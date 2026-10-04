# KADRAJ — Social Agency

Sosyal medya ajansı ilanı için, `creative-studio-demo` deposundan bağımsız klonlanan Türkçe konsept demo.

## Başlatma

```sh
npm install
npm run dev
```

Yerel adres: http://localhost:3031

```sh
npm run lint
npm run build
npm start -- -p 3031
```

## Deneyim

- Kullanıcının seçtiği `public/concepts/1-akis.html` fikrinden uyarlanan Akış Duvarı hero: beş eğik medya sütunu, ters yönlere akan kartlar, iki kısa video ve fare paralaksı.
- Kırık beyaz / kömür / kobalt mavi palet, büyük sans ve serif tipografi.
- Kaydırmaya bağlı GSAP zaman çizelgesi: büyüyen içerik duvarı → manifesto → yatay görsel kolaj → tam ekrana büyüyen film → hizmetler → kapanış kolajı.
- Yukarı kaydırınca geçişler tersine çalışır. Menü ve bölüm kontrolleri doğru zaman çizelgesi konumuna gider.
- Üç proje detay sayfası ve aralarında perde geçişi.
- Mobil tam ekran sahneler; kısa ekranlarda ve hareket azaltma tercihinde normal belge akışı.
- Erişilebilir modal menü, açılabilen hizmet kartları, yerel brief indirme formu.
- Ekran dışında, diğer bölüm açıkken ve sekme görünmezken hero animasyonları/video durur.

## İçerik ve bağlantılar

KADRAJ adı ve mevcut medya korunmuştur. Portföy örnekleri konsept olarak etiketlidir; gerçek müşteri sonuçları veya ödül iddiası içermez.

İletişim alanı bilgileri sunucuya göndermez. Form, tarayıcıda paylaşılabilir bir `.txt` brief oluşturup indirir. Gerçek ajans adı, e-posta adresi, sosyal hesaplar ve form servisi yayına geçmeden önce eklenmelidir.

Proje verileri: `lib/projects.ts`. Ajans hizmetleri ve scroll koreografisi: `components/ScrollExperience.tsx`.

Tasarım referansı: https://landonorris.com/ . Kullanıcının konsept dosyaları `public/concepts/` altında korunur.

## Doğrulama notu

Bu ortamda Turbopack CSS işlemcisi port açamadığı için üretim derlemesi Webpack kullanır. Üretim bağımlılıkları `npm audit --omit=dev` kontrolünden açık olmadan geçmiştir. ESLint araç zincirindeki `braces` kaynaklı geliştirme bağımlılığı uyarıları, uyumsuz sürüm düşürme yapılmadan korunmuştur.
