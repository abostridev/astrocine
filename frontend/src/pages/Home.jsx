import { Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { useFetch } from '../hooks/useFetch';
import { getMoviesTrending, getSeriesTrending, getMoviesNowPlaying } from '../services/api';

function SkeletonRow() {
  return (
    <div className="scroll-row">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} style={{ flexShrink: 0, width: 160 }}>
          <div className="skeleton" style={{ height: 240, marginBottom: 8 }} />
          <div className="skeleton" style={{ height: 12, marginBottom: 4, width: '80%' }} />
          <div className="skeleton" style={{ height: 10, width: '50%' }} />
        </div>
      ))}
    </div>
  );
}

function Section({ title, fetchFn, linkTo }) {
  const { data, loading } = useFetch(fetchFn);
  return (
    <section style={{ marginBottom: 48 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <p className="section-label">{title}</p>
        {linkTo && <Link to={linkTo} style={{ fontSize: 11, color: 'var(--gold)', letterSpacing: 1, textTransform: 'uppercase', flexShrink: 0, marginLeft: 16 }}>Voir tout &rarr;</Link>}
      </div>
      {loading ? <SkeletonRow /> : (
        <div className="scroll-row">
          {(data?.results || []).map(item => <MovieCard key={`${item.type}-${item.tmdbId}`} item={item} />)}
        </div>
      )}
    </section>
  );
}

export default function Home() {
  const { data: trending } = useFetch(getMoviesTrending);
  const featured = trending?.results?.[0];

  return (
    <main>
      {/* Hero */}
      {featured && (
        <section style={s.hero} className="hero-mobile">
          {featured.backdrop && <img src={featured.backdrop} alt="" style={s.heroBg} aria-hidden />}
          <div style={s.heroGrad} />
          <div className="container" style={s.heroContent}>
            <span className="badge badge-red" style={{ marginBottom: 12 }}>Tendance</span>
            <h1 style={s.heroTitle}>{featured.title}</h1>
            <div style={s.heroMeta}>
              <span>{featured.year}</span>
              <span style={{ color: 'var(--gold)' }}>&#183;</span>
              <span style={{ color: 'var(--gold)', fontWeight: 700 }}>&#9733; {featured.rating.toFixed(1)}</span>
            </div>
            {featured.overview && <p style={s.heroDesc}>{featured.overview.slice(0, 200)}{featured.overview.length > 200 ? '...' : ''}</p>}
            <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
              <Link to={`/film/${featured.tmdbId}`} className="btn btn-gold">&#9654; Regarder</Link>
              <Link to={`/film/${featured.tmdbId}`} className="btn btn-outline">Plus d'infos</Link>
            </div>
          </div>
        </section>
      )}

      <div className="container" style={{ paddingTop: 48, paddingBottom: 48 }}>
        <Section title="Films tendance" fetchFn={getMoviesTrending} linkTo="/films" />
        <Section title="Séries populaires" fetchFn={getSeriesTrending} linkTo="/series" />
        <Section title="Nouveautés" fetchFn={getMoviesNowPlaying} linkTo="/films" />
      </div>

      <footer style={{ borderTop: '1px solid var(--border)', padding: '28px 0', textAlign: 'center', background: 'var(--bg2)' }}>
        <p style={{ fontFamily: 'var(--display)', fontSize: 18, color: 'var(--gold)', marginBottom: 4 }}>Astro<span style={{ color: 'var(--red)' }}>Ciné</span></p>
        <p style={{ color: 'var(--t3)', fontSize: 12 }}>&copy; {new Date().getFullYear()} AstroCiné</p>
      </footer>
    </main>
  );
}

const s = {
hero: {
  position: 'relative',
  minHeight: 500,
  display: 'flex',
  alignItems: 'flex-end',
  overflow: 'hidden',
  background: '#0d0800',
  paddingBottom: 'env(safe-area-inset-bottom)',
},  heroBg: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', opacity: 0.35 },
  heroGrad: { position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0d0d0d 0%, rgba(13,13,13,0.5) 60%, transparent 100%)' },
  heroContent: { position: 'relative', zIndex: 1, paddingBottom: 48, maxWidth: 640 },
  heroTitle: { fontSize: 'clamp(26px, 5vw, 50px)', color: '#f5e6c0', marginBottom: 12 },
  heroMeta: { display: 'flex', gap: 10, alignItems: 'center', fontSize: 14, color: 'var(--t2)', marginBottom: 12 },
  heroDesc: { color: 'var(--t2)', fontSize: 15, lineHeight: 1.7, maxWidth: 500 },
};
