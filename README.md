# 🪐 ZuperVerse: 3D Educational Metaverse & Teacher Psychometrics Suite

Platform Gamifikasi Pembelajaran 3D dan Sistem Asesmen Psikometrik Guru terpadu yang dirancang sesuai Roadmap 4 Fase Pengembangan Digital Sekolah.

Platform ini dibangun **100% Client-Side** sehingga siap di-hosting langsung di **GitHub Pages** dan dapat dipasang di layar utama HP sebagai aplikasi **PWA (Progressive Web App)** yang mendukung permainan offline, dengan sinkronisasi multiplayer real-time ditenagai oleh **Supabase Cloud Engine** (Region Singapore).

---

## 🗺️ Roadmap Pengembangan 4 Fase (Lengkap & Terimplementasi)

### 📌 Fase 1: Core Assessment Engine & Web UI (Bulan 1)
- **Antarmuka Mode Guru untuk CRUD Soal (5 Jenis Soal):**
  1. *Pilihan Ganda (Multiple Choice)*
  2. *Benar / Salah (True / False)*
  3. *Isian Singkat (Short Answer)*
  4. *Menjodohkan Pasangan (Matching Pairs)*
  5. *Urutan Logika Hierarki (Sequence Ordering - PEMDAS)*
- **Impor Soal Otomatis dari Teks / Microsoft Word:**
  - Parser cerdas yang mampu mengenali salinan teks bernomor `1. Soal`, `A. Opsi`, `Kunci: A`, dan `Pembahasan: ...` langsung ke dalam Bank Soal.
- **Mekanisme Kelas Sederhana:**
  - Kode Kelas 6 Huruf instan (contoh: `ZUP789`).
  - Siswa bergabung dengan validasi: **Nama Lengkap Siswa + Nomor Absen (1 - 40)**.
- **Modul Kuis 2D Responsif:**
  - Timer hitung mundur dinamis (15 detik) per soal.
  - Sistem 3 Nyawa (*Hearts/Shield*).
  - Skor berbasis kecepatan menjawab dan pengganda kombo (*Streak Multiplier*).
  - Kotak umpan balik (*Feedback Box*) dengan penjelasan materi pembelajaran mendalam.

---

### 🏛️ Fase 2: 3D Environment & Building Interaction (Bulan 2)
- **Scene 3D "Kota Ilmu" (Three.js WebGL Engine):**
  - Kota terapung modern dengan jalan raya aspal cyberpunk, lampu jalan, taman, dan kristal energi pusat.
  - Karakter 3D yang lincah dengan kontrol Keyboard (WASD/Panah/Spasi) dan *Virtual Touch Joystick* di smartphone/tablet.
- **Gedung-Gedung Mapel 3D:**
  1. **English Hall (Menara Bahasa & Kosa Kata)** di koordinat Utara `(0, 0, -26)`.
  2. **Math Citadel (Kastil Matematika & Aljabar)** di koordinat Barat `(-26, 0, 0)`.
  3. **Science Lab (Laboratorium Sains & Robotik)** di koordinat Timur `(26, 0, 0)`.
  4. **Mini-Games Stadium (Stadion Turnamen)** di koordinat Selatan `(0, 0, 26)`.
- **Integrasi Trigger Pintu Masuk:**
  - Saat karakter melangkah masuk ke pintu gedung mapel tertentu, kuis 2D overlay langsung terbuka otomatis sesuai kurikulum gedung tersebut.

---

### ⚡ Fase 3: Mode Lomba Mini-Games & PWA Offline (Bulan 3)
- **Mini-Game 1: Lari Kilat (Speed Runner 4-Lajur):**
  - Pemain berlari menembus 4 lajur (Lajur A, B, C, D).
  - Menghindari rintangan dan berpindah ke lajur jawaban yang benar sebelum menerobos gerbang kuis.
- **Mini-Game 2: Jembatan Juara (Sky Bridge Quiz):**
  - Tantangan melintasi jembatan kaca di langit.
  - Memilih ubin kaca jawaban yang kokoh; memilih ubin yang salah menyebabkan kaca retak dan mengurangi nyawa.
- **Papan Peringkat (Leaderboard):**
  - Peringkat lokal tersimpan di peramban dan peringkat kelas real-time tersinkron di Supabase.
- **PWA (Progressive Web App) Offline Support:**
  - `manifest.json` dan Service Worker (`sw.js`) dengan strategi *Cache-First* memungkinkan game diinstal di layar beranda (*Add to Home Screen*) dan dimainkan saat tidak ada koneksi internet.

---

### 📊 Fase 4: Real-Time Multiplayer, Live Monitoring & Rapor (Bulan 4)
- **Real-Time Multiplayer & Live Monitoring Guru (Supabase Channels):**
  - Guru dapat memantau presensi siswa berdasarkan Nama + No. Absen, persentase shield, skor live, dan status eliminasi secara live.
  - Kendali sesi guru: Mulai Pertandingan, Kecilkan Safe Zone, dan Selesaikan Sesi.
- **Kalkulasi Psikometri Baku:**
  - **Tingkat Kesukaran ($P$ Index):**
    $$P = \frac{B}{N}$$
    Klasifikasi: *Mudah* ($P > 0.70$), *Sedang / Ideal* ($0.30 \le P \le 0.70$), dan *Sukar* ($P < 0.30$).
  - **Daya Pembeda ($D$ Index):**
    Formula baku metode 27% Kelompok Atas (*Upper*) vs 27% Kelompok Bawah (*Lower*):
    $$D = \frac{U - L}{n}$$
    Klasifikasi: *Sangat Baik* ($D \ge 0.40$), *Baik* ($0.30 \le D < 0.40$), *Cukup* ($0.20 \le D < 0.30$), dan *Jelek* ($D < 0.20$).
  - **Distribusi Nilai Kelas:**
    Menghitung otomatis Rata-rata (*Mean*), Nilai Tengah (*Median*), Standar Deviasi ($\sigma$), Nilai Tertinggi, Nilai Terendah, dan Persentase Ketuntasan KKM 75%.
- **Generator Rapor Capaian TP (Tujuan Pembelajaran) Otomatis:**
  - Menyusun narasi capaian kompetensi Kurikulum Merdeka dan rekomendasi tindak lanjut guru per siswa.
- **Sertifikat Prestasi Siswa (*Certificate of Achievement*) Siap Cetak:**
  - Generator sertifikat resmi dengan ornamen emas, tanda tangan digital guru, nomor seri, dan verifikasi QR, siap dicetak langsung atau disimpan ke PDF.

---

## 🏗️ Struktur File Repositori

```
ZuperVerse/
├── index.html              (Portal Pilihan Peran: Siswa / Guru & Status Roadmap)
├── student.html            (Dunia 3D Kota Ilmu, Pintu Gedung, Joystick & Kuis 2D)
├── teacher.html            (Dashboard Guru, Impor Word, Psikometrik & Rapor TP)
├── manifest.json           (Konfigurasi PWA Web App Manifest)
├── sw.js                   (Service Worker untuk Offline Caching)
├── README.md               (Dokumentasi Teknis & Panduan Fase 1-4)
├── css/
│   └── style.css           (Tema Cyberpunk, Glassmorphism, Joystick & Print Layout)
└── js/
    ├── supabase-config.js  (Konektor SDK Supabase Realtime)
    ├── audio.js            (Synthesizer Audio Web Audio API Prosedural)
    ├── questions-default.js(Bank Soal 5 Tipe Pembelajaran SMP)
    ├── minigames.js        (Mode Lari Kilat 4-Lajur & Jembatan Juara)
    ├── psychometrics.js    (Kalkulasi Baku P, D 27% & Distribusi Nilai Kelas)
    ├── certificate.js      (Generator Sertifikat Prestasi Siswa Siap Cetak)
    ├── world3d.js          (Engine 3D Three.js Kota Ilmu & Pintu Gedung Mapel)
    ├── student.js          (Game Loop Siswa, No. Absen, Timer 15s & Supabase)
    └── teacher.js          (Dashboard Guru, Impor Word, Telemetri & Rapor TP)
```

---

## 🚀 Panduan Menjalankan & Deployment ke GitHub Pages

1. **Akses Langsung di Repositori:**
   `https://github.com/NourAnisa/ZuperVerse`
2. **Aktifkan GitHub Pages:**
   - Masuk ke menu **Settings** ➔ **Pages**.
   - Pada bagian **Build and deployment**, pilih **Deploy from a branch**.
   - Pilih branch **main** dan folder **/(root)**, lalu klik **Save**.
3. **URL Live GitHub Pages:**
   `https://nouranisa.github.io/ZuperVerse/`
4. **Instal sebagai Aplikasi PWA di HP:**
   Buka link di Google Chrome/Safari pada smartphone, lalu ketuk menu peramban dan pilih **Tambahkan ke Layar Utama (Add to Home Screen)**. Aplikasi ZuperVerse akan terpasang di HP dan dapat dimainkan offline.

---

Dibuat dengan dedikasi penuh untuk digitalisasi dan inovasi pendidikan Indonesia.
