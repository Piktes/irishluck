import '../globals.css';

export async function generateStaticParams() {
  return [{ lang: 'tr' }, { lang: 'en' }];
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const isEn = lang === 'en';
  return {
    title: isEn
      ? 'Irish Luck | Gastropub & Whiskey & Craft Beer — Tepe Prime, Ankara'
      : 'Irish Luck | Gastropub & Viski & Craft Bira — Tepe Prime, Ankara',
    description: isEn
      ? 'Irish Luck Pub & Restaurant at Ankara Tepe Prime. Everyone Needs Luck. Craft beer, premium whiskey, live music and a full gastropub kitchen.'
      : 'Irish Luck Pub & Restaurant, Ankara Tepe Prime. Craft bira, premium viski, canlı müzik ve tam anlamıyla bir gastropub mutfağı.',
    icons: { icon: '/favicon.ico' },
  };
}

export default async function LangLayout({ children, params }) {
  const { lang } = await params;
  return (
    <html lang={lang}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
