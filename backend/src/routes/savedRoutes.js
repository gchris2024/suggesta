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

    res.status(201).json({ message: "List saved successfully", list });
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

// PATCH /api/saved/:id — add movies to an existing saved list
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { movies } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid list ID" });
  }

  if (!Array.isArray(movies) || movies.length === 0) {
    return res
      .status(400)
      .json({ error: "'movies' must be a non-empty array" });
  }

  try {
    const list = await SavedList.findOne({
      _id: id,
      userId: req.user.userId,
    });

    if (!list) {
      return res.status(404).json({ error: "List not found" });
    }

    const seenMovieIds = new Set(list.movies.map((movie) => movie.tmdbId));

    for (const movie of movies) {
      if (!movie?.tmdbId || seenMovieIds.has(movie.tmdbId)) {
        continue;
      }

      list.movies.push(movie);
      seenMovieIds.add(movie.tmdbId);
    }

    await list.save();

    res.json({ message: "List updated successfully", list });
  } catch (error) {
    console.error("Error updating list:", error.message);
    res.status(500).json({ error: "Failed to update list" });
  }
});

// PATCH /api/saved/:id/remove — remove movies from an existing saved list
router.patch("/:id/remove", async (req, res) => {
  const { id } = req.params;
  const { tmdbIds } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid list ID" });
  }

  if (!Array.isArray(tmdbIds) || tmdbIds.length === 0) {
    return res
      .status(400)
      .json({ error: "'tmdbIds' must be a non-empty array" });
  }

  try {
    const list = await SavedList.findOne({
      _id: id,
      userId: req.user.userId,
    });

    if (!list) {
      return res.status(404).json({ error: "List not found" });
    }

    const idsToRemove = new Set(tmdbIds.map(Number));

    list.movies = list.movies.filter((movie) => !idsToRemove.has(movie.tmdbId));

    await list.save();

    res.json({ message: "Movies removed successfully", list });
  } catch (error) {
    console.error("Error removing movies:", error.message);
    res.status(500).json({ error: "Failed to remove movies from list" });
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
