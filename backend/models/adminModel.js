import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    restaurantName: {type:String, required:true},
    adminName: {type:String, required:true},
    username: {type:String, required:true, unique:true},
    password: {type:String, required:true}
}, {minimize:false})

const adminModel = mongoose.models.admin || mongoose.model("admins", adminSchema);

export default adminModel;
