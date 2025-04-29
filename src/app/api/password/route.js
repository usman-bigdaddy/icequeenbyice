import { NextResponse } from "next/server";
import { db } from "../../../../database/drizzle";
import { users } from "../../../../database/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

const validateToken = async (request) => {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')[1];
  
  if (!token) return { error: "Unauthorized: No token provided", status: 401 };

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

// Admin reset password to default (123456)
export async function PUT(request) {
  const token = await validateToken(request);
  if (token.error) return NextResponse.json(token, { status: token.status });

  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const [user] = await db.select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Reset to default password
    const defaultPassword = "123456";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    await db.update(users)
      .set({ 
        passwordHash: hashedPassword,
        updatedAt: new Date()
      })
      .where(eq(users.email, email));

    return NextResponse.json(
      { message: "Password reset to default successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// User changes their own password
export async function PATCH(request) {
  const token = await validateToken(request);
  if (token.error) return NextResponse.json(token, { status: token.status });

  try {
    const { currentPassword, newPassword } = await request.json();
    
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Both current and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const [user] = await db.select()
      .from(users)
      .where(eq(users.email, token.email))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 401 }
      );
    }

    // Update to new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.update(users)
      .set({ 
        passwordHash: hashedPassword,
        updatedAt: new Date()
      })
      .where(eq(users.email, token.email));

    return NextResponse.json(
      { message: "Password changed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password change error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}