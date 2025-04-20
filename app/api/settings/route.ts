"use server";

import dbConnect from "@/lib/connect";
import Dealership from "@/models/DealershipSchema";
import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function getDealershipInfo() {
  await dbConnect();

  try {
    const dealership = await Dealership.findOne().lean();

    if (!dealership) return null;

    // Ensure plain object with no Mongo ObjectId/Buffer stuff
    const safeDealership = JSON.parse(JSON.stringify(dealership));
    return safeDealership;
  } catch (error) {
    console.error("Error fetching dealership info:", error);
    throw new Error("Failed to fetch dealership info");
  }
}
export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    const { workingHours } = body;

    if (!workingHours) {
      return NextResponse.json(
        { error: "Working hours are required" },
        { status: 400 }
      );
    }

    // Since there's no dealership ID, just update the first (and only) document or create one
    const dealership = await Dealership.findOneAndUpdate(
      {}, // no filter means update the first matching doc (or create one)
      { workingHours },
      { new: true, upsert: true }
    ).lean();
    return NextResponse.json(dealership);
  } catch (error: any) {
    console.error("Error saving working hours:", error);
    return NextResponse.json(
      { error: "Failed to save working hours", details: error.message },
      { status: 500 }
    );
  }
}

// Get all users
export async function getUsers() {
  await dbConnect();

  try {
    const users = await User.find();
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
}

// Update user role
export async function updateUserRole(userId: any, role: any) {
  await dbConnect();

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error("User not found");
    }

    return updatedUser;
  } catch (error) {
    console.error("Error updating user role:", error);
    throw new Error("Failed to update user role");
  }
}
