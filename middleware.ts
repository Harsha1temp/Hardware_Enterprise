// import { NextResponse } from "next/server"
// import type { NextRequest } from "next/server"
// import jwt from "jsonwebtoken"

// // Paths that require authentication
// const protectedPaths = ["/orders", "/profile", "/cart/checkout"]

// // Paths that require admin access
// const adminPaths = ["/admin"]

// // Paths that should redirect logged in users
// const authPaths = ["/login", "/register"]

// export async function middleware(request: NextRequest) {
//   const path = request.nextUrl.pathname

//   // Get token from cookies
//   const token = request.cookies.get("auth_token")?.value

//   // Check if path requires authentication
//   const isProtectedPath = protectedPaths.some((pp) => path.startsWith(pp))
//   const isAdminPath = adminPaths.some((ap) => path.startsWith(ap))
//   const isAuthPath = authPaths.some((ap) => path === ap)

//   // If no token and trying to access protected path
//   if (!token && isProtectedPath) {
//     const url = new URL("/login", request.url)
//     url.searchParams.set("callbackUrl", encodeURI(request.url))
//     return NextResponse.redirect(url)
//   }

//   // If token exists
//   if (token) {
//     try {
//       // Verify token
//       const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as { userId: string }

//       // If user is logged in and trying to access login/register page
//       if (isAuthPath) {
//         return NextResponse.redirect(new URL("/", request.url))
//       }

//       // For admin paths, verify admin status
//       if (isAdminPath) {
//         // This would typically involve a database check
//         // For now, we'll use a simplified approach with a custom header
//         const response = NextResponse.next()
//         response.headers.set("x-user-id", decoded.userId)
//         return response
//       }
//     } catch (error) {
//       // If token is invalid, clear it
//       if (isProtectedPath || isAdminPath) {
//         const response = NextResponse.redirect(new URL("/login", request.url))
//         response.cookies.set({
//           name: "auth_token",
//           value: "",
//           maxAge: 0,
//         })
//         return response
//       }
//     }
//   }

//   return NextResponse.next()
// }

// export const config = {
//   matcher: ["/orders/:path*", "/profile/:path*", "/admin/:path*", "/cart/checkout", "/login", "/register"],
// }
// middleware.ts (Final Version with Admin Protection)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose'; // Use 'jose' for robust JWT verification

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_ROLE = 'admin'; // Define admin role name

// Function to get the secret key as Uint8Array
const getJwtSecretKey = () => {
    if (!JWT_SECRET) {
        // Log error server-side, avoid throwing in middleware directly if possible
        console.error('FATAL: JWT_SECRET environment variable is not set in middleware');
        // Return null or throw an error that can be caught if absolutely necessary
        return null;
    }
    return new TextEncoder().encode(JWT_SECRET);
};

// Paths that require admin access
const adminPaths = ['/admin'];

// Paths that require any logged-in user
const protectedUserPaths = ['/orders', '/cart/checkout', '/profile']; // Add /profile if you have it

// Paths that should redirect logged in users away (e.g., to home)
const publicOnlyPaths = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const tokenCookie = request.cookies.get('auth_token');
  const token = tokenCookie?.value;
  const secretKey = getJwtSecretKey();

  let userPayload: { userId?: string; role?: string; [key: string]: any } | null = null;
  let isTokenValid = false;

  // --- Verify token if it exists ---
  if (token && secretKey) {
      try {
          const { payload } = await jwtVerify(token, secretKey);
          userPayload = payload as { userId?: string; role?: string; [key: string]: any };
          isTokenValid = true;
          console.log('Middleware: Token verified for user:', userPayload?.userId, 'Role:', userPayload?.role);
      } catch (error) {
          console.error('Middleware: Token verification failed:', error);
          // Token is invalid or expired, treat as not logged in
          isTokenValid = false;
      }
  } else if (token && !secretKey) {
      // Secret key issue - critical server error
      console.error("Middleware: Cannot verify token, JWT_SECRET missing.");
      // Avoid redirect loops, maybe return an error page or generic response
      return new NextResponse('Internal Server Error: Authentication configuration issue.', { status: 500 });
  }

  const isLoggedIn = isTokenValid && userPayload?.userId;
  const userRole = userPayload?.role;

  // --- Redirect logged-in users from public-only paths ---
  if (isLoggedIn && publicOnlyPaths.some((p) => pathname === p)) {
      console.log(`Middleware: Logged-in user redirected from ${pathname} to /`);
      return NextResponse.redirect(new URL('/', request.url));
  }

  // --- Protect Admin Routes ---
  if (adminPaths.some((p) => pathname.startsWith(p))) {
      if (!isLoggedIn) {
          console.log(`Middleware: No token for admin route ${pathname}, redirecting to login.`);
          const loginUrl = new URL('/login', request.url);
          loginUrl.searchParams.set('redirect', pathname);
          return NextResponse.redirect(loginUrl);
      }
      if (userRole !== ADMIN_ROLE) {
          console.log(`Middleware: User role "${userRole}" not authorized for admin route ${pathname}, redirecting to /.`);
          // Redirect non-admins away from admin area
          return NextResponse.redirect(new URL('/', request.url));
      }
      // User is logged in and is an admin - allow access
      console.log(`Middleware: Admin access allowed for ${pathname}`);
      return NextResponse.next();
  }

  // --- Protect Standard User Routes ---
  if (protectedUserPaths.some((p) => pathname.startsWith(p))) {
      if (!isLoggedIn) {
          console.log(`Middleware: No token for protected route ${pathname}, redirecting to login.`);
          const loginUrl = new URL('/login', request.url);
          loginUrl.searchParams.set('redirect', pathname);
          const response = NextResponse.redirect(loginUrl);
          // If token was invalid/expired, clear it
          if (token && !isTokenValid) {
              response.cookies.delete('auth_token');
          }
          return response;
      }
      // User is logged in (any role) - allow access
      return NextResponse.next();
  }

   // --- Handle invalid/expired tokens on non-protected pages ---
   if (token && !isTokenValid && !publicOnlyPaths.some(p => pathname === p)) {
       // If the token exists but failed verification, and we're not on a login/register page,
       // it's best to clear the invalid cookie and let the request proceed (or redirect to login)
       console.log(`Middleware: Invalid token detected on non-critical path ${pathname}, clearing cookie.`);
       const response = NextResponse.next();
       response.cookies.delete('auth_token');
       return response;
       // Alternatively, you could redirect to login here too if preferred:
       // const loginUrl = new URL('/login', request.url);
       // const response = NextResponse.redirect(loginUrl);
       // response.cookies.delete('auth_token');
       // return response;
   }


  // --- Allow access to all other paths (like /, /products, /about, etc.) ---
  return NextResponse.next();
}

// --- Define Matcher ---
// This matcher aims to run the middleware on most paths, excluding static assets and API routes.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes) - Handled server-side, middleware might interfere
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - /placeholder.svg (or other specific public assets)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|placeholder.svg).*)',
  ],
};