import { NextResponse, type NextRequest } from "next/server";

/**
 * Keeps signed-out visitors out of the admin panel.
 *
 * The middleware runs on the Edge runtime, where node:crypto is not available,
 * so it only checks that the cookie is present and unexpired. The signature is
 * verified in the pages and actions themselves, through lib/admin/session.
 */
const COOKIE = "time-house-admin";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();

  const token = request.cookies.get(COOKIE)?.value;
  const expires = Number(token?.split(".")[0]);
  const looksValid = Boolean(token) && Number.isFinite(expires) && expires > Date.now();

  if (looksValid) return NextResponse.next();

  const login = request.nextUrl.clone();
  login.pathname = "/admin/login";
  login.search = pathname === "/admin" ? "" : `?next=${encodeURIComponent(pathname)}`;
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/admin/:path*"],
};
