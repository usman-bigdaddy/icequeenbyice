import { db } from "@/../database/drizzle";
import { products } from "@/../database/schema";
import { eq, and, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const [newProducts, bestSellers, trendingProducts, featuredProducts] =
      await Promise.all([
        db
          .select()
          .from(products)
          .where(eq(products.visibility, true))
          .orderBy(desc(products.createdAt))
          .limit(10),
        db
          .select()
          .from(products)
          .where(
            and(eq(products.bestSeller, true), eq(products.visibility, true))
          )
          .limit(5),

        db
          .select()
          .from(products)
          .where(
            and(eq(products.trending, true), eq(products.visibility, true))
          )
          .limit(5),

        db
          .select()
          .from(products)
          .where(
            and(eq(products.featured, true), eq(products.visibility, true))
          )
          .limit(5),
      ]);

    return NextResponse.json({
      success: true,
      data: {
        newProducts,
        bestSellers,
        trendingProducts,
        featuredProducts,
      },
    });
  } catch (error) {
    console.error("Error fetching home details:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
