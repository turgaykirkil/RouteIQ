# RouteIQ Mobile CRM

RouteIQ, müşteri ilişkilerini ve satış takibini yönetmek için tasarlanmış bir Enterprise mobil CRM uygulamasıdır. Bu uygulama, kullanıcıların müşteri bilgilerini, görevlerini ve satış süreçlerini etkili bir şekilde yönetmelerine olanak tanır.

## Kullanılan Teknolojiler
- **React Native**: Mobil uygulama geliştirme için kullanılan ana platform.
- **TypeScript**: Daha güvenli ve hatasız kod yazmayı sağlayan statik tip kontrolü.
- **Redux Toolkit**: Uygulama durumunu yönetmek için kullanılan güçlü bir araç.
- **React Navigation**: Uygulama içinde gezinti yapmayı sağlayan kütüphane.
- **React Native Paper**: Modern ve dinamik kullanıcı arayüzleri oluşturmak için kullanılan UI bileşenleri.

## Yaklaşımlar
- **Dinamik Tema Kullanımı**: Kullanıcı arayüzünün dinamik olarak tema değiştirmesine olanak tanır.
- **Güvenli Veri İşleme**: Seri hale getirilemeyen değerlerle ilgili sorunları önlemek için güvenli veri işleme yöntemleri.
- **Modüler Mimari**: Kodun daha yönetilebilir ve sürdürülebilir olmasını sağlar.

## Mevcut Özellikler

### Müşteri Yönetimi
- Detaylı müşteri listesi görüntüleme
- Müşteri detay sayfası
- Müşterileri konuma göre sıralama
- Rol bazlı müşteri erişimi

### Konum ve Harita Özellikleri
- Kullanıcı konumuna göre müşteri mesafesi hesaplama
- Müşteri listesini konuma göre sıralama
- Konum izinleri yönetimi

### Kullanıcı Yönetimi
- Rol tabanlı erişim kontrolü
- Kullanıcı kimlik doğrulama
- Profil yönetimi

### Performans ve Güvenlik
- Hızlı ve optimize edilmiş veri yükleme
- Güvenli API entegrasyonları
- Hata yakalama ve log mekanizmaları

## Gelecek Özellikler

### Müşteri Yönetimi
- Müşteri not ekleme/düzenleme sistemi
- Müşteri aktivite geçmişi detaylandırma
- Gelişmiş müşteri segmentasyonu
- Detaylı müşteri performans raporları
- Müşteri etkileşim takip mekanizması

### Konum ve Harita Geliştirmeleri
- Rota optimizasyonu algoritması
- Offline harita desteği
- Gelişmiş konum filtreleme özellikleri
- Hava durumu ve coğrafi veri entegrasyonu
- Gerçek zamanlı konum paylaşımı

### Performans ve Analitik
- Yapay zeka destekli satış tahmin modelleri
- Detaylı performans gösterge paneli
- Müşteri davranış analizi
- Otomatik raporlama sistemi
- Performans karşılaştırmak araçları

### Entegrasyonlar
- CRM sistemleri ile çift yönlü entegrasyon
- Ödeme sistemleri entegrasyonu
- E-posta ve mesajlaşma entegrasyon araçları
- Stok yönetim sistemleri bağlantısı
- Bulut depolama çözümleri

### Kullanıcı Deneyimi
- Koyu/açık mod gelişmiş desteği
- Özelleştirilebilir dashboard
- Çoklu dil desteği
- Gelişmiş bildirim sistemleri
- Kullanıcı deneyimi iyileştirme anketleri

## Başlarken

>**Not**: Devam etmeden önce [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) talimatlarını tamamladığınızdan emin olun.

### Adım 1: Metro Sunucusunu Başlatın

Metro'yu başlatmak için, React Native projenizin kök dizininden aşağıdaki komutu çalıştırın:

```bash
# npm kullanarak
npm start

# YA DA Yarn kullanarak
yarn start
```

### Adım 2: Uygulamanızı Başlatın

Metro Bundler kendi terminalinde çalışmaya devam etsin. React Native projenizin kök dizininden yeni bir terminal açın ve aşağıdaki komutu çalıştırarak Android veya iOS uygulamanızı başlatın:

#### Android için

```bash
# npm kullanarak
npm run android

# YA DA Yarn kullanarak
yarn android
```

#### iOS için

```bash
# npm kullanarak
npm run ios

# YA DA Yarn kullanarak
yarn ios
```

Bu adımlar, uygulamanızı geliştirme ortamında çalıştırmanıza yardımcı olacaktır. Gelecekteki güncellemeler ve yeni özellikler için bizi takip edin!

## Uygulamanızı Değiştirme

Artık uygulamanızı başarıyla çalıştırdınız ve değiştirmeye hazırsınız.

1. `App.tsx` dosyasını tercih ettiğiniz metin düzenleyicisinde açın ve bazı satırları düzenleyin.
2. **Android için**: Değişikliklerinizi görmek için <kbd>R</kbd> tuşuna iki kez basın veya **Geliştirici Menüsü**nden (**Ctrl** + **M** (Windows ve Linux'ta) veya **Cmd ⌘** + **M** (macOS'ta)) **"Yenile"**yi seçin!

   **iOS için**: Değişikliklerinizi görmek için iOS simülatörünüzde **Cmd ⌘** + **R** tuşlarına basın!

## Tebrikler! :tada:

Başarıyla React Native uygulamanızı çalıştırdınız ve değiştirdiniz. :partying_face:

### Şimdi ne yapmalı?

- Mevcut bir uygulamaya bu yeni React Native kodunu eklemek istiyorsanız, [Entegrasyon Kılavuzu](https://reactnative.dev/docs/integration-with-existing-apps)'nu inceleyin.
- React Native hakkında daha fazla bilgi edinmek istiyorsanız, [React Native Giriş](https://reactnative.dev/docs/getting-started)'e bakın.

# Sorun Giderme

Uygulamayı çalıştıramıyorsanız, [Sorun Giderme](https://reactnative.dev/docs/troubleshooting) sayfasını ziyaret edin.

# Daha Fazla Bilgi Edinin

React Native hakkında daha fazla bilgi edinmek için aşağıdaki kaynaklara bakın:

- [React Native Web Sitesi](https://reactnative.dev) - React Native hakkında daha fazla bilgi edinin.
- [Başlarken](https://reactnative.dev/docs/environment-setup) - React Native ve ortamınızı kurma hakkında genel bir bakış.
- [Temel Bilgiler](https://reactnative.dev/docs/getting-started) - React Native temel bilgilerine yönelik rehberli bir tur.
- [Blog](https://reactnative.dev/blog) - En son resmi React Native blog gönderilerini okuyun.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - React Native'nin açık kaynak GitHub deposu.
