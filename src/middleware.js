import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { decodeToken, verify, verifyJos, verifyJwtToken } from "./lib/utils";

export async function middleware(req) {
  const url = req.nextUrl.clone();

  const publicPaths = ["/api/auth/login", "/api/auth/sign-up"];
  if (publicPaths.includes(url.pathname)) {
    return NextResponse.next();
  }

  try {
    const token = req.headers.get("Authorization");
    if (!token) {
      return NextResponse.redirect(new URL("/login", url));
    }
    const secret = process.env.NEXT_PUBLIC_JWT_SECRET;
    const data = await verifyJos(token, secret);
    console.log(
      "--------------decoded?.payload?.userId--------",
      decoded?.payload?.userId
    );
    req.nextUrl.searchParams.set("userId", decoded?.payload?.userId);
    return NextResponse.next();
  } catch (error) {
    // console.error("JWT verification error:", error);
    return NextResponse.redirect(new URL("/login", url));
  }
}

export const config = {
  matcher: "/api/:path*",
};
