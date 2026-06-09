export default function About({ dict, lang, settings }) {
  const isEn = lang === 'en';
  const get = (key, f) => (settings || []).find(s => s.key === key)?.[f || 'valueTr'] || '';

  const hours = isEn ? (get('hours_weekdays', 'valueEn') || get('hours_weekdays')) : get('hours_weekdays');
  const hoursWe = isEn ? (get('hours_weekends', 'valueEn') || get('hours_weekends')) : get('hours_weekends');

  const stats = [
    { value: '100+', label: isEn ? 'Craft Beers'        : 'Craft Bira Çeşidi' },
    { value: '50+',  label: isEn ? 'Premium Whiskeys'   : 'Premium Viski'     },
    { value: '4×',   label: isEn ? 'Live Shows / Month' : 'Aylık Canlı Sahne' },
    { value: '4.8',  label: isEn ? 'Guest Rating'       : 'Misafir Puanı'     },
  ];

  return (
    <section id="about" style={{ background: 'var(--s-warm)', color: 'var(--ol-1)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', minHeight: '600px' }}>

        {/* ── Left: text content ── */}
        <div className="container section-pad" style={{ maxWidth: '640px' }}>
          <p className="eyebrow" style={{ marginBottom: '3rem' }}>
            {isEn ? '— About Us' : '— Hakkımızda'}
          </p>

          <h2 className="display-heading" style={{ fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)', color: 'var(--ol-1)', marginBottom: '2rem' }}>
            {isEn ? "Ankara's" : "Ankara'nın"}<br />
            {isEn ? 'Favourite' : 'Favori'}<br />
            {isEn ? 'Irish Pub' : 'İrlanda Pub\'ı'}
          </h2>

          <p style={{ fontSize: '1.0625rem', lineHeight: 1.78, color: 'var(--ol-2)', maxWidth: '46ch' }}>
            {isEn
              ? "Since 2015, Irish Luck has been Ankara's home for craft beer, premium whiskey, and live music. Nestled in Tepe Prime, our pub blends Irish warmth with a modern gastropub menu — prepared fresh every day."
              : "2015'den bu yana Irish Luck, Ankara'da craft bira, premium viski ve canlı müziğin adresi. Tepe Prime'ın kalbinde, İrlanda sıcaklığını her gün taze hazırlanan modern gastropub lezzetleriyle buluşturuyoruz."
            }
          </p>

          <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--ol-b)' }}>
            <p className="eyebrow" style={{ color: 'var(--ol-3)', marginBottom: '1rem' }}>
              {isEn ? 'Opening Hours' : 'Çalışma Saatleri'}
            </p>
            <p style={{ fontSize: '0.9375rem', color: 'var(--ol-1)', marginBottom: '0.35rem', lineHeight: 1.5 }}>{hours}</p>
            <p style={{ fontSize: '0.9375rem', color: 'var(--ol-1)', lineHeight: 1.5 }}>{hoursWe}</p>
          </div>
        </div>

        {/* ── Right: decorative visual panel ── */}
        <div style={{
          background: 'var(--green-deep)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: 'clamp(3rem, 6vw, 5rem) clamp(2rem, 4vw, 4rem)',
          position: 'relative', overflow: 'hidden',
          minHeight: '420px',
        }}>
          {/* Background shamrock watermark */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: 'clamp(14rem, 30vw, 22rem)', lineHeight: 1, opacity: 0.04, userSelect: 'none', color: '#fff' }}>
            ☘
          </div>
          {/* Amber radial top */}
          <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '60%', paddingBottom: '60%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,138,40,0.18) 0%, transparent 65%)', pointerEvents: 'none' }} />

          {/* Stats grid */}
          <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', width: '100%', maxWidth: '380px' }}>
            {stats.map((s, i) => (
              <div key={i} style={{ borderTop: '1px solid rgba(242,235,224,0.15)', paddingTop: '1.25rem' }}>
                <p className="display-heading" style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)', color: 'var(--gold)', lineHeight: 1 }}>
                  {s.value}
                </p>
                <p style={{ fontSize: '0.8rem', color: 'rgba(242,235,224,0.5)', marginTop: '0.375rem' }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom label */}
          <p style={{
            position: 'relative', zIndex: 1, marginTop: '3rem',
            fontFamily: 'var(--font-display)', fontStyle: 'italic',
            fontSize: 'clamp(0.875rem, 2vw, 1.0625rem)',
            color: 'rgba(242,235,224,0.4)', textAlign: 'center', lineHeight: 1.55,
            maxWidth: '26ch',
          }}>
            {isEn
              ? '"Where every evening is different and every pint tastes like home."'
              : '"Her akşam farklı, her yudum gibi ev gibi."'
            }
          </p>
        </div>
      </div>
    </section>
  );
}
