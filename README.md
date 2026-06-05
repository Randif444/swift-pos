# 🧾 Swift POS

> **Sistem Kasir Multi-Tenant Modern untuk Restoran, Kedai, dan UMKM**

Swift POS adalah sistem Point of Sale berbasis web yang dirancang khusus untuk manajemen restoran, kedai, dan UMKM. Sistem ini menerapkan pemisahan ketat antara **Frontend Layer** (komponen interaktif visual) dan **Backend Layer** (mutasi data server) guna menghasilkan performa yang cepat, aman, dan responsif.

---

## 🚀 Tech Stack Utama

| Kategori                 | Teknologi                                                         |
| ------------------------ | ----------------------------------------------------------------- |
| **Framework**            | Next.js (App Router)                                              |
| **Database & Auth**      | Supabase (PostgreSQL + Row Level Security)                        |
| **Styling**              | Tailwind CSS & Shadcn UI Components                               |
| **State & Utilities**    | Custom Hooks (`useDebounce`, `useThrottle`), Clsx, Tailwind Merge |
| **Charts & Visualisasi** | Recharts Analytics                                                |

---

## 🛠️ Fitur Unggulan

### 🏢 Multi-Tenant Architecture

Sistem manajemen terisolasi yang memungkinkan banyak toko/merchant berjalan secara independen dalam satu platform, tanpa interferensi data antar tenant.

### 💳 Real-Time POS Kasir

Panel kasir interaktif dengan pencarian produk cerdas berbasis _debounced search_ dan pencegahan aksi ganda (_throttled cart action_) untuk pengalaman kasir yang lancar.

### 💰 Input Nominal Pembayaran Cerdas

Input kasir secara otomatis menyematkan format titik ribuan Rupiah secara _real-time_ untuk mencegah kesalahan input uang tunai.

### 🖨️ Cetak Nota Thermal (58mm)

Generator struk belanja otomatis yang mendukung:

- Pratinjau langsung di layar (_screen preview_)
- Pencetakan fisik ke printer thermal 58mm

### 📒 Sistem Piutang Member Khusus

Pelacakan utang dan bon belanja yang diikat langsung pada akun member terdaftar — bukan sakelar umum — sesuai alur operasional UMKM terarah.

### 📊 Ekspor Data Excel

Unduh riwayat mutasi transaksi ke format spreadsheet secara instan dan asinkron.

### 📦 Manajemen Inventaris & Stok

Notifikasi otomatis berupa badge indikator untuk produk yang menipis:

- 🔴 **Need Restock** — stok di bawah ambang batas
- 🟢 **Safe Stock** — stok aman

---

## 📁 Arsitektur Kode

Proyek ini menerapkan **pemisahan layer kode** secara disiplin:

```
Swift POS
├── Frontend Layer
│   ├── Presentasi visual & penataan Tailwind CSS responsif
│   ├── Pemformatan mata uang lokal (id-ID)
│   ├── State lokal UI & interaksi dialog modal
│   └── Manipulasi DOM (HTML5 Canvas kompresi foto, iframe print nota)
│
└── Backend Layer (Server-Side Only)
    ├── Next.js Server Actions & Middleware
    ├── Supabase SSR Server Client
    ├── Pengamanan gerbang autentikasi session cookies
    ├── Bypass RLS via Admin Service Role
    └── Mutasi data langsung ke tabel database
```

---

## 🔧 Panduan Instalasi Lokal

### 1. Clone Repositori

```bash
git clone https://github.com/username/swift-pos.git
cd swift-pos
```

### 2. Instalasi Dependencies

```bash
npm install
```

### 3. Konfigurasi Environment Variables

Buat file `.env.local` di akar proyek dan lengkapi kredensial Supabase Anda:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 4. Jalankan Aplikasi

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## 🔒 Kebijakan Struktur Database

> [!IMPORTANT]
> **Dilarang keras** menebak nama tabel atau kolom database baru secara sepihak.
> Struktur database (SQL) **wajib dikonfirmasi terlebih dahulu** sebelum menyusun atau menambahkan kode backend/server action baru, demi menjaga konsistensi skema database.

---

## 📝 Catatan Rilis & Pengembangan

### Pembaruan Input Kasir

Migrasi tipe input pembayaran tunai dari `type="number"` ke `type="text"` dengan pembatasan `inputMode="numeric"` — mendukung visualisasi tanda titik ribuan otomatis tanpa merusak data kalkulasi asli.

### Optimalisasi Resolusi Layout

Implementasi pemangkasan teks otomatis (`truncate`) dan font responsif pintar pada kartu analitik harian untuk mencegah angka nominal meluap keluar batas komponen pembungkus (_card overflow_).

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah ketentuan yang berlaku. Lihat file `LICENSE` untuk detail lebih lanjut.

---

<p align="center">
  Dibuat dengan ☕ untuk project portfolio, syukur2 kalo bisa bermanfaat. 
</p>
