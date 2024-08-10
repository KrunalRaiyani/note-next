import dbConnect from "@/app/lib/db";
import UserModel from "@/app/lib/model/user";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req) {
  const { route, password } = await req.json();

  await dbConnect();

  try {
    // Check for existing user
    const existingUser = await UserModel.findOne({ route });
    if (existingUser) {
      return NextResponse.json(
        { message: "Route already in use" },
        { status: 400 }
      );
    }

    // Create new user
    const user = new UserModel({ route, password });
    const savedUser = await user.save();

    // Generate JWT with user ID
    const token = jwt.sign(
      { userId: savedUser._id },
      process.env.NEXT_PUBLIC_JWT_SECRET,
      {
        expiresIn: "7d",
      }
    ); // Set appropriate expiration time

    return NextResponse.json({ data: savedUser, token }, { status: 201 });
  } catch (error) {
    console.error("error", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
