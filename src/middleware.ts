import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "stacklab_session";
const CSRF_COOKIE = "stacklab_csrf";

/**
 * Edge middleware does a cheap presence check only. Real authorization is
 * always verified against the database in the admin layout and in every
 * server action (see src/lib/auth.ts).
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);

  if (pathname === "/admin/login") {
    if (hasSession) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    const existing = request.cookies.get(CSRF_COOKIE)?.value;
    const token = existing ?? crypto.randomUUID();
    if (!existing) {
      // Make the token visible to the server-rendered login page in this request.
      request.cookies.set(CSRF_COOKIE, token);
    }

    const response = NextResponse.next({ request: { headers: request.headers } });
    if (!existing) {
      response.cookies.set(CSRF_COOKIE, token, {
        httpOnly: false,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        path: "/admin",
        maxAge: 60 * 60 * 8,
      });
    }
    return response;
  }

  if (!hasSession) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next();
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
