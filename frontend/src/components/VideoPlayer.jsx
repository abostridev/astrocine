import { useState, useEffect, useRef } from 'react';

export default function VideoPlayer({ players }) {
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [blocked, setBlocked] = useState(0);
  const containerRef = useRef(null);
  const iframeRef = useRef(null);
  const userInitiated = useRef(false);

  useEffect(() => { setLoading(true); }, [current]);

  // Bloque les popups pub (window.open)
  useEffect(() => {
    const originalOpen = window.open;
    window.open = (url, ...args) => {
      if (!url || url === 'about:blank' || url === '') return originalOpen(url, ...args);
      setBlocked(b => b + 1);
      return null;
    };
    return () => { window.open = originalOpen; };
  }, []);

  // Plein écran automatique dès que le lecteur charge
  // (le navigateur exige un geste utilisateur récent -> on le déclenche
  // au clic sur "Regarder" en amont, donc ça passe ici)
  const goFullscreen = () => {
    const el = containerRef.current;
    if (!el || document.fullscreenElement) return;
    const request = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen;
    request?.call(el).catch(() => {
      // Le navigateur a refusé (pas de geste utilisateur assez récent) -> on ignore silencieusement
    });
  };

  const handleLoad = () => {
    setLoading(false);
    // Tente le plein écran juste après le chargement du lecteur
    if (userInitiated.current) {
      setTimeout(goFullscreen, 300);
    }
  };

  const handleServerClick = (i) => {
    userInitiated.current = true; // ce clic compte comme geste utilisateur
    setCurrent(i);
  };

  if (!players?.length) return (
    <div style={{ height: 360, background: 'var(--card)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--t3)' }}>Aucun lecteur disponible</p>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', flexWrap: 'wrap' }}>
        <span style={{ color: 'var(--t3)', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase' }}>Serveur</span>
        {players.map((p, i) => (
          <button key={i} onClick={() => handleServerClick(i)} style={{
            border: '1px solid', borderRadius: 'var(--radius)',
            padding: '5px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            background: i === current ? 'var(--gold)' : 'var(--card)',
            color: i === current ? '#0d0d0d' : 'var(--t2)',
            borderColor: i === current ? 'var(--gold)' : 'var(--border)',
            transition: 'all 0.15s',
          }}>{p.name}</button>
        ))}
        {blocked > 0 && (
          <span style={{ background: '#1a0800', border: '1px solid var(--red)', color: 'var(--red)', fontSize: 11, padding: '3px 10px', borderRadius: 3, fontWeight: 600 }}>
            {blocked} pub{blocked > 1 ? 's' : ''} bloquée{blocked > 1 ? 's' : ''}
          </span>
        )}
        {/* Bouton plein écran manuel en secours si l'auto échoue */}
        <button onClick={() => { userInitiated.current = true; goFullscreen(); }} style={{
          marginLeft: 'auto', background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', padding: '5px 12px', fontSize: 12, color: 'var(--t2)', cursor: 'pointer',
        }}>
          &#9974; Plein écran
        </button>
      </div>

      <div ref={containerRef} style={{ position: 'relative', paddingTop: '56.25%', background: '#000', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
        {loading && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0a0800', zIndex: 2 }}>
            <div style={{ width: 36, height: 36, border: '3px solid var(--border)', borderTop: '3px solid var(--gold)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ color: 'var(--t3)', fontSize: 13, marginTop: 12 }}>Chargement...</p>
          </div>
        )}
        <iframe
          ref={iframeRef}
          key={players[current]?.url}
          // autoplay=true force le démarrage automatique sur les lecteurs qui le supportent
          src={`${players[current]?.url}${players[current]?.url.includes('?') ? '&' : '?'}autoplay=true`}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none', opacity: loading ? 0 : 1, transition: 'opacity 0.3s' }}
          onLoad={handleLoad}
          allow="fullscreen; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          title="Lecteur AstroCiné"
        />
      </div>
    </div>
  );
}