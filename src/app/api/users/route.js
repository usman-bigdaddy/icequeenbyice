import { db } from "@/../database/drizzle";
import { users } from "@/../database/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// Function to validate JWT token and check for user roles
const validateToken = async (request) => {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    console.log(token);
    return { error: "Unauthorized: No token provided", status: 401 };
  }

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

export async function GET(request) {
  try {
    const tokenValidation = await validateToken(request);
    if (tokenValidation.error) {
      return NextResponse.json({ success: false, error: tokenValidation.error }, { status: tokenValidation.status });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // 'USER' or 'ADMIN'

    let query = db.select().from(users);

    if (type) {
      query = query.where(eq(users.role, type));
    }

    const result = await query;

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const tokenValidation = await validateToken(request);
    if (tokenValidation.error) {
      return NextResponse.json({ success: false, error: tokenValidation.error }, { status: tokenValidation.status });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const { password } = await request.json();

    if (!userId && !password) {
      return NextResponse.json(
        { success: false, error: "Fields incomplete" },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const [updatedUser] = await db
      .update(users)
      .set({
        passwordHash: hashedPassword,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Password reset to default",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to reset password" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const tokenValidation = await validateToken(request);
    if (tokenValidation.error) {
      return NextResponse.json({ success: false, error: tokenValidation.error }, { status: tokenValidation.status });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId is required" },
        { status: 400 }
      );
    }

    const [deletedUser] = await db
      .delete(users)
      .where(eq(users.id, userId))
      .returning();

    if (!deletedUser) {
      return NextResponse.json(
        { success: false, error: "Admin not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Admin deleted successfully",
      data: deletedUser,
    });
  } catch (error) {
    console.error("Delete admin error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete admin" },
      { status: 500 }
    );
  }
}
