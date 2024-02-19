import { Game } from "../models/Game.js";

export const index = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const rankingsPipeline = [
      { $match: { result: "won" } },
      {
        $group: {
          _id: "$user",
          wins: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: "$user._id",
          name: { $concat: ["$user.first_name", " ", "$user.last_name"] },
          wins: 1,
        },
      },
      { $sort: { wins: -1 } },
      { $skip: skip },
      { $limit: limit },
    ];

    const rankings = await Game.aggregate(rankingsPipeline);

    const totalRecords = await Game.aggregate([
      ...rankingsPipeline.slice(0, -2),
      { $count: "totalRecords" },
    ]);

    const totalPages = Math.ceil(totalRecords[0]?.totalRecords / limit) || 1;

    const paginationMeta = {
      totalRecords: totalRecords[0]?.totalRecords || 0,
      nextPage: null,
      lastPage: totalPages,
    };

    const response = {
      data: rankings,
      meta: paginationMeta,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching rankings:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
