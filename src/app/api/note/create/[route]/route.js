import dbConnect from "@/app/lib/db";
import NoteModel from "@/app/lib/model/note";
import UserModel from "@/app/lib/model/user";
import PermissionModel from "@/app/lib/model/permission";
import { verigtToken } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  await dbConnect(); // Ensure you are connected to the database

  const token = await req.headers.get("authorization");
  const url = new URL(req.url);
  const passcode = url.searchParams.get("passcode");
  const { route } = params;

  const body = await req.json();
  const { noteId, note, title } = body;

  if (!noteId) {
    return NextResponse.json(
      { message: "Note id is required" },
      { status: 400 }
    );
  }

  if (passcode) {
    // If passcode is present, validate permissions
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
      const hasWritePermission = user.permissions.some(
        (p) =>
          p?.permissionId &&
          p?.permissionId?._id.equals(permission?._id) &&
          permission?.permissions == "write"
      );
      if (!hasWritePermission) {
        return NextResponse.json(
          { message: "No write permission" },
          { status: 403 }
        );
      }

      // Proceed with creating or updating the note
      const existingNote = await NoteModel.findOne({
        noteId,
        userId: user._id,
      });

      if (existingNote) {
        existingNote.note = note || existingNote.note;
        existingNote.title = title || existingNote.title;
        const updatedNote = await existingNote.save();
        return NextResponse.json(updatedNote, { status: 200 });
      } else {
        const newNote = new NoteModel({
          note,
          noteId,
          userId: user._id,
          title,
        });
        const savedNote = await newNote.save();
        return NextResponse.json(savedNote, { status: 201 });
      }
    } catch (error) {
      return NextResponse.json(
        { message: error.message || "Something went wrong" },
        { status: 500 }
      );
    }
  } else if (token) {
    // If token is present, validate the token and user
    try {
      const result = await verigtToken(token);
      const userId = result?.userId;

      if (!userId) {
        return NextResponse.json(
          { message: "User ID is required" },
          { status: 401 }
        );
      }

      const user = await UserModel.findOne({ _id: userId });

      if (!user) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }

      if (user.route !== route) {
        return NextResponse.json(
          { message: "Invalid route access" },
          { status: 404 }
        );
      }

      // Proceed with creating or updating the note without additional permission checks
      const existingNote = await NoteModel.findOne({ noteId, userId });

      if (existingNote) {
        existingNote.note = note || existingNote.note;
        existingNote.title = title || existingNote.title;
        const updatedNote = await existingNote.save();
        return NextResponse.json(updatedNote, { status: 200 });
      } else {
        const newNote = new NoteModel({ note, noteId, userId, title });
        const savedNote = await newNote.save();
        return NextResponse.json(savedNote, { status: 201 });
      }
    } catch (error) {
      return NextResponse.json(
        { message: error.message || "Something went wrong" },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json(
      { message: "Authorization required" },
      { status: 401 }
    );
  }
}
