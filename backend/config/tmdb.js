const axios = require('axios');

const IMAGE_BASE = 'https://image.tmdb.org/t/p';

const tmdb = (lang = 'fr-FR') => axios.create({
  baseURL: process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3',
  params: { api_key: process.env.TMDB_API_KEY, language: lang },
  timeout: 8000,
});

const formatMovie = (item, type = 'movie') => ({
  tmdbId: item.id,
  type,
  title: item.title || item.name,
  originalTitle: item.original_title || item.original_name,
  overview: item.overview,
  poster: item.poster_path ? `${IMAGE_BASE}/w500${item.poster_path}` : null,
  backdrop: item.backdrop_path ? `${IMAGE_BASE}/w1280${item.backdrop_path}` : null,
  rating: Math.round((item.vote_average || 0) * 10) / 10,
  releaseDate: item.release_date || item.first_air_date,
  year: (item.release_date || item.first_air_date || '').slice(0, 4),
  genres: item.genre_ids || [],
  originalLanguage: item.original_language,
});

const formatDetail = (item, type = 'movie') => ({
  tmdbId: item.id,
  imdbId: item.imdb_id || item.external_ids?.imdb_id,
  type,
  title: item.title || item.name,
  originalTitle: item.original_title || item.original_name,
  overview: item.overview,
  tagline: item.tagline,
  poster: item.poster_path ? `${IMAGE_BASE}/w500${item.poster_path}` : null,
  backdrop: item.backdrop_path ? `${IMAGE_BASE}/w1280${item.backdrop_path}` : null,
  rating: Math.round((item.vote_average || 0) * 10) / 10,
  voteCount: item.vote_count,
  releaseDate: item.release_date || item.first_air_date,
  year: (item.release_date || item.first_air_date || '').slice(0, 4),
  runtime: item.runtime || item.episode_run_time?.[0],
  genres: (item.genres || []).map(g => ({ id: g.id, name: g.name })),
  originalLanguage: item.original_language,
  seasons: item.seasons?.filter(s => s.season_number > 0),
  numberOfSeasons: item.number_of_seasons,
  cast: (item.credits?.cast || []).slice(0, 12).map(c => ({
    id: c.id,
    name: c.name,
    character: c.character,
    photo: c.profile_path ? `${IMAGE_BASE}/w185${c.profile_path}` : null,
  })),
  recommendations: (item.recommendations?.results || []).slice(0, 8).map(r => formatMovie(r, type)),
  trailer: (item.videos?.results || []).find(v => v.type === 'Trailer' && v.site === 'YouTube'),
});

module.exports = { tmdb, formatMovie, formatDetail };
