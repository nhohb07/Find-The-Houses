const express = require('express');
const router = express.Router();

const regionController = require('./controllers/Region');
const crawerController = require('./controllers/Crawer');

router.get('/regions/:who', (req, res) => {
  res.json(regionController.getList(req.params.who));
});

router.post('/craw-data', (req, res) => {
  crawerController.start();

  res.send('crawer started!');
});

router.post('/', function (req, res) {
  res.send('POST route on things.');
});

//export this router to use in our index.js
module.exports = router;