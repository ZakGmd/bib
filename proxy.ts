import { auth } from "@/auth"
import { NextResponse } from "next/server"

const PUBLIC_ROUTES = ["/", "/login", "/books", "/authors", "/contact"]
const AUTH_ROUTES = ["/login"]

export const proxy = auth((req) => {
  const { nextUrl, auth: session } = req
  const isLoggedIn = !!session

  const isPublic = PUBLIC_ROUTES.some(
    (route) =>
      nextUrl.pathname === route ||
      nextUrl.pathname.startsWith("/books/") ||
      nextUrl.pathname.startsWith("/authors/")
  )
  const isAuthRoute = AUTH_ROUTES.includes(nextUrl.pathname)

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/books", nextUrl))
  }

  if (!isPublic && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
