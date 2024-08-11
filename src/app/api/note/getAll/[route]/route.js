import dbConnect from "@/app/lib/db";
import NoteModel from "@/app/lib/model/note";
import UserModel from "@/app/lib/model/user";
import PermissionModel from "@/app/lib/model/permission";
import { verigtToken } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  await dbConnect();

  const { route } = params;
  const url = new URL(req.url);
  const passcode = url.searchParams.get("passcode");
  const token = await req.headers.get("authorization");
  const query = url.searchParams.get("str");

  // Helper function to search notes
  const searchNotes = async (filter) => {
    return NoteModel.find({
      ...filter,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { note: { $regex: query, $options: "i" } },
      ],
    });
  };

  // First, check if passcode and route are provided
  if (route && passcode) {
    try {
      // Find user by route
      const user = await UserModel.findOne({ route }).populate(
        "permissions.permissionId"
      );
      if (!user) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }

      // Find permissions by passcode
      const permission = await PermissionModel.findOne({ passcode });
      if (!permission) {
        return NextResponse.json(
          { message: "Invalid passcode" },
          { status: 404 }
        );
      }

      // Check if the user's permissions include the permission associated with the passcode
      const hasPermission = user.permissions.some((p) =>
        p.permissionId._id.equals(permission._id)
      );
      if (!hasPermission) {
        return NextResponse.json({ message: "No access" }, { status: 403 });
      }

      // Find and return notes associated with the permission
      const filter = { noteId: { $in: permission.noteIds } };
      const notes = query
        ? await searchNotes(filter)
        : await NoteModel.find(filter);
      return NextResponse.json({ data: notes }, { status: 200 });
    } catch (error) {
      return NextResponse.json(
        { message: error.message || "Something went wrong" },
        { status: 500 }
      );
    }
  } else if (token) {
    // If no passcode and route, check for authorization token
    try {
      const result = await verigtToken(token);
      const userId = result?.userId;
      const user = await UserModel.findOne({ _id: userId });

      if (!user) {
        return NextResponse.json(
          { message: "User not found", action: "register" },
          { status: 401 }
        );
      }

      if (!user.route || user.route !== route) {
        return NextResponse.json(
          { message: "Invalid route access", status: "error" },
          { status: 404 }
        );
      }

      // Find and return notes for the user
      const filter = { userId };
      const notes = query
        ? await searchNotes(filter)
        : await NoteModel.find(filter);
      return NextResponse.json(
        { data: notes, status: "success" },
        { status: 200 }
      );
    } catch (error) {
      if (error.message.includes("Invalid token")) {
        return NextResponse.json(
          { message: "Invalid token. Please log in again.", action: "login" },
          { status: 401 }
        );
      }

      // For other errors
      return NextResponse.json(
        { message: error.message || "Something went wrong" },
        { status: 500 }
      );
    }
  } else {
    const routeUser = await UserModel.findOne({ route: route });
    if (routeUser) {
      return NextResponse.json(
        { message: "Try to login first", action: "login" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: "Authorization required", action: "register" },
      { status: 401 }
    );
  }
}
