import { auth } from "@/auth"
import { NextResponse } from "next/server"

const PUBLIC_ROUTES = ["/", "/login", "/books", "/authors", "/contact", "/about"]
const AUTH_ROUTES = ["/login"]
const STUDENT_ONLY_ROUTES = ["/books", "/authors", "/my-loans"]

export const proxy = auth((req) => {
  const { nextUrl, auth: session } = req
  const isLoggedIn = !!session
  const role = session?.user?.role

  const isStaffRole = role === "LIBRARIAN" || role === "ADMIN"

  const isPublic = PUBLIC_ROUTES.some(
    (route) =>
      nextUrl.pathname === route ||
      nextUrl.pathname.startsWith("/books/") ||
      nextUrl.pathname.startsWith("/authors/")
  )
  const isAuthRoute = AUTH_ROUTES.includes(nextUrl.pathname)

  // Redirect staff away from student-facing pages
  const isStudentRoute =
    STUDENT_ONLY_ROUTES.some(
      (route) =>
        nextUrl.pathname === route ||
        nextUrl.pathname.startsWith("/books/") ||
        nextUrl.pathname.startsWith("/authors/")
    )

  if (isLoggedIn && isStaffRole && isStudentRoute) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl))
  }

  // After login, send staff to dashboard, students to books
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(
      new URL(isStaffRole ? "/dashboard" : "/books", nextUrl)
    )
  }

  if (!isPublic && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
