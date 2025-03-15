import { NextResponse } from "next/server";
import Cart from "@/models/Cart";
import dbConnect from "@/utils/dbConnect";

// Fetch cart for a specific user
export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { userId } = params;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const cartItems = await Cart.find({ userId }).populate("productId");
    return NextResponse.json({ success: true, cartItems }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error fetching cart", error: error.message },
      { status: 500 }
    );
  }
}

// Update cart item quantity
export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { userId } = params;
    const { productId, quantity } = await req.json();

    if (!userId || !productId || quantity < 1) {
      return NextResponse.json(
        { success: false, message: "Invalid cart update data" },
        { status: 400 }
      );
    }

    const updatedCartItem = await Cart.findOneAndUpdate(
      { userId, productId },
      { quantity },
      { new: true }
    );

    if (!updatedCartItem) {
      return NextResponse.json(
        { success: false, message: "Cart item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Cart updated", updatedCartItem },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error updating cart", error: error.message },
      { status: 500 }
    );
  }
}

// Remove an item from the cart
export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { userId } = params;
    const { productId } = await req.json();

    if (!userId || !productId) {
      return NextResponse.json(
        { success: false, message: "Invalid cart delete request" },
        { status: 400 }
      );
    }

    const deletedCartItem = await Cart.findOneAndDelete({ userId, productId });

    if (!deletedCartItem) {
      return NextResponse.json(
        { success: false, message: "Cart item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Cart item removed" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error deleting cart item",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
