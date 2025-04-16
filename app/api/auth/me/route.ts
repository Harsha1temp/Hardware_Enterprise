// import { NextResponse } from "next/server"
// import { connectToDatabase } from "@/lib/db"
// import { cookies } from "next/headers"
// import jwt from "jsonwebtoken"

// export async function GET() {
//   try {
//     // Get token from cookies
//     const token = cookies().get("auth_token")?.value

//     if (!token) {
//       return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
//     }

//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as { userId: string }

//     const { db, ObjectId } = await connectToDatabase()

//     // Find user
//     const user = await db.collection("users").findOne(
//       { _id: new ObjectId(decoded.userId) },
//       { projection: { password: 0 } }, // Exclude password
//     )

//     if (!user) {
//       return NextResponse.json({ message: "User not found" }, { status: 404 })
//     }

//     return NextResponse.json({ user })
//   } catch (error) {
//     console.error("Auth check error:", error)
//     return NextResponse.json({ message: "Authentication failed" }, { status: 401 })
//   }
// }
// app/api/auth/me/route.ts (Final Version)
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';       // Use Mongoose connection helper
import User from '@/models/User';       // Import Mongoose User model
import { cookies } from 'next/headers'; // Import cookies helper
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';      // Import mongoose for ObjectId type check

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  // This check should ideally happen at build time or server start,
  // but it's crucial here as well.
  console.error("FATAL: JWT_SECRET environment variable is not defined");
  // Avoid throwing here directly in API route, return error response
  // throw new Error('JWT_SECRET environment variable is not defined');
}

export async function GET(request: Request) {

   if (!JWT_SECRET) {
     console.error("Auth check failed: JWT_SECRET not configured on server.");
     return NextResponse.json({ message: "Server configuration error" }, { status: 500 });
   }

  try {
    // --- Get Token from Cookie ---
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      // No token found, user is not authenticated
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    // --- Verify Token ---
    let decoded: { userId: string; [key: string]: any };
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string; [key: string]: any };
    } catch (jwtError: any) {
      console.error("JWT verification failed:", jwtError.message);
       // Clear invalid/expired token cookie
       cookies().delete('auth_token');
      return NextResponse.json({ message: 'Authentication failed: Invalid token' }, { status: 401 });
    }


    // --- Ensure DB Connection ---
    try {
       await dbConnect();
    } catch (dbError) {
       console.error("Database connection failed in /api/auth/me:", dbError);
       // Don't reveal DB errors directly, but signal a server issue
       return NextResponse.json({ message: 'Server error during authentication' }, { status: 500 });
    }


    // --- Validate ObjectId ---
    if (!mongoose.Types.ObjectId.isValid(decoded.userId)) {
        console.error("Invalid userId format in JWT:", decoded.userId);
        cookies().delete('auth_token'); // Clear cookie with invalid userId
        return NextResponse.json({ message: 'Authentication failed: Invalid user identifier' }, { status: 401 });
    }

    // --- Find User ---
    // Use lean() for read-only operation if you don't need Mongoose document methods
    const user = await User.findById(decoded.userId).lean();
    // Note: Password is automatically excluded due to `select: false` in the schema

    if (!user) {
      console.log("User not found for decoded userId:", decoded.userId);
       // Token was valid, but user doesn't exist (e.g., deleted)
       cookies().delete('auth_token'); // Clear cookie for non-existent user
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // --- Return User Data ---
    return NextResponse.json({ user });

  } catch (error: any) {
    // Catch any unexpected errors during the process
    console.error('Unexpected /api/auth/me error:', error);
    return NextResponse.json({ message: 'Internal server error during authentication' }, { status: 500 });
  }
}