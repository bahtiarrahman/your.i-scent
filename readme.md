# 📂 Struktur File Website your.i scent

## ✅ Reorganisasi Selesai!

File JavaScript dan HTML telah direorganisasi untuk kemudahan maintenance dan performa yang lebih baik.

---

## 📁 Struktur Folder

```
your-i-scent/
├── index.html
├── katalog.html
├── kontak.html
├── tentang.html
└── includes/
    ├── header.html
    ├── footer.html
    ├── style.css
    ├── script.js          ← Global functions
    └── products.js        ← Product data & functions
```

---

## 📄 Penjelasan File

### **HTML Files** (index, katalog, kontak, tentang)
- ✅ Semua sudah menggunakan `header.html` dan `footer.html` dari folder includes
- ✅ Tidak ada lagi kode duplikat
- ✅ Script sudah konsisten di semua halaman

**Load order:**
```html
<script src="includes/script.js"></script>     <!-- Load dulu -->
<script src="includes/products.js"></script>   <!-- Load kedua -->
<script>
    loadHTML('header-container', 'includes/header.html');
    loadHTML('footer-container', 'includes/footer.html');
</script>
```

### **script.js** (Global Functions)
Berisi fungsi yang dipakai di **SEMUA halaman**:
- 🛒 Cart system (add, update, remove)
- 💳 Payment system (modal, checkout)
- 💬 WhatsApp integration
- 🔔 Notifications
- 📱 Header events (menu, dropdown)
- 🔧 Utility functions (formatRupiah, loadHTML)

### **products.js** (Product Specific)
Berisi **HANYA** yang berhubungan dengan produk:
- 📦 Data produk (array `products`)
- 🎨 Render product cards
- ➕ Add to cart functionality

---

## 🎯 Keuntungan Struktur Baru

### 1. **Mudah Maintenance** ✨
   - Header/Footer cukup edit 1 file (`header.html` / `footer.html`)
   - Bug di produk? Cek `products.js`
   - Bug di cart? Cek `script.js`

### 2. **Performa Lebih Baik** ⚡
   - Halaman kontak & tentang tidak perlu load `products.js`
   - Kode lebih terorganisir dan mudah di-cache browser

### 3. **Scalable** 📈
   - Mau tambah fitur reviews? Bikin `reviews.js`
   - Mau tambah wishlist? Bikin `wishlist.js`
   - Tinggal load sesuai kebutuhan halaman

### 4. **Tidak Bingung** 🧠
   - Jelas mana global, mana specific
   - Komentar yang informatif
   - Struktur yang konsisten

---

## 📋 Catatan Penting

### Urutan Load Script
**PENTING!** `script.js` harus di-load **SEBELUM** `products.js` karena:
- `products.js` butuh fungsi `addToCart()` dari `script.js`
- `products.js` butuh fungsi `formatRupiah()` dari `script.js`

### Halaman Kontak & Tentang
Kedua halaman ini **TIDAK perlu** `products.js`, jadi scriptnya cukup:
```html
<script src="includes/script.js"></script>
<!-- products.js tidak perlu di-load -->
```

### Halaman Index & Katalog
Kedua halaman ini **BUTUH** `products.js`, jadi load keduanya:
```html
<script src="includes/script.js"></script>
<script src="includes/products.js"></script>
```

---

## 🚀 Next Steps (Opsional)

Kalau mau lebih advanced lagi, bisa:

1. **Minify JS** untuk performa:
   ```
   script.min.js
   products.min.js
   ```

2. **Tambah Loading State:**
   - Show skeleton saat load produk
   - Loading indicator saat checkout

3. **LocalStorage:**
   - Simpan cart di localStorage
   - Cart tidak hilang saat refresh

4. **Search & Filter:**
   - Bikin `search.js` untuk fitur pencarian
   - Filter by category, price range

---

## ✅ Checklist Implementasi

- [x] Pisahkan `script.js` dan `products.js`
- [x] Update semua file HTML
- [x] Konsistensi load order
- [x] Hapus inline scripts
- [x] Dokumentasi

**Status: SELESAI!** 🎉

---

**Dibuat dengan ❤️ untuk your.i scent**