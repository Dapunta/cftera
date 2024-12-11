# INFORMASI

## 1. Frontend
Frontend terletak di direktori routes dan memiliki dua bagian utama: client dan kasir.

### a. Client
Folder routes/client berisi file HTML, CSS, dan JavaScript untuk antarmuka pengguna, yaitu pelanggan.

- Folder utama:

    - invoice: Menampilkan invoice pesanan pelanggan.
        - File: index.html, css, dan javascript.

    - order: Halaman untuk memesan menu.
        - File: index.html, css, dan javascript.

- Fitur di client:

    - Invoice: Pelanggan dapat melihat rincian pesanan yang sudah dibuat.
    - Order Menu: Pelanggan dapat memilih makanan/minuman, melihat total biaya, dan melakukan pemesanan.

### b. Kasir
Folder routes/kasir berisi antarmuka untuk kasir atau admin.

- Folder utama:

    - dashboard: Untuk melihat data pesanan, daftar menu, dan laporan.
    - login: Halaman login untuk mengakses dashboard kasir.

- Fitur di kasir:

    - Login: Hanya kasir yang dapat masuk untuk mengelola pesanan.
    - Dashboard: Memantau pesanan, status pembayaran, dan mengelola menu.

- Style dan Komponen

    - CSS: Terdapat file untuk mengatur gaya global, seperti global.css, dan halaman spesifik, seperti main.css dan login.css.
    - JavaScript: Ada file untuk menangani interaksi pengguna, seperti fetch.js untuk mengambil data dari backend dan style.js untuk efek halaman.

## 2. Alur Kode
Berikut gambaran alur kode saat aplikasi dijalankan:

### a. Client Order (routes/client/order):
- Pelanggan membuka halaman order.
- JavaScript (fetchs.js, pesan.js) akan memuat menu dari backend.
- Pelanggan memilih menu dan menekan tombol Order.
- Data pesanan dikirim ke backend melalui API yang ditangani oleh Python backend.

### b. Invoice (routes/client/invoice):
- Setelah memesan, pelanggan bisa melihat invoice dengan kode unik.
- JavaScript (fetch.js) mengambil data invoice dari backend dan menampilkannya.

### c. Kasir Dashboard (routes/kasir/dashboard):
- Kasir login melalui halaman login (login/index.html).
- Setelah login berhasil, kasir diarahkan ke dashboard untuk melihat pesanan dan status pembayaran.
- JavaScript seperti menu.js dan orderlist.js digunakan untuk memuat data secara dinamis.

## 3. Fungsi Tombol/Fitur
Berikut beberapa tombol dan fitur yang ada di aplikasi:

### a. Client
- Order Now (Di halaman Order):
    - Fungsi: Menambahkan menu yang dipilih ke daftar pesanan.
    - Implementasi:
        - Data dikirim ke API backend menggunakan fetch() di JavaScript.

- View Invoice (Di halaman Invoice):
    - Fungsi: Menampilkan rincian pesanan pelanggan.
    - Implementasi:
        - JavaScript mengambil data dari backend menggunakan endpoint REST API.

### b. Kasir
- Login:
    - Fungsi: Validasi login kasir.
    - Implementasi: Data username dan password dikirim ke backend menggunakan POST API.

- View Orders (Dashboard):
    - Fungsi: Menampilkan daftar pesanan pelanggan.
    - Implementasi: JavaScript memuat data pesanan menggunakan fetch() ke backend.


## Backend Terkait
Backend berada di backend/python dan mendukung fitur frontend melalui:

### a. Endpoints di app/client untuk client:
    - get_menu.py: Mengambil daftar menu.
    - validate_order.py: Memproses pesanan.
    - get_invoice.py: Memberikan rincian invoice.

### b. Endpoints di app/admin untuk admin/kasir:
    - edit_menu.py: Mengelola menu.
    - fetch_order.py: Menarik data pesanan untuk dashboard.