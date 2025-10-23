const Sentiment = require("sentiment");
const sentiment = new Sentiment()

const getWordMood = function (word) {
  const result = sentiment.analyze(word);
  const score = result.score;
    
  if (score >= 3) return "Very Positive";
  if (score > 0) return "Positive";
  if (score === 0) return "Neutral";
  if (score < 0 && score > -3) return "Negative";
  return "Very Negative";
};

module.exports = getWordMood