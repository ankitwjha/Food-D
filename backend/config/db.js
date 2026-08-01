import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/food-d';
    await mongoose.connect(mongoURI);
    console.log("DB connected");
  } catch (err) {
    console.error("DB connection failed:", err);
  }
};