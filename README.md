# Swift POS

**Swift POS** adalah platform kasir digital (_Point of Sale_) berbasis web dengan arsitektur _multi-tenant_ yang dirancang untuk performa tinggi dan integritas data maksimal. Dibangun menggunakan stack modern untuk memastikan sistem yang cepat, aman, dan siap untuk lingkungan retail produksi.

---

## Tech Stack

- **Framework**: Next.js 15 (App Router).
- **Backend Logic**: Next.js Server Actions.
- **Database**: Supabase PostgreSQL.
- **Security**: Row Level Security (RLS) & Supabase Auth.
- **Optimization**: LCP Performance Optimization.

---

## Fitur Keamanan & Integritas Data

### 1. Backend Price Check (Anti-Fraud)

Sistem menerapkan validasi harga di sisi server. Setiap transaksi akan diverifikasi dengan mengambil harga resmi langsung dari database untuk mencegah manipulasi harga dari sisi browser/klien. Jika ditemukan ketidakcocokan, transaksi akan otomatis ditolak.

### 2. Multi-Tenant Isolation (RLS)

Keamanan data antar toko dijamin melalui **PostgreSQL Row Level Security**. Kebijakan RLS memastikan user hanya dapat mengakses data yang sesuai dengan `tenant_id` mereka, sehingga data antar penyewa terisolasi secara total.

### 3. Automated Inventory Logs

Setiap pergerakan stok dicatat secara otomatis dalam sistem log:

- **IN**: Penambahan stok/restock produk.
- **OUT**: Pengurangan stok akibat transaksi penjualan.
- **ADJUSTMENT**: Koreksi stok secara manual untuk keperluan audit.

---

## Arsitektur Database

- **`products`**: Menyimpan katalog, harga resmi, dan jumlah stok berjalan.
- **`transactions`**: Rekaman penjualan yang bersifat _immutable_ untuk menjaga akurasi laporan.
- **`inventory_transactions`**: Log detail arus masuk dan keluar barang untuk transparansi stok.

---

## Optimasi Performa (LCP)

Swift POS menargetkan skor **Largest Contentful Paint (LCP) di bawah 2.5 detik**. Optimasi dilakukan melalui manajemen _database query_ yang efisien dan penggunaan komponen `next/image` dengan teknik _priority loading_ pada elemen visual utama.

```typescript
// Implementasi optimasi gambar produk
import Image from "next/image";

<Image
  src="/product-image.png"
  alt="Product Name"
  width={300}
  height={300}
  priority
/>
```
