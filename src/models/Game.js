import mongoose from "mongoose";

const gameSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    opponent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    result: {
      type: String,
      enum: ["won", "lost", "tied"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Game = mongoose.model("Game", gameSchema);
