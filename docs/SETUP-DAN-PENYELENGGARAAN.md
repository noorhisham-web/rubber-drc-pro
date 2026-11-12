# Panduan Pemasangan, Pembangunan & Penyelenggaraan

Dokumen ini disediakan khusus untuk pembangun perisian (*developers*), pentadbir sistem, atau pasukan teknikal yang ingin menjalankan, menguji, dan menyelenggara kod sumber **RubberDRC Pro** pada komputer tempatan (*local development environment*).

---

## 1. Keperluan Sistem Minimum

Sebelum memulakan, pastikan komputer anda telah dipasang dengan perisian asas berikut:

- **Node.js:** Versi `18.0.0` atau terkini (disyorkan versi `20.x LTS` atau `22.x LTS`).
- **Pengurus Pakej (*Package Manager*):** `npm` versi `9.x` ke atas (disertakan secara automatik bersama Node.js).
- **Pelayar Web Moden:** Google Chrome, Microsoft Edge, Mozilla Firefox, atau Apple Safari versi terkini.
- **Git:** Untuk klon (*clone*) dan pengurusan kod sumber dari GitHub.

---

## 2. Langkah-Langkah Menjalankan Projek

### Langkah 1: Dapatkan Kod Sumber
Klon repository ini ke komputer anda dan buka direktori projek:
```bash
git clone https://github.com/USERNAME/rubber-drc-pro.git
cd rubber-drc-pro
```

### Langkah 2: Pasang Pakej Ketergantungan (*Dependencies*)
Pasang semua pustaka yang diperlukan mengikut spesifikasi fail `package.json`:
```bash
npm install
```

### Langkah 3: Konfigurasi Fail Persekitaran (*Environment Variables*)
Salin fail contoh persekitaran `.env.example` ke fail `.env`:
```bash
cp .env.example .env
```
*(Nota: Untuk Fasa 1 Prototype, aplikasi tidak memerlukan API key luaran kerana semua pengiraan dan storan dijalankan secara tempatan dalam pelayar).*

### Langkah 4: Jalankan Pelayan Pembangunan (*Development Server*)
Mulakan pelayan pembangunan tempatan:
```bash
npm run dev
```
Pelayan akan bermula secara automatik pada alamat:  
👉 **`http://localhost:3000`**

Buka pelayar web anda dan navigasi ke alamat di atas untuk melihat aplikasi beroperasi secara langsung.

---

## 3. Arahan Skrip Utama (*Available NPM Scripts*)

Berdasarkan konfigurasi dalam `package.json`:

| Arahan (*Command*) | Tujuan / Penerangan |
| :--- | :--- |
| `npm run dev` | Menjalankan pelayan pembangunan Vite pada port `3000` dengan sokongan pantas. |
| `npm run build` | Mengkompilasi kod TypeScript dan membina fail produksi yang dioptimumkan ke dalam direktori `dist/`. |
| `npm run lint` | Menjalankan semakan ralat sintaks dan jenis data TypeScript (`tsc --noEmit`) tanpa menghasilkan fail binaan. |
| `npm run preview` | Menjalankan pelayan pratonton tempatan untuk menguji hasil binaan produksi daripada folder `dist/`. |
| `npm run clean` | Memadam direktori binaan lama `dist/` untuk memastikan pembinaan bersih. |

---

## 4. Struktur Folder Projek (*Code Architecture*)

```
rubber-drc-pro/
├── docs/                             # Dokumentasi terperinci projek
│   ├── DATA-DAN-PRIVASI.md           # Pengendalian privasi & storan data
│   ├── KEPERLUAN-PRODUK.md           # Spesifikasi PRD v1.0 & business rules
│   ├── PANDUAN-PENGGUNA.md           # Panduan lengkap operasi bagi staf & penyelia
│   ├── SETUP-DAN-PENYELENGGARAAN.md  # Panduan teknikal pembangun (dokumen ini)
│   └── STATUS-DAN-ROADMAP.md         # Status terkini & pelan Fasa 2
├── public/                           # Aset statik awam (PDF PRD, ikon)
│   └── assets/aistudio/              # Salinan fail PRD v1.0 asal
├── src/                              # Kod sumber aplikasi
│   ├── components/                   # Komponen antaramuka React modular
│   │   ├── BatchDetailModal.tsx      # Paparan butiran batch, laporan & panel kelulusan
│   │   ├── BatchEntryForm.tsx        # Borang jadual input pukal & auto-tare
│   │   ├── Dashboard.tsx             # Papan pemuka, penapis, dan senarai batch
│   │   ├── DRCGaugePill.tsx          # Tolok visual kualiti DRC & pengesan anomali
│   │   ├── EmailOutboxView.tsx       # Modul pratonton emel rasmi simulasi
│   │   ├── Navbar.tsx                # Bar navigasi atas & penukar peranan
│   │   ├── PrintView.tsx             # Susun atur sijil cetakan rasmi A4 / PDF
│   │   ├── StatusBadge.tsx           # Lencana status berkod warna
│   │   ├── StatusPipelineStepper.tsx # Penunjuk visual kitaran hidup audit batch
│   │   └── Toast.tsx                 # Sistem pemberitahuan terapung (toast)
│   ├── services/                     # Lapisan logik servis terasing
│   │   ├── emailService.ts           # Servis penjanaan log emel simulasi
│   │   └── storageService.ts         # Servis pengurusan storan localStorage
│   ├── types/                        # Definisi jenis data TypeScript
│   │   └── drc.ts                    # Antaramuka DRCBatch, DRCSample, UserRole
│   ├── utils/                        # Fungsi bantuan pengiraan & eksport
│   │   ├── drcCalculations.ts        # Formula DRC, purata batch, & validasi
│   │   └── exportHelpers.ts          # Penjana fail CSV dengan pengekodan UTF-8 BOM
│   ├── App.tsx                       # Titik masuk utama aplikasi (State Management)
│   ├── index.css                     # Gaya CSS global Tailwind & @media print
│   └── main.tsx                      # Titik pemasangan React ke DOM
├── .env.example                      # Contoh tetapan persekitaran selamat
├── .gitignore                        # Senarai fail yang diabaikan oleh Git
├── CHANGELOG.md                      # Rekod sejarah perubahan versi
├── index.html                        # Titik masuk HTML pelayar
├── metadata.json                     # Metadata aplikasi AI Studio
├── package.json                      # Senarai pustaka dependensi & skrip binaan
├── README.md                         # Halaman pengenalan utama repositori
├── tsconfig.json                     # Konfigurasi pengkompil TypeScript
└── vite.config.ts                    # Konfigurasi alat pembina Vite
```

---

## 5. Panduan Pengedaran (*Deployment Guide*)

### A. Pengedaran sebagai Laman Statik (Static Hosting)
Aplikasi Fasa 1 adalah aplikasi web satu halaman (*Single Page Application - SPA*) tanpa pelayan pangkalan data luaran. Ia boleh diedarkan dengan mudah ke mana-mana perkhidmatan pengehosan web statik seperti:
- **Cloudflare Pages**
- **Vercel**
- **Netlify**
- **GitHub Pages**

**Langkah Membina:**
1. Jalankan arahan:
   ```bash
   npm run build
   ```
2. Muat naik kandungan folder `dist/` yang terhasil ke pelayan pengehosan anda.

---

## 6. Penyelesaian Masalah Teknikal (*Troubleshooting*)

### 1. Ralat Port 3000 Digunakan (*Port 3000 in use*)
- Sekiranya port `3000` sedang digunakan oleh aplikasi lain, anda boleh menjalankan pelayan pada port lain:
  ```bash
  npx vite --port=3001
  ```

### 2. Ralat Jenis TypeScript Semasa Membina (*Build Failed*)
- Jalankan pemeriksaan awal:
  ```bash
  npm run lint
  ```
- Ini akan menyenaraikan baris kod dan fail yang mempunyai percanggahan jenis data.

### 3. Masalah Paparan Tailwind CSS
- Projek ini menggunakan **Tailwind CSS v4** dengan palam pembina `@tailwindcss/vite`.
- Pastikan fail `src/index.css` memuatkan baris `@import "tailwindcss";` di bahagian paling atas.
