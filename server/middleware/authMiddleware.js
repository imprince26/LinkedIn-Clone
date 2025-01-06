import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protectRoute = async (req, res, next) => {
  try {
    // Use square bracket notation for cookie with hyphen
    const token = req.cookies['jwt-linkedin'];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login to access this resource",
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (tokenError) {
      if (tokenError.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: "Invalid token. Please login again",
        });
      }
      if (tokenError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: "Token expired. Please login again",
        });
      }
      console.log('Cookies:', req.cookies); // Log cookies
      console.log('Token:', req.cookies['jwt-linkedin']); // Check token
      throw tokenError;
    }

    // Find user
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Attach user to request
    req.user = user;
    next();

  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({
      success: false,
      message: "Authentication failed",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};