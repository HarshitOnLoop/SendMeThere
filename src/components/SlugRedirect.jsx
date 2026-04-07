import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ExternalLink, Compass } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { detectOS, generateAppLinks } from '../utils/deepLinkHelper';

export default function SlugRedirect() {
  const { slug } = useParams();
  const [status, setStatus] = useState('loading');
  const [links, setLinks] = useState(null);

  useEffect(() => {
    if (!slug) { setStatus('invalid'); return; }

    const resolve = async () => {
      // If Supabase is not configured, we can't look up slugs
      if (!supabase) { setStatus('no-db'); return; }

      const { data, error } = await supabase
        .from('links')
        .select('original_url')
        .eq('slug', slug)
        .single();

      if (error || !data) { setStatus('not-found'); return; }

      // Increment click counter (fire and forget)
      supabase.from('links').update({ clicks: supabase.raw('clicks + 1') }).eq('slug', slug);

      const originalUrl = data.original_url;
      const os = detectOS();
      const generated = generateAppLinks(originalUrl, os);
      setLinks({ ...generated, originalUrl });

      if (os === 'desktop') { window.location.href = originalUrl; return; }
      if (!generated.appUrl) { window.location.href = originalUrl; return; }

      setStatus('redirecting');
      window.location.href = generated.appUrl;
      const t = setTimeout(() => setStatus('failed'), 2500);
      return () => clearTimeout(t);
    };

    resolve();
  }, [slug]);

  const card = (icon, title, sub, actions) => (
    <div className="redirect-page">
      <motion.div className="redirect-card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <div className="redirect-icon">{icon}</div>
        <h2 className="redirect-title">{title}</h2>
        <p className="redirect-sub">{sub}</p>
        {actions}
      </motion.div>
    </div>
  );

  if (status === 'loading')
    return card(<div className="spinner" style={{ margin: '0 auto' }}></div>, 'Resolving link…', 'Looking up your short link, hang on.', null);

  if (status === 'no-db')
    return card('⚙️', 'Not configured', 'Supabase is not set up yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables.', (
      <a href="/" className="btn btn-ghost" style={{ textDecoration: 'none', marginTop: '8px' }}>← Go home</a>
    ));

  if (status === 'not-found')
    return card('🔍', 'Link not found', `No short link exists for "/${slug}". It may have been deleted or never created.`, (
      <a href="/" className="btn btn-ghost" style={{ textDecoration: 'none', marginTop: '8px' }}>← Create a new link</a>
    ));

  if (status === 'invalid')
    return card('⚠️', 'Invalid link', 'This link appears to be malformed.', (
      <a href="/" className="btn btn-ghost" style={{ textDecoration: 'none', marginTop: '8px' }}>← Go home</a>
    ));

  if (status === 'redirecting')
    return card(<div className="spinner" style={{ margin: '0 auto' }}></div>, 'Opening app…', 'Launching the native app for you.', null);

  if (status === 'failed')
    return card(
      links?.platform?.name?.[0] || '🔗',
      'Did it open?',
      'If nothing happened, the app may not be installed. Use the options below.',
      <div className="redirect-actions" style={{ marginTop: '8px' }}>
        <a href={links?.appUrl} className="btn btn-indigo btn-lg" style={{ justifyContent: 'center', textDecoration: 'none' }}>
          <ExternalLink size={16} /> Try open app again
        </a>
        <a href={links?.originalUrl || links?.webUrl} className="btn btn-ghost btn-lg" style={{ justifyContent: 'center', textDecoration: 'none' }}>
          <Compass size={16} /> Continue in browser
        </a>
        <a href="/" className="btn btn-ghost" style={{ justifyContent: 'center', fontSize: '0.825rem', textDecoration: 'none' }}>
          ← Generate another link
        </a>
      </div>
    );

  return null;
}
