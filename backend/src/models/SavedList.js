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
	},
	{ _id: false }
);

const savedListSchema = new mongoose.Schema({
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
});

const SavedList =
	mongoose.models.SavedList || mongoose.model("SavedList", savedListSchema);

export default SavedList;
