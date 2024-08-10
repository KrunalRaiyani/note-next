import dbConnect from "@/app/lib/db";
import NoteModel from "@/app/lib/model/note";
import UserModel from "@/app/lib/model/user";
import { verigtToken } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
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

  console.log(result, "-----------------");

  const userId = result?.userId;
  const { noteId, note, title } = body;

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
}
