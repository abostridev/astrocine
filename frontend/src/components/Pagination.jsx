export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  const pages = [];
  for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) pages.push(i);

  const btn = (active, disabled) => ({
    background: active ? 'var(--gold)' : 'transparent',
    color: active ? '#0d0d0d' : disabled ? 'var(--t3)' : 'var(--t2)',
    border: `1px solid ${active ? 'var(--gold)' : 'var(--border)'}`,
    borderRadius: 'var(--radius)', padding: '6px 12px', fontSize: 13,
    cursor: disabled ? 'not-allowed' : 'pointer', minWidth: 36,
    fontFamily: 'var(--body)', transition: 'all 0.15s',
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 32, flexWrap: 'wrap' }}>
      <button onClick={() => onPageChange(page - 1)} disabled={page === 1} style={btn(false, page === 1)}>&larr;</button>
      {pages[0] > 1 && <><button onClick={() => onPageChange(1)} style={btn(false, false)}>1</button>{pages[0] > 2 && <span style={{ color: 'var(--t3)' }}>...</span>}</>}
      {pages.map(p => <button key={p} onClick={() => onPageChange(p)} style={btn(p === page, false)}>{p}</button>)}
      {pages[pages.length - 1] < totalPages && <><span style={{ color: 'var(--t3)' }}>...</span><button onClick={() => onPageChange(totalPages)} style={btn(false, false)}>{totalPages}</button></>}
      <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages} style={btn(false, page === totalPages)}>&rarr;</button>
    </div>
  );
}
