import dbConnect from "@/app/lib/db";
import NoteModel from "@/app/lib/model/note";
import UserModel from "@/app/lib/model/user";
import { verigtToken } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  await dbConnect();

  console.log(params, "--------------");

  const token = await req.headers.get("authorization");

  if (!token) {
    return NextResponse.json(
      { message: "Authorization required" },
      { status: 401 }
    );
  }

  const result = await verigtToken(token);

  const userId = result?.userId;
  const { noteId } = params;

  if (!userId) {
    return NextResponse.json(
      { message: "User ID is required" },
      { status: 401 }
    );
  }

  if (!noteId) {
    return NextResponse.json(
      { message: "Note id is required" },
      { status: 400 }
    );
  }

  try {
    const existingNote = await NoteModel.findOne({ noteId, userId });

    const user = await UserModel.findOne({ _id: userId });

    if (user?.route != params?.route) {
      return NextResponse.json(
        { message: "Invalid route access" },
        { status: 404 }
      );
    }

    if (existingNote) {
      await NoteModel.deleteOne({ noteId, userId });
      return NextResponse.json(
        { message: "Note deleted successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ message: "Note not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
