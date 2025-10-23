const express = require("express");
const router = express.Router();
const HgSlang = require("../models/HgSlangData");
const getWordMood = require("../utils/getWordMood");
router.get("/random-words", async (req, res) => {
  let randomWordsData = [];

  try {
    const allWords = await HgSlang.find({});

    for (let i = 0; i < 30; i++) {
      const randomIndex = Math.floor(Math.random() * allWords.length);
      const randomWord = allWords[randomIndex];
      const randomWordMood = getWordMood(randomWord.sentence);
      const randomWordData = { wordData: randomWord, wordMood: randomWordMood };
      randomWordsData.push(randomWordData);
    }
    res.status(201).json({ randomWordsData });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
