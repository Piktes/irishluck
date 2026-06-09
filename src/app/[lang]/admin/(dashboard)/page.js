import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminDashboard({ params }) {
  const { lang } = await params;
  const isEn = lang === 'en';

  let stats = { events: 0, activeEvents: 0, reviews: 0, approvedReviews: 0, gallery: 0 };
  try {
    const [events, activeEvents, reviews, approvedReviews, gallery] = await Promise.all([
      prisma.event.count(),
      prisma.event.count({ where: { active: true } }),
      prisma.review.count(),
      prisma.review.count({ where: { approved: true } }),
      prisma.galleryItem.count(),
    ]);
    stats = { events, activeEvents, reviews, approvedReviews, gallery };
  } catch {}

  const base = `/${lang}/admin`;

  const statCards = [
    {
      label: isEn ? 'Events' : 'Etkinlikler',
      value: `${stats.activeEvents} / ${stats.events}`,
      sub: isEn ? 'active / total' : 'aktif / toplam',
      color: 'rgba(200,149,42,0.12)',
      border: 'rgba(200,149,42,0.2)',
      iconColor: 'var(--color-gold)',
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      ),
    },
    {
      label: isEn ? 'Reviews' : 'Yorumlar',
      value: `${stats.approvedReviews} / ${stats.reviews}`,
      sub: isEn ? 'approved / total' : 'onaylı / toplam',
      color: 'rgba(27,107,58,0.12)',
      border: 'rgba(27,107,58,0.2)',
      iconColor: '#5dc87e',
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
        </svg>
      ),
    },
    {
      label: isEn ? 'Gallery' : 'Galeri',
      value: stats.gallery,
      sub: isEn ? 'total photos' : 'toplam fotoğraf',
      color: 'rgba(176,112,48,0.12)',
      border: 'rgba(176,112,48,0.2)',
      iconColor: 'var(--color-copper)',
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      ),
    },
  ];

  const quickLinks = [
    { label: isEn ? 'Manage Live Music Schedule' : 'Canlı Müzik Programı', href: `${base}/events`, desc: isEn ? 'Add, edit or remove events' : 'Etkinlik ekle, düzenle veya sil' },
    { label: isEn ? 'Upload Menu PDF' : 'Menü PDF Güncelle', href: `${base}/menu`, desc: isEn ? 'Update the digital menu file' : 'Dijital menü dosyasını değiştir' },
    { label: isEn ? 'Review Approvals' : 'Yorumları Onayla', href: `${base}/reviews`, desc: isEn ? 'Moderate customer reviews' : 'Müşteri yorumlarını yönet' },
    { label: isEn ? 'Gallery Photos' : 'Galeri Fotoğrafları', href: `${base}/gallery`, desc: isEn ? 'Add or remove gallery photos' : 'Galeri fotoğrafı ekle veya sil' },
    { label: isEn ? 'Site Settings' : 'Site Ayarları', href: `${base}/settings`, desc: isEn ? 'Update hours, contact, social links' : 'Saat, iletişim, sosyal linkleri düzenle' },
  ];

  return (
    <div className="space-y-10 max-w-5xl">
      <div className="admin-page-header">
        <h1 className="font-display text-3xl font-extrabold" style={{ color: 'var(--color-cream)' }}>
          {isEn ? 'Dashboard' : 'Genel Bakış'}
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--color-muted)' }}>
          {isEn ? 'Manage your website content from here.' : 'Sitenizin içeriğini buradan yönetin.'}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {statCards.map((sc) => (
          <div
            key={sc.label}
            className="rounded-2xl p-6 flex items-start gap-4"
            style={{ background: sc.color, border: `1px solid ${sc.border}` }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(0,0,0,0.25)', color: sc.iconColor }}
            >
              {sc.icon}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--color-muted)' }}>{sc.label}</p>
              <p className="font-display font-black text-3xl leading-none" style={{ color: 'var(--color-cream)' }}>{sc.value}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--color-dimmed)' }}>{sc.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-[0.14em] mb-4" style={{ color: 'var(--color-gold)' }}>
          {isEn ? 'Quick Actions' : 'Hızlı İşlemler'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickLinks.map((ql) => (
            <Link
              key={ql.href}
              href={ql.href}
              className="flex items-start justify-between gap-4 p-5 rounded-xl transition-all duration-200 group"
              style={{ background: 'var(--color-dark-200)', border: '1px solid rgba(255,255,255,0.07)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(200,149,42,0.25)';
                e.currentTarget.style.background = 'var(--color-dark-300)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                e.currentTarget.style.background = 'var(--color-dark-200)';
              }}
            >
              <div>
                <p className="text-sm font-bold mb-1 group-hover:text-[var(--color-gold)] transition-colors" style={{ color: 'var(--color-cream)' }}>
                  {ql.label}
                </p>
                <p className="text-xs" style={{ color: 'var(--color-muted)' }}>{ql.desc}</p>
              </div>
              <svg
                className="w-5 h-5 shrink-0 mt-0.5 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                style={{ color: 'var(--color-dimmed)' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
