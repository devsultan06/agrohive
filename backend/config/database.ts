import mongoose from "mongoose";
import { env } from "./env.ts";

export const connectDB = async () => {
  try {
    await mongoose.connect(env.mongoUri);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ DB Connection Error:", err);
    process.exit(1);
  }
};
