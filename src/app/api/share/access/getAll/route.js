import dbConnect from "@/app/lib/db";
import NoteModel from "@/app/lib/model/note";
import UserModel from "@/app/lib/model/user";
import PermissionModel from "@/app/lib/model/permission";
import { verigtToken } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET(req) {
  await dbConnect();

  const token = await req.headers.get("authorization");

  if (!token) {
    return NextResponse.json(
      { message: "Authorization required" },
      { status: 401 }
    );
  }

  try {
    // Validate the token
    const result = await verigtToken(token);
    const userId = result?.userId;

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 401 }
      );
    }

    // Find the user and populate their permissions
    const user = await UserModel.findOne({ _id: userId }).populate(
      "permissions.permissionId"
    );

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Find all permissions associated with the user
    const permissions = await PermissionModel.find({
      _id: { $in: user.permissions.map((p) => p.permissionId) },
    });

    // Lookup notes based on permissions
    const notesPromises = permissions.map(async (permission) => {
      const notes = await NoteModel.find({
        _id: { $in: permission.noteIds },
      });
      return {
        passcode: permission.passcode,
        permissions: permission.permissions,
        notes: notes.map((note) => ({
          title: note.title,
          noteId: note._id.toString(),
        })),
      };
    });

    const permissionsWithNotes = await Promise.all(notesPromises);

    return NextResponse.json(
      {
        permissions: permissionsWithNotes,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
