import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSearch } from "../hooks/useFetch";
import { getSuggestions, getLang, setLang } from "../services/api";

export default function Navbar() {
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lang = getLang();
  const inputRef = useRef(null);
  const { query, setQuery, results } = useSearch(getSuggestions);

  useEffect(() => {
    if (showSearch) setTimeout(() => inputRef.current?.focus(), 80);
  }, [showSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim().length >= 2) {
      navigate(`/recherche?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
      setShowSearch(false);
    }
  };

  const goTo = (item) => {
    navigate(`/${item.type === "movie" ? "film" : "serie"}/${item.tmdbId}`);
    setQuery("");
    setShowSearch(false);
  };

  return (
    <header style={s.header}>
      <div style={s.inner}>
        <Link to="/" style={s.logo}>
          Astro<span style={{ color: "var(--red)" }}>Ciné</span>
        </Link>

        {/* Links desktop */}
        <nav className="nav-links" style={s.nav}>
          {[
            ["/", "Accueil", true],
            ["/films", "Films"],
            ["/series", "Séries"],
          ].map(([to, label, end]) => (
            <NavLink
              key={to}
              to={to}
              end={!!end}
              style={({ isActive }) => ({
                ...s.link,
                color: isActive ? "var(--gold)" : undefined,
              })}
            >
              {label}
            </NavLink>
          ))}
          <NavLink
            to="/live"
            style={({ isActive }) => ({
              ...s.link,
              color: "var(--red)",
              opacity: isActive ? 1 : 0.8,
              display: "flex",
              alignItems: "center",
              gap: 6,
            })}
          >
            <span className="live-dot" />
            Live
          </NavLink>
        </nav>

        <div style={s.actions}>
          {/* FR / EN switcher */}
          <div style={s.langSwitch}>
            {[
              ["fr-FR", "FR"],
              ["en-US", "EN"],
            ].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setLang(val)}
                style={{
                  ...s.langBtn,
                  background: lang === val ? "var(--gold)" : "transparent",
                  color: lang === val ? "#0d0d0d" : "var(--t3)",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Recherche */}
          {/* Recherche */}
          {showSearch ? (
            <div style={s.searchOverlay}>
              <div
                style={{
                  position: "relative",
                  flex: 1,
                  maxWidth: 600,
                  margin: "0 auto",
                }}
              >
                <form
                  onSubmit={handleSubmit}
                  style={{ display: "flex", gap: 8 }}
                >
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Rechercher..."
                    style={s.searchInputFull}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setShowSearch(false);
                      setQuery("");
                    }}
                    style={s.iconBtn}
                  >
                    &#10005;
                  </button>
                </form>
                {results.length > 0 && (
                  <div style={s.dropdown}>
                    {results.map((item) => (
                      <button
                        key={`${item.type}-${item.tmdbId}`}
                        onClick={() => goTo(item)}
                        style={s.suggItem}
                      >
                        {item.poster ? (
                          <img src={item.poster} alt="" style={s.suggImg} />
                        ) : (
                          <div style={s.suggImg} />
                        )}
                        <div style={{ textAlign: "left" }}>
                          <p style={{ color: "var(--t1)", fontSize: 13 }}>
                            {item.title}
                          </p>
                          <p
                            style={{
                              color: "var(--t3)",
                              fontSize: 11,
                              marginTop: 2,
                            }}
                          >
                            {item.year} &middot;{" "}
                            {item.type === "movie" ? "Film" : "Série"}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button onClick={() => setShowSearch(true)} style={s.iconBtn}>
              <svg
                width="17"
                height="17"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          )}

          {/* Burger */}
          <button
            className="nav-burger"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ ...s.iconBtn, display: "none", fontSize: 20 }}
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div style={s.mobileMenu}>
          {[
            ["/", "Accueil"],
            ["/films", "Films"],
            ["/series", "Séries"],
            ["/live", "Live"],
          ].map(([to, label]) => (
            <Link
              key={to}
              to={to}
              style={s.mobileLink}
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </Link>
          ))}
          <div
            style={{
              display: "flex",
              gap: 6,
              paddingTop: 8,
              borderTop: "1px solid var(--border)",
            }}
          >
            {[
              ["fr-FR", "FR"],
              ["en-US", "EN"],
            ].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setLang(val)}
                style={{
                  ...s.langBtn,
                  background: lang === val ? "var(--gold)" : "var(--card)",
                  color: lang === val ? "#0d0d0d" : "var(--t2)",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

const s = {
  header: {
    background: "rgba(13,13,13,0.97)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid var(--border)",
    position: "sticky",
    top: 0,
    zIndex: 200,
  },
  inner: {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "0 20px",
    height: 64,
    display: "flex",
    alignItems: "center",
    gap: 24,
  },
  logo: {
    fontFamily: "var(--display)",
    fontSize: 20,
    fontWeight: 700,
    color: "var(--gold)",
    flexShrink: 0,
  },
  nav: { display: "flex", gap: 20, flex: 1 },
  link: {
    color: "var(--t2)",
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: 1,
    textTransform: "uppercase",
    transition: "color 0.2s",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginLeft: "auto",
  },
  langSwitch: {
    display: "flex",
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: 4,
    overflow: "hidden",
  },
  langBtn: {
    border: "none",
    padding: "4px 10px",
    fontSize: 11,
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.15s",
  },
  searchInput: {
    background: "var(--card)",
    border: "1px solid var(--border2)",
    borderRadius: "var(--radius)",
    color: "var(--t1)",
    padding: "7px 12px",
    fontSize: 13,
    outline: "none",
    width: 220,
  },
  iconBtn: {
    background: "transparent",
    border: "none",
    color: "var(--t2)",
    cursor: "pointer",
    padding: 6,
    display: "flex",
    alignItems: "center",
  },
  dropdown: {
    position: "absolute",
    top: "110%",
    left: 0,
    right: 40,
    background: "#1a1008",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    maxHeight: 340,
    overflowY: "auto",
    zIndex: 300,
  },
  suggItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 12px",
    width: "100%",
    background: "none",
    border: "none",
    borderBottom: "1px solid var(--border)",
    cursor: "pointer",
  },
  suggImg: {
    width: 32,
    height: 48,
    objectFit: "cover",
    borderRadius: 3,
    flexShrink: 0,
    background: "var(--card)",
  },
  mobileMenu: {
    background: "var(--bg2)",
    borderTop: "1px solid var(--border)",
    padding: "16px 20px",
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  mobileLink: {
    color: "var(--t2)",
    fontSize: 14,
    fontWeight: 500,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  searchOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: 64,
    background: "rgba(13,13,13,0.98)",
    backdropFilter: "blur(12px)",
    display: "flex",
    alignItems: "center",
    padding: "0 20px",
    zIndex: 500,
    borderBottom: "1px solid var(--border)",
  },
  searchInputFull: {
    flex: 1,
    background: "var(--card)",
    border: "1px solid var(--border2)",
    borderRadius: "var(--radius)",
    color: "var(--t1)",
    padding: "10px 14px",
    fontSize: 14,
    outline: "none",
  },
};
