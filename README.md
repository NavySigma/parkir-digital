# Parkir Digital

Parkir Digital adalah solusi modern untuk manajemen parkir berbasis web, terdiri dari backend (Laravel) dan frontend (React + Vite). Sistem ini memudahkan pengelolaan data kendaraan, transaksi parkir, serta integrasi pembayaran digital.

## Kenapa Membuat Parkir Digital?

- **Efisiensi**: Mengurangi antrian dan proses manual di area parkir.
- **Transparansi**: Semua transaksi tercatat secara digital.
- **Integrasi Pembayaran**: Mendukung pembayaran digital (Midtrans).
- **Monitoring Real-time**: Data parkir dan transaksi dapat dipantau secara langsung.

## Fitur Utama

- Manajemen data kendaraan dan transaksi parkir.
- QR Code untuk tiket parkir.
- Integrasi pembayaran digital (Midtrans).
- Dashboard admin dan user.
- UI modern dengan React, Vite, dan Tailwind CSS.

---

## Instalasi

### 1. Backend (Laravel)

**Kebutuhan:**
- PHP >= 8.2
- Composer
- Database (SQLite/MySQL)

**Langkah Instalasi:**
```bash
cd my-parking-backend
composer install
cp .env.example .env
# Edit konfigurasi database & midtrans di .env jika perlu
php artisan key:generate
php artisan migrate
php artisan db:seed # opsional, untuk data awal
```

**Jalankan server:**
```bash
php artisan serve
```

---

### 2. Frontend (React + Vite)

**Kebutuhan:**
- Node.js >= 18
- npm

**Langkah Instalasi:**
```bash
cd parkir_digital_vite_final
npm install
```

**Jalankan aplikasi:**
```bash
npm run dev
```

---

## Struktur Project

- my-parking-backend — Backend Laravel (API, database, Midtrans, dsb)
- parkir_digital_vite_final — Frontend React (UI, dashboard, QR code, dsb)

---

## Konfigurasi Tambahan

- Pastikan backend dan frontend berjalan di port yang berbeda.
- Atur URL API di frontend sesuai alamat backend (`.env` atau file konfigurasi frontend).
- Untuk pembayaran, atur kredensial Midtrans di file `.env` backend.

---

## Kontribusi & Lisensi

Project ini open-source, silakan kontribusi atau gunakan sesuai kebutuhan. Lisensi mengikuti MIT.

---

Silakan edit bagian tertentu jika ingin menambah detail spesifik projectmu! Jika ingin README ini langsung dibuatkan di workspace, konfirmasi saja.

I HEART NATASYA ❤️