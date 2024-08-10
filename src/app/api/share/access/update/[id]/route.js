import dbConnect from "@/app/lib/db";
import PermissionModel from "@/app/lib/model/permission";
import { verigtToken } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  await dbConnect();

  const token = await req.headers.get("authorization");
  if (!token) {
    return NextResponse.json(
      { message: "Authorization required" },
      { status: 401 }
    );
  }

  const { id } = params;
  const body = await req.json();
  const { noteIds, passcode, permissionType } = body;

  if (!id) {
    return NextResponse.json(
      { message: "Permission ID is required" },
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

    // Find the permission document by ID
    const existingPermission = await PermissionModel.findById(id);
    if (!existingPermission) {
      return NextResponse.json(
        { message: "Permission not found" },
        { status: 404 }
      );
    }

    // Update the permission document
    existingPermission.passcode = passcode || existingPermission.passcode;
    existingPermission.permissions =
      permissionType || existingPermission.permissions;
    existingPermission.noteIds = noteIds || existingPermission.noteIds;

    await existingPermission.save();

    return NextResponse.json(
      { message: "Permission updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
