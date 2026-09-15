@echo off
chcp 65001 > nul
color 0E
echo.
echo ═══════════════════════════════════════════════════════════════════
echo         🔍 DIAGNOSA: KONTEN KOSONG DI GITHUB PAGES
echo ═══════════════════════════════════════════════════════════════════
echo.
echo Masalah yang terdeteksi:
echo ✅ Sidebar dan header tampil
echo ✅ GitHub Pages sudah live
echo ❌ Area konten tengah kosong (blank putih)
echo.
echo ───────────────────────────────────────────────────────────────────
echo 💡 KEMUNGKINAN PENYEBAB:
echo ───────────────────────────────────────────────────────────────────
echo.
echo 1. ROUTING CONFIGURATION ERROR
echo    → Vue Router base path tidak sesuai
echo    → Seharusnya: base: '/SIM-PJJ/'
echo.
echo 2. DEFAULT ROUTE TIDAK ADA
echo    → Tidak ada redirect ke halaman utama
echo    → URL: /SIM-PJJ/ tidak mengarah ke komponen
echo.
echo 3. API/DATA LOADING ISSUE
echo    → Komponen menunggu data dari API
echo    → API endpoint mungkin error
echo.
echo ───────────────────────────────────────────────────────────────────
echo 🔧 SOLUSI CEPAT:
echo ───────────────────────────────────────────────────────────────────
echo.
echo OPSI 1: Coba akses langsung ke halaman spesifik
echo ┌─────────────────────────────────────────────────────────────────┐
echo │ https://ravalkyrie.github.io/SIM-PJJ/dashboard                  │
echo │ https://ravalkyrie.github.io/SIM-PJJ/kontrak                    │
echo │ https://ravalkyrie.github.io/SIM-PJJ/login                      │
echo └─────────────────────────────────────────────────────────────────┘
echo.
echo OPSI 2: Cek Console Browser untuk error
echo    1. Tekan F12 di browser
echo    2. Klik tab "Console"
echo    3. Cari error berwarna merah
echo    4. Screenshot dan kirim ke developer
echo.
echo OPSI 3: Cek Network tab untuk failed requests
echo    1. Tekan F12 di browser
echo    2. Klik tab "Network"
echo    3. Refresh halaman (Ctrl+Shift+R)
echo    4. Cari request yang failed (merah)
echo.
echo ───────────────────────────────────────────────────────────────────
echo 🛠️ FIX OTOMATIS (Jika source code ada):
echo ───────────────────────────────────────────────────────────────────
echo.
echo Jika Anda punya akses ke source code, perlu cek:
echo.
echo File: vite.config.js atau vue.config.js
echo └─→ Pastikan ada: base: '/SIM-PJJ/'
echo.
echo File: router/index.js
echo └─→ Pastikan ada: 
echo     - createWebHistory('/SIM-PJJ/')
echo     - Default route redirect ke dashboard/home
echo.
echo ═══════════════════════════════════════════════════════════════════
echo.
pause
