// app/api/checkout/route.js
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/../database/drizzle";
import { cart, orders, orderItems } from "@/../database/schema";

function generateOrderId(length = 8) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(request) {
  let newOrder = null; // Declare newOrder in the outer scope for cleanup

  try {
    const body = await request.json();

    // Destructure required fields
    const {
      userId,
      receiverName,
      receiverNumber,
      fullAddress,
      totalAmount,
      fee,
      note,
      cartItems,
    } = body;

    // Validate required fields
    const requiredFields = [
      "userId",
      "receiverName",
      "receiverNumber",
      "fullAddress",
      "totalAmount",
      "fee",
      "note",
      "cartItems",
    ];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          missingFields,
        },
        { status: 400 }
      );
    }

    // Generate order ID
    const orderId = generateOrderId();

    // 1. First create the order with the custom ID
    [newOrder] = await db
      .insert(orders)
      .values({
        id: orderId, // Set the custom ID here
        userId,
        receiverName,
        receiverNumber,
        fullAddress,
        fee,
        note,
        totalAmount,
        status: "PENDING",
      })
      .returning();

    // 2. Then create all order items using the same orderId
    const orderItemsData = cartItems.map((item) => {
      if (!item.productId || !item.quantity || !item.price) {
        throw new Error(
          "Each cart item must have productId, quantity, and price"
        );
      }
      return {
        orderId: orderId, // Use the same orderId here
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      };
    });

    await db.insert(orderItems).values(orderItemsData);

    // 3. Finally clear the cart (if all above succeeded)
    await db.delete(cart).where(eq(cart.userId, userId));

    return NextResponse.json({
      success: true,
      data: {
        order: newOrder,
        orderItems: orderItemsData,
      },
      message: "Order created successfully",
    });
  } catch (error) {
    console.error("Checkout error:", error);

    // Attempt to clean up if order was created but other steps failed
    if (newOrder?.id) {
      try {
        await db.delete(orders).where(eq(orders.id, newOrder.id));
        // No need to delete orderItems as they should be cascade deleted
        // if your schema has ON DELETE CASCADE set up
      } catch (cleanupError) {
        console.error("Cleanup failed:", cleanupError);
      }
    }

    return NextResponse.json(
      {
        error: "Failed to process checkout",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
