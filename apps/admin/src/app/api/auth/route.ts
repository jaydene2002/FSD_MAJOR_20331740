import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { env } from "@repo/env/admin";

export async function POST(request: Request) {
  try {
    // Check if the request is a form submission or a JSON payload
    const contentType = request.headers.get("content-type") || "";
    let password;
    
    if (contentType.includes("application/json")) {
      // Handle JSON submission
      const body = await request.json();
      password = body.password;
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      // Handle form submission
      const formData = await request.formData();
      password = formData.get("password");
    }
    
    // Check against environment variable password
    if (password === env.PASSWORD) {
      // Create JWT token
      const token = jwt.sign(
        { userId: "admin" },
        env.JWT_SECRET,
        { expiresIn: "365d" }
      );
      
      // Set auth cookie
      (await cookies()).set({
        name: "auth_token",
        value: token,
        path: "/",
        httpOnly: true,
      });
      
      // For form submissions, redirect to home page
      if (contentType.includes("application/x-www-form-urlencoded")) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      
      // For API calls, return JSON response
      return NextResponse.json({ success: true });
    }
    
    // For form submissions with invalid password, redirect back to login page
    if (contentType.includes("application/x-www-form-urlencoded")) {
      return NextResponse.redirect(new URL("/?error=invalid", request.url));
    }
    
    return NextResponse.json({ success: false }, { status: 401 });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function DELETE() {
  (await cookies()).delete("auth_token");
  return NextResponse.json({ success: true });
}