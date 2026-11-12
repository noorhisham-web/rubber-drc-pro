# Keperluan Produk & Spesifikasi Sistem (PRD v1.0)

Dokumen ini merangkumkan spesifikasi fungsian, peraturan perniagaan (*business rules*), serta kriteria penerimaan berasaskan dokumen asal **Product Requirements Document (PRD) v1.0 — RubberDRC Pro (12 November 2026)**.

---

## 1. Tujuan & Matlamat Sistem

RubberDRC Pro direka bentuk khusus bagi mendigitalkan proses ujian kandungan getah kering (*Dry Rubber Content - DRC*) di makmal analisis dan pusat pengumpulan getah.

### Matlamat Utama:
1. **Peningkatan Kelajuan Operasi:** Membolehkan staf makmal merekod 30 sampel dalam satu sesi ujian secara pukal tanpa perlu memuat semula halaman web.
2. **Penyingkiran Ralat Pengiraan:** Memastikan 100% pengiraan DRC mematuhi formula standard industri dan sifar penerimaan bagi rekod yang melanggar hukum fizik timbangan.
3. **Kawalan Kualiti Ketat:** Menjamin laporan rasmi hanya boleh dijana dan diedarkan selepas mendapat pengesahan serta kelulusan sah daripada pihak penyelia.
4. **Kebolehcapaian Menyeluruh:** Menyokong paparan desktop di meja makmal serta paparan mudah alih yang kemas pada telefon pintar penyelia dan pegawai (skrin selebar 360px ke atas).

---

## 2. Skop MVP (Fasa 1: Functional Interactive Prototype)

Berdasarkan perancangan PRD, pembangunan dibahagikan kepada dua fasa:

### A. Termasuk dalam Fasa 1 (Siap Dibina):
- **Role Switcher:** Penukar peranan pantas antara *Staf Makmal*, *Supervisor*, dan *Pegawai*.
- **Bulk Batch Entry Table:** Kemasukan data pukal mesra papan kekunci dengan butang tambah 1 atau 5 baris.
- **Kalkulator Auto-Tare:** Pengiraan tolak berat bekas timbangan secara automatik.
- **Formula DRC Masa Nyata:** Pengiraan spontan peratusan DRC dan purata keseluruhan batch.
- **Tolok Kualiti Visual:** Petunjuk julat kualiti piawai mengikut jenis getah (Latex, Cup Lump, USS).
- **Aliran Kitaran Kelulusan:** Status *Draft*, *Pending Approval*, *Rejected*, dan *Approved* dengan garisan audit (*pipeline stepper*).
- **Simulasi Emel Outbox:** Penghantaran notifikasi automatik ke peti keluar simulasi bagi memantau komunikasi antara staf, penyelia, dan pegawai.
- **Papan Pemuka (Dashboard):** Kad statistik, bar carian kata kunci (*batch, pembekal, sampel*), dan penapis status/tarikh.
- **Eksport Data & Sijil:** Muat turun fail CSV serasi Microsoft Excel (UTF-8 BOM) dan pratonton cetakan sijil A4/PDF.
- **Storan Tempatan:** Penyimpanan berstruktur dalam `localStorage` (`rubber_drc_batches_v1` dan `rubber_drc_emails_v1`) berserta set data demo asal.

### B. Ditangguhkan ke Fasa 2 (Production):
- Sambungan ke pangkalan data awan berpusat (*PostgreSQL / Firebase Firestore*).
- Pengesahan pengguna sebenar berasaskan katalaluan atau *Single Sign-On (SSO)* organisasi.
- Penghantaran emel sebenar ke peti masuk emel pengguna melalui pembekal perkhidmatan emel (*SMTP / Resend API*).
- Integrasi terus melalui kabel USB atau Bluetooth ke perkakasan alat penimbang digital.

---

## 3. Peraturan Perniagaan (*Business Rules*)

Sistem menguatkuasakan peraturan perniagaan berikut secara ketat:

| Kod Peraturan | Perkara | Huraian Terperinci |
| :--- | :--- | :--- |
| **BR-01** | **Had Berat Kering** | Berat Kering tidak boleh melebihi Berat Basah ($W_{\text{kering}} \le W_{\text{basah}}$). Air dan cecair serum tersejat semasa proses pengeringan; oleh itu berat kering mestilah lebih rendah atau sama. Sistem menyekat penghantaran jika syarat ini dilanggar. |
| **BR-02** | **No. Sampel Unik dalam Batch** | Sistem menyemak nombor sampel/kod lot. No. sampel yang sama tidak boleh dimasukkan lebih daripada sekali dalam batch yang sama bagi mengelakkan kekeliruan rekod. |
| **BR-03** | **Kunci Rekod Selepas Penghantaran** | Sebaik sahaja batch bertukar kepada status *Pending Approval* atau *Approved*, tiada sesiapa boleh mengubah data timbangan sampel bagi mengekalkan integriti jejak audit (*audit trail*). Suntingan hanya dibenarkan jika Supervisor menolak (*Reject*) batch tersebut. |
| **BR-04** | **Catatan Wajib Semasa Penolakan** | Supervisor yang membuat keputusan *Reject* diwajibkan menulis sebab penolakan (minimum 5 aksara) agar staf makmal mengetahui punca dan sampel mana yang perlu disemak semula. Tindakan penolakan disekat jika ulasan dibiarkan kosong. |
| **BR-05** | **Pengendalian Baris Kosong** | Jika staf menambah baris tambahan (contohnya menambah 5 baris tetapi hanya menggunakan 3 baris), sistem secara automatik mengabaikan baris yang kosong sepenuhnya tanpa mengeluarkan amaran ralat. Walau bagaimanapun, baris yang diisi separuh jalan akan disekat dengan amaran merah. |

---

## 4. Aliran Perjalanan Pengguna Utama (*User Journeys*)

```
[Staf Makmal]
   │
   ▼
1. Buka Borang Batch Baharu
   │
   ▼
2. Aktifkan Auto-Tare (Piring Aluminium 10g) & Isi Sampel Pukal
   │
   ▼
3. Semak Pengiraan DRC & Tolok Kualiti LGM (Formula DRC Masa Nyata)
   │
   ▼
4. Klik "Hantar untuk Kelulusan"
   │ (Status bertukar ke 'Pending Approval' + Emel simulasi dihantar)
   ▼
[Supervisor]
   │
   ├──────────────────────────────┬──────────────────────────────┐
   ▼                              ▼                              ▼
Semak Ketepatan Sampel      [Laluan A: Tepat]             [Laluan B: Ralat]
& Anomali Kualiti           Klik "Approve Batch"          Klik "Reject Batch"
                                  │                       (Isi Ulasan Wajib)
                                  ▼                              │
                           Status: 'Approved'                    ▼
                           (Audit Terkunci +             Status: 'Rejected'
                            Emel Rasmi Dijana)           (Staf Betulkan &
                                  │                       Hantar Semula)
                                  ▼                              │
                             [Pegawai]                           ▼
                         Eksport CSV / Cetak PDF           Resubmit ke Supervisor
```

---

## 5. Kriteria Penerimaan & Status Ujian (*Acceptance Criteria*)

Berdasarkan jadual pengesahan dalam Seksyen 17 PRD asal:

| ID Ujian | Rujukan PRD | Kriteria Pengesahan yang Diuji | Keputusan |
| :--- | :--- | :--- | :--- |
| **AC-01** | FR-002, FR-003 | Input Berat Basah `100.00 g` dan Berat Kering `32.50 g` memaparkan DRC `32.50%` secara automatik dalam masa nyata. | **LULUS (Passed)** |
| **AC-02** | FR-002, BR-01 | Input Berat Kering melebihi Berat Basah memaparkan amaran ralat merah dan menyekat penghantaran batch. | **LULUS (Passed)** |
| **AC-03** | FR-001, FR-004 | Menukar peranan kepada Supervisor membolehkan batch berstatus *Pending Approval* diluluskan dan bertukar status ke *Approved*. | **LULUS (Passed)** |
| **AC-04** | FR-004, BR-04 | Menolak batch (*Reject*) tanpa mengisi catatan disekat; selepas diisi ulasan, status bertukar kepada *Rejected* dan boleh disunting semula oleh Staf. | **LULUS (Passed)** |
| **AC-05** | FR-005 | Setiap tindakan penghantaran, penolakan, dan kelulusan menjana rekod emel baharu dalam tab *Email Outbox*. | **LULUS (Passed)** |
| **AC-06** | FR-007 | Klik butang "Eksport CSV" memuat turun fail `.csv` ber-BOM; klik "Cetak / Simpan PDF" membuka pratonton bersih tanpa elemen navigasi. | **LULUS (Passed)** |

---

## 6. Rujukan Dokumen Asal

- **Nama Fail PRD Asal:** `RubberDRC-Pro-PRD-v1.0_567a779f.pdf` (tersimpan dalam direktori projek di `public/assets/aistudio/RubberDRC-Pro-PRD-v1.0_567a779f.pdf`).
- **Versi:** 1.0 (Tarikh: 12 November 2026).
- **Status PRD:** Disahkan untuk Fasa 1 (Functional Interactive Prototype).
