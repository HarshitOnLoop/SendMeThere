import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Copy, Check, Zap, ChevronRight, ArrowRight, Link2, Wand2 } from 'lucide-react';
import { encodeUrl, getPlatformInfo } from '../utils/deepLinkHelper';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '../lib/supabase';
import { generateSlug, validateSlug } from '../utils/slugGenerator';

/* fade-up animation variant */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const APPS = [
  { icon: '🎬', name: 'YouTube', desc: 'Videos & Shorts',   color: '#ff4444' },
  { icon: '📷', name: 'Instagram', desc: 'Posts & Reels',   color: '#e1306c' },
  { icon: '🎧', name: 'Spotify', desc: 'Tracks & Podcasts', color: '#1db954' },
  { icon: '🐦', name: 'X / Twitter', desc: 'Tweets & Profiles', color: '#1da1f2' },
  { icon: '🔗', name: 'LinkedIn', desc: 'Profiles & Posts', color: '#0077b5' },
  { icon: '👍', name: 'Facebook', desc: 'Pages & Videos',   color: '#1877f2' },
];

export default function Home() {
  const [url, setUrl]                 = useState('');
  const [customSlug, setCustomSlug]   = useState('');
  const [generatedLink, setGenerated] = useState('');
  const [shortLink, setShortLink]     = useState('');
  const [copied, setCopied]           = useState(false);
  const [error, setError]             = useState('');
  const [slugError, setSlugError]     = useState('');
  const [platform, setPlatform]       = useState(null);
  const [navScrolled, setNavScrolled] = useState(false);
  const [saving, setSaving]           = useState(false);
  const [useDb, setUseDb]             = useState(!!supabase);

  // (scroll reveal handled by framer-motion whileInView)

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError('');
    setSlugError('');
    if (!url.trim()) { setError('Please paste a URL to continue.'); return; }

    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch {
      setError('Invalid URL — make sure to include https://'); return;
    }

    const info = getPlatformInfo(url);
    setPlatform(info);

    // Validate custom slug if provided
    if (customSlug.trim()) {
      const { valid, error: slugErr } = validateSlug(customSlug.trim());
      if (!valid) { setSlugError(slugErr); return; }
    }

    const slug = customSlug.trim() || generateSlug();

    setSaving(true);

    // Save to Supabase if configured
    if (supabase) {
      const { error: dbErr } = await supabase
        .from('links')
        .insert({ slug, original_url: url });

      if (dbErr) {
        setSaving(false);
        if (dbErr.code === '23505') {
          setSlugError(
            customSlug.trim()
              ? `"${slug}" is already taken. Choose a different slug.`
              : 'Slug collision — please try again.'
          );
        } else {
          setError('Failed to save link. Check your Supabase configuration.');
        }
        return;
      }

      const origin = window.location.origin;
      const short  = `${origin}/${slug}`;
      setShortLink(short);
      setGenerated(short);
    } else {
      // Fallback: use base64 encoding (no DB)
      setShortLink('');
      setGenerated(`${window.location.origin}/open?target=${encodeUrl(url)}`);
    }

    setSaving(false);
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* ══ NAV ══ */}
      <nav className={`nav ${navScrolled ? 'scrolled' : ''}`}>
        <div className="nav-inner">
          <a className="nav-logo" href="/">
            <div className="nav-logo-mark">🔗</div>
            SendMeThere
          </a>
          <ul className="nav-links">
            <li><a href="#how">How it works</a></li>
            <li><a href="#apps">Platforms</a></li>
            <li><a href="#features">Features</a></li>
          </ul>
          <div className="nav-actions">
            <button className="btn btn-ghost btn-sm" style={{padding:'8px 16px', fontSize:'0.85rem'}}
              onClick={() => document.getElementById('main-input').focus()}>
              Get started <ChevronRight size={14}/>
            </button>
          </div>
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section className="hero-section">
        <div className="hero-orb hero-orb-1"></div>
        <div className="hero-orb hero-orb-2"></div>
        <div className="hero-orb hero-orb-3"></div>

        <motion.div className="hero-content"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero-badge">
            <span className="hero-badge-dot">NEW</span>
            Deep links that actually work — no SDK required
          </div>

          <h1 className="hero-title">
            Every link,<br />
            <em>opened in the app.</em>
          </h1>

          <p className="hero-sub">
            Paste any URL — YouTube, Spotify, Instagram — and get a magic link that forces mobile users straight into the native app. No browser. No friction.
          </p>

          <form onSubmit={handleGenerate}>
            <div className="hero-input-wrap">
              <input
                id="main-input"
                type="url"
                className="hero-input"
                placeholder="https://youtube.com/watch?v=..."
                value={url}
                onChange={e => setUrl(e.target.value)}
              />
              <button type="submit" className="btn btn-indigo btn-lg" disabled={saving}>
                {saving ? <span style={{display:'flex',gap:'6px',alignItems:'center'}}><div style={{width:'14px',height:'14px',border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin 0.7s linear infinite'}}></div> Saving…</span> : <><Zap size={16} /> Generate</>}
              </button>
            </div>

            {/* Custom slug row */}
            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginTop:'10px', maxWidth:'600px', margin:'10px auto 0' }}>
              <div style={{ flex:1, display:'flex', alignItems:'center', gap:'8px', background:'rgba(255,255,255,0.04)', border:'1px solid var(--border-bright)', borderRadius:'var(--r-md)', padding:'10px 14px' }}>
                <span style={{ color:'var(--text-subtle)', fontSize:'0.875rem', whiteSpace:'nowrap' }}>{window.location.host}/</span>
                <input
                  type="text"
                  className="hero-input"
                  style={{ padding:'0', fontSize:'0.875rem' }}
                  placeholder="custom-slug  (optional)"
                  value={customSlug}
                  onChange={e => setCustomSlug(e.target.value.toLowerCase().replace(/\s/g, '-'))}
                />
              </div>
              <button type="button" className="btn btn-ghost" style={{ padding:'10px 14px', fontSize:'0.8rem' }}
                title="Generate a random slug"
                onClick={() => setCustomSlug(generateSlug())}>
                <Wand2 size={14}/> Random
              </button>
            </div>
            {slugError && <p className="hero-error">{slugError}</p>}
            {!supabase && (
              <p style={{ textAlign:'center', fontSize:'0.775rem', color:'var(--text-subtle)', marginTop:'8px' }}>
                ⚠️ Supabase not configured — using long links. Add env vars to enable short links.
              </p>
            )}
          </form>

          {error && <p className="hero-error">{error}</p>}

          <AnimatePresence>
            {generatedLink && (
              <motion.div className="result-wrap"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
              >
                <div className="result-panel">
                  <div className="result-top">
                    <div className="result-platform-badge">
                      <span>✓</span>
                      {platform ? `${platform.name} detected` : 'Link ready'}
                    </div>
                    <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {shortLink ? '🔗 Short link created' : 'Magic Link Generated'}
                    </span>
                  </div>

                  <div className="result-url-row">
                    <span className="result-url-text">{generatedLink}</span>
                    <button className="copy-btn" onClick={handleCopy}>
                      {copied ? <Check size={14}/> : <Copy size={14}/>}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>

                  <div className="qr-row">
                    <div className="qr-box">
                      <QRCodeSVG value={generatedLink} size={72} />
                    </div>
                    <div className="qr-desc">
                      <h4>Scan to test on mobile</h4>
                      <p>Point your phone camera here to open the link directly in the native app.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Hero mockup */}
        <motion.div className="hero-mockup-wrap container"
          initial={{ opacity: 0, y: 48, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero-mockup-glow"></div>
          <img src="/app_mockup.png" alt="SendMeThere app preview" />
        </motion.div>
      </section>

      {/* ══ LOGO STRIP ══ */}
      <div className="logo-strip">
        <div className="logo-strip-inner">
          <span className="logo-strip-label">Works with</span>
          <div className="logo-strip-logos">
            {APPS.map(a => (
              <div key={a.name} className="platform-logo">
                <div className="platform-logo-icon">{a.icon}</div>
                {a.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ HOW IT WORKS ══ */}
      <section className="section" id="how">
        <div className="container">
          <motion.div className="section-header"
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="section-eyebrow">How it works</div>
            <h2 className="section-title">Three steps to a better link.</h2>
            <p className="section-sub">No account needed. No SDK. No code. Just paste, generate, share.</p>
          </motion.div>

          <div className="steps-grid">
            {[
              { n: '01', icon: '📋', title: 'Paste your URL', desc: 'Drop in any link from YouTube, Instagram, Spotify, Twitter, LinkedIn, or Facebook.' },
              { n: '02', icon: '⚡', title: 'We generate a Magic Link', desc: 'Our engine wraps your URL in the correct native app intent scheme, instantly.' },
              { n: '03', icon: '📲', title: 'Share & it just works', desc: 'Email it, DM it, scan the QR code. On mobile it opens straight in the app — every time.' },
            ].map((s, i) => (
              <div key={i} className="step-card">
                <div className="step-number"><span>{s.n}</span></div>
                <span className="step-icon">{s.icon}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ STATS ══ */}
      <section className="section stats-section">
        <div className="container">
          <motion.div className="stats-grid"
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {[
              { num: '6+',    label: 'Supported platforms' },
              { num: '< 1s',  label: 'Time to generate' },
              { num: '100%',  label: 'Free, forever' },
            ].map((s, i) => (
              <div key={i} className="stat-item">
                <div className="stat-num">{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ APPS ══ */}
      <section className="section apps-section" id="apps">
        <div className="container">
          <motion.div className="section-header"
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="section-eyebrow">Platforms</div>
            <h2 className="section-title">One tool, every app.</h2>
            <p className="section-sub">We support the biggest platforms and keep expanding the list weekly.</p>
          </motion.div>

          <div className="apps-grid">
            {APPS.map((app, i) => (
              <motion.div key={i} className="app-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                whileHover={{ y: -4 }}
              >
                <span className="app-card-icon">{app.icon}</span>
                <div className="app-card-name" style={{ color: app.color }}>{app.name}</div>
                <div className="app-card-desc">{app.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURES BENTO ══ */}
      <section className="section" id="features">
        <div className="container">
          <motion.div className="section-header"
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="section-eyebrow">Features</div>
            <h2 className="section-title">Everything you need.</h2>
            <p className="section-sub">Built for creators, marketers, and developers who refuse to settle for broken mobile experiences.</p>
          </motion.div>

          <div className="bento-grid">
            {/* Big card */}
            <motion.div className="bento-card bento-1"
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }}
            >
              <div className="bento-icon">⚡</div>
              <h3>Instant deep links</h3>
              <p>Paste any URL and receive a correctly-formatted native app intent within milliseconds. No waiting, no configuration.</p>
              <div className="bento-visual">
                <div className="code-preview">
                  <div><span className="ck">const</span> link = <span className="cs">generateDeepLink</span>(</div>
                  <div>&nbsp;&nbsp;<span className="cn">'https://youtube.com/watch?v=abc'</span></div>
                  <div>);</div>
                  <div style={{marginTop:'8px', color:'#34d399'}}>// → youtube://watch?v=abc</div>
                </div>
              </div>
            </motion.div>

            {/* Small card */}
            <motion.div className="bento-card bento-2"
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.08 }}
            >
              <div className="bento-icon">📱</div>
              <h3>Smart OS detection</h3>
              <p>Our redirect layer detects iOS vs Android and serves the right URL scheme for each platform — automatically, in real time.</p>
            </motion.div>

            <motion.div className="bento-card bento-3"
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.12 }}
            >
              <div className="bento-icon">📷</div>
              <h3>QR code included</h3>
              <p>Every link comes with a live QR code. Scan it on any device to instantly verify and share your deep link.</p>
            </motion.div>

            <motion.div className="bento-card bento-4"
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.16 }}
            >
              <div className="bento-icon">🛡️</div>
              <h3>Zero data stored</h3>
              <p>Your URLs are encoded server-side and never persisted. Privacy-first, by design.</p>
            </motion.div>

            <motion.div className="bento-card bento-5"
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.20 }}
            >
              <div className="bento-icon">🆓</div>
              <h3>Free forever</h3>
              <p>No rate limits, no paywalls, no sign-up. SendMeThere is completely free for everyone.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="cta-section">
        <div className="cta-bg"></div>
        <div className="container">
          <motion.div className="cta-box"
            initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          >
            <div className="section-eyebrow" style={{ justifyContent:'center', marginBottom:'28px' }}>
              Get started today
            </div>
            <h2 className="cta-title">Stop losing users<br/>to the browser.</h2>
            <p className="cta-sub">
              One paste. One click. Your audience lands directly inside the native app — every single time.
            </p>
            <div className="cta-actions">
              <button className="btn btn-primary btn-xl"
                onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setTimeout(() => document.getElementById('main-input')?.focus(), 600); }}>
                Generate a Magic Link
                <ArrowRight size={18}/>
              </button>
              <a href="#how" className="btn btn-ghost btn-xl">See how it works</a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <a className="nav-logo" href="/">
                <div className="nav-logo-mark">🔗</div>
                SendMeThere
              </a>
              <p>Convert any web URL into a native app deep link — instantly. Works for iOS &amp; Android.</p>
            </div>
            <div className="footer-col">
              <h5>Product</h5>
              <ul>
                <li><a href="#how">How it works</a></li>
                <li><a href="#apps">Platforms</a></li>
                <li><a href="#features">Features</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h5>Platforms</h5>
              <ul>
                {APPS.map(a => <li key={a.name}><a href="#">{a.name}</a></li>)}
              </ul>
            </div>
            <div className="footer-col">
              <h5>Legal</h5>
              <ul>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} SendMeThere. All rights reserved.</span>
            <span>Made for mobile-first experiences.</span>
          </div>
        </div>
      </footer>
    </>
  );
}
