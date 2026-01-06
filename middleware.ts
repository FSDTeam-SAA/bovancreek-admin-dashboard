import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const isAuth = !!token
  const isAdmin = token?.role === "admin"

  // Protect dashboard
  if (pathname.startsWith("/dashboard")) {
    if (!isAuth) {
      const url = new URL("/auth/login", request.url)
      url.searchParams.set("error", "unauthorized")
      return NextResponse.redirect(url)
    }

    if (!isAdmin) {
      const url = new URL("/auth/login", request.url)
      url.searchParams.set("error", "not_admin")
      return NextResponse.redirect(url)
    }
  }

  // Redirect logged-in admins away from auth pages
  if (pathname.startsWith("/auth/") && isAuth && isAdmin) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
}
