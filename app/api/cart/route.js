import { NextResponse } from "next/server";
import Cart from "@/models/CartSchema";
import dbConnect from "@/utils/dbConnect";

export async function POST(req) {
  try {
    await dbConnect();
    const { userId, productId, quantity } = await req.json();

    if (!userId || !productId || quantity < 1) {
      return NextResponse.json(
        { success: false, message: "Invalid cart data" },
        { status: 400 }
      );
    }

    const cartItem = await Cart.findOneAndUpdate(
      { userId, productId },
      { $inc: { quantity } },
      { upsert: true, new: true }
    );

    return NextResponse.json(
      { success: true, message: "Cart updated", cartItem },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error updating cart", error: error.message },
      { status: 500 }
    );
  }
}
