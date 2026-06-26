const express = require('express');
const router = express.Router();
const { tmdb, formatMovie, formatDetail } = require('../config/tmdb');

const lang = (req) => req.query.lang || 'fr-FR';

router.get('/trending', async (req, res) => {
  try {
    const { data } = await tmdb(lang(req)).get('/trending/tv/week');
    res.json({ results: data.results.map(m => formatMovie(m, 'tv')), totalPages: data.total_pages });
  } catch { res.status(500).json({ error: 'Erreur' }); }
});

router.get('/popular', async (req, res) => {
  try {
    const { data } = await tmdb(lang(req)).get('/tv/popular', { params: { page: req.query.page || 1 } });
    res.json({ results: data.results.map(m => formatMovie(m, 'tv')), totalPages: data.total_pages, page: data.page });
  } catch { res.status(500).json({ error: 'Erreur' }); }
});

router.get('/top-rated', async (req, res) => {
  try {
    const { data } = await tmdb(lang(req)).get('/tv/top_rated', { params: { page: req.query.page || 1 } });
    res.json({ results: data.results.map(m => formatMovie(m, 'tv')), totalPages: data.total_pages, page: data.page });
  } catch { res.status(500).json({ error: 'Erreur' }); }
});

router.get('/on-air', async (req, res) => {
  try {
    const { data } = await tmdb(lang(req)).get('/tv/on_the_air', { params: { page: req.query.page || 1 } });
    res.json({ results: data.results.map(m => formatMovie(m, 'tv')), totalPages: data.total_pages, page: data.page });
  } catch { res.status(500).json({ error: 'Erreur' }); }
});

router.get('/genre/:genreId', async (req, res) => {
  try {
    const { data } = await tmdb(lang(req)).get('/discover/tv', {
      params: { with_genres: req.params.genreId, page: req.query.page || 1, sort_by: 'popularity.desc', 'vote_count.gte': 20 },
    });
    res.json({ results: data.results.map(m => formatMovie(m, 'tv')), totalPages: data.total_pages, page: data.page });
  } catch { res.status(500).json({ error: 'Erreur' }); }
});

router.get('/:id', async (req, res) => {
  try {
    const { data } = await tmdb(lang(req)).get(`/tv/${req.params.id}`, {
      params: { append_to_response: 'credits,videos,recommendations,external_ids' },
    });
    res.json(formatDetail(data, 'tv'));
  } catch (err) {
    if (err.response?.status === 404) return res.status(404).json({ error: 'Série non trouvée' });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/:id/season/:seasonNumber', async (req, res) => {
  try {
    const { data } = await tmdb(lang(req)).get(`/tv/${req.params.id}/season/${req.params.seasonNumber}`);
    res.json({
      seasonNumber: data.season_number,
      name: data.name,
      overview: data.overview,
      episodes: data.episodes.map(ep => ({
        id: ep.id,
        number: ep.episode_number,
        name: ep.name,
        overview: ep.overview,
        airDate: ep.air_date,
        runtime: ep.runtime,
        stillPath: ep.still_path ? `https://image.tmdb.org/t/p/w300${ep.still_path}` : null,
        rating: Math.round((ep.vote_average || 0) * 10) / 10,
      })),
    });
  } catch { res.status(500).json({ error: 'Erreur' }); }
});

module.exports = router;
