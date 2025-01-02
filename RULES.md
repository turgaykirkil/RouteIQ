# RouteIQ Geliştirme Kuralları ve Yönergeleri

## 🌐 Genel Prensipler
1. Türkçe iletişim ve dokümantasyon
2. Temiz, okunabilir ve sürdürülebilir kod
3. Performans ve güvenlik odaklı geliştirme

## 📦 Paket Yönetimi
1. Paket seçiminde kararlı ve güvenilir sürümler tercih edilir
2. Gereksiz bağımlılıklardan kaçınılır
3. Paket güncellemeleri düzenli ve kontrollü yapılır

## 🛠️ Kod Geliştirme Standartları
- TypeScript kullanımı zorunludur
- ESLint ve Prettier konfigürasyonlarına uyulmalıdır
- Birim testler yazılmalıdır

## 🔒 Güvenlik Kuralları
- Hassas bilgiler asla kodda açık şekilde tutulmamalı
- .env dosyaları ile gizli bilgiler yönetilmelidir
- Kullanıcı verileri şifrelenmelidir

## 🌍 API ve Servis Yönetimi
- Statik IP yerine dinamik IP çözümleri tercih edilir
- Interceptor'lar ile merkezi hata yönetimi
- Tutarlı ve güvenli token yönetimi

## 📝 Dokümantasyon
- Tüm fonksiyonlar ve sınıflar açıklanmalı
- README ve RULES dosyaları güncel tutulmalı
- Kod içi yorumlar net ve açıklayıcı olmalı

## 🤝 İş Birliği ve Versiyon Kontrolü
- Git Flow stratejisi kullanılır
- Anlamlı commit mesajları yazılır
- Pull Request'ler detaylı incelenir

## 🚀 Performans İyileştirmeleri
- Gereksiz render'lardan kaçınılmalı
- Performans optimizasyonları düzenli yapılmalı
- Hafıza ve CPU kullanımı izlenmelidir

## 🔍 Hata Yönetimi
- Merkezi hata yakalama mekanizmaları
- Kullanıcı dostu hata mesajları
- Hata loglaması ve raporlama
