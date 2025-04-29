import { db } from "@/../database/drizzle";
import { orders, products, users } from "@/../database/schema";
import { sql, eq, not, and, gte } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get current year
    const currentYear = new Date().getFullYear();
    const yearStart = new Date(currentYear, 0, 1); // January 1st of current year

    // 1. Get all metrics in parallel for performance
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      pendingOrders,
      shippedOrders,
      deliveredOrders,
      totalRevenue,
      recentOrders,
      monthlyOrders,
    ] = await Promise.all([
      // Total regular users (role = USER)
      db
        .select({ count: sql`count(*)`.mapWith(Number) })
        .from(users)
        .where(eq(users.role, "USER")),

      // Total visible products
      db
        .select({ count: sql`count(*)`.mapWith(Number) })
        .from(products)
        .where(eq(products.visibility, true)),

      // Total orders (all time)
      db.select({ count: sql`count(*)`.mapWith(Number) }).from(orders),

      // Pending orders
      db
        .select({ count: sql`count(*)`.mapWith(Number) })
        .from(orders)
        .where(eq(orders.status, "PENDING")),

      // Shipped orders
      db
        .select({ count: sql`count(*)`.mapWith(Number) })
        .from(orders)
        .where(eq(orders.status, "SHIPPED")),

      // Delivered orders
      db
        .select({ count: sql`count(*)`.mapWith(Number) })
        .from(orders)
        .where(eq(orders.status, "DELIVERED")),

      // Total revenue (excluding cancelled orders)
      db
        .select({ total: sql`sum(${orders.totalAmount})`.mapWith(Number) })
        .from(orders)
        .where(not(eq(orders.status, "CANCELLED"))),

      // Recent 10 orders
      db
        .select()
        .from(orders)
        .orderBy(sql`${orders.createdAt} DESC`)
        .limit(10),

      // Fixed monthly orders query - using consistent column naming
      db
        .select({
          month: sql`to_char(${orders.createdAt}, 'Mon')`.as("month"),
          monthnum: sql`extract(month from ${orders.createdAt})`.as("monthnum"), // lowercase to match Postgres
          count: sql`count(*)`.mapWith(Number),
        })
        .from(orders)
        .where(
          and(
            not(eq(orders.status, "CANCELLED")),
            gte(orders.createdAt, yearStart)
          )
        )
        .groupBy(sql`month`, sql`monthnum`) // lowercase to match
        .orderBy(sql`monthnum`), // lowercase to match
    ]);

    // 2. Format the response
    const response = {
      totals: {
        users: totalUsers[0].count,
        products: totalProducts[0].count,
        orders: totalOrders[0].count,
        pendingOrders: pendingOrders[0].count,
        shippedOrders: shippedOrders[0].count,
        deliveredOrders: deliveredOrders[0].count,
        revenue: totalRevenue[0].total || 0,
      },
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        status: order.status,
        amount: order.totalAmount,
        createdAt: order.createdAt,
      })),
      monthlyOrders: monthlyOrders.map((month) => ({
        month: month.month,
        count: month.count,
      })),
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Dashboard error:", {
      message: error.message,
      stack: error.stack,
      query: error.query || "Not available",
    });
    return new Response(
      JSON.stringify({ error: "Failed to load dashboard data" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
