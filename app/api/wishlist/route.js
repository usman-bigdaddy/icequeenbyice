import { NextResponse } from "next/server";
import Wishlist from "@/models/WishListSchema";
import dbConnect from "@/utils/dbConnect";

export async function POST(req) {
  try {
    await dbConnect();
    const { userId, productId } = await req.json();

    if (!userId || !productId) {
      return NextResponse.json(
        { success: false, message: "Invalid wishlist data" },
        { status: 400 }
      );
    }

    const wishlistItem = await Wishlist.create({ userId, productId });

    return NextResponse.json(
      { success: true, message: "Added to wishlist", wishlistItem },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error adding to wishlist",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
