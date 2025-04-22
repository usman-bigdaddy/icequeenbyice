import { db } from "@/../database/drizzle";
import { cart, products } from "@/../database/schema";
import { eq, and, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const guestId = searchParams.get("guestId");

    if (!userId && !guestId) {
      return NextResponse.json(
        { error: "Either userId or guestId must be provided" },
        { status: 400 }
      );
    }
    const cartItems = await db
      .select({
        cartId: cart.id,
        quantity: cart.quantity,
        createdAt: cart.createdAt,
        totalPrice: sql`${cart.quantity} * ${products.price}`.mapWith(Number),
        product: {
          id: products.id,
          name: products.name,
          price: products.price,
          images: products.images,
          fabricType: products.fabricType,
          size: products.size,
        },
      })
      .from(cart)
      .where(userId ? eq(cart.userId, userId) : eq(cart.guestId, guestId))
      .innerJoin(products, eq(cart.productId, products.id));

    if (!cartItems) {
      console.log("No cart items found");
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(cartItems);
  } catch (error) {
    console.error("Get cart error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    return NextResponse.json(
      {
        error: "Failed to get cart items",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
export async function POST(request) {
  try {
    const { userId, guestId, productId, quantity, action } =
      await request.json();
    const cookieStore = cookies();

    const guestIdToUse = guestId || cookieStore.get("guestId")?.value;

    if (!userId && !guestIdToUse) {
      return NextResponse.json(
        { error: "No user or guest identifier found" },
        { status: 400 }
      );
    }

    const effectiveId = userId || guestIdToUse;
    const idField = userId ? "userId" : "guestId";

    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (!product) {
      throw new Error("Product not found");
    }

    const [existingItem] = await db
      .select()
      .from(cart)
      .where(and(eq(cart[idField], effectiveId), eq(cart.productId, productId)))
      .limit(1);

    let cartItem;
    let newQuantity;
    let quantityDiff;

    if (action === "increment" || action === "decrement") {
      if (!existingItem) {
        if (action === "decrement") {
          throw new Error("Cannot decrement non-existent cart item");
        }
        newQuantity = 1; // Start with 1 if item doesn't exist
      } else {
        newQuantity =
          action === "increment"
            ? existingItem.quantity + 1
            : existingItem.quantity - 1;
      }

      if (newQuantity < 0) newQuantity = 0;

      // Calculate net quantity change
      quantityDiff = newQuantity - (existingItem?.quantity || 0);
    } else {
      //update with provided quantity
      if (quantity < 0) {
        throw new Error("Quantity cannot be negative");
      }
      newQuantity = quantity;
      quantityDiff = existingItem ? quantity - existingItem.quantity : quantity;
    }

    if (quantityDiff > 0 && product.quantity < quantityDiff) {
      throw new Error("Not enough stock available");
    }

    // Update cart in database
    if (existingItem) {
      if (newQuantity <= 0) {
        // Remove item if quantity reaches 0
        await db
          .delete(cart)
          .where(
            and(eq(cart[idField], effectiveId), eq(cart.productId, productId))
          );
        cartItem = null;
      } else {
        // Update existing item
        const [updated] = await db
          .update(cart)
          .set({ quantity: newQuantity })
          .where(
            and(eq(cart[idField], effectiveId), eq(cart.productId, productId))
          )
          .returning();
        cartItem = updated;
      }
    } else if (newQuantity > 0) {
      // Only create new item if quantity is positive
      const [newItem] = await db
        .insert(cart)
        .values({
          [idField]: effectiveId,
          productId,
          quantity: newQuantity,
        })
        .returning();
      cartItem = newItem;
    }

    // Update product inventory
    if (quantityDiff !== 0) {
      await db
        .update(products)
        .set({ quantity: product.quantity - quantityDiff })
        .where(eq(products.id, productId));
    }

    // Return updated cart item
    return NextResponse.json(cartItem, { status: 201 });
  } catch (error) {
    console.error("Cart error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update cart" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { userId, guestId } = await request.json();
    const cookieStore = cookies();
    //const guestIdToUse = guestId || cookieStore.get("guestId")?.value;
    const guestIdToUse = guestId || cookieStore.get("guestId")?.value;

    if (!userId && !guestIdToUse) {
      return NextResponse.json(
        { error: "No user or guest identifier found" },
        { status: 400 }
      );
    }

    const effectiveId = userId || guestIdToUse;
    const idField = userId ? "userId" : "guestId";

    // Get all cart items first
    const items = await db
      .select()
      .from(cart)
      .where(eq(cart[idField], effectiveId));

    // Restore each product's quantity
    for (const item of items) {
      const [product] = await db
        .select()
        .from(products)
        .where(eq(products.id, item.productId))
        .limit(1);

      if (product) {
        await db
          .update(products)
          .set({ quantity: product.quantity + item.quantity })
          .where(eq(products.id, item.productId));
      }
    }

    // Delete all cart items
    await db.delete(cart).where(eq(cart[idField], effectiveId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Clear cart error:", error);
    return NextResponse.json(
      { error: "Failed to clear cart" },
      { status: 500 }
    );
  }
}
