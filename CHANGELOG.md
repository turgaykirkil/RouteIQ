# Changelog

## [Unreleased]

### Refactoring
- Login ve Register ekranları componentlara ayrıldı
- Müşteri listesi ekranı componentlara ayrıldı
- Görev listesi ekranı componentlara ayrıldı
- Yeni auth, müşteri ve görev componentları oluşturuldu:
  * LoginHeader.tsx: Giriş ekranı logo ve başlık komponenti
  * LoginForm.tsx: Giriş formu ve doğrulama
  * LoginFooter.tsx: Giriş ekranı alt kısım bağlantıları
  * RegisterHeader.tsx: Kayıt ekranı başlık komponenti
  * RegisterForm.tsx: Kayıt formu ve doğrulama
  * RegisterFooter.tsx: Kayıt ekranı alt kısım bağlantıları
  * CustomerListHeader.tsx: Müşteri listesi başlık komponenti
  * CustomerListSearchBar.tsx: Müşteri arama ve filtreleme komponenti
  * CustomerListContent.tsx: Müşteri listesi içerik komponenti
  * CustomerListFAB.tsx: Müşteri ekleme butonu komponenti
  * TaskListHeader.tsx: Görev listesi başlık ve arama komponenti
  * TaskListContent.tsx: Görev listesi içerik komponenti
  * TaskListFAB.tsx: Yeni görev ekleme butonu komponenti
  - Görev detay ekranı componentlara ayrıldı
- Yeni görev detay componentları oluşturuldu:
  * TaskDeleteDialog.tsx: Görev silme onay dialog komponenti
  * TaskProgressDialog.tsx: Görev ilerleme güncelleme dialog komponenti
  - Yeni görev oluşturma ekranı componentlara ayrıldı
- Yeni görev oluşturma componentları oluşturuldu:
  * NewTaskHeader.tsx: Yeni görev ekranı başlık ve menü komponenti
  * NewTaskForm.tsx: Görev başlık ve açıklama formu
  * NewTaskChecklist.tsx: Görev kontrol listesi komponenti
  * NewTaskCustomerSelect.tsx: Müşteri seçim komponenti
  * NewTaskAssigneeSelect.tsx: Atanan kişi seçim komponenti
  * NewTaskPrioritySelect.tsx: Öncelik seçim komponenti
  * NewTaskDatePicker.tsx: Tarih seçim komponenti

### Changed
- TaskDetailHeader bileşeni kaldırıldı
- TaskHeader'a menu açma özelliği eklendi
- TaskDetailScreen'den gereksiz TaskDetailHeader komponenti çıkarıldı
- TaskListHeader'dan "Tümü" butonu kaldırıldı
- Görev filtreleme mantığı geliştirildi
- Arama alanı başlık ve açıklamada çalışacak şekilde genişletildi
- Görev filtreleme mekanizması geliştirildi: aynı butona tekrar basınca filtre kaldırılacak
- Görev listesi filtre butonları ekranın ortasına hizalandı
- Görev öncelik etiketi kaldırıldı
- Görev listesi arama çubuğu modernleştirildi
- Arama çubuğu arka plan rengi ve yüksekliği güncellendi
- Arama çubuğu görsel stilleri iyileştirildi
- Müşteri listesi arama çubuğu modernleştirildi
- Müşteri listesi arama çubuğundan filtreler kaldırıldı
- Müşteri arama çubuğu görsel stilleri iyileştirildi

### Fixed
- Logo import yolu düzeltildi: `../../assets/logo.png` → `../../assets/images/logo.png`

### Improvements
- Kod okunabilirliği artırıldı
- Bileşenlerin tek sorumluluk prensibi uygulandı
- Ekran kodları sadeleştirildi

### Added
- [formatDate](cci:1://file:///Users/turgaykirkil/Documents/Applications/RouteIQ/src/utils/display.ts:7:0-28:2) fonksiyonu eklendi: Tarih biçimlendirme için yardımcı fonksiyon