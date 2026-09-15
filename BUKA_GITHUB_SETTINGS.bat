@echo off
chcp 65001 >nul
color 0E
cls

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║           🌐 BUKA GITHUB PAGES SETTINGS SEKARANG              ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo.
echo  📢 DEPLOY SUDAH BERHASIL! Branch gh-pages sudah ada.
echo.
echo  ⚠️  TAPI... website masih blank karena GitHub Pages settings
echo     belum dikonfigurasi untuk menggunakan branch gh-pages.
echo.
echo ═══════════════════════════════════════════════════════════════════
echo.
echo  🔧 YANG HARUS KAMU LAKUKAN SEKARANG:
echo.
echo     Script ini akan otomatis membuka halaman GitHub Pages settings.
echo.
echo     Di halaman itu:
echo.
echo     1️⃣  Cari bagian "Build and deployment"
echo.
echo     2️⃣  Ubah setting:
echo         • Source: Deploy from a branch
echo         • Branch: gh-pages (pilih dari dropdown)
echo         • Folder: / (root)
echo.
echo     3️⃣  Klik tombol [Save] (warna hijau)
echo.
echo     4️⃣  Tunggu 2-3 menit
echo.
echo     5️⃣  Website akan live di:
echo         https://ravalkyrie.github.io/SIM-PJJ/
echo.
echo ═══════════════════════════════════════════════════════════════════
echo.
echo  Tekan ENTER untuk membuka GitHub Pages settings...
echo.
pause >nul

start https://github.com/Ravalkyrie/SIM-PJJ/settings/pages

echo.
echo  ✅ Browser terbuka! Ikuti instruksi di atas.
echo.
echo  💡 Setelah save, tunggu 2-3 menit lalu buka website kamu.
echo.
echo ═══════════════════════════════════════════════════════════════════
echo.
timeout /t 3 >nul

echo  Apakah kamu ingin langsung membuka website setelah setting?
echo  (Tunggu 2-3 menit dulu setelah klik Save di GitHub!)
echo.
echo  Tekan Y untuk buka website, atau ENTER untuk skip...
echo.

choice /c YN /n /t 10 /d N /m ""

if errorlevel 2 goto :skip
if errorlevel 1 goto :open

:open
echo.
echo  🌐 Membuka website...
start https://ravalkyrie.github.io/SIM-PJJ/
echo.
echo  ✅ Website terbuka! Jika masih blank, tunggu 1-2 menit lagi.
echo.
goto :end

:skip
echo.
echo  ⏭️  Skipped. Buka manual setelah 2-3 menit:
echo     https://ravalkyrie.github.io/SIM-PJJ/
echo.

:end
echo ═══════════════════════════════════════════════════════════════════
echo.
echo  📋 TROUBLESHOOTING:
echo.
echo  • Website masih blank setelah 5 menit?
echo    → Hard refresh: Ctrl + Shift + R
echo.
echo  • Masih blank juga?
echo    → Cek GitHub Pages settings lagi, pastikan sudah Save
echo.
echo  • Ada error?
echo    → Baca file: FIX_GITHUB_PAGES_BLANK.txt
echo.
echo ═══════════════════════════════════════════════════════════════════
echo.
pause
