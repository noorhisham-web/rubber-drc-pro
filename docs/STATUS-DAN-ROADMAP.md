# Status Pembangunan & Perancangan (Roadmap)

Dokumen ini merekodkan status sebenar ciri-ciri sistem **RubberDRC Pro**, perkara yang telah disahkan melalui ujian, isu atau batasan yang diketahui, serta pelan hala tuju pembangunan masa hadapan.

---

## 1. Status Ciri-Ciri Semasa (Fasa 1 Prototype)

### A. Siap Dibina & Telah Diuji (Verified)
- [x] **Pengiraan DRC Automatik Masa Nyata:** Mengira peratusan DRC secara tepat berasaskan formula standard LGM.
- [x] **Papan Pemuka (Dashboard):** Kad statistik keseluruhan (Jumlah Batch, Pending, Approved, Purata DRC), penapis status, penapis tarikh, dan carian kata kunci pantas.
- [x] **Kemasukan Data Pukal (Bulk Batch Entry):** Borang input berjadual dengan navigasi kekunci `Tab`, butang tambah pantas (+1 baris, +5 baris), dan pemadaman baris.
- [x] **Kalkulator Tolak Berat Bekas (Auto-Tare):** Menyokong pratetap Piring Aluminium (10g), Piring Petri (18.5g), Mangkuk (12g), dan berat tersuai (*custom*), memaparkan berat bersih dan mengira DRC terus dari timbangan kasar.
- [x] **Tolok Kualiti DRC Visual (DRC Gauge Pill):** Penunjuk visual berkod warna (*Normal, Rendah, Tinggi, Ekstrem*) berasaskan julat piawai industri getah (Latex 28%–42%, Cup Lump 50%–65%, Unribbed Sheet 65%–78%).
- [x] **Pengesanan Anomali (Outlier Detection):** Menandakan sampel yang berada di luar julat biasa untuk semakan segera oleh pihak Supervisor sebelum meluluskan batch.
- [x] **Aliran Semakan & Kelulusan Supervisor:** Aliran *Approve* (mengunci rekod audit) dan aliran *Reject* (dengan ulasan penolakan wajib).
- [x] **Garisan Audit Dokumen (Status Pipeline Stepper):** Petunjuk langkah demi langkah kemajuan kitaran hidup dokumen makmal.
- [x] **Simulasi Email Outbox:** Penjanaan rekod notifikasi automatik dengan *snapshot* jadual sampel dan ulasan penyelia.
- [x] **Eksport Fail CSV:** Fail `.csv` dengan pengekodan UTF-8 BOM yang serasi dengan Microsoft Excel tanpa herotan aksara.
- [x] **Cetak Sijil Analisis DRC (PDF):** Format cetakan rasmi A4 yang menyembunyikan navigasi web secara automatik melalui `@media print`.
- [x] **Penukar Peranan Pantas (Role Switcher):** Suis satu-klik antara *Staf Makmal*, *Supervisor*, dan *Pegawai*.
- [x] **Penyimpanan Tempatan & Data Contoh:** Storan `localStorage` modular dengan butang *Reset Demo Data* yang menyediakan 3 batch contoh (1 Approved, 1 Pending, 1 Rejected).

---

## 2. Perkara yang Belum Disahkan / Batasan Semasa

1. **Perkongsian Data Antara Peranti Berbeza:**
   - *Status Semasa:* Data hanya disimpan dalam memori pelayar web peranti semasa (*Browser localStorage*). Perubahan data pada satu komputer tidak akan kelihatan secara langsung pada komputer lain.
   - *Penyelesaian Semasa:* Data boleh dipindahkan menggunakan eksport CSV untuk perkongsian fail pejabat.
2. **Penghantaran Emel Sebenar:**
   - *Status Semasa:* Notifikasi emel dijana dan dipaparkan dalam modul *Email Outbox* dalam aplikasi untuk tujuan demonstrasi aliran kerja. Emel tidak dihantar ke peti masuk emel peribadi/organisasi sebenar.
3. **Penyambungan Perkakasan Penimbang Digital:**
   - *Status Semasa:* Angka timbangan perlu ditaip oleh juruanalisis menggunakan papan kekunci. Sistem belum bersambung secara perkakasan (*hardware integration*) ke pangkalan kabel penimbang digital.

---

## 3. Isu Diketahui (*Known Issues*)

- **Pembersihan Cache Pelayar (*Browser Cache Clearance*):** Sekiranya pengguna membersihkan *site data / cookies* pelayar, data ujian tempatan akan dipadamkan. Pengguna boleh klik butang *"Reset Data Contoh"* untuk memulihkan set data rujukan makmal.
- **Had Paparan Skrin Sangat Kecil (< 360px):** Aplikasi dioptimumkan untuk skrin mudah alih selebar 360px ke atas. Pada skrin yang lebih sempit daripada 360px, beberapa jadual mungkin memerlukan skrol mendatar ringkas.

---

## 4. Perancangan Pembangunan Masa Hadapan (Roadmap Fasa 2)

Perancangan ini dirangka untuk pelaksanaan apabila prototaip Fasa 1 telah diluluskan sepenuhnya oleh pihak berkepentingan:

### Peringkat 1: Pangkalan Data Awan Berpusat (*Cloud Database*)
- Menghubungkan aplikasi ke pangkalan data hubungan awan (contoh: *PostgreSQL* atau *Firebase Firestore*).
- Membolehkan Staf Makmal menaip di komputer meja makmal, manakala Supervisor boleh meluluskan dari telefon pintar mereka secara serentak di mana sahaja.

### Peringkat 2: Pengesahan Pengguna Sebenar (*User Authentication & RBAC*)
- Melaksanakan sistem log masuk rasmi menggunakan emel dan kata laluan atau integrasi *Single Sign-On (SSO)* organisasi (contohnya akaun emel rasmi agensi).
- Menggantikan *Role Switcher* prototaip dengan kawalan keselamatan berasaskan sesi sebenar (*Real Session Management*).

### Peringkat 3: Integrasi Perkhidmatan Emel Sebenar (*Live Email Delivery*)
- Menyambungkan sistem ke pelayan *SMTP* atau *Email API* (seperti Resend / SendGrid).
- Menghantar notifikasi emel sebenar ke peti masuk pegawai berserta lampiran fail PDF sijil analisis secara automatik apabila batch diluluskan.

### Peringkat 4: Mod Luar Talian & Integrasi Penimbang (*Offline PWA & Scale Hardware*)
- Membina keupayaan *Progressive Web App (PWA)* supaya makmal di pedalaman yang mengalami masalah capaian internet masih boleh merekod sampel tanpa terputus perkhidmatan.
- Kajian integrasi perkakasan penimbang melalui *Web Bluetooth API* atau *Web Serial API* untuk membaca gram secara automatik daripada mesin penimbang digital.
