import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, Copy, Check, ExternalLink, Zap, Shield, Globe, ChevronRight } from 'lucide-react';
import { encodeUrl, getPlatformInfo } from '../utils/deepLinkHelper';
import { QRCodeSVG } from 'qrcode.react';

/* ── Intersection Observer hook for scroll-reveal ── */
function useFadeUp() {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return ref;
}

/* ──────────────────── Supported Apps ──────────────────── */
const APPS = [
  { emoji: '🎬', name: 'YouTube',     desc: 'Videos & channels',  color: '#FF0000' },
  { emoji: '📷', name: 'Instagram',   desc: 'Posts & reels',       color: '#E1306C' },
  { emoji: '🎧', name: 'Spotify',     desc: 'Music & podcasts',    color: '#1DB954' },
  { emoji: '🐤', name: 'X / Twitter', desc: 'Tweets & profiles',   color: '#1DA1F2' },
  { emoji: '🔗', name: 'LinkedIn',    desc: 'Profiles & posts',    color: '#0077b5' },
  { emoji: '👍', name: 'Facebook',    desc: 'Pages & videos',      color: '#1877F2' },
];

/* ──────────────────── Home Component ──────────────────── */
export default function Home() {
  const [url, setUrl] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [platform, setPlatform] = useState(null);

  /* refs for scroll animations */
  const howRef   = useFadeUp();
  const appsRef  = useFadeUp();
  const featRef  = useFadeUp();
  const ctaRef   = useFadeUp();

  const handleGenerate = (e) => {
    e.preventDefault();
    setError('');
    if (!url.trim()) { setError('Please enter a URL first.'); return; }
    try {
      new URL(url);
      const info = getPlatformInfo(url);
      setPlatform(info);
      setGeneratedLink(`${window.location.origin}/open?target=${encodeUrl(url)}`);
      setCopied(false);
    } catch {
      setError('Invalid URL format — make sure to include https://');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* ═══════════ NAV ═══════════ */}
      <nav className="nav">
        <div className="nav-inner">
          <a className="nav-logo" href="/">
            <div className="nav-logo-icon">
              <ExternalLink size={22} />
            </div>
            SendMeThere
          </a>
          <ul className="nav-links">
            <li><a href="#how">How it works</a></li>
            <li><a href="#apps">Supported Apps</a></li>
            <li><a href="#features">Features</a></li>
          </ul>
          <div className="nav-actions">
            <button className="btn btn-primary" onClick={() => document.getElementById('hero-input').focus()}>
              Try Free <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* ═══════════ HERO ═══════════ */}
      <section className="hero">
        {/* Left */}
        <div>
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}>
            <span className="hero-eyebrow">
              <span className="hero-eyebrow-dot"></span>
              ✨ Magic Deep Links — No App, No Code
            </span>
          </motion.div>

          <motion.h1 className="hero-title" initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1, duration:0.6 }}>
            Open links <span className="highlight">directly</span><br/>in the app.
          </motion.h1>

          <motion.p className="hero-sub" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2, duration:0.5 }}>
            Paste any YouTube, Instagram, Spotify link — we turn it into a Magic Link that forces mobile users directly into the native app. No more annoying browser redirects.
          </motion.p>

          <motion.form className="hero-form" onSubmit={handleGenerate} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3, duration:0.5 }}>
            <input
              id="hero-input"
              type="url"
              className="hero-input"
              placeholder="https://youtube.com/watch?v=..."
              value={url}
              onChange={e => setUrl(e.target.value)}
            />
            <button type="submit" className="btn btn-primary btn-lg">
              <Zap size={20} /> Generate Link
            </button>
          </motion.form>
          {error && <p className="hero-error">{error}</p>}

          {/* Result Panel */}
          <AnimatePresence>
            {generatedLink && (
              <motion.div
                className="result-panel"
                initial={{ opacity:0, y:20, height:0 }}
                animate={{ opacity:1, y:0, height:'auto' }}
                exit={{ opacity:0, height:0 }}
                transition={{ duration:0.4 }}
              >
                <div className="result-header">
                  <div className="result-platform-dot" style={{ background: platform?.color || 'var(--primary)' }}></div>
                  <span style={{ fontWeight:800 }}>Your Magic Link is Ready 🎉</span>
                  {platform && <span style={{ marginLeft:'auto', color:'var(--text-muted)', fontSize:'0.85rem', fontWeight:600 }}>{platform.name}</span>}
                </div>
                <div className="result-input-row">
                  <div className="result-url-box">{generatedLink}</div>
                  <button className="copy-btn" onClick={handleCopy}>
                    {copied ? <Check size={18}/> : <Copy size={18}/>}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="qr-row">
                  <div className="qr-box">
                    <QRCodeSVG value={generatedLink} size={90} />
                  </div>
                  <div className="qr-desc">
                    <h4>Scan to test on mobile</h4>
                    <p>Point your camera at the QR code to instantly open the link on your phone.</p>
                    {platform && <p className="qr-platform" style={{ color: platform.color }}>{platform.name} detected ✓</p>}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right — illustration */}
        <div className="hero-right">
          <motion.div className="hero-img-wrap" initial={{ opacity:0, scale:0.85 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.2, duration:0.7, ease:'easeOut' }}>
            <img src="/hero_character.png" alt="Magic link illustration" style={{ width:'100%' }}/>
          </motion.div>
          <div className="hero-badge badge-1">
            <span>🚀</span>
            <span>10K+ links generated</span>
          </div>
          <div className="hero-badge badge-2">
            <span style={{color:'#1DB954'}}>●</span>
            <span>Works on iOS & Android</span>
          </div>
        </div>
      </section>

      {/* ═══════════ STATS BAR ═══════════ */}
      <div className="stats-bar">
        <div className="stats-inner">
          {[
            { num: '6+',    label: 'Supported platforms' },
            { num: '100%',  label: 'Free forever' },
            { num: '<1s',   label: 'Time to generate' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay: i*0.1, duration:0.5 }}>
              <div className="stat-num">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section className="section" id="how">
        <div className="section-inner">
          <div className="how-grid">
            <div ref={howRef} className="fade-up">
              <p className="section-eyebrow">How it works</p>
              <h2 className="section-title">Three steps to magic.</h2>
              <p className="section-sub">No accounts, no SDKs, no complexity. Just paste, generate, share.</p>

              <div className="steps" style={{ marginTop: '2.5rem' }}>
                {[
                  { n:'1', cls:'', title:'Paste your link', desc:'Drop in any URL — YouTube videos, Instagram posts, Spotify tracks, Twitter profiles, and more.' },
                  { n:'2', cls:'accent', title:'We build the deep link', desc:'Our engine detects the platform and wraps your URL in the right native app URI scheme, automatically.' },
                  { n:'3', cls:'sky', title:'Share your Magic Link', desc:'Copy the generated link or scan the QR code. When tapped on mobile, it opens directly in the native app.' },
                ].map((s, i) => (
                  <motion.div key={i} className="step" initial={{ opacity:0, x:-30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ delay: i*0.15, duration:0.5 }}>
                    <div className={`step-num ${s.cls}`}>{s.n}</div>
                    <div>
                      <h3>{s.title}</h3>
                      <p>{s.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div initial={{ opacity:0, scale:0.9 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }} transition={{ duration:0.7 }}>
              <img src="/features_character.png" alt="How it works illustration" className="how-img" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════ SUPPORTED APPS ═══════════ */}
      <section className="section apps-section-bg" id="apps">
        <div className="section-inner">
          <div ref={appsRef} className="fade-up text-center">
            <p className="section-eyebrow">Supported Platforms</p>
            <h2 className="section-title">One tool, all your apps.</h2>
            <p className="section-sub" style={{ margin: '0 auto' }}>
              We support the most popular platforms and keep adding more every week.
            </p>
          </div>
          <div className="apps-grid">
            {APPS.map((app, i) => (
              <motion.div key={i} className="app-card"
                initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay: i*0.08, duration:0.5 }}
                whileHover={{ scale:1.04 }}
              >
                <span className="app-icon">{app.emoji}</span>
                <div className="app-name" style={{ color: app.color }}>{app.name}</div>
                <div className="app-desc">{app.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURES ═══════════ */}
      <section className="section" id="features">
        <div className="section-inner">
          <div ref={featRef} className="fade-up text-center">
            <p className="section-eyebrow">Why SendMeThere.</p>
            <h2 className="section-title">Everything you need.</h2>
            <p className="section-sub" style={{ margin: '0 auto' }}>
              Built for marketers, creators, and developers who want the best mobile link experience.
            </p>
          </div>

          <div className="features-grid">
            {[
              { icon:'⚡', cls:'blue', iconCls:'blue', title:'Instant Generation', desc:'Generate a working deep link in under one second. No signup, no friction, no waiting.' },
              { icon:'📱', cls:'green', iconCls:'green', title:'Smart OS Detection', desc:'Our redirect engine detects iOS vs Android and serves the right intent URI for each platform automatically.' },
              { icon:'🔗', cls:'sky', iconCls:'sky', title:'QR Code Included', desc:'Every generated link comes with a scannable QR code so you can instantly test on any device.' },
              { icon:'🛡️', cls:'blue', iconCls:'blue', title:'Privacy First', desc:'We never store your URLs. Everything is encoded in the link itself — fully stateless and secure.' },
              { icon:'🌍', cls:'green', iconCls:'green', title:'6+ Platforms', desc:'YouTube, Instagram, Twitter, Spotify, LinkedIn, Facebook — and more platforms added regularly.' },
              { icon:'🆓', cls:'sky', iconCls:'sky', title:'100% Free', desc:'No hidden costs, no rate limits. App Opener is completely free for everyone, forever.' },
            ].map((f, i) => (
              <motion.div key={i} className="feature-card"
                initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay: i*0.08, duration:0.5 }}
              >
                <div className={`feature-icon ${f.iconCls}`}>{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="cta-section">
        <div className="cta-blob cta-blob-1"></div>
        <div className="cta-blob cta-blob-2"></div>
        <div className="cta-inner" ref={ctaRef}>
          <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.6 }}>
            <h2 className="cta-title">Start opening links the right way.</h2>
            <p className="cta-sub">Stop losing users to browser redirects. Give your audience the best mobile experience in seconds — for free.</p>
            <div className="cta-actions">
              <button className="btn btn-accent btn-lg" onClick={() => window.scrollTo({ top:0, behavior:'smooth' })}>
                ✨ Generate a Link Free
              </button>
              <a href="#how" className="btn btn-lg" style={{ background:'rgba(255,255,255,0.15)', color:'#fff', border:'2px solid rgba(255,255,255,0.3)' }}>
                See How It Works
              </a>
            </div>
          </motion.div>
          <motion.div initial={{ opacity:0, scale:0.9 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }} transition={{ duration:0.7 }}>
            <img src="/cta_character.png" alt="CTA illustration" className="cta-img" />
          </motion.div>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <a className="nav-logo" href="/" style={{ textDecoration:'none' }}>
                <div className="nav-logo-icon"><ExternalLink size={22}/></div>
                SendMeThere
              </a>
              <p>The simplest way to convert web links into native app deep links for iOS & Android.</p>
            </div>
            <div className="footer-col">
              <h4>Product</h4>
              <ul>
                <li><a href="#how">How it works</a></li>
                <li><a href="#apps">Supported Apps</a></li>
                <li><a href="#features">Features</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Platforms</h4>
              <ul>
                {APPS.map(a => <li key={a.name}><a href="#">{a.name}</a></li>)}
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} SendMeThere. All rights reserved.</span>
            <span>Made with ❤️ for mobile-first experiences</span>
          </div>
        </div>
      </footer>
    </>
  );
}
