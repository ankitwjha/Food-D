import mongoose from 'mongoose';
import dotenv from 'dotenv';
import foodModel from '../models/foodModel.js';

dotenv.config();

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/food-d';
    await mongoose.connect(mongoURI);
    console.log("DB connected");

    // Migrate legacy food items that don't have an owner field
    const result = await foodModel.updateMany(
      { owner: { $exists: false } },
      { $set: { owner: "abir123@12.com" } }
    );
    if (result.modifiedCount > 0) {
      console.log(`Migrated ${result.modifiedCount} legacy food items to owner abir123@12.com`);
    }

    // Migrate legacy food items that don't have a restaurantName field
    await foodModel.updateMany(
      { restaurantName: { $exists: false } },
      { $set: { restaurantName: "Food-D Express" } }
    );

    // Dynamic Migration: Update food items' restaurantName to match their owner's restaurantName from the database
    const adminsList = await mongoose.model("admins").find({});
    for (const admin of adminsList) {
      await foodModel.updateMany(
        { owner: admin.username },
        { $set: { restaurantName: admin.restaurantName } }
      );
    }
  } catch (err) {
    console.error("DB connection failed:", err);
  }
};