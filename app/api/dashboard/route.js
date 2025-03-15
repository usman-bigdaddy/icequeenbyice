import { NextResponse } from "next/server";
import User from "@/models/UserSchema"; // Adjust the path to your User model
import Product from "@/models/ProductSchema"; // Adjust the path to your Product model
import dbConnect from "@/utils/dbConnect"; // Adjust the path to your dbConnect utility

export async function GET() {
  try {
    await dbConnect(); // Connect to the database

    // Fetch total number of users with role "customer"
    const totalCustomers = await User.countDocuments({ role: "customer" });

    // Fetch total stock quantity of all products
    const products = await Product.find({}, { stock: 1 }); // Fetch only the stock field
    const totalStock = products.reduce(
      (sum, product) => sum + product.stock,
      0
    );
    // Return the metrics
    return NextResponse.json(
      {
        success: true,
        totalCustomers,
        totalStock,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch dashboard metrics",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
