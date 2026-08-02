import adminModel from "../models/adminModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET);
}

// Register Admin
const registerAdmin = async (req, res) => {
    const { restaurantName, adminName, username, password } = req.body;
    try {
        if (!restaurantName || !adminName || !username || !password) {
            return res.json({success: false, message: "Please fill all fields"});
        }
        
        // Check if admin exists
        const exists = await adminModel.findOne({username});
        if (exists) {
            return res.json({success: false, message: "Username/Email already exists"});
        }

        if (password.length < 8) {
            return res.json({success: false, message: "Password must be at least 8 characters"});
        }

        // Hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = new adminModel({
            restaurantName,
            adminName,
            username,
            password: hashedPassword
        });

        const admin = await newAdmin.save();
        const token = createToken(admin._id);
        res.json({success: true, message: "Admin registered successfully", token, username: admin.username, restaurantName: admin.restaurantName, adminName: admin.adminName});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error registering admin"});
    }
}

// Login Admin
const loginAdmin = async (req, res) => {
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            return res.json({success: false, message: "Please fill all fields"});
        }
        const admin = await adminModel.findOne({username});
        if (!admin) {
            return res.json({success: false, message: "Admin not found"});
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.json({success: false, message: "Invalid password"});
        }
        const token = createToken(admin._id);
        res.json({success: true, message: "Admin logged in successfully", token, username: admin.username, restaurantName: admin.restaurantName, adminName: admin.adminName});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error logging in admin"});
    }
}

export { registerAdmin, loginAdmin };
