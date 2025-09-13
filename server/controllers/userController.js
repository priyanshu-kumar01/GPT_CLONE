import User from "../models/User.js";
import  jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


// Generate JWT 
const generateToken = (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn : "30d"
    })
}

// API Call to register the user
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExist = await User.findOne({ email });

        if (userExist) {
            return res.json({ success: false, message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({ name, email, password });

        const token = generateToken(user._id);
        res.json({ success: true, token });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};


// API to Login user
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) return res.json({ success: false, message: "Invalid email or password" });

        const isMatch = await bcrypt.compare(password, user.password);
   

        if (!isMatch) return res.json({ success: false, message: "Invalid email or password" });

        const token = generateToken(user._id);
        res.json({ success: true, token });
    } catch (error) {
        console.log("Login error:", error.message);
        res.json({ success: false, message: error.message });
    }
};


// API to get user data

export const getUser = (req,res)=>{
    try {
        const user = req.user;
        return res.json({success: true, user});

    } catch (error) {
         return res.json({success: false, message:error.message});
    }
}