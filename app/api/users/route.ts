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

// app/api/users/[userId]/route.ts
export async function PATCH(
  request: Request,
  { params }: { params: { userId: string } }
) {
  await dbConnect();

  try {
    const { role } = await request.json();

    const updatedUser = await User.findByIdAndUpdate(
      params.userId,
      { role },
      { new: true }
    )
      .select("-password") // Exclude password
      .lean(); // Convert to plain object

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
