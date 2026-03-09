const express = require("express");
const BMI = require("../models/BMI");
const Campaign = require("../models/Campaign");

const router = express.Router();

router.get("/summary", async (req, res) => {
  try {
    // 🔹 BASIC COUNTS
    const totalBMI = await BMI.countDocuments();
    const totalCampaigns = await Campaign.countDocuments();

    // 🔹 BMI CATEGORY STATS
    const categories = await BMI.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      }
    ]);

    let overweight = 0;
    let obese = 0;
    let mostCommon = "";
    let maxCount = 0;

    categories.forEach(cat => {
      if (cat._id === "Overweight") overweight = cat.count;
      if (cat._id === "Obese") obese = cat.count;

      if (cat.count > maxCount) {
        maxCount = cat.count;
        mostCommon = cat._id;
      }
    });

    const overweightPercent = totalBMI
      ? ((overweight / totalBMI) * 100).toFixed(1)
      : 0;

    const obesePercent = totalBMI
      ? ((obese / totalBMI) * 100).toFixed(1)
      : 0;

    // 🔥 CAMPAIGN ENGAGEMENT ANALYTICS

    const allCampaigns = await Campaign.find();

    let mostBookmarked = "None";
    let maxBookmarks = 0;

    let mostCompleted = "None";
    let maxCompleted = 0;

    let highestRated = "None";
    let maxAvgRating = 0;

    allCampaigns.forEach(camp => {
      // 📌 Most Bookmarked
      if (camp.bookmarks.length > maxBookmarks) {
        maxBookmarks = camp.bookmarks.length;
        mostBookmarked = camp.title;
      }

      // ✅ Most Completed
      if (camp.completedBy.length > maxCompleted) {
        maxCompleted = camp.completedBy.length;
        mostCompleted = camp.title;
      }

      // ⭐ Highest Rated
      if (camp.ratings.length > 0) {
        const avg =
          camp.ratings.reduce((sum, r) => sum + r.rating, 0) /
          camp.ratings.length;

        if (avg > maxAvgRating) {
          maxAvgRating = avg;
          highestRated = camp.title;
        }
      }
    });

    // 🔹 FINAL RESPONSE
    res.json({
      totalBMI,
      totalCampaigns,
      overweightPercent,
      obesePercent,
      mostCommonCategory: mostCommon,
      mostBookmarked,
      mostCompleted,
      highestRated
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
// Campaign Effectiveness Analytics
router.get("/campaign-stats", async (req, res) => {
  try {

    const campaigns = await Campaign.find();

    const stats = campaigns.map(c => {

      const bookmarkCount = c.bookmarks.length;
      const completionCount = c.completedBy.length;

      const avgRating =
        c.ratings.length > 0
          ? (
              c.ratings.reduce((sum, r) => sum + r.rating, 0) /
              c.ratings.length
            ).toFixed(1)
          : 0;

      return {
        title: c.title,
        bookmarks: bookmarkCount,
        completions: completionCount,
        avgRating: avgRating
      };

    });

    res.json(stats);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});