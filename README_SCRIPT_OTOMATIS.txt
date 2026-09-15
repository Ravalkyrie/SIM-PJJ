╔═══════════════════════════════════════════════════════════════════╗
║        ✅ SOLUSI OTOMATIS - CARI DAN UBAH FILE ROUTER             ║
║                    BACA INI SEKARANG!                             ║
╚═══════════════════════════════════════════════════════════════════╝

MASALAH:
❌ File router tidak ketemu di lokasi standard
❌ Tidak bisa akses file system secara langsung

SOLUSI:
✅ Script otomatis yang akan mencari dan mengubah file untuk Anda!

═══════════════════════════════════════════════════════════════════
🚀 CARA MENGGUNAKAN (SANGAT MUDAH):
═══════════════════════════════════════════════════════════════════

LANGKAH 1: JALANKAN SCRIPT
┌─────────────────────────────────────────────────────────────────┐
│ Double-click: CARI_DAN_UBAH_OTOMATIS.bat                         │
└─────────────────────────────────────────────────────────────────┘

LANGKAH 2: MASUKKAN PATH PROJECT
┌─────────────────────────────────────────────────────────────────┐
│ Script akan tanya path folder project.                          │
│ Contoh: C:\New folder\Manajemen                                 │
│                                                                  │
│ Paste path dan tekan Enter                                      │
└─────────────────────────────────────────────────────────────────┘

LANGKAH 3: KONFIRMASI FILE
┌─────────────────────────────────────────────────────────────────┐
│ Script akan tampilkan file yang ditemukan.                      │
│ Cek apakah itu file router yang benar.                          │
│ Ketik: y (untuk konfirmasi)                                     │
└─────────────────────────────────────────────────────────────────┘

LANGKAH 4: DEPLOY
┌─────────────────────────────────────────────────────────────────┐
│ Script akan tanya apakah mau deploy otomatis.                   │
│ Ketik: y (untuk deploy)                                         │
│ Script akan otomatis:                                            │
│   • Backup file original                                         │
│   • Ubah createWebHistory → createWebHashHistory                │
│   • Git commit & push                                            │
│   • npm run build                                                │
│   • npm run deploy                                               │
└─────────────────────────────────────────────────────────────────┘

LANGKAH 5: TUNGGU & TEST
┌─────────────────────────────────────────────────────────────────┐
│ • Tunggu 2-3 menit untuk propagasi                              │
│ • Buka: https://ravalkyrie.github.io/SIM-PJJ/#/                │
│ • Test semua halaman                                            │
│ • Hard refresh: Ctrl+Shift+R                                    │
└─────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════
✅ APA YANG DILAKUKAN SCRIPT:
═══════════════════════════════════════════════════════════════════

1. Mencari semua file .js, .ts, .vue di project
2. Cari file yang berisi "createWebHistory"
3. Tampilkan isi file untuk konfirmasi
4. Backup file original (*.backup)
5. Ubah semua "createWebHistory" → "createWebHashHistory"
6. Deploy otomatis ke GitHub Pages
7. Tampilkan instruksi testing

═══════════════════════════════════════════════════════════════════
🛡️ KEAMANAN:
═══════════════════════════════════════════════════════════════════

✅ File original di-backup sebelum diubah
✅ Konfirmasi manual sebelum ubah
✅ Konfirmasi manual sebelum deploy
✅ Jika build gagal, file dikembalikan dari backup

Backup file akan tersimpan dengan nama:
  [nama_file_asli].backup

Contoh:
  src/router/index.js.backup

═══════════════════════════════════════════════════════════════════
❓ JIKA TERJADI ERROR:
═══════════════════════════════════════════════════════════════════

ERROR: "Folder tidak ditemukan"
└─→ Pastikan path yang dimasukkan benar
    Cek dengan File Explorer
    Copy path lengkapnya

ERROR: "File tidak ditemukan"
└─→ Kemungkinan file sudah menggunakan createWebHashHistory
    Atau router dikonfigurasi di tempat lain
    Cek manual dengan VS Code search

ERROR: "Build gagal"
└─→ Script otomatis kembalikan file dari backup
    Cek error message untuk troubleshooting

ERROR: "Deploy gagal"
└─→ Cek koneksi internet
    Cek GitHub credentials
    Deploy manual jika perlu

═══════════════════════════════════════════════════════════════════
🔄 JIKA INGIN ROLLBACK:
═══════════════════════════════════════════════════════════════════

File backup otomatis tersimpan dengan ekstensi .backup

Untuk rollback:
1. Cari file: [nama_file].backup
2. Rename/copy ke nama original
3. Deploy ulang

Contoh:
  copy src\router\index.js.backup src\router\index.js
  git add .
  git commit -m "Rollback router"
  npm run build
  npm run deploy

═══════════════════════════════════════════════════════════════════
💡 TIPS:
═══════════════════════════════════════════════════════════════════

• Pastikan tidak ada perubahan uncommitted sebelum jalankan script
• Biarkan terminal terbuka sampai deploy selesai
• Screenshot setiap langkah untuk dokumentasi
• Simpan file backup untuk jaga-jaga

═══════════════════════════════════════════════════════════════════
📂 LOKASI FILE:
═══════════════════════════════════════════════════════════════════

Script: C:\New folder\Manajemen\CARI_DAN_UBAH_OTOMATIS.bat

Double-click untuk menjalankan!

═══════════════════════════════════════════════════════════════════
Last Updated: 16 September 2026, 03:03 WIB
Script Version: 1.0
═══════════════════════════════════════════════════════════════════
