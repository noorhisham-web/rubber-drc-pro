# RubberDRC Pro — Sistem Pengiraan & Kelulusan Dry Rubber Content

Aplikasi web pengurusan dan pengiraan automatik **Dry Rubber Content (DRC)** untuk makmal analisis dan pusat pengumpulan getah, lengkap dengan fungsi timbangan pantas, semakan kualiti, dan aliran kelulusan rasmi.

---

## 📌 Pengenalan Ringkas

Dalam industri getah, penentuan peratusan **Dry Rubber Content (DRC)** atau **Kandungan Getah Kering** adalah langkah paling penting untuk menentukan kualiti susu getah (*latex*) dan getah beku (*cup lump*) sebelum bayaran kepada pekebun dibuat.

**RubberDRC Pro** menggantikan amalan lama mencatat timbangan di atas buku log kertas dan menyalinnya semula ke dalam komputer secara berasingan. Dengan sistem ini, pengiraan berlaku secara serta-merta semasa staf menimbang sampel, menghapuskan risiko silap formula dan mempercepatkan laporan rasmi kepada pihak pengurusan.

---

## 🛑 Masalah yang Diselesaikan

Di kebanyakan pusat timbangan dan makmal getah:
1. **Dua Kali Kerja (*Double-Entry*):** Staf mencatat berat timbangan dalam buku log fizikal, kemudian menyalinnya semula ke dalam lembaran Microsoft Excel. Ini membuang masa apabila terdapat puluhan sampel setiap hari.
2. **Risiko Silap Kira Formula:** Formula manual kadangkala tersilap tekan kalkulator atau salah masukkan formula Excel, menyebabkan pertikaian nilai DRC.
3. **Kelewatan Semakan Supervisor:** Sampel yang telah siap diuji lambat disahkan kerana kertas laporan fizikal perlu dihantar ke meja penyelia secara manual.
4. **Kekeliruan Berat Bekas Timbangan (*Tare Weight*):** Staf terpaksa menolak berat mangkuk atau piring timbang secara manual untuk setiap sampel sebelum merekod angka bersih.

**RubberDRC Pro menyelesaikan masalah ini** dengan menyediakan jadual pintar mesra papan kekunci, kalkulator tolak berat bekas automatik, pengesanan bacaan luar biasa (*outlier detection*), serta aliran kelulusan bersepadu.

---

## 👥 Untuk Siapa Aplikasi Ini?

| Peranan Pengguna | Tanggungjawab Utama dalam Sistem |
| :--- | :--- |
| **Staf Makmal / Kerani Timbang** | Memasukkan data timbangan basah & kering secara pukal, menggunakan mod tolak bekas, menyemak DRC automatik, dan membetulkan sampel jika dipulangkan oleh penyelia. |
| **Supervisor (Penyelia Makmal)** | Menerima notifikasi batch baharu, menyemak bacaan luar biasa melalui tolok kualiti, serta membuat keputusan **Lulus (*Approve*)** atau **Tolak (*Reject*)** berserta catatan wajib. |
| **Pegawai Kawalan Mutu / Pengurusan** | Memantau batch yang telah diluluskan, memuat turun laporan rasmi dalam format **CSV (Excel)** dan mencetak **Sijil Analisis DRC (PDF)**. |

---

## ⚡ Apa yang Boleh Dibuat? (Ciri-Ciri Utama)

- **Kemasukan Data Pukal Pantas (*Bulk Batch Entry*):** Masukkan puluhan sampel getah secara berterusan menggunakan kekunci `Tab` tanpa perlu klik tetikus berulang kali.
- **Kalkulator Tolak Berat Bekas (*Auto-Tare Weight Calculator*):** Pilih jenis piring timbang (cth: Piring Aluminium 10g atau Piring Petri 18.5g), masukkan bacaan timbangan kasar terus dari penimbang, dan sistem akan menolak berat bekas secara automatik.
- **Pengiraan DRC Masa Nyata (*Real-Time Formula*):** Nilai peratusan DRC dikira secara automatik mengikut formula rasmi:  
  $$\text{DRC (\%)} = \left(\frac{\text{Berat Kering}}{\text{Berat Basah}}\right) \times 100$$
- **Tolok Kualiti Visual & Pengesan Anomali (*Quality Gauge Pill*):** Sistem membandingkan bacaan DRC dengan piawaian industri Lembaga Getah Malaysia (LGM) — *Latex (28%–42%)*, *Cup Lump (50%–65%)* — dan memberi amaran jika terdapat bacaan luar biasa (*outlier*).
- **Aliran Kelulusan Dua Peringkat (*Approval Workflow*):** Supervisor mempunyai panel khas untuk meluluskan batch atau menolaknya dengan catatan pembetulan wajib (*mandatory feedback*).
- **Simulasi Emel Makluman (*Email Outbox Simulation*):** Notifikasi automatik kepada Supervisor semasa staf menghantar batch, notifikasi kepada staf jika ditolak, dan laporan rasmi kepada Pegawai apabila diluluskan.
- **Eksport CSV & Sijil Cetak PDF:** Eksport fail `.csv` berpengekodan UTF-8 BOM yang dibuka kemas dalam Microsoft Excel, serta paparan cetakan kemas berformat dokumen rasmi A4.
- **Penukar Peranan Pantas (*Role Switcher*):** Tukar peranan antara Staf, Supervisor, dan Pegawai dalam satu klik untuk mencuba keseluruhan kitaran kerja.

---

## 📖 Contoh Cara Penggunaan

1. **Staf Makmal Menimbang Sampel:**
   - Buka aplikasi dan pastikan peranan di bar atas ialah **Staf Makmal**.
   - Klik **"+ Input Batch Baharu"**.
   - Hidupkan suis **"Kalkulator Tolak Berat Bekas"** dan pilih *Piring Aluminium (10.00g)*.
   - Masukkan bacaan timbangan kasar: *Berat Basah Kasar: 110.00g*, *Berat Kering Kasar: 45.00g* bagi susu getah (*Latex*).
   - Sistem menolak berat bekas 10.00g secara automatik (Bersih: 100.00g & 35.00g) dan memaparkan DRC **`35.00% Normal (Piawai)`**.
   - Klik **"Hantar untuk Kelulusan"**.
2. **Supervisor Menyemak & Meluluskan:**
   - Tukar peranan kepada **Supervisor**.
   - Buka batch tersebut di Dashboard. Sistem memaparkan makluman jika semua sampel mematuhi piawaian.
   - Klik **"Approve Batch"** untuk mengesahkan data.
3. **Pegawai Mengambil Laporan:**
   - Tukar peranan kepada **Pegawai**.
   - Tapis senarai kepada status *Diluluskan (Approved)*.
   - Klik **"Eksport CSV"** untuk arkib fail Excel atau **"Cetak / PDF"** untuk mencetak Sijil Keputusan Analisis DRC.

---

## 🔗 Cara Mencuba Aplikasi

Aplikasi boleh diakses terus melalui pelayar web (tiada pemasangan perisian diperlukan untuk mencuba):

👉 **[Buka Aplikasi RubberDRC Pro](https://ais-pre-iaeidx5tegbc3b53wpvir4-992483945637.asia-southeast1.run.app)**

*(Nota: Pautan ini disediakan oleh persekitaran Google AI Studio Preview).*

---

## 📊 Status Projek Semasa

- **Tahap Semasa:** Fasa 1 (Functional Interactive Prototype).
- **Penyimpanan Data:** Data disimpan secara tempatan di dalam pelayar (*Browser localStorage*). Data kekal selagi cache pelayar tidak dipadamkan.
- **Penghantaran Emel:** Disimulasikan melalui modul *Email Outbox* dalam aplikasi tanpa memerlukan sambungan pelayan SMTP atau kunci API luaran.
- **Perancangan Fasa Seterusnya (Fasa 2):** Sambungan ke pangkalan data awan (*Cloud SQL PostgreSQL / Firebase*) untuk akses berbilang peranti serentak, integrasi emel sebenar melalui SMTP LGM, dan sambungan perkakasan penimbang Bluetooth.

---

## 📚 Dokumentasi Lanjut

Untuk panduan terperinci, sila rujuk dokumen-dokumen berikut:

- [📖 Panduan Pengguna Langkah Demi Langkah](docs/PANDUAN-PENGGUNA.md) — Cara lengkap menggunakan sistem bagi setiap peranan.
- [📋 Spesifikasi & Keperluan Produk (PRD)](docs/KEPERLUAN-PRODUK.md) — Butiran business rules, formula, dan kriteria penerimaan.
- [🛣️ Status Pembangunan & Perancangan (Roadmap)](docs/STATUS-DAN-ROADMAP.md) — Senarai fungsi yang telah disahkan dan perancangan masa hadapan.
- [🔒 Data & Privasi](docs/DATA-DAN-PRIVASI.md) — Maklumat bagaimana data disimpan dan dijamin kerahsiaannya.
- [🛠️ Panduan Pemasangan & Penyelenggaraan Kod](docs/SETUP-DAN-PENYELENGGARAAN.md) — Arahan menjalankan kod sumber untuk pembangun perisian (*developers*).
- [📝 Rekod Perubahan (Changelog)](CHANGELOG.md) — Sejarah kemaskini versi aplikasi.

---

## 💻 Ringkasan Teknologi

Aplikasi ini dibina berasaskan teknologi web moden yang ringan dan pantas:

- **React (v19):** Digunakan untuk membina paparan antaramuka interaktif yang berubah serta-merta tanpa perlu memuat semula halaman (*page reload*).
- **TypeScript:** Bahasa pengaturcaraan yang memastikan kod bebas daripada kesilapan jenis data (*type safety*), menjamin formula pengiraan tidak menghasilkan nombor tidak sah.
- **Tailwind CSS (v4):** Kerangka reka bentuk visual yang menyediakan reka bentuk responsif untuk komputer makmal mahupun telefon pintar, menggunakan warna hijau zamrud korporat (#065f46).
- **Vite:** Alat pembina (*bundler*) moden yang membolehkan aplikasi dimuatkan dengan pantas dalam masa kurang dari satu saat.
- **Lucide React:** Koleksi ikon visual mesra pengguna untuk operasi makmal dan navigasi.

---

## 💬 Maklum Balas & Bantuan

Sekiranya anda menemui sebarang pepijat (*bug*), isu pengiraan, atau mempunyai cadangan penambahbaikan untuk operasi makmal anda:

Sila laporkan melalui tab **Issues** di repository GitHub ini dengan menyatakan:
1. Peranan yang digunakan (*Staf Makmal*, *Supervisor*, atau *Pegawai*).
2. Nombor batch atau contoh angka timbangan yang dimasukkan.
3. Mesej ralat atau paparan yang tidak dijangka.

---

*Hak Cipta Terpelihara © 2026 RubberDRC Pro. Dibina untuk kegunaan operasi makmal analisis getah.*
