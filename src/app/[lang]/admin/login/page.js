'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const { lang = 'tr' } = useParams();
  const isEn = lang === 'en';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPw, setShowPw]     = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res  = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || (isEn ? 'An error occurred.' : 'Bir hata oluştu.'));
      } else {
        router.push(`/${lang}/admin`);
        router.refresh();
      }
    } catch {
      setError(isEn ? 'Network error.' : 'Ağ hatası oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'var(--color-void)' }}
    >
      {/* Ambient blobs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(27,107,58,0.14) 0%, transparent 65%)' }} />
      <div className="absolute bottom-0 right-0 w-80 h-80 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(200,149,42,0.07) 0%, transparent 65%)' }} />

      {/* Brand header */}
      <div className="text-center mb-8 z-10">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 text-3xl"
          style={{
            background: 'linear-gradient(135deg, var(--color-green), var(--color-green-dark))',
            boxShadow: 'var(--shadow-glow-green)',
          }}
        >
          ☘️
        </div>
        <h1 className="font-display text-3xl font-extrabold tracking-[0.1em]" style={{ color: 'var(--color-cream)' }}>
          IRISH LUCK
        </h1>
        <p className="text-xs font-bold tracking-[0.22em] uppercase mt-1" style={{ color: 'var(--color-muted)' }}>
          {isEn ? 'Management Panel' : 'Yönetim Paneli'}
        </p>
      </div>

      {/* Card */}
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden z-10"
        style={{ background: 'var(--color-dark-200)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: 'var(--shadow-lifted)' }}
      >
        <div className="h-1" style={{ background: 'linear-gradient(90deg, var(--color-green), var(--color-gold))' }} />
        <div className="p-8 sm:p-10">
          <h2 className="font-display text-xl font-bold mb-7 text-center" style={{ color: 'var(--color-cream)' }}>
            {isEn ? 'Sign In' : 'Yönetici Girişi'}
          </h2>

          {error && (
            <div className="alert alert-error mb-5">
              <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="input-label">{isEn ? 'Username' : 'Kullanıcı Adı'}</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-dimmed)' }}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="input"
                  style={{ paddingLeft: '2.75rem' }}
                />
              </div>
            </div>

            <div>
              <label className="input-label">{isEn ? 'Password' : 'Şifre'}</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-dimmed)' }}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </span>
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input"
                  style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'var(--color-dimmed)' }}
                >
                  {showPw ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-green w-full mt-2"
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                  {isEn ? 'Signing In…' : 'Giriş Yapılıyor…'}
                </>
              ) : (isEn ? 'Sign In' : 'Giriş Yap')}
            </button>
          </form>
        </div>
      </div>

      <a
        href={`/${lang}`}
        className="mt-7 text-xs font-medium transition-colors duration-200 z-10"
        style={{ color: 'var(--color-dimmed)' }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-gold)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-dimmed)')}
      >
        ← {isEn ? 'Back to Website' : 'Web Sitesine Dön'}
      </a>
    </main>
  );
}
