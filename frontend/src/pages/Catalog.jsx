import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import Pagination from '../components/Pagination';
import { useFetch, usePaginated } from '../hooks/useFetch';
import {
  getMoviesPopular, getMoviesTopRated, getMoviesNowPlaying, getMoviesUpcoming, getMoviesByGenre, getMoviesByYear,
  getSeriesPopular, getSeriesTopRated, getSeriesOnAir, getSeriesByGenre,
  getMovieGenres, getTvGenres,
} from '../services/api';

const YEARS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

export default function Catalog({ type = 'movie' }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtre, setFiltre] = useState(searchParams.get('filtre') || 'popular');
  const [genreId, setGenreId] = useState(searchParams.get('genre') || '');
  const [year, setYear] = useState(searchParams.get('annee') || '');
  const isMovie = type === 'movie';

  const { data: genresData } = useFetch(isMovie ? getMovieGenres : getTvGenres, [type]);
  const genres = genresData || [];

  const movieFiltres = [['popular', 'Populaires'], ['top-rated', 'Mieux notés'], ['now-playing', 'En salle'], ['upcoming', 'À venir']];
  const tvFiltres = [['popular', 'Populaires'], ['top-rated', 'Mieux notées'], ['on-air', 'En diffusion']];
  const filtres = isMovie ? movieFiltres : tvFiltres;

  const fetchFn = (page) => {
    if (genreId) return isMovie ? getMoviesByGenre(genreId, page) : getSeriesByGenre(genreId, page);
    if (year) return getMoviesByYear(year, page);
    if (isMovie) {
      if (filtre === 'top-rated') return getMoviesTopRated(page);
      if (filtre === 'now-playing') return getMoviesNowPlaying(page);
      if (filtre === 'upcoming') return getMoviesUpcoming(page);
      return getMoviesPopular(page);
    } else {
      if (filtre === 'top-rated') return getSeriesTopRated(page);
      if (filtre === 'on-air') return getSeriesOnAir(page);
      return getSeriesPopular(page);
    }
  };

  const { data, loading, page, totalPages, goToPage } = usePaginated(fetchFn, [filtre, genreId, year, type]);

  const setF = (val) => { setFiltre(val); setGenreId(''); setYear(''); };
  const setG = (id) => { setGenreId(id === genreId ? '' : id); setFiltre('popular'); setYear(''); };
  const setY = (y) => { setYear(y); setGenreId(''); };

  const btnStyle = (active) => ({
    background: active ? 'var(--gold)' : 'transparent',
    color: active ? '#0d0d0d' : 'var(--t2)',
    border: `1px solid ${active ? 'var(--gold)' : 'transparent'}`,
    borderRadius: 'var(--radius)', padding: '6px 12px',
    fontSize: 13, textAlign: 'left', cursor: 'pointer',
    fontWeight: active ? 600 : 400, transition: 'all 0.15s', width: '100%',
  });

  return (
    <main style={{ minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(to bottom, #1a0a00, var(--bg))', padding: '36px 0 20px', borderBottom: '1px solid var(--border)', marginBottom: 32 }}>
        <div className="container">
          <h1 style={{ fontFamily: 'var(--display)', fontSize: 34 }}>{isMovie ? 'Films' : 'Séries'}</h1>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: 48 }}>
        <div className="catalog-layout" style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
          {/* Sidebar */}
          <aside className="catalog-sidebar" style={{ width: 190, flexShrink: 0, position: 'sticky', top: 80, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <p style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--t3)', fontWeight: 600, marginBottom: 4 }}>Trier</p>
            {filtres.map(([val, label]) => <button key={val} onClick={() => setF(val)} style={btnStyle(filtre === val && !genreId && !year)}>{label}</button>)}

            <p style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--t3)', fontWeight: 600, marginTop: 16, marginBottom: 4 }}>Genre</p>
            {genres.map(g => <button key={g.id} onClick={() => setG(String(g.id))} style={btnStyle(String(genreId) === String(g.id))}>{g.name}</button>)}

            {isMovie && <>
              <p style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--t3)', fontWeight: 600, marginTop: 16, marginBottom: 4 }}>Année</p>
              <select value={year} onChange={e => setY(e.target.value)} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--t1)', padding: '7px 10px', fontSize: 13, outline: 'none', cursor: 'pointer' }}>
                <option value="">Toutes</option>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </>}
          </aside>

          {/* Grille */}
          <div style={{ flex: 1 }}>
            {loading ? (
              <div className="grid-cards">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i}>
                    <div className="skeleton" style={{ height: 230, marginBottom: 8 }} />
                    <div className="skeleton" style={{ height: 12, marginBottom: 4, width: '80%' }} />
                    <div className="skeleton" style={{ height: 10, width: '50%' }} />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="grid-cards">
                  {data.map(item => <MovieCard key={`${item.type}-${item.tmdbId}`} item={item} />)}
                </div>
                <Pagination page={page} totalPages={Math.min(totalPages, 500)} onPageChange={goToPage} />
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
