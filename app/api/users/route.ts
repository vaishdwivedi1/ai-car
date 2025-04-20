import { NextResponse } from "next/server";
import dbConnect from "@/lib/connect";
import { User } from "@/models/User";

export async function GET() {
  await dbConnect();

  try {
    // Add .lean() to convert Mongoose documents to plain JavaScript objects
    const users = await User.find({}, { password: 0 }).lean();
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

