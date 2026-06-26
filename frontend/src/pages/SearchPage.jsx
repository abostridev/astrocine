import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import Pagination from '../components/Pagination';
import { searchAll } from '../services/api';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [type, setType] = useState('all');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');

  const doSearch = async (q, t, p) => {
    if (!q || q.length < 2) return;
    setLoading(true); setError('');
    try {
      const d = await searchAll(q, t, p);
      setResults(d.results || []); setTotalPages(d.totalPages || 1); setPage(d.page || 1);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { doSearch(query, type, 1); }, [query, type]);

  const handlePage = (p) => { doSearch(query, type, p); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const tabBtn = (val) => ({
    background: type === val ? 'var(--gold)' : 'transparent',
    color: type === val ? '#0d0d0d' : 'var(--t2)',
    border: `1px solid ${type === val ? 'var(--gold)' : 'var(--border)'}`,
    borderRadius: 'var(--radius)', padding: '6px 16px', fontSize: 12,
    fontWeight: 600, cursor: 'pointer', letterSpacing: 1, textTransform: 'uppercase', transition: 'all 0.15s',
  });

  return (
    <main style={{ minHeight: '100vh', paddingBottom: 60 }}>
      <div style={{ background: 'linear-gradient(to bottom, #1a0a00, var(--bg))', padding: '36px 0 24px', borderBottom: '1px solid var(--border)', marginBottom: 32 }}>
        <div className="container">
          <p style={{ color: 'var(--t3)', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Résultats pour</p>
          <h1 style={{ fontFamily: 'var(--display)', fontSize: 30, color: 'var(--t1)' }}>&ldquo;{query}&rdquo;</h1>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            {[['all', 'Tout'], ['movie', 'Films'], ['tv', 'Séries']].map(([v, l]) => (
              <button key={v} onClick={() => setType(v)} style={tabBtn(v)}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="container">
        {loading ? (
          <div className="grid-cards">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i}>
                <div className="skeleton" style={{ height: 230, marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 12, marginBottom: 4, width: '75%' }} />
                <div className="skeleton" style={{ height: 10, width: '50%' }} />
              </div>
            ))}
          </div>
        ) : error ? (
          <p style={{ color: 'var(--red)', fontSize: 14 }}>{error}</p>
        ) : results.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: 80, color: 'var(--t3)' }}>
            <p style={{ fontSize: 16 }}>Aucun résultat pour &ldquo;{query}&rdquo;</p>
          </div>
        ) : (
          <>
            <p style={{ color: 'var(--t3)', fontSize: 13, marginBottom: 20 }}>{results.length} résultat{results.length > 1 ? 's' : ''}</p>
            <div className="grid-cards">
              {results.map(item => <MovieCard key={`${item.type}-${item.tmdbId}`} item={item} />)}
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={handlePage} />
          </>
        )}
      </div>
    </main>
  );
}
