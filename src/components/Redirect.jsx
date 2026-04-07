import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ExternalLink, Compass } from 'lucide-react';
import { decodeUrl, detectOS, generateAppLinks } from '../utils/deepLinkHelper';

export default function Redirect() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('initializing');
  const [links, setLinks] = useState(null);

  useEffect(() => {
    const target = searchParams.get('target');
    if (!target) { setStatus('invalid'); return; }
    const decoded = decodeUrl(target);
    if (!decoded) { setStatus('invalid'); return; }

    const os = detectOS();
    const generated = generateAppLinks(decoded, os);
    setLinks(generated);

    if (os === 'desktop') { window.location.href = generated.webUrl; return; }

    setStatus('redirecting');
    window.location.href = generated.appUrl;
    const t = setTimeout(() => setStatus('failed'), 2500);
    return () => clearTimeout(t);
  }, [searchParams]);

  if (status === 'invalid') return (
    <div className="redirect-page">
      <motion.div className="redirect-card" initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}>
        <div className="redirect-icon">⚠️</div>
        <h2 className="redirect-title">Invalid link</h2>
        <p className="redirect-sub">This magic link is broken or missing its destination URL.</p>
        <a href="/" className="btn btn-ghost" style={{ textDecoration:'none', marginTop:'8px' }}>← Back to SendMeThere</a>
      </motion.div>
    </div>
  );

  return (
    <div className="redirect-page">
      <motion.div className="redirect-card" initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}>
        {status === 'redirecting' && (
          <>
            <div className="spinner"></div>
            <h2 className="redirect-title">Opening app…</h2>
            <p className="redirect-sub">Launching the native app for you. Hang on a second.</p>
          </>
        )}
        {status === 'failed' && (
          <>
            <div className="redirect-icon">
              {links?.platform?.name?.[0] || '🔗'}
            </div>
            <h2 className="redirect-title">Did it open?</h2>
            <p className="redirect-sub">
              If nothing happened, the app may not be installed. Use the options below to try again or open in browser.
            </p>
            <div className="redirect-actions">
              <a href={links?.appUrl} className="btn btn-indigo btn-lg" style={{ justifyContent:'center' }}>
                <ExternalLink size={16}/> Try open app again
              </a>
              <a href={links?.webUrl} className="btn btn-ghost btn-lg" style={{ justifyContent:'center' }}>
                <Compass size={16}/> Continue in browser
              </a>
              <a href="/" className="btn btn-ghost" style={{ justifyContent:'center', fontSize:'0.825rem' }}>
                ← Generate another link
              </a>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
