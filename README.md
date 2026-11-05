# 🪐 ZuperVerse: 3D Educational Metaverse & Teacher Psychometrics Suite

Platform Metaverse Pembelajaran Interaktif 3D dan Sistem Asesmen Psikometrik Guru terpadu yang dirancang khusus untuk pembelajaran modern sekolah (SMP/SMA). 

Aplikasi ini berjalan **100% pada peramban web (client-side)** dan siap di-hosting langsung di **GitHub Pages**, dengan sinkronisasi multiplayer real-time dan basis data yang ditenagai oleh **Supabase Cloud Realtime Engine** (Region Singapore).

---

## 🌟 Fitur Utama Platform

### 1. Portal Peserta Didik (Student 3D World & Battle Royale)
- **Dunia Virtual 3D WebGL (Three.js):**
  - Pulau Akademia terapung dengan landmark interaktif: Menara Bahasa & Kosa Kata (Utara), Kastil Matematika (Barat), Laboratorium Sains & Logika (Timur), serta Arena Pertandingan (Selatan).
  - NPC Guru Robot (*ZuperWiseman*) yang memberikan panduan quest harian secara interaktif.
  - Multi-avatar rendering: Siswa dapat melihat pergerakan karakter 3D teman sekelasnya secara real-time.
- **Kustomisasi Avatar Penuh:**
  - Pilihan warna kostum (Indigo, Pink Neon, Cyan, Emerald, Amber, Crimson).
  - Aksesoris kepala (Topi Pelajar, Mahkota Juara, Topi Penyihir, Tanduk Cyber).
  - Jubah Pahlawan Pengetahuan (Hero Cape).
- **Kontrol Adaptif Lintas Perangkat:**
  - Keyboard (WASD / Tombol Panah / Spasi / E).
  - *Virtual Touch Joystick* otomatis muncul pada layar sentuh (HP, tablet, dan Chromebook).
- **Radar Minimap:**
  - Radar berputar dengan indikator posisi pemain dan lingkar *Safe Zone*.
- **4 Mode Permainan Edukatif:**
  1. *Solo Free Roam Quest* (Eksplorasi mandiri dan interaksi portal kuis).
  2. *Battle Royale Mode* (Zona aman menyusut, shield berkurang saat jawaban salah, pemain bertahan terakhir menjadi juara).
  3. *Co-op Boss Raid Mode* (Bar HP Boss Mega Golem bersama; setiap jawaban benar memancarkan laser spell untuk mengalahkan monster).
  4. *1v1 Quiz Duel* (Adu cepat dan akurasi skor langsung antar siswa).
- **5 Tipe Soal Asesmen Interaktif:**
  1. Pilihan Ganda (*Multiple Choice*)
  2. Benar / Salah (*True / False*)
  3. Isian Singkat (*Short Answer*)
  4. Menjodohkan Pasangan (*Matching Pairs*)
  5. Urutan Logika Hierarki (*Sequence Ordering - PEMDAS*)

---

### 2. Dashboard Eksekutif Guru (Teacher LMS & Asesmen Psikometrik)
- **Pusat Kendali Ruangan (Room & Match Controller):**
  - Pembuat Room PIN 6-karakter instan (contoh: `ZUP77`).
  - Pemilihan mode pertandingan (Battle Royale, Boss Raid, Duel, Solo).
  - Tombol aksi Guru: Mulai Pertandingan, Kecilkan Safe Zone, dan Selesaikan Sesi.
  - *Live Student Telemetry*: Memantau seluruh siswa di kelas, persentase shield, perolehan skor, dan status hidup/tereliminasi via Supabase Realtime.
- **Analisis Butir Soal Psikometrik (Psychometric Item Analysis):**
  - **Tingkat Kesukaran ($P$ - Difficulty Index):**
    $$P = \frac{B}{N}$$
    Kategori otomatis: *Mudah* ($P > 0.70$), *Sedang / Proporsional* ($0.30 \le P \le 0.70$), dan *Sukar* ($P < 0.30$).
  - **Daya Pembeda ($D$ - Discrimination Index):**
    Menggunakan formula baku perbandingan kelompok 27% Atas vs 27% Bawah:
    $$D = \frac{U - L}{n}$$
    Kategori otomatis: *Sangat Baik* ($D \ge 0.40$), *Baik* ($0.30 \le D < 0.40$), *Cukup* ($0.20 \le D < 0.30$), dan *Perlu Direvisi* ($D < 0.20$).
  - Rekomendasi otomatis status soal untuk bank soal ujian sekolah.
- **Generator Rapor Naratif Otomatis (Siap Cetak / Ekspor PDF):**
  - Menganalisis ketepatan dan pola capaian siswa.
  - Menghasilkan narasi deskripsi capaian kompetensi siswa, catatan kognitif, dan rekomendasi tindak lanjut bagi orang tua/guru.
  - Tata letak khusus cetak (*print-ready layout*) dengan satu kali klik.
- **Bank Soal Interaktif (Interactive Question Builder):**
  - Formulir penambahan soal dinamis untuk kelima tipe soal asesmen.

---

## 🏗️ Arsitektur Teknologi

```
ZuperVerse (Static Web Client di GitHub Pages)
├── index.html        (Portal Masuk: Pemilihan Peran Siswa / Guru)
├── student.html      (Dunia 3D Siswa, Three.js WebGL & HUD Gamifikasi)
├── teacher.html      (Dashboard Guru, Analisis Butir Soal & Rapor Naratif)
├── css/style.css     (Tema Cyberpunk, Glassmorphism & Print Styling)
└── js/
    ├── supabase-config.js   (Konektor SDK Supabase Realtime)
    ├── audio.js             (Synthesizer Audio Web Audio API Prosedural)
    ├── questions-default.js (Bank Soal 5 Tipe Pembelajaran SMP)
    ├── world3d.js           (Engine Tiga Dimensi Three.js, Pulau & Avatar)
    ├── student.js           (Game Loop Siswa, Joystick, Kuis & Safe Zone)
    └── teacher.js           (Logika Telemetri Guru, Rumus Psikometrik & Rapor)
```

### Integrasi Basis Data Cloud: Supabase Realtime
- **Endpoint:** `https://vmsmmueseewuxgqtaguf.supabase.co` (Region Singapore / `ap-southeast-1`)
- **Tabel Basis Data:**
  - `zuper_rooms`: Kode room, nama guru, mode game, radius safe zone, HP boss.
  - `zuper_players`: Posisi 3D ($x, z$), warna & topi avatar, live shield, live score, status eliminasi.
  - `zuper_assessments`: Log jawaban butir soal dan catatan waktu respons untuk analisis psikometrik.

---

## 🚀 Panduan Menjalankan & Deployment

### 1. Membuka Secara Lokal (Local Development)
Buka file `index.html` langsung menggunakan peramban modern (Google Chrome, Microsoft Edge, Safari, Firefox) atau jalankan melalui local server:
```bash
# Menggunakan Python HTTP Server
python -m http.server 8000
```
Buka `http://localhost:8000` pada peramban.

### 2. Mengaktifkan GitHub Pages (Hosting Online Gratis)
1. Buka repositori di GitHub: `https://github.com/NourAnisa/ZuperVerse`
2. Masuk ke menu **Settings** ➔ **Pages**.
3. Pada bagian **Build and deployment**:
   - Source: **Deploy from a branch**
   - Branch: **main** / folder **/(root)**
4. Klik **Save**. Dalam 1-2 menit, situs akan aktif secara online di:
   `https://nouranisa.github.io/ZuperVerse/`

---

## 📖 Panduan Penggunaan di Kelas

### Skenario Pembelajaran Guru:
1. Guru membuka menu **Dashboard Guru** di laptop atau proyektor kelas.
2. Masukkan nama kelas/guru dan pilih mode permainan (misal: *Battle Royale* atau *Boss Raid*).
3. Klik **Buka Room Kelas Sekarang** untuk mendapatkan Kode PIN (misal: `ZUP88`).
4. Siswa di HP atau laptop masing-masing membuka **Portal Siswa**, mengkustomisasi avatar mereka, dan memasukkan kode PIN.
5. Guru melihat nama dan avatar seluruh siswa muncul di layar proyektor secara real-time.
6. Guru menekan **Mulai Pertandingan**. Siswa menjawab soal-soal interaktif di dunia 3D.
7. Di akhir sesi, Guru dapat langsung melihat tabel **Analisis Butir Soal Psikometrik** dan mencetak **Rapor Naratif Siswa** untuk evaluasi pembelajaran.

---

Dibuat dengan ❤️ untuk kemajuan inovasi teknologi pendidikan digital Indonesia.
