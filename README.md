# 🧾 Swift POS

> **Sistem Kasir Multi-Tenant Modern untuk Restoran, Kedai, dan UMKM**

Swift POS (Kedai Artha) adalah sistem Point of Sale berbasis web yang dirancang khusus untuk manajemen restoran, kedai, dan UMKM. Sistem ini menerapkan pemisahan ketat antara **Frontend Layer** (komponen interaktif visual) dan **Backend Layer** (mutasi data server) guna menghasilkan performa yang cepat, aman, dan responsif.

---

## 🚀 Tech Stack Utama

| Kategori | Teknologi |
| --- | --- |
| **Framework** | Next.js (App Router) |
| **Database & Auth** | Supabase (PostgreSQL + Row Level Security) |
| **Styling** | Tailwind CSS & Shadcn UI Components |
| **State & Utilities** | Custom Hooks (`useDebounce`, `useThrottle`), Clsx, Tailwind Merge |
| **Charts & Visualisasi** | Recharts Analytics |

---

## 🛠️ Fitur Unggulan

### 🏢 Multi-Tenant Architecture
Sistem manajemen terisolasi yang memungkinkan banyak toko/merchant berjalan secara independen dalam satu platform, tanpa interferensi data antar tenant melalui penguncian token JWT server-side.

### 💳 Real-Time POS Kasir
Panel kasir interaktif dengan pencarian produk cerdas berbasis _debounced search_ (300ms) dan pencegahan aksi ganda otomatis (_throttled action_) untuk memproses pesanan Tunai, QRIS, dan sistem Bon (DEBT) secara lancar.

### 💰 Input Nominal Pembayaran Cerdas
Input kasir secara otomatis menyematkan format titik ribuan Rupiah secara _real-time_ menggunakan Regex masking untuk mencegah kesalahan kasir membaca nominal uang tunai.

### 🖨️ Cetak Nota Thermal (58mm)
Generator struk belanja otomatis yang mendukung pratinjau langsung di layar (_screen preview_) serta pencetakan fisik langsung ke perangkat printer thermal 58mm.

### 📒 Sistem Bon & Hutang Pelanggan (DEBT)
Mendukung opsi pencatatan transaksi non-tunai berupa Bon Toko yang diikat langsung pada UUID entitas data pelanggan terdaftar di tabel `customers` database Supabase, mengisolasi pelacakan field `total_debt` secara akurat.

### 👥 Manajemen Staf & Tim
Modul back-office interaktif untuk mengundang tim operasional baru lewat mekanisme *Unique Invitation Access Code* serta kontrol penuh aktivasi status staf secara *real-time*.

### 📦 Manajemen Inventaris & Stok
Notifikasi otomatis berupa badge indikator kondisional di layar kasir untuk mendeteksi produk yang stoknya menipis:
- 🔴 **Need Restock** — stok habis atau di bawah ambang batas
- 🟢 **Safe Stock** — stok aman

---

## 📁 Arsitektur Kode

Proyek ini menerapkan **pemisahan layer kode** secara disiplin:

```
Swift POS
├── Frontend Layer
│   ├── Presentasi visual & penataan Tailwind CSS responsif
│   ├── Pemformatan mata uang lokal Rupiah (id-ID)
│   ├── State lokal UI, kustom Hooks, & interaksi dialog modal
│   └── Format Masking Regex (Uang tunai kasir)
│
└── Backend Layer (Server-Side Only)
    ├── Next.js Server Actions & Middleware
    ├── Supabase SSR Server Client
    ├── Pengamanan gerbang autentikasi session cookies
    ├── Isolasi data wilayah kerja via PostgreSQL Row Level Security (RLS)
    └── Mutasi data terverifikasi aman langsung ke tabel database
```

---

## 🔧 Panduan Instalasi Lokal

### 1. Clone Repositori

```bash
git clone https://github.com/Randif444/swift-pos.git
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

Buka <http://localhost:3000> di browser Anda.

---

## 🔒 Kebijakan Struktur Database

> [!IMPORTANT]
> **Dilarang keras** menebak nama tabel atau kolom database baru secara sepihak.
> Struktur database (SQL) **wajib dikonfirmasi terlebih dahulu** sebelum menyusun atau menambahkan kode backend/server action baru, demi menjaga konsistensi skema database.

---

## 📝 Catatan Rilis & Pengembangan

### Pembaruan Input Kasir
Migrasi tipe input pembayaran tunai dari `type="number"` ke `type="text"` dengan pembatasan `inputMode="numeric"` — mendukung visualisasi tanda titik ribuan otomatis tanpa merusak data kalkulasi asli.

### Refactor Dropdown DEBT Pelanggan
Tombol transaksi DEBT pada kasir kini dikunci secara aman menggunakan dropdown dinamis yang menarik relasi UUID data dari baris data pelanggan aktif di tabel `public.customers` Supabase guna memastikan akurasi data penanggung jawab bon.

---

## 📅 Future Backlog (Rencana Pengembangan)

- **Modul Visual CRUD Customers** — Pembuatan antarmuka visual khusus kasir di halaman dashboard untuk pendaftaran akun pelanggan baru dan pengaturan limit piutang (debt limit) secara dinamis (mengadopsi arsitektur dari halaman Manajemen Staf yang sudah berjalan).

- **Dynamic Analytics Filter** — Implementasi penyaringan rentang waktu berkala (Hari ini, Bulan ini, 3 Bulan Terakhir) pada grafik laba kotor Recharts.

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah ketentuan yang berlaku. Lihat file `LICENSE` untuk detail lebih lanjut.

---

Dibuat dengan ☕ untuk project portfolio, syukur-syukur kalau bisa bermanfaat.
