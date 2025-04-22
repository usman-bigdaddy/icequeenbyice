import { NextResponse } from "next/server";
import { db } from "../../../../database/drizzle";
import { deliveryFees } from "../../../../database/schema";
import { eq } from "drizzle-orm";
import { getToken } from "next-auth/jwt";

// Helper function to validate token and roles
const validateToken = async (request) => {
  // Manual token extraction as fallback
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')[1];
  
  if (!token) {
    return { error: "Unauthorized: No token provided", status: 401 };
  }

  // Verify token structure
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    if (!payload.role || !['ADMIN', 'SUPER_ADMIN'].includes(payload.role)) {
      return { error: "Forbidden: Admins only", status: 403 };
    }
    return payload;
  } catch (error) {
    return { error: "Invalid token format", status: 401 };
  }
};


// GET: Fetch all delivery fees (Public)
export async function GET() {
  try {
    const fees = await db.select().from(deliveryFees).orderBy(deliveryFees.location);
    return NextResponse.json(fees, { status: 200 });
  } catch (error) {
    console.error("Error fetching delivery fees:", error);
    return NextResponse.json({ error: "Failed to retrieve fees" }, { status: 500 });
  }
}

// POST: Add a new delivery fee (Admin only)
export async function POST(request) {
  const token = await validateToken(request);
  if (token.error) return NextResponse.json(token, { status: token.status });

  try {
    const { location, fee } = await request.json();
    if (!location || fee == null) {
      return NextResponse.json({ error: "Location and fee are required" }, { status: 400 });
    }
    
    const [newFee] = await db.insert(deliveryFees)
      .values({ location, fee })
      .returning();
      
    return NextResponse.json(newFee, { status: 201 });
  } catch (error) {
    console.error("Error adding delivery fee:", error);
    return NextResponse.json({ error: "Failed to add delivery fee" }, { status: 500 });
  }
}

// PUT: Update a delivery fee (Admin only)
export async function PUT(request) {
  const token = await validateToken(request);
  if (token.error) return NextResponse.json(token, { status: token.status });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing fee ID" }, { status: 400 });
    
    const { location, fee } = await request.json();
    if (!location || fee == null) {
      return NextResponse.json({ error: "Location and fee are required" }, { status: 400 });
    }
    
    const [updatedFee] = await db.update(deliveryFees)
      .set({ location, fee })
      .where(eq(deliveryFees.id, id))
      .returning();
      
    if (!updatedFee) return NextResponse.json({ error: "Fee not found" }, { status: 404 });
    
    return NextResponse.json(updatedFee, { status: 200 });
  } catch (error) {
    console.error("Error updating delivery fee:", error);
    return NextResponse.json({ error: "Failed to update delivery fee" }, { status: 500 });
  }
}

// DELETE: Remove a delivery fee (Admin only)
export async function DELETE(request) {
  const token = await validateToken(request);
  if (token.error) return NextResponse.json(token, { status: token.status });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing fee ID" }, { status: 400 });
    
    const [deletedFee] = await db.delete(deliveryFees)
      .where(eq(deliveryFees.id, id))
      .returning();
      
    if (!deletedFee) return NextResponse.json({ error: "Fee not found" }, { status: 404 });
    
    return NextResponse.json({ message: "Fee deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting delivery fee:", error);
    return NextResponse.json({ error: "Failed to delete delivery fee" }, { status: 500 });
  }
}