// import mongoose from 'mongoose'

// export const connectDB = async () => {
//     await mongoose.connect('mongodb+srv://ankitjha1978:19782005@cluster0.9k0pvoo.mongodb.net/food-d')
//     .then (()=>console.log("DB connected"))
// }
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB connected");
  } catch (err) {
    console.error("DB connection failed:", err);
  }
};