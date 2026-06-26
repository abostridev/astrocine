import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function MovieCard({ item, size = 'normal' }) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const w = size === 'small' ? 130 : 160;
  const h = Math.round(w * 1.5);

  return (
    <Link to={`/${item.type === 'tv' ? 'serie' : 'film'}/${item.tmdbId}`}
      style={{ width: w, flexShrink: 0, display: 'block', textDecoration: 'none' }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div style={{
        width: w, height: h, borderRadius: 'var(--radius)', overflow: 'hidden',
        border: `1px solid ${hovered ? 'var(--gold)' : 'var(--border)'}`,
        position: 'relative', background: 'var(--card)',
        transition: 'border-color 0.2s, transform 0.2s',
        transform: hovered ? 'translateY(-3px)' : 'none', marginBottom: 8,
      }}>
        {item.poster && !imgError
          ? <img src={item.poster} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setImgError(true)} loading="lazy" />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--t3)', fontSize: 11, padding: 8, textAlign: 'center' }}>{item.title}</div>
        }
        {/* Overlay play */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: hovered ? 1 : 0, transition: 'opacity 0.2s' }}>
          <div style={{ width: 38, height: 38, background: 'var(--gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0d0d0d', fontSize: 14, paddingLeft: 3 }}>&#9654;</div>
        </div>
        {/* Note */}
        {item.rating > 0 && (
          <div style={{ position: 'absolute', bottom: 6, right: 6, background: 'rgba(10,8,2,0.9)', borderRadius: 3, padding: '2px 6px', fontSize: 10, fontWeight: 700, color: 'var(--gold)', opacity: hovered ? 0 : 1, transition: 'opacity 0.2s' }}>
            &#9733; {item.rating.toFixed(1)}
          </div>
        )}
        {/* Badge série */}
        {item.type === 'tv' && (
          <div style={{ position: 'absolute', top: 6, left: 6, background: 'rgba(13,13,13,0.85)', border: '1px solid var(--border)', color: 'var(--gold)', fontSize: 9, fontWeight: 700, padding: '2px 5px', borderRadius: 2 }}>SÉRIE</div>
        )}
      </div>
      <p style={{ fontSize: size === 'small' ? 11 : 12, fontWeight: 500, color: 'var(--t1)', lineHeight: 1.3, marginBottom: 3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{item.title}</p>
      <p style={{ fontSize: 10, color: 'var(--t3)' }}>{item.year}</p>
    </Link>
  );
}
