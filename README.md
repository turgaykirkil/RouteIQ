# RouteIQ Mobile CRM

🇺🇸 **English**
> RouteIQ is an Enterprise mobile CRM application designed for managing customer relationships and sales tracking. This application enables users to effectively manage customer information, tasks, and sales processes.

🇹🇷 **Türkçe**
> RouteIQ, müşteri ilişkilerini ve satış takibini yönetmek için tasarlanmış bir Enterprise mobil CRM uygulamasıdır. Bu uygulama, kullanıcıların müşteri bilgilerini, görevlerini ve satış süreçlerini etkili bir şekilde yönetmelerine olanak tanır.

## 🛠 Technologies Used / Kullanılan Teknolojiler

- **React Native**: Main platform for mobile app development
- **TypeScript**: Static type checking for safer and error-free code
- **Redux Toolkit**: Powerful tool for managing application state
- **React Navigation**: Library for in-app navigation
- **React Native Paper**: UI components for creating modern and dynamic user interfaces
- **@react-native-community/geolocation**: For handling location services

## ✨ Current Features / Mevcut Özellikler

### 👥 Customer Management / Müşteri Yönetimi

🇺🇸 **English**
- Detailed customer list view with search functionality
- Customer detail page
- Distance-based customer sorting
- Role-based customer access (Admin, Supervisor, Sales Rep)
- Search customers by name, company, or email
- View distance to customers with location permissions

🇹🇷 **Türkçe**
- Detaylı müşteri listesi görüntüleme ve arama
- Müşteri detay sayfası
- Mesafeye göre müşteri sıralama
- Rol tabanlı müşteri erişimi (Admin, Supervisor, Satış Temsilcisi)
- İsim, şirket veya email ile müşteri arama
- Konum izni ile müşterilere olan mesafeyi görüntüleme

### 📍 Location and Map Features / Konum ve Harita Özellikleri

🇺🇸 **English**
- Calculate customer distance based on user location
- Sort customer list by location
- Graceful location permission handling
- Distance indicator with modern UI

🇹🇷 **Türkçe**
- Kullanıcı konumuna göre müşteri mesafesi hesaplama
- Müşteri listesini konuma göre sıralama
- Zarif konum izni yönetimi
- Modern arayüzlü mesafe göstergesi

### 👤 User Management / Kullanıcı Yönetimi

🇺🇸 **English**
- Role-based access control
- User authentication
- Profile management
- Sales representative specific customer filtering

🇹🇷 **Türkçe**
- Rol tabanlı erişim kontrolü
- Kullanıcı kimlik doğrulama
- Profil yönetimi
- Satış temsilcilerine özel müşteri filtreleme

### ⚡ Performance and Security / Performans ve Güvenlik

🇺🇸 **English**
- Fast and optimized data loading
- Secure API integrations
- Error handling and logging mechanisms
- Efficient search and filtering

🇹🇷 **Türkçe**
- Hızlı ve optimize edilmiş veri yükleme
- Güvenli API entegrasyonları
- Hata yakalama ve log mekanizmaları
- Verimli arama ve filtreleme

## 🚀 Future Features / Gelecek Özellikler

### 📱 Customer Management / Müşteri Yönetimi

🇺🇸 **English**
- Customer note addition/editing system
- Detailed customer activity history
- Advanced customer segmentation
- Detailed customer performance reports
- Customer interaction tracking mechanism

🇹🇷 **Türkçe**
- Müşteri not ekleme/düzenleme sistemi
- Detaylı müşteri aktivite geçmişi
- Gelişmiş müşteri segmentasyonu
- Detaylı müşteri performans raporları
- Müşteri etkileşim takip mekanizması

### 📍 Location and Map Enhancements / Konum ve Harita Geliştirmeleri

🇺🇸 **English**
- Route optimization algorithm
- Offline map support
- Advanced location filtering features
- Weather and geographic data integration
- Real-time location sharing

🇹🇷 **Türkçe**
- Rota optimizasyonu algoritması
- Offline harita desteği
- Gelişmiş konum filtreleme özellikleri
- Hava durumu ve coğrafi veri entegrasyonu
- Gerçek zamanlı konum paylaşımı

### ⚡ Performance and Analytics / Performans ve Analitik

🇺🇸 **English**
- AI-powered sales forecasting models
- Detailed performance indicator dashboard
- Customer behavior analysis
- Automated reporting system
- Performance comparison tools

🇹🇷 **Türkçe**
- Yapay zeka destekli satış tahmin modelleri
- Detaylı performans gösterge paneli
- Müşteri davranış analizi
- Otomatik raporlama sistemi
- Performans karşılaştırmak araçları

### 📈 Integrations / Entegrasyonlar

🇺🇸 **English**
- Two-way integration with CRM systems
- Payment system integrations
- Email and messaging integration tools
- Stock management system connections
- Cloud storage solutions

🇹🇷 **Türkçe**
- CRM sistemleri ile çift yönlü entegrasyon
- Ödeme sistemleri entegrasyonu
- E-posta ve mesajlaşma entegrasyon araçları
- Stok yönetim sistemleri bağlantısı
- Bulut depolama çözümleri

### 👥 User Experience / Kullanıcı Deneyimi

🇺🇸 **English**
- Advanced dark/light mode support
- Customizable dashboard
- Multi-language support
- Advanced notification systems
- User experience improvement surveys

🇹🇷 **Türkçe**
- Koyu/açık mod gelişmiş desteği
- Özelleştirilebilir dashboard
- Çoklu dil desteği
- Gelişmiş bildirim sistemleri
- Kullanıcı deneyimi iyileştirme anketleri

## 📚 Getting Started / Başlarken

>**Note**: Before proceeding, make sure to complete the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions.

### 📊 Step 1: Start Metro Server

To start Metro, run the following command from your React Native project's root directory:

```bash
# Using npm
npm start

# OR Using Yarn
yarn start
```

### 📱 Step 2: Start Your Application

Keep Metro running in its own terminal. Open a new terminal in your React Native project's root directory and run the following command to start your Android or iOS application:

#### For Android

```bash
# Using npm
npm run android

# OR Using Yarn
yarn android
```

#### For iOS

```bash
# Using npm
npm run ios

# OR Using Yarn
yarn ios
```

These steps will help you run your application in the development environment. Follow us for future updates and new features!

## 📝 Modifying Your Application

You have successfully run and modified your application.

1. Open the `App.tsx` file in your preferred text editor and modify some lines.
2. **For Android**: Press the **R** key twice or select **"Reload"** from the **Developer Menu** (**Ctrl** + **M** on Windows and Linux or **Cmd ⌘** + **M** on macOS) to see your changes!

   **For iOS**: Press **Cmd ⌘** + **R** in your iOS simulator to see your changes!

## 🎉 Congratulations! :tada:

You have successfully run and modified your React Native application. :partying_face:

### 🤔 What's Next?

- If you want to add this new React Native code to an existing application, check out the [Integration Guide](https://reactnative.dev/docs/integration-with-existing-apps).
- To learn more about React Native, visit [React Native Getting Started](https://reactnative.dev/docs/getting-started).

# 🚨 Troubleshooting

If you can't run the application, visit the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# 📚 Learn More

For more information about React Native, check out the following resources:

- [React Native Website](https://reactnative.dev) - Learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - A general overview of setting up React Native and your environment.
- [Basic Concepts](https://reactnative.dev/docs/getting-started) - A guided tour of React Native basics.
- [Blog](https://reactnative.dev/blog) - Read the latest official React Native blog posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - React Native's open-source GitHub repository.
