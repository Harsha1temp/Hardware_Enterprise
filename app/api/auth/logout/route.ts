// import { NextResponse } from "next/server"
// import { cookies } from "next/headers"

// export async function POST() {
//   // Clear the auth cookie
//   cookies().set({
//     name: "auth_token",
//     value: "",
//     httpOnly: true,
//     path: "/",
//     secure: process.env.NODE_ENV === "production",
//     maxAge: 0, // Expire immediately
//   })

//   return NextResponse.json({ message: "Logged out successfully" })
// }
// app/api/auth/logout/route.ts (Final Version)
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();

    // Clear the authentication cookie
    cookieStore.delete('auth_token');
    // Or set it to expire immediately:
    // cookieStore.set('auth_token', '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', expires: new Date(0), path: '/' });

    console.log("User logged out, cookie cleared.");
    return NextResponse.json({ message: 'Logout successful' }, { status: 200 });

  } catch (error: any) {
    console.error('Logout API Error:', error);
    return NextResponse.json({ message: 'An error occurred during logout', error: error.message }, { status: 500 });
  }
}