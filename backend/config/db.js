import mongoose from 'mongoose'

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://ankitjha1978:19782005@cluster0.9k0pvoo.mongodb.net/food-d')
    .then (()=>console.log("DB connected"))
}