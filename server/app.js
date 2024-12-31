import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/authRoute.js";
import userRoutes from "./routes/userRoute.js";
import postRoutes from "./routes/postRoute.js";
import notificationRoutes from "./routes/notificationroute.js";
import connectionRoutes from "./routes/connectionRoute.js";

dotenv.config();

const app = express();
const Port = process.env.PORT || 8000;
const __dirname = path.resolve();

app.use(
  cors({
    origin:process.env.CLIENT_URL || "*",
    credentials: true,
  })
);

app.use(express.json()); // parse JSON request bodies
app.use(cookieParser());

app.get("/",(req,res)=>{
  res.json({
      message : "Server is running on port 8000" 
  })
})

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/notifications", notificationRoutes);
app.use("/connections", connectionRoutes);

app.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
  connectDB();
});
