export default function LivePage() {
  return (
    <main style={{ minHeight: '100vh', paddingBottom: 60 }}>
      <div style={{ background: 'linear-gradient(to bottom, #1a0000, var(--bg))', padding: '36px 0 24px', borderBottom: '1px solid var(--border)', marginBottom: 40 }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span className="live-dot" />
            <p style={{ color: 'var(--red)', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700 }}>En direct</p>
          </div>
          <h1 style={{ fontFamily: 'var(--display)', fontSize: 32 }}>Streams Live</h1>
        </div>
      </div>
      <div className="container">
        <div style={{ textAlign: 'center', paddingTop: 60, color: 'var(--t3)' }}>
          <p style={{ fontSize: 16, marginBottom: 8 }}>Aucun stream en ce moment</p>
          <p style={{ fontSize: 14 }}>Reviens plus tard !</p>
        </div>
      </div>
    </main>
  );
}
