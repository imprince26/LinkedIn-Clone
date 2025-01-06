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
      secure: process.env.NODE_ENV === 'production',
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

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create and send token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });
    await res.cookie("jwt-linkedin", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: "Logged in successfully" });
  } catch (error) {
    console.error("Error in login controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("jwt-linkedin");
  res.json({ message: "Logged out successfully" });
};

export const getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please log in.",
      });
    }

    const user = await User.findById(req.user._id)
      .select({
        password: 0,
        __v: 0,
      })
      .populate("connections", "name username profilePicture headline");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
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
    };

    // Send successful response
    res.status(200).json(userResponse);
  } catch (error) {
    console.error("Error in getCurrentUser controller:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(422).json({
        success: false,
        message: "User validation failed",
        errors: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
