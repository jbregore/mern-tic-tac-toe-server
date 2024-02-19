import { Game } from "../models/Game.js";
import { User } from "../models/User.js";

export const index = async (req, res) => {
  try {
    const userId = req.userId;

    const games = await Game.find({ user: userId })
      .populate("opponent", "first_name last_name")
      .sort({ createdAt: -1 });

    const formattedGames = games.map((game) => {
      const createdAt = new Date(game.createdAt);
      const formattedDate = createdAt.toLocaleString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });

      return {
        ...game._doc,
        createdAt: formattedDate,
      };
    });

    return res.json(formattedGames);
  } catch (error) {
    console.error("Error fetching games:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const store = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findOne({ _id: userId });

    const { opponent_id, result } = req.body;

    const newGame = new Game({
      user: user._id,
      opponent: opponent_id,
      result: result,
    });

    await newGame.save();

    res.status(201).json({
      status: 201,
      message: "Game created successfully",
    });
  } catch (error) {
    console.error("Error signing up:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
