import dotenv from "dotenv";
dotenv.config();

if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  throw new Error("❌ Missing environment variables. Check your .env file!");
}

export const env = {
  port: process.env.PORT ? Number(process.env.PORT) : 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  nodeEnv: process.env.NODE_ENV || "development",
};
