import { useState, useEffect, useRef } from 'react';

const detectBrowser = () => {
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isFirefox = ua.includes('Firefox');
  const isEdge = ua.includes('Edg');
  const isChrome = ua.includes('Chrome') && !isEdge;
  if (isIOS) return 'ios';
  if (isFirefox) return 'firefox';
  if (isEdge) return 'edge';
  if (isChrome) return 'chrome';
  return 'other';
};

const LINKS = {
  chrome: { name: 'uBlock Origin Lite', url: 'https://chrome.google.com/webstore/detail/ublock-origin-lite/ddkjiahejlhfcafbddmgiahcphecmpfh' },
  firefox: { name: 'uBlock Origin', url: 'https://addons.mozilla.org/fr/firefox/addon/ublock-origin/' },
  edge: { name: 'uBlock Origin Lite', url: 'https://microsoftedge.microsoft.com/addons/detail/ublock-origin-lite/cimighlppcgcoapaliogubppchhinhh' },
  ios: { name: 'AdGuard (App Store)', url: 'https://apps.apple.com/app/adguard-ad-blocker-privacy/id1047223162' },
  other: { name: 'uBlock Origin', url: 'https://ublockorigin.com/' },
};

const checkAdBlockActive = () => {
  return new Promise((resolve) => {
    const bait = document.createElement('div');
    bait.className = 'pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads text-ad-links ad-placement adbadge';
    bait.style.cssText = 'position:absolute;top:-9999px;left:-9999px;width:1px;height:1px;';
    document.body.appendChild(bait);
    setTimeout(() => {
      const blocked = bait.offsetParent === null || bait.offsetHeight === 0
        || getComputedStyle(bait).display === 'none' || getComputedStyle(bait).visibility === 'hidden';
      document.body.removeChild(bait);
      resolve(blocked);
    }, 150);
  });
};

export default function UBlockGate({ onContinue }) {
  const [visible, setVisible] = useState(false);
  const [checking, setChecking] = useState(true);
  const [browser, setBrowser] = useState('other');
  const pollRef = useRef(null);

  const runCheck = async () => {
    const active = await checkAdBlockActive();
    if (active) {
      localStorage.setItem('ac_ublock_ok', '1');
      setVisible(false);
      onContinue();
      return true;
    }
    return false;
  };

  useEffect(() => {
    setBrowser(detectBrowser());
    (async () => {
      const ok = await runCheck();
      setChecking(false);
      if (!ok) {
        setVisible(true);
        pollRef.current = setInterval(async () => {
          const ok2 = await runCheck();
          if (ok2) clearInterval(pollRef.current);
        }, 2000);
      }
    })();
    return () => clearInterval(pollRef.current);
  }, []);

  const handleInstallClick = () => window.open(LINKS[browser].url, '_blank');

  const handleSkip = () => {
    clearInterval(pollRef.current);
    setVisible(false);
    onContinue();
  };

  const handleClose = () => {
    clearInterval(pollRef.current);
    setVisible(false);
    // Pas d'onContinue ici — fermer la croix annule juste le popup sans lancer le film
  };

  if (checking || !visible) return null;

  const link = LINKS[browser];
  const isIOS = browser === 'ios';

  return (
    <div style={s.overlay}>
      <div style={s.box} className="ublock-box">
        <button onClick={handleClose} style={s.closeBtn} title="Fermer">&#10005;</button>

        <div style={s.iconWrap}>
          <svg width="28" height="28" fill="none" stroke="var(--gold)" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <h3 style={s.title}>Bloqueur de pub conseillé</h3>
        <p style={s.text}>
          {isIOS
            ? "Installe AdGuard pour bloquer les publicités des lecteurs vidéo."
            : `Installe ${link.name}, puis reviens sur cette page — la détection est automatique.`}
        </p>

        <button onClick={handleInstallClick} className="btn btn-gold" style={{ width: '100%', justifyContent: 'center' }}>
          Installer {link.name}
        </button>

        <div style={s.pollingNote}>
          <div style={s.spinner} />
          En attente de détection...
        </div>

        {isIOS && <p style={s.iosNote}>Active-le ensuite dans Réglages &rarr; Safari &rarr; Bloqueurs de contenu</p>}

        <button onClick={handleSkip} style={s.skipBtn}>
          Continuer sans installer
        </button>
      </div>
    </div>
  );
}

const s = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 },
  box: { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '32px 28px', maxWidth: 380, textAlign: 'center', position: 'relative' },
  closeBtn: { position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: 'var(--t3)', fontSize: 16, cursor: 'pointer', padding: 4 },
  iconWrap: { width: 56, height: 56, borderRadius: '50%', background: 'rgba(212,160,23,0.1)', border: '1px solid rgba(212,160,23,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' },
  title: { fontFamily: 'var(--display)', fontSize: 20, color: 'var(--t1)', marginBottom: 10 },
  text: { color: 'var(--t2)', fontSize: 14, lineHeight: 1.6, marginBottom: 20 },
  pollingNote: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'var(--t3)', fontSize: 12, marginTop: 14 },
  spinner: { width: 12, height: 12, border: '2px solid var(--border)', borderTop: '2px solid var(--gold)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  iosNote: { color: 'var(--t3)', fontSize: 12, marginTop: 12, lineHeight: 1.5 },
  skipBtn: { background: 'none', border: 'none', color: 'var(--t3)', fontSize: 12, marginTop: 14, cursor: 'pointer', textDecoration: 'underline' },
};