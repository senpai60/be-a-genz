const express = require("express");
const router = express.Router();
const axios = require("axios");
const verifyUser = require("../middlewares/verifyUser")

const Archived = require('../models/Archived')

require("dotenv").config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // ❗ variable name fix (was geminiApi)
const textGeminiApiUri =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const sentencePromptText = `
Analyze this sentence and give JSON only.
The JSON should have:
{
  "sentence": "<the genz version>",
  "words": [
    { "word": "<genz_word>", "meaning": "<its meaning>" }
  ]
}
User wants to learn GenZ English, so convert to GenZ slang and give relevant words with meanings.
`;

router.post("/translate-genz", async (req, res) => {
  const { sentence } = req.body;

  if (!sentence) {
    return res
      .status(400)
      .json({ message: "Please send a valid sentence to translate." });
  }

  try {
    const response = await axios.post(
      textGeminiApiUri,
      {
        contents: [
          {
            parts: [
              {
                text: `${sentencePromptText}\nSentence: ${sentence}`,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "x-goog-api-key": GEMINI_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    // ✅ Safely extract Gemini response
    const text =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response generated.";

    // 🧠 Try parsing JSON if AI follows instructions properly
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { raw_text: text };
    }

    // ✅ Send after complete response only
    return res.status(200).json({
      status: "success",
      data: parsed,
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    return res.status(500).json({ message: "Gemini request failed." });
  }
});

router.post("/add-to-archive", verifyUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const { word, sentence, meaning } = req.body; // destructure everything

    if (!word || !sentence || !meaning)
      return res.status(400).json({ message: "Please provide word, useCase and meaning." });

    const wordExist = await Archived.findOne({ word, user: userId }); // check for user-specific duplicates
    if (wordExist)
      return res.status(409).json({ message: "You already saved this word!" });

    const newWord = await Archived.create({
      word,
      sentence,
      meaning,
      user: userId,
    });

    res.status(201).json({ message: "Word archived!", data: newWord });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


module.exports = router;
