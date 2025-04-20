import { NextRequest, NextResponse } from "next/server"; // Use NextRequest and NextResponse
import dbConnect from "@/lib/connect"; // Ensure this is the correct path
import bcrypt from "bcryptjs";
import { User } from "@/models/User"; // Ensure this path is correct
import { sign } from "jsonwebtoken"; // For generating JWT token

// Named export for the POST method
export async function POST(req: NextRequest) {
  console.log("POST method received");

  await dbConnect();

  const { email, password } = await req.json(); // Use req.json() to parse the request body

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 400 }
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 400 }
      );
    }

    const token = sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!, // Use actual environment variable
      { expiresIn: "1h" }
    );

    return NextResponse.json({ success: true, token }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// Named export for other HTTP methods (optional if needed)
export async function GET() {
  return NextResponse.json(
    { success: false, message: "Method not allowed" },
    { status: 405 }
  );
}
