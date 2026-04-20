import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
