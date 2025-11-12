import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // This avoids Edge Runtime incompatibility issues with OpenID Client
  const sessionCookie =
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value

  // Protect admin routes
  // if (pathname.startsWith("/") || pathname.startsWith("/dashboard")) {
  //   if (!sessionCookie) {
  //     return NextResponse.redirect(new URL("/auth/login", request.url))
  //   }
  // }

  // Redirect authenticated users away from auth pages
  if (pathname.startsWith("/auth/") && sessionCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/:path*", "/dashboard/:path*", "/auth/:path*"],
}
