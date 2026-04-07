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

    const decodedTarget = decodeUrl(target);
    if (!decodedTarget) { setStatus('invalid'); return; }

    const os = detectOS();
    const generated = generateAppLinks(decodedTarget, os);
    setLinks(generated);

    if (os === 'desktop') {
      window.location.href = generated.webUrl;
      return;
    }

    setStatus('redirecting');
    window.location.href = generated.appUrl;

    const timer = setTimeout(() => setStatus('failed'), 2500);
    return () => clearTimeout(timer);
  }, [searchParams]);

  if (status === 'invalid') {
    return (
      <div className="redirect-page">
        <motion.div className="redirect-card" initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}>
          <div className="redirect-icon-wrap">⚠️</div>
          <h2 className="redirect-title">Invalid Link</h2>
          <p className="redirect-sub">This magic link appears to be broken or missing its destination.</p>
          <a href="/" className="btn btn-primary" style={{ textDecoration:'none', borderRadius:'9999px' }}>← Go Home</a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="redirect-page" style={{ background: '#f8fafc' }}>
      <motion.div className="redirect-card" initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}>

        {status === 'redirecting' && (
          <>
            <div className="spinner"></div>
            <h2 className="redirect-title">Opening app…</h2>
            <p className="redirect-sub">Launching the native app for you. This will only take a moment.</p>
          </>
        )}

        {status === 'failed' && (
          <>
            <div className="redirect-icon-wrap" style={{ background: links?.platform?.color ? `${links.platform.color}18` : '#f3f4f6' }}>
              <span>{links?.platform?.name?.[0] || '🔗'}</span>
            </div>
            <h2 className="redirect-title">Did it open?</h2>
            <p className="redirect-sub">
              If nothing happened, the app might not be installed. Use the buttons below to try again or continue in your browser.
            </p>
            <div className="redirect-actions">
              <a href={links?.appUrl} className="btn btn-primary" style={{ justifyContent:'center' }}>
                <ExternalLink size={18}/> Try Open App Again
              </a>
              <a href={links?.webUrl} className="btn btn-ghost" style={{ justifyContent:'center' }}>
                <Compass size={18}/> Continue in Browser
              </a>
              <a href="/" className="btn btn-ghost" style={{ justifyContent:'center', fontSize:'0.875rem' }}>
                ← Generate another link
              </a>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
