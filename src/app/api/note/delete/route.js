import dbConnect from "@/app/lib/db";
import NoteModel from "@/app/lib/model/note";
import { verigtToken } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  await dbConnect(); // Ensure you are connected to the database

  const token = await req.headers.get("authorization");

  if (!token) {
    return NextResponse.json(
      { message: "Authorization required" },
      { status: 401 }
    );
  }

  const body = await req.json();
  const result = await verigtToken(token);

  const userId = result?.userId;
  const { noteId } = body;

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
