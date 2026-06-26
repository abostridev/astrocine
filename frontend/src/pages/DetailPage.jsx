import { useState } from 'react';
import { useParams } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import VideoPlayer from '../components/VideoPlayer';
import { useFetch } from '../hooks/useFetch';
import { getMovieDetail, getSeriesDetail, getSeasonDetail, getMoviePlayers, getTvPlayers } from '../services/api';
import UBlockGate from '../components/UBlockGate';

export default function DetailPage({ type = 'movie' }) {
  const { id } = useParams();
  const isMovie = type === 'movie';

  const { data: detail, loading, error } = useFetch(
    () => isMovie ? getMovieDetail(id) : getSeriesDetail(id), [id, type]
  );

  const [playing, setPlaying] = useState(false);
  const [players, setPlayers] = useState([]);
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [showFullOverview, setShowFullOverview] = useState(false);
  const [showGate, setShowGate] = useState(false);

  const { data: seasonData, loading: seasonLoading } = useFetch(
    () => !isMovie && detail ? getSeasonDetail(id, selectedSeason) : Promise.resolve(null),
    [id, selectedSeason, isMovie, !!detail]
  );

  const loadPlayers = async (s, e) => {
    setLoadingPlayers(true);
    try {
      const currentSeason = s || selectedSeason;
      const currentEpisode = e || selectedEpisode;
      
      const d = isMovie
        ? await getMoviePlayers(detail.tmdbId, detail.imdbId)
        : await getTvPlayers(detail.tmdbId, currentSeason, currentEpisode, detail.imdbId);
      setPlayers(d.players || []);
    } catch { 
      setPlayers([]); 
    } finally { 
      setLoadingPlayers(false); 
    }
  };

  const handlePlay = () => {
    setShowGate(true);
  };

  const actuallyPlay = () => {
    setShowGate(false); // Optionnel : Fermer la gate une fois qu'on accepte
    setPlaying(true);
    loadPlayers(selectedSeason, selectedEpisode); // Correction ici
  };

  const handleEpisode = (ep) => {
    setSelectedEpisode(ep.number);
    if (playing) loadPlayers(selectedSeason, ep.number);
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', padding: 48 }}>
      <div className="container">
        <div className="skeleton" style={{ height: 400, marginBottom: 24 }} />
        <div className="skeleton" style={{ height: 40, width: '40%', marginBottom: 16 }} />
        <div className="skeleton" style={{ height: 100 }} />
      </div>
    </div>
  );

  if (error || !detail) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--t3)' }}>Contenu introuvable.</p>
    </div>
  );

  return (
    <main style={{ minHeight: '100vh' }}>
      {/* Correction : rendu conditionnel du UBlockGate déplacé ici */}
      {showGate && <UBlockGate onContinue={actuallyPlay} />}

      {/* Backdrop fixe */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 480, zIndex: 0, pointerEvents: 'none' }}>
        {detail.backdrop && <img src={detail.backdrop} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.18 }} />}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(13,13,13,0.2), var(--bg))' }} />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: 40, paddingBottom: 60 }}>
        {/* Layout affiche + infos */}
        <div className="detail-layout" style={{ display: 'flex', gap: 40, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Affiche */}
          <div style={{ flexShrink: 0 }}>
            {detail.poster
              ? <img src={detail.poster} alt={detail.title} style={{ width: 220, height: 330, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)' }} />
              : <div style={{ width: 220, height: 330, background: 'var(--card)', borderRadius: 8, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--t3)', fontSize: 13 }}>Pas d'affiche</div>
            }
          </div>

          {/* Infos */}
          <div style={{ flex: 1, minWidth: 260 }}>
            <h1 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(22px, 4vw, 40px)', color: 'var(--t1)', marginBottom: 8 }}>{detail.title}</h1>
            {detail.tagline && <p style={{ color: 'var(--golddim)', fontSize: 14, fontStyle: 'italic', marginBottom: 8 }}>{detail.tagline}</p>}

            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', fontSize: 14, color: 'var(--t2)', marginBottom: 12 }}>
              {detail.year && <span>{detail.year}</span>}
              {detail.runtime && <><span style={{ color: 'var(--gold)' }}>&#183;</span><span>{detail.runtime} min</span></>}
              {detail.numberOfSeasons && <><span style={{ color: 'var(--gold)' }}>&#183;</span><span>{detail.numberOfSeasons} saisons</span></>}
              {detail.rating > 0 && <><span style={{ color: 'var(--gold)' }}>&#183;</span><span style={{ color: 'var(--gold)', fontWeight: 700 }}>&#9733; {detail.rating.toFixed(1)}/10</span></>}
            </div>

            {detail.genres?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                {detail.genres.map(g => <span key={g.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--t2)', fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 3 }}>{g.name}</span>)}
              </div>
            )}

            {detail.overview && (
              <div style={{ marginBottom: 24 }}>
                <p style={{
                  color: 'var(--t2)', fontSize: 15, lineHeight: 1.75, maxWidth: 560,
                  display: showFullOverview ? 'block' : '-webkit-box',
                  WebkitLineClamp: showFullOverview ? 'unset' : 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: showFullOverview ? 'visible' : 'hidden',
                }}>
                  {detail.overview}
                </p>
                {detail.overview.length > 150 && (
                  <button
                    onClick={() => setShowFullOverview(!showFullOverview)}
                    style={{
                      background: 'none', border: 'none', color: 'var(--gold)',
                      fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: 0, marginTop: 6,
                    }}
                  >
                    {showFullOverview ? 'Voir moins' : 'Voir plus'}
                  </button>
                )}
              </div>
            )}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button className="btn btn-gold" onClick={handlePlay}>&#9654; {isMovie ? 'Regarder' : 'Lire'}</button>
              {detail.trailer && (
                <a href={`https://www.youtube.com/watch?v=${detail.trailer.key}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                  Bande-annonce
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Player */}
        {playing && (
          <div style={{ marginTop: 40 }}>
            <p className="section-label" style={{ marginBottom: 16 }}>Lecture</p>
            {loadingPlayers
              ? <div style={{ height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: 'var(--t3)' }}>Chargement...</p></div>
              : <VideoPlayer players={players} />
            }
          </div>
        )}

        {/* Saisons & épisodes */}
        {!isMovie && detail.seasons?.length > 0 && (
          <div style={{ marginTop: 40 }}>
            <p className="section-label" style={{ marginBottom: 16 }}>Épisodes</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
              {detail.seasons.map(s => (
                <button key={s.season_number} onClick={() => { setSelectedSeason(s.season_number); setSelectedEpisode(1); }} style={{
                  border: '1px solid', borderRadius: 'var(--radius)', padding: '5px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  background: selectedSeason === s.season_number ? 'var(--gold)' : 'var(--card)',
                  color: selectedSeason === s.season_number ? '#000000' : 'var(--t2)',
                  borderColor: selectedSeason === s.season_number ? 'var(--gold)' : 'var(--border)',
                }}>Saison {s.season_number}</button>
              ))}
            </div>

            {seasonLoading ? (
              Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 60, marginBottom: 6 }} />)
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {(seasonData?.episodes || []).map(ep => (
                  <button key={ep.number} onClick={() => handleEpisode(ep)} style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '12px 16px', background: selectedEpisode === ep.number ? 'var(--card)' : 'rgba(24,16,8,0.5)',
                    border: `1px solid ${selectedEpisode === ep.number ? 'var(--gold)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                  }}>
                    <span style={{ color: 'var(--gold)', fontSize: 13, fontWeight: 700, minWidth: 28 }}>{ep.number}</span>
                    {ep.stillPath && <img src={ep.stillPath} alt="" style={{ width: 80, height: 45, objectFit: 'cover', borderRadius: 3, flexShrink: 0 }} />}
                    <div>
                      <p style={{ color: 'var(--t1)', fontSize: 13, fontWeight: 500 }}>{ep.name}</p>
                      <p style={{ color: 'var(--t3)', fontSize: 11, marginTop: 2 }}>{ep.runtime ? `${ep.runtime} min` : ''}{ep.airDate ? ` · ${ep.airDate.slice(0, 10)}` : ''}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Cast */}
        {detail.cast?.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <p className="section-label" style={{ marginBottom: 20 }}>Casting</p>
            <div className="scroll-row">
              {detail.cast.map(actor => (
                <div key={actor.id} style={{ flexShrink: 0, width: 85, textAlign: 'center' }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--card)', margin: '0 auto 8px', overflow: 'hidden', border: '2px solid var(--border)' }}>
                    {actor.photo
                      ? <img src={actor.photo} alt={actor.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--t3)', fontSize: 20 }}>&#128100;</div>
                    }
                  </div>
                  <p style={{ fontSize: 11, color: 'var(--t1)', lineHeight: 1.3 }}>{actor.name}</p>
                  <p style={{ fontSize: 10, color: 'var(--t3)', marginTop: 2 }}>{actor.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommandations */}
        {detail.recommendations?.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <p className="section-label" style={{ marginBottom: 20 }}>Vous aimerez aussi</p>
            <div className="scroll-row">
              {detail.recommendations.map(item => <MovieCard key={`${item.type}-${item.tmdbId}`} item={item} size="small" />)}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}