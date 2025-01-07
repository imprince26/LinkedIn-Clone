import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      username,
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    res.cookie("jwt-linkedin", token, {
      httpOnly: true,
      secure : true,
      sameSite: "None",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ message: "User registered successfully" });

    const profileUrl = process.env.CLIENT_URL + "/profile/" + user.username;
  } catch (error) {
    console.log("Error in signup: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { 
        userId: user._id, 
        username: user.username 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: "3d" }
    );

    // Enhanced cookie settings
    res.cookie("jwt-linkedin", token, {
      httpOnly: true,
      secure:true,
      sameSite: "None",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ 
      message: "Login successful", 
      isAuthenticated: true 
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = (req, res) => {
  res.cookie('jwt-linkedin', '', {
    httpOnly: true,
    expires: new Date(0), 
    secure: true,
    sameSite: 'None',
  });
  
  res.status(200).json({ 
    message: "Logged out successfully",
    logoutSuccessful: true 
  });
};

export const getCurrentUser = async (req, res) => {
  try {
    const token = req.cookies['jwt-linkedin'];

    if (!token) {
      return res.status(200).json({
        success: true,
        isAuthenticated: false,
        message: "No active session"
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

    const user = await User.findById(decoded.userId)
      .select({
        password: 0,
        __v: 0,
      })
      .populate("connections", "name username profilePicture headline");

    if (!user) {
      return res.status(200).json({
        success: true,
        isAuthenticated: false,
        message: "User not found"
      });
    }

    const userResponse = {
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture || "/avatar.png",
      bannerImg: user.bannerImg || "/banner.png",
      headline: user.headline || "LinkedIn User",
      location: user.location || "Earth",
      about: user.about || "",
      skills: user.skills || [],
      experience: user.experience || [],
      education: user.education || [],
      connections: user.connections || [],
      connectionCount: user.connections.length || 0,
      createdAt: user.createdAt,
      isAuthenticated: true
    };

    res.status(200).json({
      ...userResponse,
      isAuthenticated: true
    });
  } catch (error) {
    console.error("Error in getCurrentUser controller:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });

    res.status(200).json({
      success: true,
      isAuthenticated: true,
      message: "Authentication process failed",
    });
  }
};

function handleTokenError(error) {
  switch (error.name) {
    case 'JsonWebTokenError':
      return "Invalid token";
    case 'TokenExpiredError':
      return "Token expired";
    default:
      return "Authentication failed";
  }
}