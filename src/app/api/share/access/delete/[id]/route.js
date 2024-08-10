import dbConnect from "@/app/lib/db";
import PermissionModel from "@/app/lib/model/permission";
import UserModel from "@/app/lib/model/user"; // Import UserModel to update user permissions
import { verigtToken } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  await dbConnect();

  const token = await req.headers.get("authorization");
  if (!token) {
    return NextResponse.json(
      { message: "Authorization required" },
      { status: 401 }
    );
  }

  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { message: "Permission ID is required" },
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

    // Find and delete the permission document by ID
    const deletedPermission = await PermissionModel.findByIdAndDelete(id);
    if (!deletedPermission) {
      return NextResponse.json(
        { message: "Permission not found" },
        { status: 404 }
      );
    }

    // Find the user and remove the deleted permission ID from their list
    await UserModel.updateMany(
      { "permissions.permissionId": id },
      { $pull: { permissions: { permissionId: id } } }
    );

    return NextResponse.json(
      { message: "Permission deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
