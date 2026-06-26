import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import DetailPage from './pages/DetailPage';
import SearchPage from './pages/SearchPage';
import LivePage from './pages/LivePage';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/films" element={<Catalog type="movie" />} />
        <Route path="/series" element={<Catalog type="tv" />} />
        <Route path="/film/:id" element={<DetailPage type="movie" />} />
        <Route path="/serie/:id" element={<DetailPage type="tv" />} />
        <Route path="/recherche" element={<SearchPage />} />
        <Route path="/live" element={<LivePage />} />
        <Route path="*" element={
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <p style={{ fontFamily: 'var(--display)', fontSize: 72, color: 'var(--border)' }}>404</p>
            <p style={{ color: 'var(--t3)', fontSize: 16 }}>Page introuvable</p>
            <a href="/" style={{ color: 'var(--gold)', fontSize: 14 }}>Retour à l'accueil</a>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}
