import { NextResponse } from "next/server";
import User from "@/models/UserSchema"; // Adjust the path to your User model
import dbConnect from "@/utils/dbConnect"; // Adjust the path to your dbConnect utility

export async function POST(req) {
  try {
    await dbConnect(); // Connect to the database

    // Parse the request body
    const { name, email, password, role } = await req.json();

    // Validate required fields
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, email, password, and role are required",
        },
        { status: 400 }
      );
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Create a new user
    const newUser = await User.create({ name, email, password, role });

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create user",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect(); // Connect to the database

    // Fetch all users
    const users = await User.find({}, { password: 0 }); // Exclude the password field

    // Return the users
    return NextResponse.json(
      {
        success: true,
        users,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch users",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
