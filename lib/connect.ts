import mongoose, { Mongoose } from "mongoose";

// Define the type for the Mongoose connection
const MONGODB_URI = process.env.MONGODB_URL;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URL environment variable");
}

let cached: { conn: Mongoose | null; promise: Promise<Mongoose> | null } =
  global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Define the type for dbConnect function
async function dbConnect(): Promise<Mongoose> {
  // If connection exists, return it
  if (cached.conn) return cached.conn;

  // If no connection, establish it and cache the promise
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI)
      .then((mongooseInstance) => mongooseInstance);
  }

  // Wait for the connection to be established and cache it
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
