import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const error = req.nextUrl.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL("/auth/error", req.url));
  }

  return NextResponse.next();
}
