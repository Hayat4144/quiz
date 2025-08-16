import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { auth } from "./auth";

export async function middleware(request: NextRequest) {
  const session = await auth();
  const pathname = request.nextUrl.pathname;

  if (!session && pathname !== "/auth/signin") {
    const searchParams = new URLSearchParams({ url: pathname });
    return NextResponse.redirect(
      new URL(`/auth/login?${searchParams.toString()}`, request.nextUrl.origin),
    );
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
