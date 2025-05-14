import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { env } from "@repo/env/admin";

/**
 * Handles authentication requests
 * POST endpoint for user login with password validation
 */
export async function POST(request: Request) {
  try {
    // Check if the request is a form submission or a JSON payload
    const contentType = request.headers.get("content-type") || "";
    let password;
    
    if (contentType.includes("application/json")) {
      // Handle the JSON submission - used for API calls
      const body = await request.json();
      password = body.password;
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      // Handle form submission - used for web form login
      const formData = await request.formData();
      password = formData.get("password");
    }
    
    // Check against environment variable password
    // This compares the submitted password with the expected admin password
    if (password === env.PASSWORD) {
      // Create JWT token with a generous 1-year expiration
      const token = jwt.sign(
        { userId: "admin" },
        env.JWT_SECRET,
        { expiresIn: "365d" }
      );
      
      // Set auth cookie for persistent authentication
      (await cookies()).set({
        name: "auth_token",
        value: token,
        path: "/",
        httpOnly: true, // Prevents JavaScript access for security
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

/**
 * Handles logout requests
 * Removes the authentication cookie
 */
export async function DELETE() {
  (await cookies()).delete("auth_token");
  return NextResponse.json({ success: true });
}