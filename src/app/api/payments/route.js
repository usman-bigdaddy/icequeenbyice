import { NextResponse } from "next/server";
import axios from "axios";
import { db } from "@/../database/drizzle";
import { paymentTransactions, orders } from "@/../database/schema";
import { eq } from "drizzle-orm";
import { processCheckout } from "@/utils/checkout";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

// INITIATE PAYSTACK PAYMENT
export async function POST(req) {
  try {
    const { userId, orderId, email } = await req.json();

    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const paystackRes = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: order.totalAmount * 100, // in kobo
        metadata: {
          orderId,
          userId,
        },
        callback_url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/payment/verify`,
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const { reference, authorization_url } = paystackRes.data.data;

    // Save transaction
    await db.insert(paymentTransactions).values({
      userId,
      orderId,
      reference,
      amount: order.totalAmount,
      status: "PENDING",
    });

    return NextResponse.json({
      link: authorization_url,
      reference,
    });
  } catch (error) {
    console.error("Paystack Init Error:", error?.response?.data || error);
    return NextResponse.json(
      { error: "Failed to initiate payment", details: error.message },
      { status: 500 }
    );
  }
}

// VERIFY PAYSTACK PAYMENT
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("reference");

  if (!reference) {
    return NextResponse.json({ error: "Missing reference" }, { status: 400 });
  }

  try {
    const verifyRes = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const rawStatus = verifyRes.data.data.status;
    const status =
      rawStatus === "success"
        ? "SUCCESS"
        : rawStatus === "failed"
          ? "FAILED"
          : "PENDING";

    await db
      .update(paymentTransactions)
      .set({ status })
      .where(eq(paymentTransactions.reference, reference));

    if (status === "SUCCESS") {
      const orderId = verifyRes.data.data.metadata?.orderId;
      if (orderId) {
        await db
          .update(orders)
          .set({ status: "SUCCESS" })
          .where(eq(orders.id, orderId));
      }
    }

    return NextResponse.json({
      success: true,
      status,
      data: verifyRes.data.data,
    });
  } catch (error) {
    console.error("Paystack Verify Error:", error?.response?.data || error);
    return NextResponse.json(
      { error: "Verification failed", details: error.message },
      { status: 500 }
    );
  }
}
