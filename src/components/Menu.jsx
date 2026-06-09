export default function Menu({ dict, lang, menuInfo }) {
  const isEn = lang === 'en';
  const pdfUrl = menuInfo?.pdfUrl;
  const desc = isEn ? menuInfo?.descriptionEn : menuInfo?.descriptionTr;

  const categories = [
    {
      num: '01',
      name:  isEn ? 'Craft Beers'       : 'Craft Biralar',
      count: isEn ? '100+ varieties'    : '100+ çeşit',
      desc:  isEn
        ? 'Local and imported craft beers, artisan ales, seasonal taps and rotating guest kegs — always something new on pour.'
        : 'Yerli ve yabancı craft biralar, artisan aleler, mevsimlik musluk seçenekleri ve sürekli değişen misafir biralı fıçılar.',
      accent: 'rgba(200,138,40,0.12)',
    },
    {
      num: '02',
      name:  isEn ? 'Premium Whiskeys'  : 'Premium Viskiler',
      count: isEn ? '50+ labels'        : '50+ etiket',
      desc:  isEn
        ? 'Single malts, blends and rare bottles from Ireland, Scotland, Japan and America — curated for the serious enthusiast.'
        : 'İrlanda, İskoçya, Japonya ve Amerika\'dan single malt, blend ve nadir şişeler — gerçek meraklılar için seçilmiş.',
      accent: 'rgba(28,92,50,0.14)',
    },
    {
      num: '03',
      name:  isEn ? 'Gastropub Kitchen' : 'Gastropub Mutfağı',
      count: isEn ? 'Fresh daily'       : 'Her gün taze',
      desc:  isEn
        ? 'Seasonal produce, slow-cooked classics and elevated pub favourites — from burgers to fish & chips done right.'
        : 'Mevsimlik malzemeler, uzun pişirilmiş klasikler ve yükseltilmiş pub favorileri — burgerden doğru yapılmış fish & chips\'e.',
      accent: 'rgba(176,100,40,0.12)',
    },
  ];

  return (
    <section id="menu" style={{ background: 'var(--s-void)', color: 'var(--od-1)' }}>

      {/* ── Visual header band ── */}
      <div style={{
        borderBottom: '1px solid var(--od-b)',
        padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 5vw, 5rem)',
        display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between',
        gap: '2rem',
        background: 'linear-gradient(135deg, rgba(28,92,50,0.18) 0%, rgba(200,138,40,0.08) 50%, rgba(9,8,10,0) 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Giant "MENU" text watermark */}
        <div style={{
          position: 'absolute', right: '-2%', top: '50%', transform: 'translateY(-50%)',
          fontFamily: 'var(--font-display)', fontWeight: 900,
          fontSize: 'clamp(6rem, 18vw, 14rem)', lineHeight: 1,
          color: 'var(--od-1)', opacity: 0.03, userSelect: 'none', pointerEvents: 'none',
          letterSpacing: '-0.03em',
        }}>
          {isEn ? 'MENU' : 'MENÜ'}
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px' }}>
          <p className="eyebrow" style={{ marginBottom: '1.5rem' }}>
            {isEn ? '— What We Offer' : '— Ne Sunuyoruz'}
          </p>
          <h2 className="display-heading" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', color: 'var(--od-1)' }}>
            {isEn ? 'The Menu' : 'Menü'}
          </h2>
          {desc && (
            <p style={{ fontSize: '1rem', lineHeight: 1.75, color: 'var(--od-2)', maxWidth: '52ch', marginTop: '1.25rem' }}>
              {desc}
            </p>
          )}
        </div>

        {pdfUrl && (
          <a href={pdfUrl} target="_blank" rel="noreferrer" className="cta-gold" style={{ position: 'relative', zIndex: 1, alignSelf: 'flex-end' }}>
            {isEn ? 'Download Full Menu' : 'Tam Menüyü İndir'}
          </a>
        )}
      </div>

      {/* ── Category list ── */}
      <div className="container" style={{ paddingTop: 'clamp(2.5rem, 5vw, 4rem)', paddingBottom: 'clamp(2.5rem, 5vw, 4rem)' }}>
        {categories.map((cat, i) => (
          <div key={i} style={{
            display: 'grid',
            gridTemplateColumns: 'clamp(2.5rem, 4vw, 3.5rem) 1fr clamp(5rem, 10vw, 8rem)',
            gap: '2.5rem', alignItems: 'start',
            padding: 'clamp(1.75rem, 3.5vw, 2.75rem) 0',
            borderTop: '1px solid var(--od-b)',
            transition: 'background 0.2s',
          }}>
            <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1rem', color: 'var(--gold)', opacity: 0.6, paddingTop: '0.3rem' }}>
              {cat.num}
            </span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', color: 'var(--od-1)', lineHeight: 1.15 }}>
                  {cat.name}
                </h3>
                <span style={{ display: 'inline-block', padding: '0.2rem 0.75rem', background: cat.accent, border: '1px solid rgba(200,138,40,0.18)', fontSize: '0.6375rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                  {cat.count}
                </span>
              </div>
              <p style={{ fontSize: '0.9375rem', color: 'var(--od-2)', lineHeight: 1.72, maxWidth: '54ch' }}>
                {cat.desc}
              </p>
            </div>
            {/* Small decorative bar */}
            <div style={{ height: '3px', background: cat.accent, borderLeft: `3px solid var(--gold)`, marginTop: '0.75rem', borderRadius: '0 2px 2px 0' }} />
          </div>
        ))}
        <div style={{ borderTop: '1px solid var(--od-b)' }} />
      </div>
    </section>
  );
}
