const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const betterSqlite3 = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

async function main() {
  const dbPath = path.resolve(process.cwd(), 'dev.db');
  const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
  const prisma = new PrismaClient({ adapter });

  console.log('Seeding database...');

  // 1. Create admin user
  const passwordHash = await bcrypt.hash('irishlucktepe', 10);
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      passwordHash,
    },
  });
  console.log('Admin user seeded:', admin.username);

  // 2. Create settings
  const settings = [
    { key: 'phone', valueTr: '0312 284 76 53', valueEn: '0312 284 76 53' },
    { key: 'whatsapp', valueTr: '905300000000', valueEn: '905300000000' }, // actual or dummy whatsapp number
    { key: 'email', valueTr: 'info@irishlucktepe.com', valueEn: 'info@irishlucktepe.com' },
    { key: 'address', valueTr: 'Mustafa Kemal Mah., Tepe Prime Avenue, Dumlupınar Blv. 266 B Blok No:5, Çankaya/Ankara', valueEn: 'Mustafa Kemal Mah., Tepe Prime Avenue, Dumlupinar Blv. 266 B Block No:5, Cankaya/Ankara' },
    { key: 'instagram', valueTr: 'https://www.instagram.com/irishlucktepe/', valueEn: 'https://www.instagram.com/irishlucktepe/' },
    { key: 'hours_weekdays', valueTr: 'Hafta İçi: 11:00 - 01:00', valueEn: 'Weekdays: 11:00 AM - 01:00 AM' },
    { key: 'hours_weekends', valueTr: 'Hafta Sonu: 11:00 - 02:00', valueEn: 'Weekends: 11:00 AM - 02:00 AM' },
  ];

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: s,
      create: s,
    });
  }
  console.log('Settings seeded.');

  // 3. Create initial menu info
  await prisma.menuInfo.create({
    data: {
      pdfUrl: '/uploads/menu.pdf',
      descriptionTr: 'Mevsimlik malzemelerle hazırlanan enfes gastropub lezzetleri, geniş premium viski koleksiyonumuz ve yerli/yabancı craft biralarımız.',
      descriptionEn: 'Exquisite gastropub delights prepared with seasonal ingredients, our wide collection of premium whiskeys, and local/imported craft beers.',
    },
  });
  console.log('Menu info seeded.');

  // 4. Create initial events
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentDay = new Date().getDate();

  const events = [
    {
      titleTr: 'Canlı Müzik & Karaoke Gecesi',
      titleEn: 'Live Music & Karaoke Night',
      date: new Date(currentYear, currentMonth, currentDay + 2, 21, 0),
      artist: 'Grup Kesişme',
      image: '/images/events/karaoke.jpg',
      descriptionTr: 'Eğlenceli ve dinamik şarkılarla dolu sahne performansı, ardından sahne senin! Sevdiğin şarkıları söyleme zamanı.',
      descriptionEn: 'A stage performance filled with fun and dynamic songs, followed by karaoke! Time to sing your favorite tunes.',
      active: true,
    },
    {
      titleTr: 'Akustik Rock Sahnesi',
      titleEn: 'Acoustic Rock Stage',
      date: new Date(currentYear, currentMonth, currentDay + 4, 21, 30),
      artist: 'Ege & Ceren Duo',
      image: '/images/events/acoustic.jpg',
      descriptionTr: '90\'lar ve 2000\'lerin en sevilen rock klasikleri akustik yorumlarıyla Irish Luck sahnesinde.',
      descriptionEn: 'The most popular rock classics of the 90s and 2000s on Irish Luck stage with their acoustic interpretations.',
      active: true,
    },
    {
      titleTr: 'Barda Şarap & Caz Gecesi',
      titleEn: 'Wine & Jazz Night at the Bar',
      date: new Date(currentYear, currentMonth, currentDay + 5, 20, 0),
      artist: 'Jazz Trio Ankara',
      image: '/images/events/jazz.jpg',
      descriptionTr: 'Seçkin yerli ve yabancı şarapların caz tınılarıyla buluştuğu harika bir Cuma akşamı.',
      descriptionEn: 'A wonderful Friday evening where select local and imported wines meet smooth jazz melodies.',
      active: true,
    },
  ];

  for (const e of events) {
    await prisma.event.create({ data: e });
  }
  console.log('Events seeded.');

  // 5. Create initial reviews
  const reviews = [
    {
      author: 'Ahmet Yılmaz',
      rating: 5,
      contentTr: 'Ankara\'daki en iyi İrlanda pub\'ı net. Bira çeşitliliği harika, hamburgerleri aşırı lezzetli. Personel çok güler yüzlü ve ilgili. Canlı müzik gecelerinde ortam efsane oluyor.',
      contentEn: 'Clearly the best Irish pub in Ankara. Great beer variety, hamburgers are extremely delicious. The staff is very friendly and attentive. The atmosphere is legendary on live music nights.',
      approved: true,
    },
    {
      author: 'Sarah Jenkins',
      rating: 5,
      contentTr: 'Tepe Prime\'da harika bir mekan. Viski koleksiyonu beni şaşırttı, oldukça geniş. Tasarım ve loş ışıklar gerçek bir Dublin pub havası veriyor. Kesinlikle tavsiye ederim.',
      contentEn: 'A great place at Tepe Prime. The whiskey collection surprised me, very extensive. The design and dim lights give an authentic Dublin pub feel. Definitely recommend.',
      approved: true,
    },
    {
      author: 'Melis Kaya',
      rating: 4,
      contentTr: 'Kokteylleri çok yaratıcı ve sunumları çok şık. Hafta sonları yer bulmak zor olabiliyor, o yüzden rezervasyon yaptırmak şart. Patates sepeti ve bira ikilisi harika.',
      contentEn: 'Their cocktails are very creative and presentations are chic. It can be hard to find a table on weekends, so reservation is a must. The potato basket and beer combo is great.',
      approved: true,
    },
  ];

  for (const r of reviews) {
    await prisma.review.create({ data: r });
  }
  console.log('Reviews seeded.');

  // 6. Create initial gallery items
  const galleryItems = [
    { imageUrl: '/images/gallery/bar-1.jpg', category: 'Mekan' },
    { imageUrl: '/images/gallery/bar-2.jpg', category: 'Mekan' },
    { imageUrl: '/images/gallery/food-1.jpg', category: 'Yemek' },
    { imageUrl: '/images/gallery/food-2.jpg', category: 'Yemek' },
    { imageUrl: '/images/gallery/drink-1.jpg', category: 'Icecek' },
    { imageUrl: '/images/gallery/event-1.jpg', category: 'Etkinlik' },
  ];

  for (const gi of galleryItems) {
    await prisma.galleryItem.create({ data: gi });
  }
  console.log('Gallery items seeded.');

  console.log('Database seeding finished successfully!');
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
