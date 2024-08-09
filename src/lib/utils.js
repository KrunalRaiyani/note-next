import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import jwt from "jsonwebtoken";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const verigtToken = async (token) => {
  const secret = process.env.NEXT_PUBLIC_JWT_SECRET;
  const payload = jwt.verify(token, secret);
  return payload;
};
