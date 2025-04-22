import { db } from "@/../database/drizzle";
import { orders, users, orderItems, products } from "@/../database/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    // Using destructuring as you prefer
    const { id } = params;

    const result = await db
      .select({
        id: orders.id,
        status: orders.status,
        fee: orders.fee,
        note: orders.note,
        totalAmount: orders.totalAmount,
        createdAt: orders.createdAt,
        receiverName: orders.receiverName,
        receiverNumber: orders.receiverNumber, // Added from schema
        fullAddress: orders.fullAddress,
        userFullName: users.fullName,
        userEmail: users.email,
        itemId: orderItems.id,
        productId: orderItems.productId,
        quantity: orderItems.quantity,
        price: orderItems.price,
        productName: products.name,
        productImages: products.images, // Changed from productImage to images (matches schema)
        productFabric: products.fabricType, // Changed from fabricType to match schema
        productSize: products.size,
      })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
      .leftJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orders.id, id));

    if (!result || result.length === 0) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // Transform with null checks
    const transformed = {
      id: result[0]?.id,
      status: result[0]?.status,
      fee: result[0]?.fee,
      note: result[0]?.note,
      totalAmount: result[0]?.totalAmount,
      createdAt: result[0]?.createdAt,
      customerDetails: {
        fullName: result[0]?.userFullName || null,
        email: result[0]?.userEmail || null,
      },
      shippingDetails: {
        receiverName: result[0]?.receiverName || null,
        receiverNumber: result[0]?.receiverNumber || null, // Added
        fullAddress: result[0]?.fullAddress || null,
      },
      items: result.map((row) => ({
        id: row?.itemId || null,
        productId: row?.productId || null,
        quantity: row?.quantity || null,
        price: row?.price || null,
        product: {
          name: row?.productName || null,
          images: row?.productImages || [], // Changed to images array
          fabricType: row?.productFabric || null,
          size: row?.productSize || null,
        },
      })),
    };

    return NextResponse.json({
      success: true,
      data: transformed,
    });
  } catch (error) {
    console.error("Get order error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch order",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    // Using destructuring as you prefer
    const { id } = params;
    const { status } = await request.json();

    const updatedOrder = await db
      .update(orders)
      .set({
        status,
        updatedAt: new Date(), // Added to match schema
      })
      .where(eq(orders.id, id))
      .returning();

    if (!updatedOrder || updatedOrder.length === 0) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedOrder[0],
    });
  } catch (error) {
    console.error("Update order error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update order",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
