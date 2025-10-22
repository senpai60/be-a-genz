const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Imports all the routes here=-====
const promptRoute = require('./prompt')
const usersRoute = require('./users');


// user routes here
router.use('/prompt',promptRoute)
router.use('/users',usersRoute)



module.exports = router;
