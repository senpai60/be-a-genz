const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Imports all the routes here=-====
const promptRoute = require('./prompt')
const usersRoute = require('./users');
const injectionRoute = require('./dataInjection')
const wordsRoute =require('./words')
const commentGenRoute =  require('./commentGen')


// user routes here
router.use('/prompt',promptRoute)
router.use('/users',usersRoute)
router.use('/inject',injectionRoute)
router.use('/words',wordsRoute)
router.use('/comments',commentGenRoute)



module.exports = router;
