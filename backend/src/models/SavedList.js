import mongoose from "mongoose";
import movieSchema from "./Movie.js";

const savedListSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    movies: {
      type: [movieSchema],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }, // disable __v field
);

const SavedList =
  mongoose.models.SavedList || mongoose.model("SavedList", savedListSchema);

export default SavedList;
