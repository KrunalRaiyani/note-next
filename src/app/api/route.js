import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json(
      { message: "Note next route is working" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
