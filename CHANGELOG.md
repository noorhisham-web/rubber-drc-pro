# Sejarah Perubahan (Changelog)

Semua perubahan penting pada projek **RubberDRC Pro** direkodkan dalam dokumen ini mengikut format standard semantik versi (*Semantic Versioning*).

---

## [1.1.0] — 12 November 2026

### Ditambah (Added)
- **Kalkulator Tolak Berat Bekas Pintar (*Auto-Tare Weight Calculator*):**
  - Suis togol mod tolak bekas pada borang kemasukan pukal.
  - Pratetap piring timbang piawai: Piring Aluminium (10.00g), Piring Petri Kaca (18.50g), Mangkuk Dehidrasi (12.00g), dan pilihan nilai tersuai (*custom*).
  - Pengiraan berat bersih masa nyata daripada bacaan timbangan kasar terus dari penimbang.
  - Ringkasan dwi-timbangan (Jumlah Kasar & Jumlah Bersih) di bahagian kaki jadual.
- **Tolok Kualiti Visual DRC & Pengesan Anomali (*DRCGaugePill*):**
  - Meter bar kualiti mikro dengan zon sasaran hijau mengikut jenis getah LGM (*Latex 28%–42%*, *Cup Lump 50%–65%*, *Unribbed Sheet 65%–78%*).
  - Lencana status kualiti: *Normal (Piawai)*, *Rendah (Cair)*, *Tinggi*, dan *Ekstrem*.
  - Tooltip interaktif memaparkan penerangan saintifik bagi setiap sampel.
  - Pengesan sampel luar biasa (*outlier detection banner*) dalam paparan perincian batch bagi membantu Supervisor menyemak anomali sebelum meluluskan.
  - Penunjuk anomali pada senarai jadual Dashboard.
- **Garisan Audit Dokumen (*Status Pipeline Stepper*):**
  - Penunjuk visual 3-langkah (1. Penyediaan Batch $\rightarrow$ 2. Semakan Supervisor $\rightarrow$ 3. Keputusan Kelulusan) lengkap dengan avatar, cap masa rasmi, dan ulasan penolakan.
- **Dokumentasi Terperinci GitHub:**
  - `README.md` utama mesra orang awam.
  - `docs/PANDUAN-PENGGUNA.md` panduan lengkap operasi staf dan penyelia.
  - `docs/KEPERLUAN-PRODUK.md` spesifikasi PRD v1.0 dan peraturan perniagaan.
  - `docs/STATUS-DAN-ROADMAP.md` status ciri semasa dan pelan Fasa 2.
  - `docs/DATA-DAN-PRIVASI.md` jaminan privasi dan storan data tempatan.
  - `docs/SETUP-DAN-PENYELENGGARAAN.md` panduan pemasangan teknikal pembangun.

---

## [1.0.0] — 12 November 2026

### Ditambah (Added)
- **Pembangunan Teras Prototaip Berdasarkan PRD v1.0:**
  - Penukar Peranan Pantas (*Role Switcher*) di bar navigasi untuk *Staf Makmal*, *Supervisor*, dan *Pegawai*.
  - Papan Pemuka (*Dashboard*) dengan 4 kad metrik statistik makmal, carian kata kunci pantas, dan penapis status/tarikh.
  - Borang Jadual Kemasukan Pukal (*Bulk Batch Entry Table*) mesra kekunci `Tab` dengan sokongan tambah 1 baris atau 5 baris serentak.
  - Formula DRC automatik masa nyata: $\text{DRC (\%)} = (\text{Kering} / \text{Basah}) \times 100$.
  - Penguatkuasaan Peraturan Perniagaan:
    - **BR-01:** Menyekat Berat Kering melebihi Berat Basah.
    - **BR-02:** Menyekat nombor sampel pendua dalam batch yang sama.
    - **BR-03:** Mengunci rekod daripada disunting selepas dihantar atau diluluskan.
    - **BR-04:** Mewajibkan ulasan pembetulan penolakan (minima 5 aksara) bagi tindakan *Reject*.
    - **BR-05:** Mengabaikan baris kosong secara automatik semasa penghantaran.
  - Modul **Simulasi Email Outbox** dua panel untuk meninjau emel notifikasi penghantaran, penolakan, dan laporan kelulusan rasmi.
  - Fungsi **Eksport CSV** berpengekodan UTF-8 BOM untuk keserasian sempurna dengan Microsoft Excel.
  - Fungsi **Cetak Sijil Analisis Makmal / PDF** berformat A4 bersih melalui `@media print`.
  - Servis Storan Tempatan Modular (`storageService.ts` dan `emailService.ts`) menggunakan `localStorage` dengan 3 set data demo rujukan (Approved, Pending, Rejected) dan butang *Reset Demo Data*.
