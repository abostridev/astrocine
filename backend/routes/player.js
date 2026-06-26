const express = require('express');
const router = express.Router();

const moviePlayers = (tmdbId) => [
  { name: 'Videasy', url: `https://player.videasy.net/movie/${tmdbId}?color=d4a017` },
  { name: 'VidLink', url: `https://vidlink.pro/movie/${tmdbId}?primaryColor=d4a017&secondaryColor=c0392b` },
];

const tvPlayers = (tmdbId, season, episode) => [
  { name: 'Videasy', url: `https://player.videasy.net/tv/${tmdbId}/${season}/${episode}?color=d4a017` },
  { name: 'VidLink', url: `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}?primaryColor=d4a017&secondaryColor=c0392b` },
];

router.get('/movie/:tmdbId', (req, res) => {
  res.json({ players: moviePlayers(req.params.tmdbId) });
});

router.get('/tv/:tmdbId/:season/:episode', (req, res) => {
  const { tmdbId, season, episode } = req.params;
  res.json({ players: tvPlayers(tmdbId, season, episode) });
});

module.exports = router;