# Feature: User Registration API (POST /api/users)

## 1. Overview
Fitur ini bertujuan untuk menambahkan fungsionalitas registrasi user baru ke dalam aplikasi backend. Data user akan disimpan ke database MySQL melalui Drizzle ORM dengan kata sandi yang di-hash menggunakan algoritma **bcrypt**.

---

## 2. Spesifikasi Database (Tabel `users`)

Perbarui definisi tabel `users` pada file `src/db/schema.ts` dengan struktur kolom berikut:

| Nama Kolom | Tipe Data | Keterangan |
|---|---|---|
| `id` | `int` | Primary Key, Auto Increment |
| `name` | `varchar(255)` | Not Null |
| `email` | `varchar(255)` | Not Null, Unique |
| `password` | `varchar(255)` | Not Null (menyimpan hash bcrypt) |
| `created_at` | `timestamp` | Default Current Timestamp |

*Catatan: Pastikan kolom `password` ditambahkan dan tipe data serta constraint sesuai spesifikasi di atas.*

---

## 3. Struktur Folder dan File Baru

Proyek menggunakan pemisahan tanggung jawab (Separation of Concerns) antara routing dan business logic di dalam folder `src/`:

```
src/
├── db/
│   ├── index.ts
│   └── schema.ts           # [MODIFIKASI] Tambahkan kolom password & sesuaikan kolom
├── routes/                 # [FOLDER BARU] Tempat routing ElysiaJS
│   └── users-route.ts      # [FILE BARU] Route handler untuk /api/users
├── services/               # [FOLDER BARU] Tempat logic bisnis & database query
│   └── users-service.ts    # [FILE BARU] Logic registrasi, pengecekan email, hashing
└── index.ts                # [MODIFIKASI] Mendaftarkan router users ke app utama
```

---

## 4. Spesifikasi API Endpoint

### Endpoint: Registrasi User
- **Method**: `POST`
- **URL**: `/api/users`
- **Header**: `Content-Type: application/json`

#### Request Body (JSON):
```json
{
  "name": "Fani",
  "email": "eko@localhost",
  "password": "rahasia"
}
```
*Validasi:*
- `name`: string, tidak boleh kosong.
- `email`: string, format email valid.
- `password`: string, minimal 1 karakter (disarankan minimal 6).

#### Response Body:
- **Success (HTTP 200 atau 201)**:
  ```json
  {
    "data": "OK"
  }
  ```
- **Error - Email Sudah Terdaftar (HTTP 400)**:
  ```json
  {
    "error": "Email sudah terdaftar"
  }
  ```

---

## 5. Panduan Tahapan Implementasi (Step-by-Step)

Ikuti tahapan ini secara berurutan:

### Langkah 1: Perbarui Skema Database & Generate Migrasi
1. Buka file `src/db/schema.ts`.
2. Tambahkan kolom `password` bertipe `varchar("password", { length: 255 }).notNull()`.
3. Pastikan kolom `created_at` menggunakan default timestamp sekarang.
4. Jalankan perintah generate migrasi di terminal:
   ```bash
   bun run db:generate
   ```

### Langkah 2: Buat Service Layer (`src/services/users-service.ts`)
1. Buat direktori `src/services/` jika belum ada.
2. Buat file `src/services/users-service.ts`.
3. Di dalam file ini, buat fungsi registrasi (misal `registerUser(payload)`):
   - **Pengecekan Email**: Cari apakah email sudah ada di tabel `users` menggunakan query Drizzle (`eq(users.email, payload.email)`).
   - **Penanganan Duplikat**: Jika email sudah ada, lempar error atau kembalikan indikator error bahwa email sudah terdaftar.
   - **Hashing Password**: Hash password menggunakan bcrypt.
     - *Rekomendasi di Bun:* Gunakan fungsi native bawaan Bun:
       ```ts
       const hashedPassword = await Bun.password.hash(payload.password, {
         algorithm: "bcrypt",
         cost: 10,
       });
       ```
     - *Atau alternatif:* Menggunakan library `bcryptjs`.
   - **Simpan Data**: Masukkan record baru ke database via Drizzle `db.insert(users).values({ name, email, password: hashedPassword })`.
   - Kembalikan hasil sukses.

### Langkah 3: Buat Route Layer (`src/routes/users-route.ts`)
1. Buat direktori `src/routes/` jika belum ada.
2. Buat file `src/routes/users-route.ts`.
3. Inisialisasi instance Elysia baru:
   ```ts
   import { Elysia, t } from "elysia";
   import { registerUser } from "../services/users-service";

   export const usersRoute = new Elysia({ prefix: "/api/users" })
     .post("/", async ({ body, set }) => {
       try {
         await registerUser(body);
         set.status = 200; // atau 201
         return { data: "OK" };
       } catch (error: any) {
         if (error.message === "Email sudah terdaftar") {
           set.status = 400;
           return { error: "Email sudah terdaftar" };
         }
         set.status = 500;
         return { error: "Internal Server Error" };
       }
     }, {
       body: t.Object({
         name: t.String({ minLength: 1 }),
         email: t.String({ format: "email" }),
         password: t.String({ minLength: 1 }),
       }),
     });
   ```

### Langkah 4: Daftarkan Route di Server Utama (`src/index.ts`)
1. Buka file `src/index.ts`.
2. Import `usersRoute` dari `./routes/users-route`.
3. Pasang route ke app Elysia utama menggunakan method `.use(usersRoute)`.

### Langkah 5: Pengujian & Validasi
1. Jalankan pengecekan TypeScript:
   ```bash
   bun run typecheck
   ```
2. Jalankan server lokal:
   ```bash
   bun run dev
   ```
3. Uji menggunakan curl atau HTTP client:
   - **Test 1 (Registrasi Baru)**: Kirim POST ke `http://localhost:3000/api/users` dengan body JSON baru. Pastikan response adalah `{"data":"OK"}`.
   - **Test 2 (Duplikasi Email)**: Kirim request yang sama sekali lagi. Pastikan response adalah HTTP 400 dengan body `{"error":"Email sudah terdaftar"}`.
   - **Test 3 (Verifikasi Hash)**: Pastikan password yang tersimpan di database dalam bentuk string hash bcrypt (diawali dengan `$2b$` atau `$2a$`), bukan plain text.

---

## 6. Acceptance Criteria Checklist
- [x] Skema tabel `users` memiliki kolom: `id`, `name`, `email`, `password`, dan `created_at`.
- [x] File migrasi berhasil dibuat melalui `bun run db:generate`.
- [x] Folder `src/routes/` dan `src/services/` dibuat.
- [x] File `src/routes/users-route.ts` dan `src/services/users-service.ts` diimplementasikan sesuai pemisahan tanggung jawab.
- [x] Password disimpan dalam bentuk hash bcrypt (tidak plain text).
- [x] Endpoint `POST /api/users` mengembalikan `{"data": "OK"}` jika berhasil.
- [x] Endpoint `POST /api/users` mengembalikan `{"error": "Email sudah terdaftar"}` jika email sudah digunakan.
- [x] `bun run typecheck` lolos tanpa error TypeScript.
