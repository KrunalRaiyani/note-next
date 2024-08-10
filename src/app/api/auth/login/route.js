import dbConnect from "@/app/lib/db";
import UserModel from "@/app/lib/model/user";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function POST(req) {
  const { route, password } = await req.json();

  await dbConnect();

  try {
    const user = await UserModel.findOne({ route });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid route or password" },
        { status: 401 }
      );
    }

    // Compare hashed passwords using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid route or password" },
        { status: 401 }
      );
    }

    // Generate JWT with user ID
    const token = jwt.sign(
      { userId: user._id },
      process.env.NEXT_PUBLIC_JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return NextResponse.json({ userId: user._id, token }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
