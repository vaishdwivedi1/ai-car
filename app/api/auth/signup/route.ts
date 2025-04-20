import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/connect";
import bcrypt from "bcryptjs";
import { User } from "@/models/User";
import { sign } from "jsonwebtoken";

export async function POST(req: NextRequest) {
  console.log("Signup POST method received");

  await dbConnect();

  const { email, password } = await req.json();

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      email,
      password: hashedPassword,
    });

    // Create JWT token
    const token = sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    return NextResponse.json(
      { success: true, message: "User registered", token },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { success: false, message: "Method not allowed" },
    { status: 405 }
  );
}
