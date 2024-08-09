import dbConnect from "@/app/lib/db";
import NoteModel from "@/app/lib/model/note";
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
    const result = await verigtToken(token);
    const userId = result?.userId;

    if (!userId) {
      return NextResponse.json(
        { message: "Invalid token or user not found" },
        { status: 401 }
      );
    }

    const url = new URL(req.url);
    const query = url.searchParams.get("str");

    let notes;

    if (query) {
      notes = await NoteModel.find({
        userId,
        $or: [
          { title: { $regex: query, $options: "i" } },
          { note: { $regex: query, $options: "i" } },
        ],
      });
    } else {
      // Retrieve all notes for the user
      notes = await NoteModel.find({ userId });
    }

    return NextResponse.json(notes, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
