import { NextResponse } from "next/server";
import { getSession } from "next-auth/react";

export async function middleware(request) {
  const session = await getSession({ req: request });

  // Protect specific routes
  if (request.nextUrl.pathname.startsWith("/api/add-admin")) {
    if (!session || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Only super admins can perform this action." },
        { status: 403 }
      );
    }
  }

  // Continue to the next handler
  return NextResponse.next();
}