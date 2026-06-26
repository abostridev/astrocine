// Langue stockée dans localStorage
export const getLang = () => localStorage.getItem('ac_lang') || 'fr-FR';
export const setLang = (l) => { localStorage.setItem('ac_lang', l); window.location.reload(); };

const get = async (path, params = {}) => {
  const url = new URL(`/api${path}`, window.location.origin);
  url.searchParams.set('lang', getLang());
  Object.entries(params).forEach(([k, v]) => v !== undefined && v !== '' && url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || `Erreur ${res.status}`); }
  return res.json();
};

export const getMoviesTrending   = ()           => get('/movies/trending');
export const getMoviesPopular    = (page)       => get('/movies/popular', { page });
export const getMoviesTopRated   = (page)       => get('/movies/top-rated', { page });
export const getMoviesNowPlaying = (page)       => get('/movies/now-playing', { page });
export const getMoviesUpcoming   = (page)       => get('/movies/upcoming', { page });
export const getMoviesByGenre    = (id, page, sort_by) => get(`/movies/genre/${id}`, { page, sort_by });
export const getMoviesByYear     = (year, page) => get(`/movies/year/${year}`, { page });
export const getMovieDetail      = (id)         => get(`/movies/${id}`);

export const getSeriesTrending   = ()           => get('/series/trending');
export const getSeriesPopular    = (page)       => get('/series/popular', { page });
export const getSeriesTopRated   = (page)       => get('/series/top-rated', { page });
export const getSeriesOnAir      = (page)       => get('/series/on-air', { page });
export const getSeriesByGenre    = (id, page)   => get(`/series/genre/${id}`, { page });
export const getSeriesDetail     = (id)         => get(`/series/${id}`);
export const getSeasonDetail     = (id, s)      => get(`/series/${id}/season/${s}`);

export const searchAll           = (q, type, page) => get('/search', { q, type, page });
export const getSuggestions      = (q)         => get('/search/suggestions', { q });

export const getMoviePlayers     = (tmdbId, imdbId) => get(`/player/movie/${tmdbId}`, { imdbId });
export const getTvPlayers        = (tmdbId, s, e, imdbId) => get(`/player/tv/${tmdbId}/${s}/${e}`, { imdbId });

export const getMovieGenres      = ()           => get('/genres/movies');
export const getTvGenres         = ()           => get('/genres/tv');
