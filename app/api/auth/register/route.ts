import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Please provide name, email, and password" },
        { status: 400 }
      );
    }

    //  Add future password logic here when there is an database

    return NextResponse.json({ message: "Registration successful", name : name }, { status: 201 });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "There was an error creating your account" },
      { status: 500 }
    );
  }
}