import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// token decode

export const getJwtSecretKey = () => {
  const secret = process.env.NEXT_PUBLIC_JWT_SECRET;
  if (!secret || secret.length === 0) {
    throw new Error("The environment variable JWT_SECRET is not set.");
  }
  return secret;
};

export async function verifyJwtToken(token) {
  try {
    const verified = await jwtVerify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
    return verified.payload;
  } catch (error) {
    throw new Error("Your token is expired");
  }
}

// stack
import { SignJWT, jwtVerify } from "jose";

export async function signJos(payload, secret) {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 60 * 60; // one hour

  return new SignJWT({ payload })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(exp)
    .setIssuedAt(iat)
    .setNotBefore(iat)
    .sign(new TextEncoder().encode(secret));
}

export async function verifyJos(token, secret) {
  const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
  // run some checks on the returned payload, perhaps you expect some specific values
  console.log("payload:::>0", payload);
  // if its all good, return it, or perhaps just return a boolean
  return payload;
}
