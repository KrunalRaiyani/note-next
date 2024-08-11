import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import jwt from "jsonwebtoken";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const verigtToken = async (token) => {
  const secret = process.env.NEXT_PUBLIC_JWT_SECRET;

  try {
    const payload = jwt.verify(token, secret);
    return payload;
  } catch (error) {
    // Throw a generic error message for any JWT-related issue
    throw new Error("Invalid token. Please log in again.");
  }
};
