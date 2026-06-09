'use client';

import { useState } from 'react';

const FALLBACKS = [
  ['#1a1208','#2e1e0a'], ['#0c1510','#1a2e1e'],
  ['#100c18','#1e1530'], ['#180e08','#2e1a10'],
  ['#0c1218','#1a2032'], ['#151008','#28201a'],
];

export default function Gallery({ dict, lang, galleryItems }) {
  const isEn = lang === 'en';
  const [lb, setLb] = useState(null);
  const items = (galleryItems || []).slice(0, 12);

  const close = () => setLb(null);
  const prev  = () => setLb(l => (l - 1 + items.length) % items.length);
  const next  = () => setLb(l => (l + 1) % items.length);

  return (
    <section id="gallery" style={{ background: 'var(--s-void)', color: 'var(--od-1)', position: 'relative', overflow: 'hidden' }}>

      {/* ── Decorative header visual ── */}
      <div style={{
        borderBottom: '1px solid var(--od-b)',
        padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 5vw, 5rem)',
        display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between',
        gap: '2rem',
        background: 'linear-gradient(135deg, rgba(28,92,50,0.12) 0%, transparent 50%)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative camera/photo icon — large, right side */}
        <div style={{ position: 'absolute', right: 'clamp(2rem, 5vw, 6rem)', top: '50%', transform: 'translateY(-50%)', opacity: 0.06, pointerEvents: 'none' }}>
          <svg width="clamp(8rem,18vw,14rem)" height="clamp(8rem,18vw,14rem)" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5">
            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <p className="eyebrow" style={{ marginBottom: '1.5rem' }}>
            {isEn ? '— The Atmosphere' : '— Atmosfer'}
          </p>
          <h2 className="display-heading" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', color: 'var(--od-1)' }}>
            {isEn ? 'Gallery' : 'Galeri'}
          </h2>
        </div>
        {items.length > 0 && (
          <p style={{ fontSize: '0.8rem', color: 'var(--od-3)', position: 'relative', zIndex: 1 }}>
            {items.length} {isEn ? 'photos' : 'fotoğraf'}
          </p>
        )}
      </div>

      {/* ── Masonry grid ── */}
      <div style={{ padding: 'clamp(1.5rem, 3vw, 2.5rem) clamp(1.5rem, 5vw, 5rem)' }}>
        {items.length === 0 ? (
          <p style={{ color: 'var(--od-3)', fontSize: '0.9375rem', padding: '4rem 0', textAlign: 'center' }}>
            {isEn ? 'Gallery photos coming soon.' : 'Galeri fotoğrafları yakında eklenecek.'}
          </p>
        ) : (
          <div style={{ columns: 'clamp(180px, 28vw, 320px)', columnGap: '0.75rem' }}>
            {items.map((item, i) => {
              const [c1, c2] = FALLBACKS[i % FALLBACKS.length];
              const tall = i % 3 === 0;
              return (
                <div key={item.id}
                  onClick={() => setLb(i)}
                  style={{ breakInside: 'avoid', marginBottom: '0.75rem', position: 'relative', overflow: 'hidden', cursor: 'pointer', aspectRatio: tall ? '3/4' : '4/3', background: `linear-gradient(135deg, ${c1}, ${c2})` }}
                >
                  <img src={item.imageUrl} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s ease' }}
                    onLoad={e => { e.currentTarget.style.opacity = 1; }}
                    onError={e => { e.currentTarget.style.display = 'none'; }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.nextSibling.style.opacity = 1; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.nextSibling.style.opacity = 0; }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(9,8,10,0.4)', opacity: 0, transition: 'opacity 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                      <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35" strokeLinecap="round"/>
                    </svg>
                  </div>
                  {/* Category chip */}
                  {item.category && (
                    <span style={{ position: 'absolute', bottom: '0.5rem', left: '0.5rem', fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', padding: '0.2rem 0.5rem', background: 'rgba(9,8,10,0.65)', color: 'rgba(242,235,224,0.7)' }}>
                      {item.category}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lb !== null && (
        <div onClick={close} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(9,8,10,0.96)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <button onClick={e => { e.stopPropagation(); prev(); }} style={{ position: 'absolute', left: 'clamp(1rem, 3vw, 2.5rem)', background: 'rgba(242,235,224,0.08)', border: '1px solid rgba(242,235,224,0.12)', color: '#F2EBE0', borderRadius: '50%', width: '2.75rem', height: '2.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <img src={items[lb]?.imageUrl} alt="" onClick={e => e.stopPropagation()} style={{ maxWidth: 'min(90vw, 900px)', maxHeight: '85vh', objectFit: 'contain' }} />
          <button onClick={e => { e.stopPropagation(); next(); }} style={{ position: 'absolute', right: 'clamp(1rem, 3vw, 2.5rem)', background: 'rgba(242,235,224,0.08)', border: '1px solid rgba(242,235,224,0.12)', color: '#F2EBE0', borderRadius: '50%', width: '2.75rem', height: '2.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button onClick={close} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(242,235,224,0.08)', border: '1px solid rgba(242,235,224,0.12)', color: '#F2EBE0', borderRadius: '50%', width: '2.5rem', height: '2.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/></svg>
          </button>
          <p style={{ position: 'absolute', bottom: '1.5rem', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.15em', color: 'rgba(242,235,224,0.4)' }}>
            {lb + 1} / {items.length}
          </p>
        </div>
      )}
    </section>
  );
}
