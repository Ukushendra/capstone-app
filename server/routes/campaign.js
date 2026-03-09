const express = require("express");
const Campaign = require("../models/Campaign");

const router = express.Router();


// ============================
// Create Campaign (Admin)
// ============================
router.post("/create", async (req, res) => {
  try {
    const { title, description, category } = req.body;

    const newCampaign = new Campaign({
      title,
      description,
      category
    });

    await newCampaign.save();

    res.status(201).json({ message: "Campaign created successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ============================
// Get All Campaigns
// ============================
router.get("/", async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.json(campaigns);

  } catch (error) {
    console.error("Error fetching campaigns:", error);
    res.status(500).json({ error: error.message });
  }
});


// ============================
// Bookmark Campaign
// ============================
router.post("/bookmark", async (req, res) => {
  try {
    const { campaignId, userId } = req.body;

    const campaign = await Campaign.findById(campaignId);

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    if (!campaign.bookmarks.includes(userId)) {
      campaign.bookmarks.push(userId);
      await campaign.save();
    }

    res.json({ message: "Campaign bookmarked successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ============================
// Mark Campaign Completed
// ============================
router.post("/complete", async (req, res) => {
  try {
    const { campaignId, userId } = req.body;

    const campaign = await Campaign.findById(campaignId);

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    if (!campaign.completedBy.includes(userId)) {
      campaign.completedBy.push(userId);
      await campaign.save();
    }

    res.json({ message: "Campaign marked as completed" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ============================
// Rate Campaign
// ============================
router.post("/rate", async (req, res) => {
  try {
    const { campaignId, userId, rating } = req.body;

    const campaign = await Campaign.findById(campaignId);

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    // Check if user already rated
    const existingRating = campaign.ratings.find(
      r => r.userId.toString() === userId
    );

    if (existingRating) {
      existingRating.rating = rating;
    } else {
      campaign.ratings.push({ userId, rating });
    }

    await campaign.save();

    res.json({ message: "Rating submitted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;