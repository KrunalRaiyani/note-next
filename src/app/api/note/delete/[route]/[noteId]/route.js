import dbConnect from "@/app/lib/db";
import NoteModel from "@/app/lib/model/note";
import UserModel from "@/app/lib/model/user";
import PermissionModel from "@/app/lib/model/permission";
import { verigtToken } from "@/lib/utils";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function DELETE(req, { params }) {
  await dbConnect();

  const token = await req.headers.get("authorization");
  const url = new URL(req.url);
  const passcode = url.searchParams.get("passcode");
  const { noteId } = params;

  if (!noteId) {
    return NextResponse.json(
      { message: "Note id is required" },
      { status: 400 }
    );
  }

  const note = await NoteModel.findOne({ noteId });
  const objectIdNoteId = note?._id;

  if (!objectIdNoteId) {
    return NextResponse.json({ message: "Note not found" }, { status: 404 });
  }

  if (passcode) {
    // If passcode is present, validate permissions
    try {
      const user = await UserModel.findOne({ route: params.route }).populate(
        "permissions.permissionId"
      );
      if (!user) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }

      const permission = await PermissionModel.findOne({ passcode });
      if (!permission) {
        return NextResponse.json(
          { message: "Invalid passcode" },
          { status: 404 }
        );
      }

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

      const existingNote = await NoteModel.findOne({
        noteId,
        userId: user._id,
      });
      if (!existingNote) {
        return NextResponse.json(
          { message: "Note not found" },
          { status: 404 }
        );
      }

      await NoteModel.deleteOne({ noteId, userId: user._id });

      // Log noteId and permissions data for debugging
      console.log("Note ID:", noteId);
      const permissions = await PermissionModel.find({
        noteIds: objectIdNoteId,
      });
      console.log("Matching Permissions:", permissions);

      // Remove the note ID from permissions
      const checkUpdate = await PermissionModel.updateMany(
        { noteIds: objectIdNoteId },
        { $pull: { noteIds: objectIdNoteId } }
      );
      console.log("Update Result:", checkUpdate);

      // Check if permissions have no noteIds left and delete them
      if (checkUpdate.modifiedCount > 0) {
        const emptyPermissions = await PermissionModel.find({
          noteIds: { $size: 0 },
        });
        if (emptyPermissions.length > 0) {
          const emptyPermissionIds = emptyPermissions.map((p) => p._id);

          // Delete permissions with no noteIds
          await PermissionModel.deleteMany({
            _id: { $in: emptyPermissionIds },
          });

          // Remove these permissions from the user's permissions list
          await UserModel.updateMany(
            { "permissions.permissionId": { $in: emptyPermissionIds } },
            {
              $pull: {
                permissions: { permissionId: { $in: emptyPermissionIds } },
              },
            }
          );
        }
      }

      return NextResponse.json(
        { message: "Note deleted successfully" },
        { status: 200 }
      );
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

      if (user.route !== params.route) {
        return NextResponse.json(
          { message: "Invalid route access" },
          { status: 404 }
        );
      }

      const existingNote = await NoteModel.findOne({ noteId, userId });
      if (!existingNote) {
        return NextResponse.json(
          { message: "Note not found" },
          { status: 404 }
        );
      }

      await NoteModel.deleteOne({ noteId, userId });

      // Log noteId and permissions data for debugging
      console.log("Note ID:", noteId);
      const permissions = await PermissionModel.find({
        noteIds: objectIdNoteId,
      });
      console.log("Matching Permissions:", permissions);

      // Remove the note ID from permissions
      const checkUpdate = await PermissionModel.updateMany(
        { noteIds: objectIdNoteId },
        { $pull: { noteIds: objectIdNoteId } }
      );
      console.log("Update Result:", checkUpdate);

      // Check if permissions have no noteIds left and delete them
      if (checkUpdate.modifiedCount > 0) {
        const emptyPermissions = await PermissionModel.find({
          noteIds: { $size: 0 },
        });
        if (emptyPermissions.length > 0) {
          const emptyPermissionIds = emptyPermissions.map((p) => p._id);

          // Delete permissions with no noteIds
          await PermissionModel.deleteMany({
            _id: { $in: emptyPermissionIds },
          });

          // Remove these permissions from the user's permissions list
          await UserModel.updateMany(
            { "permissions.permissionId": { $in: emptyPermissionIds } },
            {
              $pull: {
                permissions: { permissionId: { $in: emptyPermissionIds } },
              },
            }
          );
        }
      }

      return NextResponse.json(
        { message: "Note deleted successfully" },
        { status: 200 }
      );
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
