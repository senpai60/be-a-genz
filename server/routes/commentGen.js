const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent";

router.post("/gen-comment", async (req, res) => {
  const { userPrompt, tone, imageBase64, imageType } = req.body;

  if (!userPrompt)
    return res.status(400).json({
      message:
        "Please provide post context (userPrompt) to generate the comment.",
    });

  try {
    // 🔹 Build system prompt dynamically with tone
    const systemPrompt = `
You are a creative social media comment generator.
Generate a short (max 2 sentences) comment matching the tone: ${tone || "neutral"}.
If image data is provided, make the comment relevant to the image too.
Keep the comment natural, human, and platform-friendly.`;

    // 🔹 Construct the request payload
    const parts = [{ text: userPrompt }];

    if (imageBase64 && imageType) {
      parts.push({
        inlineData: {
          mimeType: imageType,
          data: imageBase64,
        },
      });
    }

    const payload = {
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [{ parts }],
    };

    // 🔹 Make API call
    const response = await axios.post(GEMINI_API_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY,
      },
    });

    const comment =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Could not generate a comment.";

    return res.status(200).json({
      status: "success",
      comment,
    });
  } catch (err) {
    console.error("Gemini API Error:", err.response?.data || err.message);
    res.status(500).json({
      message: "Server error while generating comment.",
    });
  }
});

router.get("/comment-gen-ping",(req,res)=>{
  res.status(200).json({message:"ping-pong"})
})

module.exports = router;
