import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import User from "./models/User.js";
import SavedList from "./models/SavedList.js";
import verifyToken from "./middleware/verifyToken.js";

dotenv.config();

const app = express();
const PORT = 3000;

const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "https://gchris2024.github.io",
];

app.use(cors({ origin: ALLOWED_ORIGINS }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

// POST /api/auth/register — create a new account
app.post("/api/auth/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters" });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(409)
        .json({ error: "An account with that email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({ email, passwordHash });

    res.status(201).json({
      message: "Account created successfully",
      userId: user._id,
      email: user.email,
    });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({ error: "Registration failed" });
  }
});

// POST /api/auth/login — log in and receive a token
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    res.json({
      token,
      userId: user._id,
      email: user.email,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ error: "Login failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
