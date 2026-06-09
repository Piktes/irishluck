'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeLinecap="round"/>
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function Navbar({ lang, dict }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const isEn = lang === 'en';

  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'dark';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const links = [
    { href: '#about',   label: isEn ? 'About'   : 'Hakkımızda' },
    { href: '#menu',    label: isEn ? 'Menu'    : 'Menü'        },
    { href: '#events',  label: isEn ? 'Events'  : 'Etkinlikler' },
    { href: '#gallery', label: isEn ? 'Gallery' : 'Galeri'      },
    { href: '#reviews', label: isEn ? 'Reviews' : 'Yorumlar'    },
    { href: '#contact', label: isEn ? 'Contact' : 'İletişim'    },
  ];

  const navBg = scrolled
    ? 'rgba(9,8,10,0.93)'
    : 'transparent';

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        transition: 'background 0.4s, backdrop-filter 0.4s, border-color 0.4s',
        background: navBg,
        backdropFilter: scrolled ? 'blur(18px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(242,235,224,0.07)' : '1px solid transparent',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', height: '4.5rem', gap: '1.5rem' }}>

          <Link href={`/${lang}`} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', flexShrink: 0 }}>
            <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>☘</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1rem', letterSpacing: '0.12em', color: '#F2EBE0' }}>
              IRISH LUCK
            </span>
          </Link>

          <ul style={{ display: 'flex', gap: 0, listStyle: 'none', marginLeft: 'auto' }} className="hidden lg:flex">
            {links.map(l => (
              <li key={l.href}>
                <a href={l.href}
                  style={{ display: 'block', padding: '0.5rem 0.9rem', fontSize: '0.775rem', fontWeight: 600, letterSpacing: '0.05em', color: 'rgba(242,235,224,0.6)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#F2EBE0')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(242,235,224,0.6)')}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} className="lg:ml-0 ml-auto">
            {/* Theme toggle */}
            <button onClick={toggleTheme}
              style={{ background: 'rgba(242,235,224,0.08)', border: '1px solid rgba(242,235,224,0.12)', borderRadius: '50%', width: '2rem', height: '2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(242,235,224,0.6)', transition: 'all 0.2s', flexShrink: 0 }}
              onMouseEnter={e => { e.currentTarget.style.color = '#F2EBE0'; e.currentTarget.style.borderColor = 'rgba(200,138,40,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(242,235,224,0.6)'; e.currentTarget.style.borderColor = 'rgba(242,235,224,0.12)'; }}
              title={theme === 'dark' ? (isEn ? 'Light mode' : 'Açık tema') : (isEn ? 'Dark mode' : 'Koyu tema')}
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>

            <Link href={`/${lang === 'tr' ? 'en' : 'tr'}`}
              style={{ fontSize: '0.675rem', fontWeight: 700, letterSpacing: '0.18em', color: 'rgba(242,235,224,0.4)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#F2EBE0')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(242,235,224,0.4)')}>
              {lang === 'tr' ? 'EN' : 'TR'}
            </Link>

            <a href="#contact" className="cta-gold hidden md:inline-flex" style={{ padding: '0.575rem 1.375rem', fontSize: '0.65rem' }}>
              {isEn ? 'Reserve' : 'Rezervasyon'}
            </a>

            <button onClick={() => setOpen(v => !v)} className="lg:hidden"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#F2EBE0', padding: '0.25rem', lineHeight: 0 }}>
              {open
                ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/></svg>
                : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round"/></svg>
              }
            </button>
          </div>
        </div>
      </nav>

      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 49, background: 'rgba(9,8,10,0.98)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.125rem' }}>
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.875rem, 8vw, 2.75rem)', fontWeight: 900, color: '#F2EBE0', textDecoration: 'none', padding: '0.4rem 2rem', textAlign: 'center', transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
              onMouseLeave={e => (e.currentTarget.style.color = '#F2EBE0')}>
              {l.label}
            </a>
          ))}
          <a href="#contact" className="cta-gold" style={{ marginTop: '2.5rem' }} onClick={() => setOpen(false)}>
            {isEn ? 'Make a Reservation' : 'Rezervasyon Yap'}
          </a>
        </div>
      )}
    </>
  );
}
