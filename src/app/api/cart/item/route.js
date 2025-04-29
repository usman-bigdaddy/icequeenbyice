import { db } from "@/../database/drizzle";
import { cart, products } from "@/../database/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function DELETE(request) {
  try {
    const { userId, guestId, productId } = await request.json();

    if (!productId || (!userId && !guestId)) {
      return NextResponse.json(
        {
          error:
            "Either userId or guestId, and productId are required in the request body",
        },
        { status: 400 }
      );
    }

    const idField = userId ? "userId" : "guestId";
    const idValue = userId || guestId;

    //Get the cart item to know quantity
    const [item] = await db
      .select()
      .from(cart)
      .where(and(eq(cart[idField], idValue), eq(cart.productId, productId)))
      .limit(1);

    if (!item) {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }

    // Restore the product quantity
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (product) {
      await db
        .update(products)
        .set({ quantity: product.quantity + item.quantity })
        .where(eq(products.id, productId));
    }

    await db
      .delete(cart)
      .where(and(eq(cart[idField], idValue), eq(cart.productId, productId)));

    return NextResponse.json(
      { message: "Item removed from cart and stock restored." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Remove item error:", error);
    return NextResponse.json(
      {
        error: "Failed to remove item from cart",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
