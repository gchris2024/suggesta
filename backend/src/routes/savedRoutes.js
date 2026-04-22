import express from "express";
import mongoose from "mongoose";
import SavedList from "../models/SavedList.js";

const router = express.Router();

// POST /api/saved — save a new recommendation list
router.post("/", async (req, res) => {
  const { name, movies } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: "List name is required" });
  }

  if (!Array.isArray(movies) || movies.length === 0) {
    return res
      .status(400)
      .json({ error: "'movies' must be a non-empty array" });
  }

  try {
    const list = await SavedList.create({
      userId: req.user.userId,
      name: name.trim(),
      movies,
    });

    res.status(201).json({ message: "List saved successfully" });
  } catch (error) {
    console.error("Error saving list:", error.message);
    res.status(500).json({ error: "Failed to save list" });
  }
});

// GET /api/saved — retrieve all saved lists for the logged-in user
router.get("/", async (req, res) => {
  try {
    const lists = await SavedList.find({ userId: req.user.userId }).sort({
      createdAt: -1,
    });

    res.json({ message: "Lists fetched successfully", lists });
  } catch (error) {
    console.error("Error fetching lists:", error.message);
    res.status(500).json({ error: "Failed to fetch lists" });
  }
});

// DELETE /api/lists/:id — delete a saved list
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid list ID" });
  }

  try {
    const list = await SavedList.findOneAndDelete({
      _id: id,
      userId: req.user.userId,
    });

    if (!list) {
      return res.status(404).json({ error: "List not found" });
    }

    res.json({ message: "List deleted successfully" });
  } catch (error) {
    console.error("Error deleting list:", error.message);
    res.status(500).json({ error: "Failed to delete list" });
  }
});

export default router;
