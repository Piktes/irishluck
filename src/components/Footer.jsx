'use client';
import Link from 'next/link';

export default function Footer({ lang, settings }) {
  const isEn = lang === 'en';
  const sa = settings || [];
  const insta   = sa.find(s => s.key === 'instagram')?.valueTr || '';
  const phone   = sa.find(s => s.key === 'phone')?.valueTr     || '';
  const address = sa.find(s => s.key === 'address')?.valueTr   || '';
  const year    = new Date().getFullYear();

  const links = [
    { href: '#about',   label: isEn ? 'About'   : 'Hakkımızda' },
    { href: '#menu',    label: isEn ? 'Menu'    : 'Menü'        },
    { href: '#events',  label: isEn ? 'Events'  : 'Etkinlikler' },
    { href: '#gallery', label: isEn ? 'Gallery' : 'Galeri'      },
    { href: '#contact', label: isEn ? 'Contact' : 'İletişim'    },
  ];

  return (
    <footer style={{ background: 'var(--s-foot)', borderTop: '1px solid var(--od-b)', color: 'var(--od-1)' }}>
      <div className="container" style={{ padding: '4rem clamp(1.5rem, 5vw, 5rem)' }}>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '3rem', marginBottom: '3.5rem' }}>

          {/* Brand */}
          <div style={{ maxWidth: '280px' }}>
            <Link href={`/${lang}`} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.25rem' }}>☘</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1rem', letterSpacing: '0.12em', color: 'var(--od-1)' }}>
                IRISH LUCK
              </span>
            </Link>
            <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '0.875rem', color: 'var(--od-3)', lineHeight: 1.6 }}>
              {isEn ? 'Pub & Restaurant · Ankara' : 'Pub & Restoran · Ankara'}
            </p>
            {address && (
              <p style={{ fontSize: '0.8125rem', color: 'var(--od-3)', lineHeight: 1.65, marginTop: '0.75rem', opacity: 0.7 }}>{address}</p>
            )}
          </div>

          {/* Nav */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            <p style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--od-3)', marginBottom: '0.375rem', opacity: 0.5 }}>
              {isEn ? 'Navigate' : 'Sayfalar'}
            </p>
            {links.map(l => (
              <a key={l.href} href={l.href}
                style={{ fontSize: '0.875rem', color: 'var(--od-2)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--od-1)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--od-2)')}>
                {l.label}
              </a>
            ))}
          </nav>

          {/* Connect */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <p style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--od-3)', marginBottom: '0.375rem', opacity: 0.5 }}>
              {isEn ? 'Connect' : 'İletişim'}
            </p>
            {insta && (
              <a href={insta} target="_blank" rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.875rem', color: 'var(--od-2)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--od-1)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--od-2)')}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="3.5"/>
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
                </svg>
                @irishlucktepe
              </a>
            )}
            {phone && (
              <a href={`tel:${phone.replace(/\s/g, '')}`}
                style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.875rem', color: 'var(--od-2)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--od-1)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--od-2)')}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.338c0 10.335 8.375 18.712 18.713 18.712h.001a2.25 2.25 0 002.25-2.25v-2.838a2.25 2.25 0 00-1.667-2.176l-3.278-.819a2.25 2.25 0 00-2.25.56l-.93.93a16.38 16.38 0 01-8.462-8.461l.928-.93a2.25 2.25 0 00.561-2.25L7.5 4.168A2.25 2.25 0 005.325 2.5H2.488a2.25 2.25 0 00-2.25 2.25 2.25 2.25 0 00.012.257z"/>
                </svg>
                {phone}
              </a>
            )}
            <Link href={`/${lang === 'tr' ? 'en' : 'tr'}`}
              style={{ fontSize: '0.8rem', color: 'var(--od-3)', textDecoration: 'none', marginTop: '0.5rem', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--od-1)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--od-3)')}>
              {lang === 'tr' ? 'Switch to English →' : 'Türkçe\'ye geç →'}
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ paddingTop: '1.75rem', borderTop: '1px solid var(--od-b)', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--od-3)' }}>
            © {year} Irish Luck Pub & Restaurant. {isEn ? 'All rights reserved.' : 'Tüm hakları saklıdır.'}
          </p>
          <Link href={`/${lang}/admin`}
            style={{ fontSize: '0.6875rem', color: 'var(--od-3)', textDecoration: 'none', opacity: 0.35, transition: 'opacity 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = 0.8)}
            onMouseLeave={e => (e.currentTarget.style.opacity = 0.35)}>
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
