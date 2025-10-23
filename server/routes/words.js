const express = require('express')
const router = express.Router()
const HgSlang = require('../models/HgSlangData')

router.get('/random-words',async(req,res)=>{
  let randomWords= []

  try {
    const allWords = await HgSlang.find({})
    
    for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random()*allWords.length+1)
    randomWords.push(allWords[randomIndex])
  }
  res.status(201).json({randomWords})
  } catch (err) {
    console.error(err)
  }
})

module.exports = router