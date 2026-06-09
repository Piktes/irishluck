'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton({ lang, isEn }) {
  const router = useRouter();

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push(`/${lang}/admin/login`);
    router.refresh();
  };

  return (
    <button
      onClick={logout}
      className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
      style={{ color: 'var(--color-muted)', background: 'transparent' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(180,40,40,0.12)';
        e.currentTarget.style.color = '#f07070';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.color = 'var(--color-muted)';
      }}
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
      </svg>
      {isEn ? 'Log Out' : 'Çıkış Yap'}
    </button>
  );
}
