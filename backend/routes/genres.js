const express = require('express');
const router = express.Router();
const { MOVIE_GENRES, TV_GENRES } = require('../config/genres');

router.get('/movies', (req, res) => {
  res.json(Object.entries(MOVIE_GENRES).map(([id, name]) => ({ id: parseInt(id), name })));
});

router.get('/tv', (req, res) => {
  res.json(Object.entries(TV_GENRES).map(([id, name]) => ({ id: parseInt(id), name })));
});

module.exports = router;
