import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOGIN_PATH = "/login";
const PROTECTED_PATHS = ["/welcome"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth_token")?.value;

  if (pathname.startsWith(LOGIN_PATH) && token) {
    return NextResponse.redirect(new URL("/welcome", request.url));
  }

  const isProtectedPath = PROTECTED_PATHS.some((path) => pathname.startsWith(path));
  if (isProtectedPath && !token) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Match all routes except Next.js internals and static files.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)" ],
};
