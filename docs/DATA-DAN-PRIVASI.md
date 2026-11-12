# Data & Privasi — RubberDRC Pro

Dokumen ini menerangkan pengendalian data, kaedah penyimpanan, dan dasar privasi bagi aplikasi **RubberDRC Pro** berdasarkan pelaksanaan teknikal sebenar sistem.

---

## 1. Data yang Dikumpulkan oleh Aplikasi

Aplikasi ini hanya mengendalikan data operasi makmal bagi pengujian getah, merangkumi:

1. **Maklumat Kumpulan Sampel (Batch Data):**
   - Kod rujukan batch (contoh: `BATCH-20261112-01`).
   - Tarikh ujian makmal dijalankan.
   - Nama operator / staf makmal yang memasukkan data.
   - Status kelulusan semasa (*Draft, Pending Approval, Rejected, Approved*).
   - Catatan teguran atau ulasan daripada Supervisor.
   - Cap masa (*timestamp*) penciptaan, pengemaskinian, dan kelulusan batch.
2. **Data Sampel Individu:**
   - Nombor rujukan sampel atau kod lot.
   - Nama pembekal, pekebun kecil, atau ladang/estet.
   - Jenis getah (*Latex, Cup Lump, Unribbed Sheet, Lain-lain*).
   - Berat basah sampel (dalam unit gram).
   - Berat kering sampel (dalam unit gram).
   - Nilai peratusan DRC yang dikira.
3. **Data Log Emel Simulasi:**
   - Rekod subjek emel, penerima sasaran (*Supervisor, Staf, Pegawai*), dan salinan ringkasan ujian bagi setiap peristiwa kelulusan.

---

## 2. Di Mana Data Disimpan?

- **Storan Tempatan Pelayar Sahaja (Browser localStorage):**
  Dalam Fasa 1 Prototype ini, semua data disimpan sepenuhnya di dalam peranti pelayar pengguna menggunakan storan tempatan (`localStorage`). Kunci storan yang digunakan ialah:
  - `rubber_drc_batches_v1` — Menyimpan senarai semua rekod batch dan sampel.
  - `rubber_drc_emails_v1` — Menyimpan log emel simulasi.
  - `rubber_drc_active_role_v1` — Menyimpan pilihan peranan pengguna semasa.
- **Tiada Pangkalan Data Luar:** Data **TIDAK** dihantar atau disimpan di mana-mana pelayan luaran, pangkalan data pihak ketiga, atau storan awan komersial pada fasa ini.

---

## 3. Adakah Data Dihantar kepada Model AI atau Perkhidmatan Pihak Ketiga?

- **Sifar Penghantaran Data ke Model AI:** Walaupun aplikasi dibangunkan di dalam persekitaran Google AI Studio, keseluruhan proses pengiraan DRC dan logik perniagaan dilaksanakan secara matematik deterministik di bahagian klien (*client-side JavaScript/TypeScript*). Tiada data timbangan, nama pembekal, atau ulasan yang dihantar kepada mana-mana model bahasa besar (*LLM*) atau API kecerdasan buatan.
- **Tiada Penjejak / Analisis Pihak Ketiga (*No Third-Party Trackers*):** Sistem tidak memasang sebarang kod penjejak iklan, kuki analitis komersial (*telemetry*), atau skrip pemantauan tingkah laku pengguna.

---

## 4. Kawalan Akses & Keselamatan Data Semasa

- **Akses Pada Fasa 1:** Memandangkan data berada di dalam `localStorage` pelayar, sesiapa yang menggunakan profil pelayar komputer yang sama boleh melihat dan mengurus rekod tersebut. Penukar peranan (*Role Switcher*) berfungsi sebagai simulasi kawalan hak akses untuk pengujian aliran kerja pengguna.
- **Peralihan ke Fasa 2:** Apabila berpindah ke pangkalan data awan berpusat kelak, kawalan akses keselamatan sebenar (*Role-Based Access Control - RBAC*) berserta penyulitan data dalam transit (*HTTPS/TLS*) dan penyulitan data pegun (*Encryption at Rest*) akan dilaksanakan.

---

## 5. Cara Memadam Data

Pengguna mempunyai kawalan penuh untuk memadamkan data pada bila-bila masa:

1. **Memadam Draf Batch Tertentu:**
   - Log masuk sebagai *Staf Makmal*.
   - Klik ikon tong sampah pada mana-mana batch berstatus *Draft* di Dashboard.
2. **Memulihkan Set Data Contoh Asal:**
   - Klik butang **"Reset Data Contoh"** di bahagian atas bar navigasi. Tindakan ini akan memadam rekod baharu dan memulihkan 3 batch contoh rujukan.
3. **Mengosongkan Semua Data Pelayar Sepenuhnya:**
   - Buka tetapan pelayar anda (*Browser Settings* $\rightarrow$ *Privacy and Security* $\rightarrow$ *Site Settings / Clear Data*).
   - Pilih untuk memadam *Local Storage / Cookies* bagi laman ini. Semua rekod akan dibersihkan serta-merta.

---

## 6. Nota Pematuhan Perundangan

Aplikasi ini pada masa ini berada pada tahap prototaip berfungsi (*Functional Prototype*). Sebarang pensijilan rasmi pematuhan perundangan perlindungan data (seperti Akta Perlindungan Data Peribadi / PDPA) atau piawaian keselamatan maklumat ISO perlu disahkan dan diaudit secara berasingan oleh pihak berkuasa keselamatan ICT organisasi apabila sistem disambungkan ke pangkalan data awan sebenar pada Fasa 2 kelak.
