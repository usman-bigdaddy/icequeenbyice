import { db } from "@/../database/drizzle";
import { orders, orderItems, users } from "@/../database/schema";
import { eq, and, desc, sql, not } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");

    // Build the where conditions dynamically
    const whereConditions = [];
    if (userId) whereConditions.push(eq(orders.userId, userId));
    if (status) whereConditions.push(eq(orders.status, status));

    const ordersData = await db
      .select({
        // Order details
        id: orders.id,
        note: orders.note,
        status: orders.status,
        totalAmount: orders.totalAmount,
        createdAt: orders.createdAt,
        receiverName: orders.receiverName,
        fullAddress: orders.fullAddress,

        // User details
        userFullName: users.fullName,
        userEmail: users.email,

        // Sum of quantities from order items
        totalQuantity: sql`SUM(${orderItems.quantity})`.mapWith(Number),
      })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .groupBy(orders.id, users.id, users.fullName, users.email)
      .orderBy(desc(orders.createdAt));

    return NextResponse.json({
      success: true,
      data: ordersData.map((order) => ({
        id: order.id,
        note: order.note,
        status: order.status,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt,
        totalQuantity: order.totalQuantity || 0, // Default to 0 if null
        customerDetails: {
          fullName: order.userFullName,
          email: order.userEmail,
        },
        shippingDetails: {
          receiverName: order.receiverName,
          fullAddress: order.fullAddress,
        },
      })),
    });
  } catch (error) {
    console.error("Get orders error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch orders",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
