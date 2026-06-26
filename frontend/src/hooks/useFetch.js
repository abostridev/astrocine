import { useState, useEffect, useCallback } from 'react';

export function useFetch(fn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try { setData(await fn()); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, deps);

  useEffect(() => { load(); }, [load]);
  return { data, loading, error, refetch: load };
}

export function usePaginated(fn, deps = []) {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async (p = 1) => {
    setLoading(true); setError(null);
    try {
      const r = await fn(p);
      setData(r.results || []); setTotalPages(r.totalPages || 1); setPage(p);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, deps);

  useEffect(() => { load(1); }, [load]);
  return { data, loading, error, page, totalPages, goToPage: (p) => { if (p >= 1 && p <= totalPages) load(p); } };
}

export function useSearch(fn, delay = 350) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query || query.length < 2) { setResults([]); return; }
    const t = setTimeout(async () => {
      setLoading(true);
      try { setResults(await fn(query)); }
      catch { setResults([]); }
      finally { setLoading(false); }
    }, delay);
    return () => clearTimeout(t);
  }, [query]);

  return { query, setQuery, results, loading };
}
