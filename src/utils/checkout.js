// lib/checkout-utils.js
import { eq } from "drizzle-orm";
import { db } from "@/../database/drizzle";
import { cart, orders, orderItems } from "@/../database/schema";

export function generateOrderId(length = 8) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function processCheckout(body) {
  let newOrder = null;

  try {
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
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }

    const orderId = generateOrderId();

    [newOrder] = await db
      .insert(orders)
      .values({
        id: orderId,
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

    const orderItemsData = cartItems.map((item) => {
      if (!item.productId || !item.quantity || !item.price) {
        throw new Error(
          "Each cart item must have productId, quantity, and price"
        );
      }
      return {
        orderId,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      };
    });

    await db.insert(orderItems).values(orderItemsData);

    await db.delete(cart).where(eq(cart.userId, userId));

    return {
      success: true,
      data: {
        order: newOrder,
        orderItems: orderItemsData,
      },
    };
  } catch (error) {
    // Cleanup if order was created but other steps failed
    if (newOrder?.id) {
      try {
        await db.delete(orders).where(eq(orders.id, newOrder.id));
      } catch (cleanupError) {
        console.error("Cleanup failed:", cleanupError);
        throw new Error("Checkout failed and cleanup unsuccessful");
      }
    }
    throw error; // Re-throw the error for the caller to handle
  }
}
