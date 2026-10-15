# Belajar Vibe Coding (Bun + ElysiaJS + Drizzle ORM + MySQL)

Backend API service modern yang dibangun menggunakan runtime **Bun**, framework **ElysiaJS**, dan ORM **Drizzle** dengan database **MySQL**.

---

## 🛠️ Tech Stack

- **Runtime**: [Bun](https://bun.sh/) (v1.4+)
- **Framework**: [ElysiaJS](https://elysiajs.com/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Database Driver**: [mysql2](https://github.com/sidorares/node-mysql2)
- **Language**: TypeScript

---

## 📁 Struktur Direktori

```
├── drizzle/              # Folder migrasi SQL dari Drizzle Kit
├── src/
│   ├── db/
│   │   ├── index.ts      # Koneksi database pool & Drizzle instance
│   │   └── schema.ts     # Definisi skema tabel database (MySQL)
│   └── index.ts          # Server entry point & routing ElysiaJS
├── .env.example          # Template environment variable
├── .env                  # Konfigurasi lokal (git-ignored)
├── drizzle.config.ts     # Konfigurasi Drizzle Kit CLI
├── issue.md              # Dokumen perencanaan proyek
├── package.json          # Dependency & npm/bun scripts
└── tsconfig.json         # Konfigurasi TypeScript
```

---

## 🚀 Memulai (Quickstart)

### 1. Prasyarat
- Terpasang [Bun](https://bun.sh/)
- Server MySQL berjalan lokal atau remote

### 2. Instalasi Dependensi
```bash
bun install
```

### 3. Konfigurasi Environment
Salin file `.env.example` menjadi `.env` lalu sesuaikan konfigurasi database Anda:
```bash
cp .env.example .env
```

Contoh konfigurasi `.env`:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=belajar_vibe_coding
```

### 4. Database Migration
Jalankan migrasi database menggunakan Drizzle Kit:

- **Generate migrasi baru dari schema**:
  ```bash
  bun run db:generate
  ```

- **Jalankan migrasi ke database target**:
  ```bash
  bun run db:migrate
  ```

- **Push schema langsung ke database (dev mode)**:
  ```bash
  bun run db:push
  ```

- **Buka GUI Database (Drizzle Studio)**:
  ```bash
  bun run db:studio
  ```

### 5. Menjalankan Server

- **Mode Pengembangan (Watch mode)**:
  ```bash
  bun run dev
  ```

- **Mode Produksi**:
  ```bash
  bun run start
  ```

- **Pemeriksaan Type (TypeScript Check)**:
  ```bash
  bun run typecheck
  ```

---

## 📡 Endpoint API

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/` | Pesan selamat datang & timestamp status |
| `GET` | `/health` | Health check & server uptime |
| `GET` | `/users` | Mengambil seluruh data user dari database |
| `POST` | `/users` | Menambahkan user baru (`name`, `email`) |
