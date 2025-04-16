// import { NextResponse } from "next/server"
// import { connectToDatabase } from "@/lib/db"
// import bcrypt from "bcryptjs"
// import { cookies } from "next/headers"
// import jwt from "jsonwebtoken"

// export async function POST(request: Request) {
//   try {
//     const { email, password } = await request.json()

//     // Validate input
//     if (!email || !password) {
//       return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
//     }

//     const { db } = await connectToDatabase()

//     // Find user
//     const user = await db.collection("users").findOne({ email })
//     if (!user) {
//       return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
//     }

//     // Verify password
//     const isPasswordValid = await bcrypt.compare(password, user.password)
//     if (!isPasswordValid) {
//       return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
//     }

//     // Create JWT token
//     const token = jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET || "your-secret-key", {
//       expiresIn: "7d",
//     })

//     // Set cookie
//     cookies().set({
//       name: "auth_token",
//       value: token,
//       httpOnly: true,
//       path: "/",
//       secure: process.env.NODE_ENV === "production",
//       maxAge: 60 * 60 * 24 * 7, // 1 week
//     })

//     // Return user without password
//     const { password: _, ...userWithoutPassword } = user

//     return NextResponse.json({
//       message: "Login successful",
//       user: userWithoutPassword,
//     })
//   } catch (error) {
//     console.error("Login error:", error)
//     return NextResponse.json({ message: "Internal server error" }, { status: 500 })
//   }
// }
// app/api/auth/login/route.ts (Final Version)
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User'; // Import Mongoose model
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers'; // Import cookies helper

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not defined');
}

export async function POST(request: Request) {
  // Ensure DB connection
  try {
    await dbConnect();
  } catch (dbError) {
    console.error("Database connection failed:", dbError);
    return NextResponse.json({ message: 'Database connection error' }, { status: 500 });
  }

  try {
    const { identifier, password } = await request.json(); // Identifier can be email or phone

    if (!identifier || !password) {
      return NextResponse.json({ message: 'Email/Phone and password are required' }, { status: 400 });
    }

    // --- Find User (Select Password) ---
    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    }).select('+password'); // Explicitly select password for comparison

    if (!user) {
      console.log(`Login attempt failed: User not found for identifier "${identifier}"`);
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 }); // Unauthorized
    }

    // --- Compare Password ---
    const isMatch = await bcrypt.compare(password, user.password || '');

    if (!isMatch) {
       console.log(`Login attempt failed: Password mismatch for user "${user.email || user.phone}"`);
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // --- Generate JWT ---
    const payload = {
      userId: user._id,
      role: user.role, // Include role if needed for client-side checks/UI
      name: user.name // Include name for display
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: '1d', // Example: Token expires in 1 day
    });

    // --- Prepare Response (Exclude Password) ---
    const userResponse = user.toObject();
    delete userResponse.password;

    // --- Set HTTP-Only Cookie ---
    const cookieStore = cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true, // Prevents client-side JS access
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'strict', // Helps prevent CSRF
      maxAge: 60 * 60 * 24 * 1, // 1 day in seconds
      path: '/', // Cookie available across the site
    });

    console.log(`Login successful for user "${user.email || user.phone}"`);
    return NextResponse.json({ message: 'Login successful', user: userResponse }, { status: 200 });

  } catch (error: any) {
    console.error('Login API Error:', error);
    return NextResponse.json({ message: 'An error occurred during login', error: error.message }, { status: 500 });
  }
}