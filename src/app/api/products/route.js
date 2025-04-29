import { NextResponse } from "next/server";
import { db } from "../../../../database/drizzle";
import { products, SIZE_ENUM } from "../../../../database/schema";
import { eq } from "drizzle-orm";

const validateToken = async (request) => {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    console.log(token);
    return { error: "Unauthorized: No token provided", status: 401 };
  }

  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );
    if (!payload.role || !["ADMIN", "SUPER_ADMIN"].includes(payload.role)) {
      return { error: "Forbidden: Admins only", status: 403 };
    }
    return payload;
  } catch (error) {
    return { error: "Invalid token format", status: 401 };
  }
};

// GET - Public (with pagination)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("id");
    const pageParam = parseInt(searchParams.get("page") || "1", 10);
    const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
    const pageSize = 20;

    if (productId) {
      const product = await db
        .select()
        .from(products)
        .where(eq(products.id, productId))
        .limit(1);

      return product[0]
        ? NextResponse.json(product[0])
        : NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    const paginatedProducts = await db
      .select()
      .from(products)
      .where(eq(products.visibility, true))
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    return NextResponse.json(paginatedProducts);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST - Admin only
export async function POST(request) {
  const token = await validateToken(request);
  if (token.error) return NextResponse.json(token, { status: token.status });

  try {
    const body = await request.json();
    // const requiredFields = ['name', 'fabricType','bestSeller', 'trending', 'size', 'width', 'price', 'quantity', 'images'];

    // if (requiredFields.some(field => !body[field])) {
    //   return NextResponse.json(
    //     { error: "Missing required fields" },
    //     { status: 400 }
    //   );
    // }

    // Validate size enum
    if (!SIZE_ENUM.enumValues.includes(body.size)) {
      return NextResponse.json(
        {
          error: `Invalid size value. Must be one of: ${SIZE_ENUM.enumValues.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Validate images is an array
    if (!Array.isArray(body.images)) {
      return NextResponse.json(
        { error: "Images must be an array of strings" },
        { status: 400 }
      );
    }

    const [newProduct] = await db
      .insert(products)
      .values({
        ...body,
        createdAt: new Date(),
        updatedAt: new Date(),
        featured: body.featured ?? false,
        visibility: body.visibility ?? true,
        deleted: false,
      })
      .returning();

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      { error: "Invalid request data", details: error.message },
      { status: 400 }
    );
  }
}

// PUT - Admin only
export async function PUT(request) {
  const token = await validateToken(request);
  if (token.error) return NextResponse.json(token, { status: token.status });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const body = await request.json();

    const updateData = {
      updatedAt: new Date(),
    };

    const allowedFields = [
      "name",
      "fabricType",
      "size",
      "width",
      "length",
      "bestSeller",
      "trending",
      "price",
      "quantity",
      "images",
      "featured",
      "length",
      "description",
    ];

    allowedFields.forEach((field) => {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    });

    // Validate size enum if provided
    if (body.size && !SIZE_ENUM.enumValues.includes(body.size)) {
      return NextResponse.json(
        {
          error: `Invalid size value. Must be one of: ${SIZE_ENUM.enumValues.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // If images are being updated, validate it's an array
    if (body.images && !Array.isArray(body.images)) {
      return NextResponse.json(
        { error: "Images must be an array of strings" },
        { status: 400 }
      );
    }

    const [updatedProduct] = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, id))
      .returning();

    return updatedProduct
      ? NextResponse.json(updatedProduct)
      : NextResponse.json({ error: "Product not found" }, { status: 404 });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json(
      {
        error: "Failed to update product",
        details: error.message,
      },
      { status: 400 }
    );
  }
}

// DELETE - Admin only
export async function DELETE(request) {
  const token = await validateToken(request);
  if (token.error) return NextResponse.json(token, { status: token.status });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) throw new Error("Missing ID");

    const [result] = await db
      .update(products)
      .set({
        deleted: true,
        visibility: false, // Force visibility to false when deleting
        updatedAt: new Date(),
      })
      .where(eq(products.id, id))
      .returning({ deletedId: products.id });

    return result
      ? NextResponse.json({ message: "Deleted successfully" })
      : NextResponse.json({ error: "Not Found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json(
      { error: "Deletion failed", details: error.message },
      { status: 500 }
    );
  }
}
