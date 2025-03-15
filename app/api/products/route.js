import { NextResponse } from "next/server";
import Product from "@/models/ProductSchema";
import dbConnect from "@/utils/dbConnect";
export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find();
    return NextResponse.json({ success: true, products }, { status: 200 });
  } catch (error) {
    // Handle errors
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch products",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const {
      name,
      description,
      price,
      category,
      stock,
      width,
      length,
      images,
      featured,
    } = await req.json();

    // Validate required fields
    if (!name || !price || !category || !stock || !width || !length) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Name, price, category, stock, width, and length are required fields",
        },
        { status: 400 }
      );
    }

    // Create a new product in the database
    const newProduct = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      width,
      length,
      images,
      featured,
    });

    // Return success response with the new product
    return NextResponse.json(
      {
        success: true,
        message: "Product added successfully",
        product: newProduct,
      },
      { status: 201 }
    );
  } catch (error) {
    // Handle errors
    console.error("Error adding product:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error adding product",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
