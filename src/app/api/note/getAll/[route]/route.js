import dbConnect from "@/app/lib/db";
import NoteModel from "@/app/lib/model/note";
import UserModel from "@/app/lib/model/user";
import { verigtToken } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
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
    const user = await UserModel.findOne({ _id: userId });
    const isRouteExsist = await UserModel.findOne({ route: params?.route });

    if (user?.route != params?.route) {
      if (!isRouteExsist) {
        return NextResponse.json(
          { message: "Route not found", status: "suggestion" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { message: "Invalid route access", status: "error" },
        { status: 404 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { message: "Invalid token or user not found", status: "error" },
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

    return NextResponse.json(
      { data: notes, status: "success" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
