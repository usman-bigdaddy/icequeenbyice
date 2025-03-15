import { NextResponse } from "next/server";
import Order from "@/models/OrderSchema";
import dbConnect from "@/utils/dbConnect";

export async function GET(req) {
  try {
    await dbConnect();
    const orders = await Order.find().populate("user");
    return NextResponse.json({ success: true, orders }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve orders",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const { userId, items, totalAmount, status } = await req.json();

    if (!userId || !items.length || !totalAmount) {
      return NextResponse.json(
        { success: false, message: "Invalid order data" },
        { status: 400 }
      );
    }

    const newOrder = await Order.create({
      userId,
      items,
      totalAmount,
      status: status || "Pending",
    });

    return NextResponse.json(
      { success: true, message: "Order placed successfully", order: newOrder },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error placing order", error: error.message },
      { status: 500 }
    );
  }
}
