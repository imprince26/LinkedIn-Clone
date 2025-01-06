import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protectRoute = async (req, res, next) => {
  try {
    // Log all incoming cookies for debugging
    console.log('Incoming Cookies:', req.cookies);

    // Use square bracket notation for cookie with hyphen
    const token = req.cookies['jwt-linkedin'];

    console.log('Token from Cookie:', token);

    if (!token) {
      return res.status(200).json({
        success: true,
        isAuthenticated: false,
        message: "No token found"
      });
    }

    // Verify token with more robust error handling
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded Token:', decoded);
    } catch (tokenError) {
      console.error('Token Verification Error:', tokenError);
      return res.status(200).json({
        success: true,
        isAuthenticated: false,
        message: handleTokenError(tokenError),
      });
    }

    // Find user
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(200).json({
        success: true,
        isAuthenticated: false,
        message: "User not found",
      });
    }

    // Attach user to request
    req.user = user;
    next();

  } catch (error) {
    console.error("Authentication middleware error:", error);
    res.status(200).json({
      success: true,
      isAuthenticated: false,
      message: "Authentication failed",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
  
};