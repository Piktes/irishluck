export default function Hero({ dict, lang, settings }) {
  const isEn = lang === 'en';
  const phone = (settings || []).find(s => s.key === 'whatsapp')?.valueTr || '';
  const waUrl = phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(isEn ? 'Hello, I would like to make a reservation.' : 'Merhaba, rezervasyon yaptırmak istiyorum.')}`
    : '#contact';

  const tickers = isEn
    ? ['Live Music Every Week', 'Craft Beer & Artisan Cocktails', '50+ Premium Whiskeys', 'Gastropub Kitchen', 'Tepe Prime · Ankara']
    : ['Her Hafta Canlı Müzik', 'Craft Bira & Özel Kokteyller', '50+ Premium Viski', 'Gastropub Mutfağı', 'Tepe Prime · Ankara'];

  return (
    <section id="hero" style={{ minHeight: '100svh', background: 'var(--s-void)', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>

      {/* ── Decorative background ── */}
      {/* Warm amber radial — simulates stage lighting */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 60% 50% at 50% 60%, rgba(200,138,40,0.11) 0%, transparent 65%)' }} />
      {/* Green glow — bottom left corner */}
      <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '45%', paddingBottom: '45%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(28,92,50,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
      {/* Giant shamrock watermark */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%) rotate(-12deg)',
        fontSize: 'clamp(18rem, 50vw, 42rem)',
        lineHeight: 1, opacity: 0.025,
        pointerEvents: 'none', userSelect: 'none',
        color: 'var(--green)',
      }}>☘</div>

      {/* ── Main content ── */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center',
        padding: '7rem clamp(1.5rem, 5vw, 5rem) 4rem',
        position: 'relative', zIndex: 1,
      }}>
        {/* Top badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.625rem',
          border: '1px solid rgba(200,138,40,0.25)',
          padding: '0.375rem 1rem',
          marginBottom: '2.5rem',
          fontSize: '0.6375rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase',
          color: 'var(--gold)',
        }}>
          <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--gold)', display: 'inline-block' }} />
          {isEn ? 'Est. 2015 — Tepe Prime, Ankara' : 'Kur. 2015 — Tepe Prime, Ankara'}
          <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--gold)', display: 'inline-block' }} />
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 900,
          fontSize: 'clamp(4.5rem, 16vw, 12rem)',
          lineHeight: 0.93, letterSpacing: '-0.025em',
          color: 'var(--od-1)', marginBottom: '1.75rem',
        }}>
          IRISH<br />LUCK
        </h1>

        {/* Sub */}
        <p style={{
          fontFamily: 'var(--font-display)', fontStyle: 'italic',
          fontSize: 'clamp(1.0625rem, 2.5vw, 1.5rem)',
          color: 'var(--gold)', letterSpacing: '0.04em', marginBottom: '3.5rem',
        }}>
          {isEn ? 'Pub & Restaurant' : 'Pub & Restoran'}
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href={waUrl} target="_blank" rel="noreferrer" className="cta-gold">
            {isEn ? 'Make a Reservation' : 'Rezervasyon Yap'}
          </a>
          <a href="#menu" className="cta-ghost-light">
            {isEn ? 'View Menu' : 'Menüyü Gör'}
          </a>
        </div>
      </div>

      {/* ── Ticker ── */}
      <div style={{ borderTop: '1px solid var(--od-b)', padding: '0.9rem 0', overflow: 'hidden', position: 'relative', zIndex: 1 }}>
        <div className="ticker-track">
          {[0, 1].map(i => (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
              {tickers.map((item, j) => (
                <span key={j} style={{ display: 'flex', alignItems: 'center', gap: '2.25rem', padding: '0 2.25rem', fontSize: '0.675rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--od-3)', whiteSpace: 'nowrap' }}>
                  {item}
                  <span style={{ color: 'var(--gold)', fontSize: '0.4rem', opacity: 0.6 }}>◆</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
