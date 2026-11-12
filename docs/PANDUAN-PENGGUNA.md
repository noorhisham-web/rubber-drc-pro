# Panduan Pengguna RubberDRC Pro

Dokumen ini menyediakan panduan langkah demi langkah cara menggunakan sistem **RubberDRC Pro** untuk operasi pengujian dan kelulusan *Dry Rubber Content* (DRC).

---

## 📑 Isi Kandungan

1. [Pengenalan Peranan Pengguna](#1-pengenalan-peranan-pengguna)
2. [Panduan untuk Staf Makmal (Kemasukan Data Pukal)](#2-panduan-untuk-staf-makmal)
3. [Panduan untuk Supervisor (Semakan & Kelulusan)](#3-panduan-untuk-supervisor)
4. [Panduan untuk Pegawai (Eksport & Cetakan Sijil)](#4-panduan-untuk-pegawai)
5. [Maksud Status & Lencana Sistem](#5-maksud-status--lencana-sistem)
6. [Penyelesaian Masalah Biasa (*Troubleshooting*)](#6-penyelesaian-masalah-biasa)

---

## 1. Pengenalan Peranan Pengguna

Di bahagian atas kanan bar navigasi terdapat **Penukar Peranan (*Role Switcher*)**. Anda boleh menukar peranan pada bila-bila masa untuk menguji kebenaran akses:

- 🧪 **Staf Makmal:** Dibenarkan mencipta batch baharu, memasukkan data pukal, menyimpan draft, dan membetulkan batch yang ditolak.
- 👔 **Supervisor:** Dibenarkan menyemak bacaan timbangan, meneliti sampel luar julat piawai, meluluskan (*Approve*) atau menolak (*Reject*) berserta ulasan pembetulan.
- 📊 **Pegawai:** Dikhaskan untuk melihat laporan rasmi yang telah diluluskan dan mengeksport data ke fail CSV atau PDF.

---

## 2. Panduan untuk Staf Makmal

### A. Mencipta Batch Baharu
1. Pastikan peranan aktif ialah **Staf Makmal**.
2. Klik butang **"+ Input Batch Baharu"** pada bar navigasi atau di papan pemuka (*Dashboard*).
3. **Maklumat Kumpulan Sampel (*Batch Header*):**
   - **No. Batch / Kod Lot:** Dijana automatik mengikut format tarikh hari ini (contoh: `BATCH-20261112-01`). Anda boleh meminda kod ini jika makmal mempunyai sistem penomboran sendiri.
   - **Tarikh Ujian Makmal:** Tarikh sampel diambil dan dikeringkan.
   - **Nama Operator:** Nama staf yang bertanggungjawab menjalankan ujian.

### B. Menggunakan Kalkulator Tolak Berat Bekas (*Auto-Tare*)
Sekiranya sampel getah ditimbang di dalam piring atau mangkuk:
1. Hidupkan suis **"Kalkulator Tolak Berat Bekas (Auto-Tare Weight Mode)"**.
2. Pilih jenis bekas yang digunakan:
   - **Piring Aluminium (10.00g)**
   - **Piring Petri Kaca (18.50g)**
   - **Mangkuk Dehidrasi (12.00g)**
   - **Tersuai (*Custom*):** Masukkan berat bekas mengikut timbangan makmal anda.
3. Semasa memasukkan bacaan ke dalam jadual, masukkan **bacaan timbangan kasar (*gross weight*)** terus daripada alat penimbang.
4. Sistem akan menolak berat bekas secara automatik dan memaparkan berat bersih di bawah kotak input (contoh: Kasar `110.00g` $\rightarrow$ Bersih `100.00g`).

### C. Mengisi Jadual Sampel Secara Pantas
- Tekan kekunci `Tab` untuk bergerak ke sel seterusnya (No. Sampel $\rightarrow$ Pembekal $\rightarrow$ Jenis Getah $\rightarrow$ Berat Basah $\rightarrow$ Berat Kering).
- Klik butang **"+1 Baris"** atau **"+5 Baris Sekaligus"** untuk menambah ruang sampel mengikut keperluan sesi ujian.
- **Cadangan Pembekal (*Autocomplete*):** Semasa menaip nama pembekal, sistem akan menyenaraikan nama pembekal yang pernah direkodkan sebelum ini.
- **Tolok Kualiti DRC:** Setiap kali nombor berat dimasukkan, nilai peratusan DRC dikira secara langsung berserta penunjuk kualiti (Normal, Rendah, Tinggi, atau Ekstrem).

### D. Menyimpan Draft atau Menghantar untuk Kelulusan
- **Simpan Draft:** Gunakan pilihan ini jika proses timbangan belum selesai sepenuhnya atau ketuhar pengeringan masih berjalan.
- **Hantar untuk Kelulusan:** Setelah semua baris lengkap, klik butang ini. Sistem akan menyemak integriti data:
  - Memastikan Berat Kering tidak melebihi Berat Basah.
  - Memastikan tiada No. Sampel yang bertindih (*duplicate*).
  - Mengabaikan baris kosong yang tidak digunakan secara automatik.
- Setelah berjaya dihantar, status batch akan bertukar kepada **Menunggu Kelulusan (*Pending Approval*)** dan notifikasi simulasi dihantar kepada Supervisor.

### E. Membetulkan Batch yang Ditolak (*Resubmission*)
1. Jika Supervisor menolak sesuatu batch, statusnya akan bertukar kepada **Ditolak (*Rejected*)**.
2. Buka batch tersebut. Anda akan melihat **kotak amaran merah** yang memaparkan ulasan penyelia mengenai sampel mana yang perlu dibetulkan (contoh: *"Sampel SMP-23 bacaan kering meragukan"*).
3. Klik **"Buka Mod Suntingan untuk Betulkan & Resubmit"**.
4. Betulkan nombor timbangan yang berkaitan.
5. Klik **"Hantar Semula (Resubmit)"**. Status akan kembali kepada *Pending Approval*.

---

## 3. Panduan untuk Supervisor

### A. Menyemak Batch yang Masuk
1. Tukar peranan kepada **Supervisor**.
2. Di bar atas, anda akan melihat penunjuk bilangan batch yang menunggu tindakan anda (contoh: *"1 menunggu kelulusan anda"*).
3. Pada senarai Dashboard, batch yang memerlukan tindakan ditandakan dengan status **Menunggu Kelulusan**. Klik **"Semak"** atau ikon mata.

### B. Menilai Kualiti & Mengesan Bacaan Luar Biasa (*Outliers*)
- Sistem menyediakan banner **Penilaian Kualiti (*Quality Assessment*)**:
  - 🟢 **Semua Sampel Normal:** Menandakan semua bacaan mematuhi julat standard LGM (*Latex 28%–42%*, *Cup Lump 50%–65%*).
  - 🟡 **Anomali Dikesan:** Memaklumkan bilangan sampel yang mencatatkan bacaan luar biasa. Periksa baris yang bertanda *Rendah* atau *Ekstrem*.

### C. Membuat Keputusan
- **Laluan 1 — Luluskan (*Approve*):**
  - Jika data tepat, klik **"Approve Batch"**.
  - Masukkan catatan pilihan jika perlu (contoh: *"Data timbangan disahkan mematuhi SOP"*).
  - Klik **"Sahkan & Luluskan"**. Rekod akan dikunci daripada sebarang suntingan dan emel laporan rasmi dijana kepada Pegawai.
- **Laluan 2 — Tolak (*Reject*):**
  - Jika terdapat keraguan (contohnya peratusan getah terlalu tinggi kerana belum kering sepenuhnya), klik **"Reject Batch"**.
  - **Wajib:** Isi ruangan **Catatan Pembetulan** (minimum 5 aksara) supaya staf makmal tahu sampel mana yang perlu ditimbang semula.
  - Klik **"Tolak Batch Ini"**.

---

## 4. Panduan untuk Pegawai

### A. Melihat Laporan Rasmi yang Diluluskan
1. Tukar peranan kepada **Pegawai**.
2. Pada bar penapis, pilih status **Diluluskan (*Approved*)**.
3. Klik pada mana-mana batch untuk melihat ringkasan penuh purata DRC, jumlah berat basah/kering, dan perincian setiap pembekal.

### B. Memuat Turun Data ke Excel (CSV)
1. Klik butang **"Eksport CSV"** sama ada dari senarai Dashboard atau dari dalam paparan perincian batch.
2. Fail `.csv` akan dimuat turun serta-merta ke komputer anda.
3. Fail ini telah diformat menggunakan *UTF-8 with BOM* supaya apabila dibuka dalam Microsoft Excel, semua aksara Bahasa Melayu dan nombor perpuluhan tersusun rapi dalam lajur yang betul tanpa ralat paparan.

### C. Mencetak Sijil Keputusan Analisis DRC (PDF)
1. Klik butang **"Cetak / PDF"**.
2. Dialog cetakan pelayar akan dibuka secara automatik.
3. **Format Bersih Sedia Cetak:**
   - Semua elemen antaramuka web (seperti bar navigasi, butang, dan penukar peranan) disembunyikan secara automatik.
   - Yang dipaparkan hanyalah kepala surat rasmi (*Lembaga Getah Malaysia — Pusat Pengumpulan & Makmal Analisis Getah*), jadual sampel, rumusan DRC, dan ruangan tandatangan rasmi bagi Juruanalisis, Penyelia, dan Pegawai.
4. Pada tetapan pencetak pelayar, pilih destinasi: **"Save as PDF"** untuk menyimpan dokumen digital atau hantar terus ke mesin pencetak.

---

## 5. Maksud Status & Lencana Sistem

| Status / Lencana | Warna Visual | Maksud & Tindakan |
| :--- | :--- | :--- |
| **Draft** | Kelabu Neutral | Batch masih dalam proses pengisian oleh staf makmal. Belum dihantar untuk semakan. |
| **Menunggu Kelulusan (*Pending*)** | Kuning Ambar | Batch telah dihantar oleh staf. Menunggu semakan dan pengesahan oleh Supervisor. |
| **Ditolak (*Rejected*)** | Merah Mawar | Batch telah disemak oleh Supervisor dan ditolak kerana ralat. Memerlukan pembetulan oleh staf sebelum dihantar semula. |
| **Diluluskan (*Approved*)** | Hijau Zamrud | Batch telah disahkan rasmi. Rekod dikunci daripada sebarang pindaan bagi mengekalkan integriti audit. Sedia untuk arkib dan perakaunan. |

---

## 6. Penyelesaian Masalah Biasa (*Troubleshooting*)

### Masalah 1: Mesej "Ralat: Berat Kering tidak boleh melebihi Berat Basah"
- **Punca:** Semasa pengeringan di dalam ketuhar (*oven*), air dan cecair serum akan tersejat. Oleh itu, berat kering secara fizikalnya tidak mungkin lebih berat daripada berat basah awal.
- **Penyelesaian:** Semak semula bacaan timbangan sampel tersebut pada buku catatan atau penimbang. Pastikan anda tidak tertukar antara ruangan berat basah dan berat kering.

### Masalah 2: Mesej "Timbangan kasar mesti melebihi berat bekas"
- **Punca:** Mod tolak bekas (*Auto-Tare*) sedang aktif (contohnya piring 10.00g), tetapi angka timbangan yang ditaip adalah sama atau kurang daripada 10.00g.
- **Penyelesaian:** Masukkan berat kasar (berat piring bersama getah). Jika anda hanya menimbang getah bersih tanpa piring, matikan suis mod bekas di bahagian atas.

### Masalah 3: Mesej "No. Sampel telah wujud dalam batch ini"
- **Punca:** Peraturan sistem menetapkan setiap sampel dalam satu batch mestilah mempunyai nombor rujukan lot yang unik bagi mengelakkan percampuran data.
- **Penyelesaian:** Gunakan nombor kod lot yang berbeza bagi setiap baris sampel (contoh: `SMP-01`, `SMP-02`).

### Masalah 4: Data hilang selepas membersihkan sejarah pelayar (*browser cache*)
- **Punca:** Dalam Fasa 1 Prototype ini, data disimpan di dalam storan tempatan komputer anda (*localStorage*). Sekiranya anda memilih pilihan *Clear Browsing Data / Cookies*, storan ini akan dikosongkan.
- **Penyelesaian:** Klik butang **"Reset Data Contoh"** di bahagian atas kanan untuk memuatkan semula set data contoh asal makmal. Untuk simpanan kekal jangka panjang, pastikan anda mengeksport data batch yang penting ke fail CSV atau mencetaknya ke fail PDF.
