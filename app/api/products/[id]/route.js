import dbConnect from "@/utils/dbConnect";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  await dbConnect();
  const product = await Product.findById(params.id);
  return NextResponse.json(product);
}
