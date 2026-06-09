const MONTHS_EN = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
const MONTHS_TR = ['OCA','ŞUB','MAR','NİS','MAY','HAZ','TEM','AĞU','EYL','EKİ','KAS','ARA'];
const DAYS_EN   = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
const DAYS_TR   = ['PAZ','PZT','SAL','ÇAR','PER','CUM','CMT'];

export default function Events({ dict, lang, events, settings }) {
  const isEn = lang === 'en';
  const phone = (settings || []).find(s => s.key === 'whatsapp')?.valueTr || '';
  const active = (events || []).filter(e => e.active).slice(0, 5);

  return (
    <section id="events" style={{ background: 'var(--s-deep)', color: 'var(--od-1)', position: 'relative', overflow: 'hidden' }}>

      {/* ── Decorative background ── */}
      <div style={{ position: 'absolute', top: 0, right: 0, width: '40%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(28,92,50,0.07))', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '5%', width: '30%', paddingBottom: '30%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,138,40,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
      {/* Vertical text watermark */}
      <div style={{
        position: 'absolute', right: 'clamp(1rem, 3vw, 3rem)', top: '50%',
        transform: 'translateY(-50%) rotate(90deg)',
        transformOrigin: 'center center',
        fontFamily: 'var(--font-display)', fontWeight: 900,
        fontSize: 'clamp(3rem, 7vw, 6rem)', letterSpacing: '0.3em',
        color: 'var(--od-1)', opacity: 0.025, userSelect: 'none', pointerEvents: 'none',
        whiteSpace: 'nowrap',
      }}>
        {isEn ? 'LIVE MUSIC' : 'CANLI MÜZİK'}
      </div>

      <div className="container section-pad" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: '4.5rem' }}>
          <p className="eyebrow" style={{ marginBottom: '1.5rem' }}>
            {isEn ? '— Live Music' : '— Canlı Müzik'}
          </p>
          <h2 className="display-heading" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', color: 'var(--od-1)' }}>
            {isEn ? 'Upcoming Shows' : 'Yaklaşan Etkinlikler'}
          </h2>
        </div>

        {active.length === 0 ? (
          <div style={{ borderTop: '1px solid var(--od-b)', paddingTop: '2rem' }}>
            <p style={{ fontSize: '0.9375rem', color: 'var(--od-3)', padding: '3rem 0' }}>
              {isEn ? 'No upcoming events. Check back soon.' : 'Yaklaşan etkinlik yok. Yakında kontrol edin.'}
            </p>
          </div>
        ) : (
          <div>
            {active.map(ev => {
              const d     = new Date(ev.date);
              const day   = d.getDate();
              const mon   = isEn ? MONTHS_EN[d.getMonth()] : MONTHS_TR[d.getMonth()];
              const wday  = isEn ? DAYS_EN[d.getDay()]     : DAYS_TR[d.getDay()];
              const time  = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const title = isEn ? (ev.titleEn || ev.titleTr) : ev.titleTr;
              const desc  = isEn ? (ev.descriptionEn || ev.descriptionTr) : ev.descriptionTr;
              const waMsg = isEn
                ? `I'd like to reserve for the event on ${day} ${mon} — ${ev.artist}.`
                : `${day} ${mon} tarihli ${ev.artist} etkinliği için yer ayırtmak istiyorum.`;
              const waUrl = phone ? `https://wa.me/${phone}?text=${encodeURIComponent(waMsg)}` : '#';

              return (
                <div key={ev.id} style={{
                  display: 'grid',
                  gridTemplateColumns: 'clamp(4rem, 7vw, 5.5rem) 1fr auto',
                  gap: 'clamp(1.5rem, 3vw, 3rem)',
                  alignItems: 'center',
                  padding: 'clamp(1.75rem, 3.5vw, 2.75rem) 0',
                  borderTop: '1px solid var(--od-b)',
                }}>
                  {/* Date block */}
                  <div style={{ textAlign: 'center', flexShrink: 0 }}>
                    <p style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--od-3)', marginBottom: '0.25rem' }}>{wday}</p>
                    <p className="display-heading" style={{ fontSize: 'clamp(2rem, 4.5vw, 2.75rem)', color: 'var(--gold)', lineHeight: 1 }}>{day}</p>
                    <p style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--od-3)', marginTop: '0.25rem' }}>{mon}</p>
                  </div>

                  {/* Info */}
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: '0.675rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.5rem' }}>
                      {ev.artist} · {time}
                    </p>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(1.25rem, 2.5vw, 1.875rem)', color: 'var(--od-1)', lineHeight: 1.2, marginBottom: '0.5rem' }}>
                      {title}
                    </h3>
                    {desc && (
                      <p style={{ fontSize: '0.9rem', color: 'var(--od-2)', lineHeight: 1.65, maxWidth: '54ch', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {desc}
                      </p>
                    )}
                  </div>

                  {/* Image or CTA */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-end', flexShrink: 0 }}>
                    {ev.image && (
                      <div style={{ width: 'clamp(4rem, 8vw, 6rem)', aspectRatio: '1', overflow: 'hidden', background: 'rgba(28,92,50,0.2)', flexShrink: 0 }}>
                        <img src={ev.image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                    {phone && (
                      <a href={waUrl} target="_blank" rel="noreferrer"
                        className="cta-ghost-light hidden sm:inline-flex"
                        style={{ fontSize: '0.65rem', padding: '0.65rem 1.375rem' }}>
                        {isEn ? 'Reserve' : 'Yer Al'}
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
            <div style={{ borderTop: '1px solid var(--od-b)' }} />
          </div>
        )}
      </div>
    </section>
  );
}
