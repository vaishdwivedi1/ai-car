"use server";
import dbConnect from "@/lib/connect";
import { Car } from "@/models/Cars";
import type { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Function to convert File to base64
async function fileToBase64(file: { arrayBuffer: () => any }) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  return buffer.toString("base64");
}

// Gemini AI integration for car image processing
export async function processCarImageWithAI(file: never) {
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

export async function GET() {
  await dbConnect();

  try {
    const cars = await Car.find().sort({ createdAt: -1 });
    return NextResponse.json(cars);
  } catch (error) {
    console.error("Error fetching cars:", error);
    return NextResponse.json(
      { error: "Failed to fetch cars" },
      { status: 500 }
    );
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

export async function PATCH(req: Request) {
  await dbConnect();

  try {
    const body = await req.json();
    const { id, change, value } = body;
    console.error("coming iubsahdbhsjabd");
    if (!id || !change) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    let updateData: Record<string, any> = {};

    // Toggle only "features.featured"
    if (change === "featured") {
      const car = await Car.findById(id);
      if (!car) {
        return NextResponse.json({ error: "Car not found" }, { status: 404 });
      }

      updateData["featured"] = !car.featured;
    }

    // Change status like "sold", "available"
    else if (change === "status") {
      const car = await Car.findById(id);
      if (!car) {
        return NextResponse.json({ error: "Car not found" }, { status: 404 });
      }

      updateData["status"] = value;
    }

    // Update the whole car object
    else if (change === "carvalues") {
      updateData = value;
    }

    const updatedCar = await Car.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedCar) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    return NextResponse.json(updatedCar);
  } catch (error) {
    console.error("Error updating car:", error);
    return NextResponse.json(
      { error: "Failed to update car", details: error?.message },
      { status: 500 }
    );
  }
}
