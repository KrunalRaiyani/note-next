import dbConnect from "@/app/lib/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
export async function POST(req) {
  // const authHeader = req.headers.get("authorization");

  // console.log("---->", authHeader);

  // try {
  //   const decoded = jwt.verify(authHeader, process.env.NEXT_PUBLIC_JWT_SECRET);
  //   console.log("decoded::::>", decoded);
  //   // req.nextUrl.searchParams.set("userId", decoded.userId);
  //   // return NextResponse.next();
  // } catch (error) {
  //   // console.error("JWT verification error:", error);
  //   console.log("error::::>", error);
  // }
  // const body = await req.json();

  await dbConnect();

  try {
    return NextResponse.json({ data: "data" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
