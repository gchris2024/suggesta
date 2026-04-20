import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import SavedList from "./models/SavedList.js";
import verifyToken from "./middleware/verifyToken.js";

import authRoutes from "./routes/authRoutes.js";
import moviesRoutes from "./routes/moviesRoutes.js";
import listRoutes from "./routes/listRoutes.js";

dotenv.config();

const app = express();
const PORT = 3000;

const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "https://gchris2024.github.io",
];

app.use(
  cors({
    origin: ALLOWED_ORIGINS,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/movies", verifyToken, moviesRoutes);
app.use("/api/list", verifyToken, listRoutes);

// Connect to MongoDB, then start the server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
