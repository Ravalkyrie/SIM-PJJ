@echo off
chcp 65001 > nul
color 0A
echo.
echo ═══════════════════════════════════════════════════════════════════
echo      ✅ FILE SUDAH DIUBAH - DEPLOY SEKARANG
echo ═══════════════════════════════════════════════════════════════════
echo.
echo PERUBAHAN YANG DILAKUKAN:
echo ✅ BrowserRouter → HashRouter di src/App.tsx
echo.
echo FILE: C:\New folder\Manajemen\src\App.tsx
echo BARIS 7: import { HashRouter as Router, ... }
echo.
echo ═══════════════════════════════════════════════════════════════════
echo.
echo Script ini akan:
echo 1. Git add, commit, push
echo 2. npm run build
echo 3. npm run deploy
echo.
pause
echo.
cd "C:\New folder\Manajemen"
if errorlevel 1 (
    echo ❌ ERROR: Folder tidak ditemukan
    pause
    exit /b 1
)
echo ✅ Folder project: C:\New folder\Manajemen
echo.
echo ═══════════════════════════════════════════════════════════════════
echo 📝 GIT COMMIT & PUSH...
echo ═══════════════════════════════════════════════════════════════════
echo.
git add src/App.tsx
git commit -m "Fix: Ubah BrowserRouter ke HashRouter untuk GitHub Pages compatibility"
git push origin main
echo.
if errorlevel 1 (
    echo ⚠️ WARNING: Git push mungkin gagal, tapi lanjut build...
    echo.
)
echo ═══════════════════════════════════════════════════════════════════
echo 🔨 BUILDING PROJECT...
echo ═══════════════════════════════════════════════════════════════════
echo.
call npm run build
if errorlevel 1 (
    echo.
    echo ❌ ERROR: Build gagal!
    echo.
    echo Kemungkinan:
    echo - Ada syntax error di code
    echo - Dependencies belum terinstall (npm install)
    echo - TypeScript error
    echo.
    pause
    exit /b 1
)
echo.
echo ✅ Build berhasil!
echo.
echo ═══════════════════════════════════════════════════════════════════
echo 🚀 DEPLOYING TO GITHUB PAGES...
echo ═══════════════════════════════════════════════════════════════════
echo.
call npm run deploy
if errorlevel 1 (
    echo.
    echo ❌ ERROR: Deploy gagal!
    echo.
    echo Kemungkinan:
    echo - Koneksi internet bermasalah
    echo - GitHub credentials tidak valid
    echo - Branch gh-pages ada masalah
    echo.
    pause
    exit /b 1
)
echo.
echo ═══════════════════════════════════════════════════════════════════
echo         ✅ DEPLOY BERHASIL!
echo ═══════════════════════════════════════════════════════════════════
echo.
echo PERUBAHAN:
echo • BrowserRouter → HashRouter
echo • URL sekarang menggunakan # (hash)
echo.
echo 📋 LANGKAH SELANJUTNYA:
echo.
echo 1. ⏱️  TUNGGU 2-3 menit untuk GitHub Pages propagasi
echo.
echo 2. 🌐 BUKA website (perhatikan ada # di URL):
echo    https://ravalkyrie.github.io/SIM-PJJ/#/
echo.
echo 3. ✅ TEST semua halaman:
echo    • https://ravalkyrie.github.io/SIM-PJJ/#/dashboard
echo    • https://ravalkyrie.github.io/SIM-PJJ/#/kontrak
echo    • https://ravalkyrie.github.io/SIM-PJJ/#/kontrak/baru
echo    • https://ravalkyrie.github.io/SIM-PJJ/#/log-aktivitas
echo    • https://ravalkyrie.github.io/SIM-PJJ/#/hak-akses
echo.
echo 4. 🔄 Jika masih bermasalah:
echo    • Hard refresh: Ctrl + Shift + R
echo    • Clear cache: Ctrl + Shift + Delete
echo    • Coba browser lain atau incognito mode
echo.
echo 5. 📱 TEST di mobile browser juga
echo.
echo ═══════════════════════════════════════════════════════════════════
echo.
echo 💡 CATATAN PENTING:
echo.
echo ✓ URL dengan # (hash) adalah NORMAL untuk GitHub Pages
echo ✓ Ini adalah solusi standard untuk React SPA di static hosting
echo ✓ Semua konten seharusnya tampil dengan baik sekarang
echo ✓ Navigasi akan bekerja sempurna
echo.
echo ═══════════════════════════════════════════════════════════════════
echo.
pause
