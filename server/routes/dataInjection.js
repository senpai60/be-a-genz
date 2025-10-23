// routes/importHgRows.js
const express = require("express");
const router = express.Router();
const axios = require("axios");
const HgSlang = require("../models/HgSlangData");

const DATASETS = [
    {
        url: "https://raw.githubusercontent.com/gauthamp10/slang-urban-dictionary-dataset/main/slang.json",
        type: "json"
    },
    {
        url: "https://raw.githubusercontent.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words/master/en",
        type: "text"
    },
    {
        url: "https://raw.githubusercontent.com/words/profanities/master/index.json",
        type: "json"
    },
    {
        url: "https://raw.githubusercontent.com/sunnykinger/BadWordList/master/BadWordList.json",
        type: "json"
    }
];

async function fetchDataset(dataset) {
  try {
    console.log(`Fetching from ${dataset.url}...`);
    const { data } = await axios.get(dataset.url, { 
      timeout: 30000,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    if (dataset.type === 'json') {
      if (Array.isArray(data)) {
        // Handle array of strings (like profanities list)
        if (typeof data[0] === 'string') {
          return data.map(word => ({
            word: word.trim(),
            meaning: `Common slang term or expression`,
            example: `Example usage of "${word.trim()}"`
          }));
        }
        // Handle array of objects
        return data.map(item => ({
          word: item.word || item.slang || item.term || item.name || Object.keys(item)[0],
          meaning: item.meaning || item.definition || item.desc || item[Object.keys(item)[0]] || 'Common slang expression',
          example: item.example || item.usage || item.sentence || `Example usage of this term`
        }));
      }
      // Handle object format
      return Object.entries(data).map(([word, info]) => ({
        word: word.trim(),
        meaning: typeof info === 'string' ? info : (info.meaning || info.definition || 'Common slang expression'),
        example: typeof info === 'string' ? `Example usage of "${word.trim()}"` : (info.example || info.usage || `Example usage of this term`)
      }));
    } else if (dataset.type === 'text') {
      // Split text file by lines and convert to objects
      return data.split('\n')
        .filter(line => line.trim())
        .map(word => ({
          word: word.trim(),
          meaning: `Common ${word.trim()} slang term`,
          example: `Example usage of "${word.trim()}"`
        }));
    }
    return [];
  } catch (error) {
    console.error(`Error fetching from ${dataset.url}:`, error.message);
    return [];
  }
}

router.get("/hg-slang-import", async (req, res) => {
  let totalFetched = 0;
  let insertedCount = 0;
  let allRecords = new Set();
  let existingWords = [];

  try {
    console.log("Starting import from multiple sources...");
    
    // Get existing words first
    existingWords = await HgSlang.distinct('word');
    const existingWordsSet = new Set(existingWords.map(w => w.toLowerCase()));
    console.log(`Found ${existingWords.length} existing words`);

    for (const dataset of DATASETS) {
      const records = await fetchDataset(dataset);

      if (records && records.length > 0) {
        console.log(`Processing ${records.length} records from source...`);
        
        records.forEach(record => {
          const word = record.word?.trim() || record.slang?.trim();
          const meaning = record.meaning?.trim() || record.definition?.trim();
          const sentence = record.sentence?.trim() || record.example?.trim();
          
          if (!word || !meaning || !sentence) return;
          if (existingWordsSet.has(word.toLowerCase())) return;
          
          const key = `${word}|${meaning}|${sentence}`;
          if (!allRecords.has(key)) {
            allRecords.add(key);
          }
        });
        
        totalFetched += records.length;
        console.log(`Processed ${totalFetched} total records, unique new records: ${allRecords.size}`);
      }
    }

    const records = Array.from(allRecords).map(key => {
      const [word, meaning, sentence] = key.split('|');
      return { word, meaning, sentence };
    });

    console.log(`Found ${records.length} new unique records to insert`);

    if (records.length > 0) {
      const insertBatchSize = 500;
      for (let i = 0; i < records.length; i += insertBatchSize) {
        const batch = records.slice(i, i + insertBatchSize);
        const result = await HgSlang.insertMany(batch, { ordered: false });
        insertedCount += result.length;
        console.log(`Inserted batch ${Math.floor(i/insertBatchSize) + 1}: ${result.length} records`);
      }
    }

    res.json({
      success: true,
      stats: {
        existingRecords: existingWords.length,
        newRecordsFetched: totalFetched,
        uniqueNewRecords: records.length,
        insertedCount
      },
      message: `Successfully imported ${insertedCount} new unique slang terms`
    });

  } catch (err) {
    console.error("Import error:", err.message || err);
    res.status(500).json({
      success: false,
      error: err.message || String(err),
      stats: {
        existingRecords: existingWords.length,
        totalFetched,
        uniqueNewRecords: allRecords.size,
        insertedCount
      }
    });
  }
});

module.exports = router;
