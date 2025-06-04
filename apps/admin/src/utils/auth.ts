import jwt from "jsonwebtoken";
import { env } from "@repo/env/admin"
import { cookies } from "next/headers";

export async function isLoggedIn() {
  try {
    const userCookies = await cookies();
    
    // Check that auth_token cookie exists and is valid
    const token = userCookies.get("auth_token")?.value;
    
    if (!token) return false;
    
    // Try to verify the token - if it's expired or invalid, this will throw an error
    const verified = jwt.verify(token, env.JWT_SECRET || "");
    return !!verified;
  } catch (error) {
    // If any error occurs during verification (including token expired),
    // just return false instead of letting the error propagate
    return false;
  }
}