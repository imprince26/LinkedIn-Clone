import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// server/middleware/authMiddleware.js
export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies['jwt-linkedin'];

    if (!token) {
      return res.status(200).json({
        success: true,
        isAuthenticated: false,
        message: "No token found"
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (tokenError) {
      return res.status(200).json({
        success: true,
        isAuthenticated: false,
        message: handleTokenError(tokenError)
      });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(200).json({
        success: true,
        isAuthenticated: false,
        message: "User not found"
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication middleware error:", error);
    res.status(200).json({
      success: true,
      isAuthenticated: false,
      message: "Authentication failed"
    });
  }
};