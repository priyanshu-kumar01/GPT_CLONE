import jwt from "jsonwebtoken"
import User from "../models/User.js";

// export const protect = async (req,res, next) => {
//     let token = req.headers.authorization;
//     try {
//         const decord = jwt.verify(token, process.env.JWT_SECRET);
//         const userId = decord.id;

//         const user = await User.findById(userId);
        
//         if(!user){
//             return res.json({success : false, message: "Not authorized, user not found"});
//         }
//         req.user = user;
//         next()
//     } catch (error) {
//         res.status(401).json({message : "Not authorized, token failed"});
//     } 
//}

export const protect = async (req, res, next) => {
    let token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ success: false, message: "Not authorized, no token" });
    }

    // Remove "Bearer " if present
    if (token.startsWith("Bearer ")) {
        token = token.split(" ")[1];
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password"); // hide password

        if (!user) {
            return res.status(401).json({ success: false, message: "Not authorized, user not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Not authorized, token failed" });
    }
};
