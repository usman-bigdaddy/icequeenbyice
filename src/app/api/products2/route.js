import { db } from "@/../database/drizzle";
import { products } from "@/../database/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const visibleProducts = await db
      .select()
      .from(products)
      .where(eq(products.visibility, true));

    return NextResponse.json(visibleProducts, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
