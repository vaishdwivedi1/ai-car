"use server";
import dbConnect from "@/lib/connect";
import { Car } from "@/models/Cars";
import type { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Function to convert File to base64
async function fileToBase64(file) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  return buffer.toString("base64");
}

// Gemini AI integration for car image processing
export async function processCarImageWithAI(file) {
  try {
    // Check if API key is available
    if (!process.env.GEMINI) {
      throw new Error("Gemini API key is not configured");
    }

    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Convert image file to base64
    const base64Image = await fileToBase64(file);

    // Create image part for the model
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: file.type,
      },
    };

    // Define the prompt for car detail extraction
    const prompt = `
        Analyze this car image and extract the following information:
        1. Make (manufacturer)
        2. Model
        3. Year (approximately)
        4. Color
        5. Body type (SUV, Sedan, Hatchback, etc.)
        6. Mileage
        7. Fuel type (your best guess)
        8. Transmission type (your best guess)
        9. Price (your best guess)
        9. Short Description as to be added to a car listing
  
        Format your response as a clean JSON object with these fields:
        {
          "make": "",
          "model": "",
          "year": 0000,
          "color": "",
          "price": "",
          "mileage": "",
          "bodyType": "",
          "fuelType": "",
          "transmission": "",
          "description": "",
          "confidence": 0.0
        }
  
        For confidence, provide a value between 0 and 1 representing how confident you are in your overall identification.
        Only respond with the JSON object, nothing else.
      `;

    // Get response from Gemini
    const result = await model.generateContent([imagePart, prompt]);
    const response = await result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    // Parse the JSON response
    try {
      const carDetails = JSON.parse(cleanedText);

      // Validate the response format
      const requiredFields = [
        "make",
        "model",
        "year",
        "color",
        "bodyType",
        "price",
        "mileage",
        "fuelType",
        "transmission",
        "description",
        "confidence",
      ];

      const missingFields = requiredFields.filter(
        (field) => !(field in carDetails)
      );

      if (missingFields.length > 0) {
        throw new Error(
          `AI response missing required fields: ${missingFields.join(", ")}`
        );
      }

      // Return success response with data
      return {
        success: true,
        data: carDetails,
      };
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      console.log("Raw response:", text);
      return {
        success: false,
        error: "Failed to parse AI response",
      };
    }
  } catch (error) {
    console.error();
    throw new Error("Gemini API error:" + error.message);
  }
}

export async function Delete(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const { id } = req.query;

  try {
    if (req.method === "DELETE") {
      await Car.findByIdAndDelete(id);
      return res.status(200).json({ message: "Car deleted" });
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete car" });
  }
}

export async function Get(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  try {
    const cars = await Car.find().sort({ createdAt: -1 });
    return res.status(200).json(cars);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch cars" });
  }
}

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method Not Allowed" },
      { status: 405 }
    );
  }

  try {
    await dbConnect();

    // Parse the request body
    const body = await req.json();

    // Validate required fields
    if (!body.make || !body.model || !body.year) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newCar = await Car.create(body);
    return NextResponse.json(newCar, { status: 201 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to create car", details: error?.message },
      { status: 500 }
    );
  }
}
