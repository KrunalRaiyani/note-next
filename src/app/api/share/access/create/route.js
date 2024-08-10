import dbConnect from "@/app/lib/db";
import UserModel from "@/app/lib/model/user";
import PermissionModel from "@/app/lib/model/permission";
import { verigtToken } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();

  const token = await req.headers.get("authorization");
  if (!token) {
    return NextResponse.json(
      { message: "Authorization required" },
      { status: 401 }
    );
  }

  const body = await req.json();
  const { noteIds, passcode, permissionType } = body;

  if (!noteIds || !Array.isArray(noteIds) || !passcode || !permissionType) {
    return NextResponse.json(
      { message: "Note IDs, passcode, and permission type are required" },
      { status: 400 }
    );
  }

  if (!["read", "write"].includes(permissionType)) {
    return NextResponse.json(
      { message: "Invalid permission type" },
      { status: 400 }
    );
  }

  try {
    const result = await verigtToken(token);
    const userId = result?.userId;

    if (!userId) {
      return NextResponse.json(
        { message: "Invalid token or user not found" },
        { status: 401 }
      );
    }

    // Check if a permission with the same passcode already exists for the user
    const existingPermission = await PermissionModel.findOne({
      passcode,
    });
    if (existingPermission) {
      return NextResponse.json(
        { message: "A permission with the same passcode already exists" },
        { status: 400 }
      );
    }

    // Create a new permission document
    const newPermission = await PermissionModel.create({
      passcode,
      permissions: permissionType,
      noteIds,
    });

    // Update the user's permissions with the new permission ID
    await UserModel.findOneAndUpdate(
      { _id: userId },
      { $addToSet: { permissions: { permissionId: newPermission._id } } }
    );

    return NextResponse.json({ newPermission }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
