import dbConnect from "@/lib/connect";
import { User } from "@/models/User";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  try {
    console.log(params);
    const { role } = await request.json();

    const updatedUser = await User.findByIdAndUpdate(
      params.id,
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
