'use client';

const MAP_EMBED = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3059.9806540608573!2d32.77665797652758!3d39.908272886470355!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d3464ee81d33bb%3A0xe54d241775f0a0bb!2sTepe%20Prime!5e0!3m2!1str!2str!4v1717770000000!5m2!1str!2str";

export default function Contact({ dict, lang, settings }) {
  const isEn = lang === 'en';
  const sa = settings || [];

  const get = (key) => {
    const s = sa.find(x => x.key === key);
    if (!s) return '';
    return isEn ? (s.valueEn || s.valueTr) : s.valueTr;
  };

  const phone    = sa.find(x => x.key === 'phone')?.valueTr     || '';
  const whatsapp = sa.find(x => x.key === 'whatsapp')?.valueTr  || '';
  const address  = get('address');
  const insta    = sa.find(x => x.key === 'instagram')?.valueTr || '';
  const mapUrl   = sa.find(x => x.key === 'map_url')?.valueTr   || MAP_EMBED;
  const hoursWd  = get('hours_weekdays');
  const hoursWe  = get('hours_weekends');

  const waText = encodeURIComponent(isEn ? 'Hello, I would like to make a reservation.' : 'Merhaba, rezervasyon yaptırmak istiyorum.');
  const waUrl  = whatsapp ? `https://wa.me/${whatsapp}?text=${waText}` : null;

  const rows = [
    address && { label: isEn ? 'Address' : 'Adres', value: address, href: `https://maps.google.com/?q=${encodeURIComponent(address)}` },
    phone   && { label: isEn ? 'Phone'   : 'Telefon', value: phone, href: `tel:${phone.replace(/\s/g, '')}` },
    (hoursWd || hoursWe) && { label: isEn ? 'Hours' : 'Saatler', value: [hoursWd, hoursWe].filter(Boolean).join('\n') },
    insta   && { label: 'Instagram', value: '@irishlucktepe', href: insta },
  ].filter(Boolean);

  return (
    <section id="contact" style={{ background: 'var(--s-void)', color: 'var(--od-1)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))', minHeight: '540px' }}>

        {/* ── Left: info ── */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          {/* Subtle green glow */}
          <div style={{ position: 'absolute', top: '10%', left: '-10%', width: '60%', paddingBottom: '60%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(28,92,50,0.15) 0%, transparent 65%)', pointerEvents: 'none' }} />

          <div className="container section-pad" style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: '600px' }}>
            <p className="eyebrow" style={{ marginBottom: '1.5rem' }}>
              {isEn ? '— Find Us' : '— Bizi Bulun'}
            </p>
            <h2 className="display-heading" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--od-1)', marginBottom: '3.5rem' }}>
              {isEn ? 'Come Visit' : 'Bizi Ziyaret Edin'}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.25rem' }}>
              {rows.map((row, i) => (
                <div key={i} style={{ display: 'flex', gap: '1.75rem', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold)', minWidth: '5rem', paddingTop: '0.2rem', flexShrink: 0 }}>
                    {row.label}
                  </span>
                  {row.href ? (
                    <a href={row.href} target="_blank" rel="noreferrer"
                      style={{ fontSize: '0.9375rem', lineHeight: 1.65, color: 'var(--od-2)', textDecoration: 'none', transition: 'color 0.2s', whiteSpace: 'pre-line' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--od-1)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'var(--od-2)')}>
                      {row.value}
                    </a>
                  ) : (
                    <p style={{ fontSize: '0.9375rem', lineHeight: 1.65, color: 'var(--od-2)', whiteSpace: 'pre-line' }}>{row.value}</p>
                  )}
                </div>
              ))}
            </div>

            {waUrl && (
              <div style={{ marginTop: '3.5rem' }}>
                <a href={waUrl} target="_blank" rel="noreferrer" className="cta-gold">
                  {isEn ? 'Reserve via WhatsApp' : 'WhatsApp ile Rezervasyon'}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* ── Right: map ── */}
        <div style={{ minHeight: '420px', position: 'relative' }}>
          <iframe src={mapUrl} width="100%" height="100%"
            style={{ border: 0, display: 'block', minHeight: '420px', filter: 'grayscale(35%) brightness(0.8) contrast(1.1)' }}
            allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
            title={isEn ? 'Location' : 'Konum'} />
        </div>
      </div>
    </section>
  );
}
