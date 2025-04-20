import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    make: String,
    model: String,
    year: Number,
    price: mongoose.Types.Decimal128,
    mileage: Number,
    color: String,
    fuelType: String,
    transmission: String,
    bodyType: String,
    seats: Number,
    description: String,
    status: {
      type: String,
      enum: ["AVAILABLE", "UNAVAILABLE", "SOLD"],
      default: "AVAILABLE",
    },
    featured: { type: Boolean, default: false },
    images: [String],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Car = mongoose.models.Car || mongoose.model("Car", carSchema);
