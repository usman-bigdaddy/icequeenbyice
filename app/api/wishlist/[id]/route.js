import { NextResponse } from "next/server";
import Wishlist from "@/models/Wishlist";
import dbConnect from "@/utils/dbConnect";

// Fetch wishlist for a specific user
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

    const wishlistItems = await Wishlist.find({ userId }).populate("productId");
    return NextResponse.json({ success: true, wishlistItems }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching wishlist",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// Remove an item from the wishlist
export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { userId } = params;
    const { productId } = await req.json();

    if (!userId || !productId) {
      return NextResponse.json(
        { success: false, message: "Invalid wishlist delete request" },
        { status: 400 }
      );
    }

    const deletedWishlistItem = await Wishlist.findOneAndDelete({
      userId,
      productId,
    });

    if (!deletedWishlistItem) {
      return NextResponse.json(
        { success: false, message: "Wishlist item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Wishlist item removed" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error deleting wishlist item",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
