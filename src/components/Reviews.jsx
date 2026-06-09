'use client';

import { useState, useEffect, useRef } from 'react';

const Stars = ({ n }) => (
  <span style={{ display: 'inline-flex', gap: '0.2rem' }}>
    {Array.from({ length: 5 }).map((_, i) => (
      <svg key={i} width="13" height="13" viewBox="0 0 24 24"
        fill={i < n ? 'var(--gold)' : 'none'}
        stroke="var(--gold)" strokeWidth="1.5" style={{ opacity: i < n ? 1 : 0.28 }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ))}
  </span>
);

export default function Reviews({ dict, lang, reviews }) {
  const isEn = lang === 'en';
  const approved = (reviews || []).filter(r => r.approved);
  const [idx, setIdx] = useState(0);
  const timer = useRef(null);

  useEffect(() => {
    if (approved.length < 2) return;
    timer.current = setInterval(() => setIdx(i => (i + 1) % approved.length), 7000);
    return () => clearInterval(timer.current);
  }, [approved.length]);

  const go = (i) => {
    clearInterval(timer.current);
    setIdx(i);
    if (approved.length > 1) {
      timer.current = setInterval(() => setIdx(n => (n + 1) % approved.length), 7000);
    }
  };

  if (!approved.length) return null;

  const current = approved[idx];
  const content = isEn ? (current.contentEn || current.contentTr) : current.contentTr;

  return (
    <section id="reviews" style={{ background: 'var(--s-warm)', color: 'var(--ol-1)', position: 'relative', overflow: 'hidden' }}>

      {/* ── Decorative background elements ── */}
      {/* Giant opening quote — decorative */}
      <div style={{
        position: 'absolute', top: '-2rem', left: 'clamp(1rem, 5vw, 5rem)',
        fontFamily: 'var(--font-display)', fontSize: 'clamp(12rem, 25vw, 20rem)',
        lineHeight: 1, color: 'var(--ol-1)', opacity: 0.04,
        userSelect: 'none', pointerEvents: 'none',
      }}>"</div>
      {/* Green tint bottom right */}
      <div style={{ position: 'absolute', bottom: '-15%', right: '-5%', width: '40%', paddingBottom: '40%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(28,92,50,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
      {/* Gold tint top right */}
      <div style={{ position: 'absolute', top: '-10%', right: '10%', width: '30%', paddingBottom: '30%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,138,40,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div className="container section-pad" style={{ position: 'relative', zIndex: 1 }}>
        <p className="eyebrow" style={{ marginBottom: '5rem' }}>
          {isEn ? '— What Guests Say' : '— Misafirlerimiz Ne Diyor'}
        </p>

        {/* Quote block */}
        <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center', minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <p className="display-italic" style={{ fontSize: 'clamp(1.25rem, 3vw, 2rem)', color: 'var(--ol-1)', marginBottom: '2.75rem', letterSpacing: '-0.005em', lineHeight: 1.5 }}>
            {content}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <Stars n={current.rating} />
            <p style={{ fontSize: '0.8125rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ol-3)' }}>
              {current.author}
            </p>
          </div>
        </div>

        {/* Pagination dots */}
        {approved.length > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.625rem', marginTop: '4rem' }}>
            {approved.map((_, i) => (
              <button key={i} onClick={() => go(i)} style={{ width: i === idx ? '2rem' : '0.5rem', height: '0.5rem', borderRadius: '99px', border: 'none', cursor: 'pointer', background: i === idx ? 'var(--gold)' : 'var(--ol-b)', transition: 'all 0.3s ease', padding: 0 }} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
