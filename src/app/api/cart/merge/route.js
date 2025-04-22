import { db } from "@/../database/drizzle";
import { cart } from "@/../database/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { guestId, userId } = await request.json();

    if (!guestId || !userId) {
      return NextResponse.json(
        { error: "Both guestId and userId are required" },
        { status: 400 }
      );
    }

    // Simply transfer all guest items to the user
    await db
      .update(cart)
      .set({
        userId,
        guestId: null, // Remove guest association
      })
      .where(eq(cart.guestId, guestId));

    return NextResponse.json({
      success: true,
      message: "Cart merged successfully",
    });
  } catch (error) {
    console.error("Merge error:", error);
    return NextResponse.json(
      { error: "Failed to merge carts" },
      { status: 500 }
    );
  }
}
