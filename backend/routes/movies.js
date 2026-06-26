const express = require('express');
const router = express.Router();
const { tmdb, formatMovie, formatDetail } = require('../config/tmdb');

const lang = (req) => req.query.lang || 'fr-FR';

router.get('/trending', async (req, res) => {
  try {
    const { data } = await tmdb(lang(req)).get('/trending/movie/week');
    res.json({ results: data.results.map(m => formatMovie(m, 'movie')), totalPages: data.total_pages });
  } catch { res.status(500).json({ error: 'Erreur tendances' }); }
});

router.get('/popular', async (req, res) => {
  try {
    const { data } = await tmdb(lang(req)).get('/movie/popular', { params: { page: req.query.page || 1 } });
    res.json({ results: data.results.map(m => formatMovie(m, 'movie')), totalPages: data.total_pages, page: data.page });
  } catch { res.status(500).json({ error: 'Erreur' }); }
});

router.get('/top-rated', async (req, res) => {
  try {
    const { data } = await tmdb(lang(req)).get('/movie/top_rated', { params: { page: req.query.page || 1 } });
    res.json({ results: data.results.map(m => formatMovie(m, 'movie')), totalPages: data.total_pages, page: data.page });
  } catch { res.status(500).json({ error: 'Erreur' }); }
});

router.get('/now-playing', async (req, res) => {
  try {
    const { data } = await tmdb(lang(req)).get('/movie/now_playing', { params: { page: req.query.page || 1 } });
    res.json({ results: data.results.map(m => formatMovie(m, 'movie')), totalPages: data.total_pages, page: data.page });
  } catch { res.status(500).json({ error: 'Erreur' }); }
});

router.get('/upcoming', async (req, res) => {
  try {
    const { data } = await tmdb(lang(req)).get('/movie/upcoming', { params: { page: req.query.page || 1 } });
    res.json({ results: data.results.map(m => formatMovie(m, 'movie')), totalPages: data.total_pages, page: data.page });
  } catch { res.status(500).json({ error: 'Erreur' }); }
});

router.get('/genre/:genreId', async (req, res) => {
  try {
    const { data } = await tmdb(lang(req)).get('/discover/movie', {
      params: { with_genres: req.params.genreId, page: req.query.page || 1, sort_by: req.query.sort_by || 'popularity.desc', 'vote_count.gte': 50 },
    });
    res.json({ results: data.results.map(m => formatMovie(m, 'movie')), totalPages: data.total_pages, page: data.page });
  } catch { res.status(500).json({ error: 'Erreur' }); }
});

router.get('/year/:year', async (req, res) => {
  try {
    const { data } = await tmdb(lang(req)).get('/discover/movie', {
      params: { primary_release_year: req.params.year, page: req.query.page || 1, sort_by: 'popularity.desc', 'vote_count.gte': 50 },
    });
    res.json({ results: data.results.map(m => formatMovie(m, 'movie')), totalPages: data.total_pages, page: data.page });
  } catch { res.status(500).json({ error: 'Erreur' }); }
});

router.get('/:id', async (req, res) => {
  try {
    const { data } = await tmdb(lang(req)).get(`/movie/${req.params.id}`, {
      params: { append_to_response: 'credits,videos,recommendations,external_ids' },
    });
    res.json(formatDetail(data, 'movie'));
  } catch (err) {
    if (err.response?.status === 404) return res.status(404).json({ error: 'Film non trouvé' });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
