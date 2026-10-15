# Project Setup: Bun + ElysiaJS + Drizzle ORM + MySQL

## 1. Overview
Inisialisasi backend project baru pada repository ini menggunakan runtime **Bun**, framework **ElysiaJS**, dan ORM **Drizzle** yang terhubung ke database **MySQL**. Dokumen ini berfungsi sebagai panduan implementasi tingkat tinggi (high-level) bagi pengembang atau model LLM pelaksana.

---

## 2. Tech Stack & Dependencies
- **Runtime & Package Manager**: [Bun](https://bun.sh/)
- **Web Framework**: [ElysiaJS](https://elysiajs.com/)
- **Database ORM**: [Drizzle ORM](https://orm.drizzle.team/) & `drizzle-kit` (CLI/migrations)
- **Database Client**: `mysql2`

---

## 3. High-Level Implementation Steps

### Phase 1: Project Initialization
1. Inisialisasi project Bun di root folder (`bun init`).
2. Pasang dependencies utama:
   - `elysia`
   - `drizzle-orm`
   - `mysql2`
3. Pasang development dependencies:
   - `drizzle-kit`
   - `@types/bun` (jika diperlukan oleh TypeScript setup)
4. Pastikan `package.json` memiliki scripts standar (e.g. `dev`, `build`, `db:generate`, `db:migrate`, `db:push`).

### Phase 2: Configuration & Environment
1. Buat file `.env.example` dan `.env` yang memuat konfigurasi koneksi MySQL:
   - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
2. Konfigurasikan `drizzle.config.ts` untuk menentukan lokasi schema, output migrasi, dan dialect `mysql`.

### Phase 3: Database & Schema Setup
1. Buat folder database (e.g. `src/db/`):
   - Koneksi client database menggunakan pool koneksi MySQL via Drizzle.
   - Definisi schema tabel awal (contoh: tabel `users` atau entitas dasar) menggunakan helper Drizzle MySQL (`mysqlTable`).
2. Sediakan mekanisme migrasi atau push schema agar tabel dapat dibuat di database target.

### Phase 4: Application Server Setup
1. Buat entry point server Elysia (e.g. `src/index.ts`).
2. Buat endpoint dasar:
   - Health check endpoint (e.g. `GET /` atau `GET /health`) untuk verifikasi server berjalan.
   - Endpoint contoh interaksi database (e.g. `GET /users`, `POST /users`) menggunakan Drizzle client.
3. Konfigurasi port server (baca dari environment variable atau default port, misal `3000`).

---

## 4. Acceptance Criteria
- [x] Project berhasil diinisialisasi dengan struktur direktori yang rapi dan standar TypeScript.
- [x] Dependencies `elysia`, `drizzle-orm`, `mysql2`, dan `drizzle-kit` terpasang tanpa konflik.
- [x] File konfigurasi Drizzle (`drizzle.config.ts`) dan environment template (`.env.example`) tersedia.
- [x] Modul koneksi database dan skema dasar terdefinisi secara modular.
- [x] Server Elysia dapat dijalankan dengan perintah `bun run dev` dan merespons request HTTP.
- [x] Dokumentasi singkat cara menjalankan project dan migrasi ditulis di `README.md`.
