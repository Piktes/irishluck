# Irish Luck Pub & Restaurant — Geliştirici Kılavuzu (CLAUDE.md)

Bu dosya, projenin mimarisini, dosya yapısını, veritabanı kurgusunu ve geliştirme komutlarını içerir. Oturumlar arası sürekliliği sağlamak için tasarlanmıştır.

## 🛠️ Proje Mimarisi & Teknoloji Stack
- **Framework:** Next.js 15 (App Router) + React 19.
- **Tasarım & Styling:** Vanilla CSS (Custom Properties ile globals.css).
- **Veritabanı & ORM:** SQLite + Prisma ORM (`prisma/schema.prisma`).
- **Güvenlik & Auth:** HTTP-only cookie tabanlı, JWT imzalı ve bcryptjs şifrelemeli custom admin koruması.
- **İkon Kütüphanesi:** Lucide React.
- **Animasyonlar:** Framer Motion (global geçişler).

---

## 📂 Dosya ve Dizin Yapısı
- `src/app/` - Next.js uygulama rotaları.
  - `[lang]/` - Dil parametresine (TR/EN) duyarlı rotalar.
    - `page.js` - Canlı web sitesi ana sayfası (Hero, Hakkımızda, Menü, Etkinlik, Galeri, Yorum, İletişim).
    - `layout.js` - Ana layout, head etiketleri ve Google Fonts bağlantıları.
    - `admin/` - Yönetim paneli dizini.
      - `login/page.js` - Yönetici giriş paneli.
      - `(dashboard)/` - Route group; korumalı admin alt sayfaları.
        - `layout.js` - JWT token'ını server-side doğrular ve sidebar arayüzünü çizer.
        - `page.js` - Dashboard anasayfa (Genel istatistikler ve hızlı yönlendirmeler).
        - `events/page.js` - Sahne programı CRUD arayüzü ve görsel yükleyici.
        - `menu/page.js` - Menü PDF dosyası yükleyici ve çift dilde açıklama editörü.
        - `gallery/page.js` - Kategori bazlı galeri yükleme ve fotoğraf silme arayüzü.
        - `reviews/page.js` - Müşteri yorumlarını onaylama, düzenleme ve silme.
        - `settings/page.js` - Telefon, WhatsApp, harita, Instagram ve çalışma saatleri bulk düzenleme.
- `src/app/api/` - API uç noktaları.
  - `auth/` - Giriş (`login/route.js`) ve çıkış (`logout/route.js`) API'leri.
  - `events/` - Canlı müzik programı CRUD endpoints (`route.js`, `[id]/route.js`).
  - `reviews/` - Müşteri yorumları CRUD endpoints (`route.js`, `[id]/route.js`).
  - `gallery/` - Galeri yönetimi endpoints (`route.js`, `[id]/route.js`).
  - `settings/` - Telefon, WhatsApp, çalışma saatleri güncelleme API'si (`route.js`).
  - `menu/` - Menü PDF ve metin güncelleyici (`route.js`).
  - `upload/` - Görsel ve PDF yüklemelerini public disk klasörlerine yazan ortak API (`route.js`).
- `src/components/` - Ana sayfada kullanılan React bileşenleri.
- `src/dictionaries/` - Çift dil JSON sözlükleri (`tr.json`, `en.json`).
- `src/lib/` - Ortak kütüphaneler.
  - `prisma.js` - Veritabanı istemcisi (`PrismaBetterSqlite3` adaptörlü).
  - `auth.js` - JWT imzalama ve doğrulama yardımcıları.
- `src/proxy.js` - Next.js yönlendiricisine bağlı yerel proxy yönlendirme motoru (Middleware yerine çalışır).

---

## 🗄️ Veritabanı Modelleri (`prisma/schema.prisma`)
1. **User:** Admin giriş bilgileri (id, username, passwordHash).
2. **Setting:** Genel ayarlar (key, valueTr, valueEn).
3. **Event:** Sahne takvimi (titleTr, titleEn, date, artist, image, descriptionTr, descriptionEn, active).
4. **Review:** Müşteri yorumları (author, rating, contentTr, contentEn, approved).
5. **GalleryItem:** Galeri fotoğrafları (imageUrl, category).
6. **MenuInfo:** Menü PDF dosya yolu ve açıklamaları (pdfUrl, descriptionTr, descriptionEn).

---

## 💻 Geliştirici Komutları

### 1. Geliştirme Sunucusunu Başlatma
```bash
npm run dev
```

### 2. Veritabanını Sıfırlama / Seed Etme
Veritabanını sıfırlamak veya varsayılan admin kullanıcısı (`admin` / `irishlucktepe`) ve örnek verileri yüklemek için:
```bash
npx prisma db push --force-accept-data-loss
node prisma/seed.js
```

### 3. Prisma İstemcisini Oluşturma
Şema değişikliklerinden sonra istemciyi güncellemek için:
```bash
npx prisma generate
```
