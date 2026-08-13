import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "@/server/auth.config";

const { auth } = NextAuth(authConfig);

const PUBLIC_ROUTES = ["/", "/login", "/register"];
// Only these should bounce an already-logged-in user away (no reason to see
// the login/register forms again). "/" stays visible to everyone, logged in
// or not, so it always shows the landing page first.
const AUTH_ONLY_ROUTES = ["/login", "/register"];

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
  }

  if (isLoggedIn && AUTH_ONLY_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  // Skip API routes, Next.js internals, and any request for a file with an
  // extension (images, manifest, icons, etc. served from /public) — those
  // were getting redirected to /login by this middleware otherwise.
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*|favicon.ico).*)"],
};
