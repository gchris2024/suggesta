import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    tmdbId: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    posterPath: {
      type: String,
      default: "",
      trim: true,
    },
    overview: {
      type: String,
      trim: true,
    },
    releaseDate: {
      type: String,
      trim: true,
    },
    genreIds: {
      type: [Number],
      default: undefined,
    },
    voteAverage: {
      type: Number,
    },
  },
  { _id: false },
);

export default movieSchema;
