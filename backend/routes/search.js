const express = require('express');
const router = express.Router();
const { tmdb, formatMovie } = require('../config/tmdb');

const lang = (req) => req.query.lang || 'fr-FR';

router.get('/', async (req, res) => {
  try {
    const { q, type = 'all', page = 1 } = req.query;
    if (!q || q.trim().length < 2) return res.status(400).json({ error: 'Minimum 2 caractères' });

    let results = [], totalPages = 1;

    if (type === 'movie') {
      const { data } = await tmdb(lang(req)).get('/search/movie', { params: { query: q, page } });
      results = data.results.map(m => formatMovie(m, 'movie'));
      totalPages = data.total_pages;
    } else if (type === 'tv') {
      const { data } = await tmdb(lang(req)).get('/search/tv', { params: { query: q, page } });
      results = data.results.map(m => formatMovie(m, 'tv'));
      totalPages = data.total_pages;
    } else {
      const { data } = await tmdb(lang(req)).get('/search/multi', { params: { query: q, page } });
      results = data.results
        .filter(r => r.media_type === 'movie' || r.media_type === 'tv')
        .map(m => formatMovie(m, m.media_type));
      totalPages = data.total_pages;
    }

    res.json({ results, totalPages, page: parseInt(page), query: q });
  } catch (err) {
    console.error('Search error:', err.message);
    res.status(500).json({ error: 'Erreur lors de la recherche' });
  }
});

router.get('/suggestions', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) return res.json([]);
    const { data } = await tmdb(lang(req)).get('/search/multi', { params: { query: q, page: 1 } });
    const suggestions = data.results
      .filter(r => r.media_type === 'movie' || r.media_type === 'tv')
      .slice(0, 8)
      .map(r => ({
        tmdbId: r.id,
        type: r.media_type,
        title: r.title || r.name,
        year: (r.release_date || r.first_air_date || '').slice(0, 4),
        poster: r.poster_path ? `https://image.tmdb.org/t/p/w92${r.poster_path}` : null,
      }));
    res.json(suggestions);
  } catch {
    res.json([]);
  }
});

module.exports = router;
