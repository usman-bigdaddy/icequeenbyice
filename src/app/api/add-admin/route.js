import { db } from "../../../../database/drizzle";
import { users } from "../../../../database/schema";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

const validateToken = async (request) => {
  // Manual token extraction
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')[1];
  
  if (!token) {
    return { error: "Unauthorized: No token provided", status: 401 };
  }

  // Verify token structure
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    if (!payload.role || !['ADMIN', 'SUPER_ADMIN'].includes(payload.role)) {
      return { error: "Forbidden: Admins only", status: 403 };
    }
    return payload;
  } catch (error) {
    return { error: "Invalid token format", status: 401 };
  }
};

export async function POST(request) {
  const token = await validateToken(request);
  if (token.error) return NextResponse.json(token, { status: token.status });

  // Only SUPER_ADMIN can create new admins
  if (token.role !== "SUPER_ADMIN") {
    return NextResponse.json(
      { error: "Unauthorized. Only SUPER_ADMIN can add new admins" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { fullName, email } = body;

    // Validation
    if (!fullName || !email) {
      return NextResponse.json(
        { error: "Full name and email are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check existing user
    const existingUser = await db.select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // Create new admin
    const defaultPassword = "123456";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const [newUser] = await db.insert(users)
      .values({
        id: uuidv4(),
        fullName,
        email,
        passwordHash: hashedPassword,
        role: "ADMIN",
      })
      .returning();

    return NextResponse.json(
      { message: "Admin created successfully", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}