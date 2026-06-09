import { prisma } from '@/lib/prisma';
import { getDictionary } from '@/dictionaries';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Menu from '@/components/Menu';
import Events from '@/components/Events';
import Gallery from '@/components/Gallery';
import Reviews from '@/components/Reviews';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default async function Page({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  let events = [];
  let reviews = [];
  let settings = [];
  let menuInfo = null;
  let galleryItems = [];

  try {
    [events, reviews, settings, menuInfo, galleryItems] = await Promise.all([
      prisma.event.findMany({ where: { active: true }, orderBy: { date: 'asc' } }),
      prisma.review.findMany({ where: { approved: true }, orderBy: { id: 'desc' } }),
      prisma.setting.findMany(),
      prisma.menuInfo.findFirst(),
      prisma.galleryItem.findMany({ orderBy: { id: 'desc' } }),
    ]);
  } catch (err) {
    console.error('DB fetch error in page.js — using fallbacks:', err);
  }

  events      = JSON.parse(JSON.stringify(events));
  reviews     = JSON.parse(JSON.stringify(reviews));
  settings    = JSON.parse(JSON.stringify(settings));
  galleryItems = JSON.parse(JSON.stringify(galleryItems));
  if (menuInfo) menuInfo = JSON.parse(JSON.stringify(menuInfo));

  return (
    <>
      <Navbar dict={dict} lang={lang} />
      <main>
        <Hero dict={dict} lang={lang} settings={settings} />
        <About dict={dict} lang={lang} settings={settings} />
        <Menu dict={dict} lang={lang} menuInfo={menuInfo} />
        <Events dict={dict} lang={lang} events={events} settings={settings} />
        <Gallery dict={dict} lang={lang} galleryItems={galleryItems} />
        <Reviews dict={dict} lang={lang} reviews={reviews} />
        <Contact dict={dict} lang={lang} settings={settings} />
      </main>
      <Footer lang={lang} settings={settings} />
    </>
  );
}
