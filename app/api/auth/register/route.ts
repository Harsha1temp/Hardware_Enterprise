// import { NextResponse } from "next/server"
// import { connectToDatabase } from "@/lib/db"
// import bcrypt from "bcryptjs"
// import { cookies } from "next/headers"
// import jwt from "jsonwebtoken"

// export async function POST(request: Request) {
//   try {
//     const { name, email, phone, password, address } = await request.json()

//     // Validate input
//     if (!name || !email || !phone || !password || !address) {
//       return NextResponse.json({ message: "All fields are required" }, { status: 400 })
//     }

//     const { db } = await connectToDatabase()

//     // Check if user already exists
//     const existingUser = await db.collection("users").findOne({ email })
//     if (existingUser) {
//       return NextResponse.json({ message: "User with this email already exists" }, { status: 400 })
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10)

//     // Create user
//     const result = await db.collection("users").insertOne({
//       name,
//       email,
//       phone,
//       password: hashedPassword,
//       address,
//       isAdmin: false, // Default to regular user
//       createdAt: new Date(),
//     })

//     // Get the created user (without password)
//     const user = await db.collection("users").findOne({ _id: result.insertedId }, { projection: { password: 0 } })

//     // Create JWT token
//     const token = jwt.sign({ userId: user?._id.toString() }, process.env.JWT_SECRET || "your-secret-key", {
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

//     return NextResponse.json({
//       message: "User registered successfully",
//       user,
//     })
//   } catch (error) {
//     console.error("Registration error:", error)
//     return NextResponse.json({ message: "Internal server error" }, { status: 500 })
//   }
// }
// app/api/auth/register/route.ts (Final Version)
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';        // Use Mongoose connection helper
import User from '@/models/User';        // Import Mongoose User model
import bcrypt from 'bcryptjs';          // Import bcryptjs

export async function POST(request: Request) {
  // Ensure DB connection
  try {
    await dbConnect();
  } catch (dbError) {
    console.error("Database connection failed:", dbError);
    return NextResponse.json({ message: 'Database connection error' }, { status: 500 });
  }

  try {
    const { name, email, phone, address, password } = await request.json();

    // --- Input Validation ---
    if (!name || !email || !phone || !address || !password) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }
    // Add more specific validation if needed (e.g., email format, password length)

    // --- Check for Existing User ---
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] }).lean(); // Use lean for faster checks when just checking existence
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists with this email or phone' }, { status: 409 }); // 409 Conflict
    }

    // --- Hash Password ---
    const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10

    // --- Create New User ---
    const newUser = new User({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      role: 'user', // Default role
    });

    await newUser.save();

    // --- Prepare Response (Exclude Password) ---
    const userResponse = newUser.toObject();
    // Although password has `select: false`, explicitly remove it just in case
    delete userResponse.password;


    return NextResponse.json({ message: 'User registered successfully', user: userResponse }, { status: 201 });

  } catch (error: any) {
    console.error('Registration API Error:', error);
    // Handle potential Mongoose validation errors or other issues
    if (error.name === 'ValidationError') {
         return NextResponse.json({ message: 'Validation failed', errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'An error occurred during registration', error: error.message }, { status: 500 });
  }
}