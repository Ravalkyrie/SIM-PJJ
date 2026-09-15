@echo off
chcp 65001 > nul
color 0A
echo.
echo ═══════════════════════════════════════════════════════════════════
echo      ✅ FIX CEPAT: KEMBALI KE HASH ROUTER
echo ═══════════════════════════════════════════════════════════════════
echo.
echo MASALAH TERIDENTIFIKASI:
echo ✅ Dulu pakai Hash Router (#) → NORMAL
echo ❌ Diubah ke History Router (tanpa #) → ERROR
echo.
echo SOLUSI:
echo Kembali ke Hash Router untuk GitHub Pages compatibility
echo.
echo ═══════════════════════════════════════════════════════════════════
echo.
echo Script ini akan MEMBUKA file router untuk di-edit manual.
echo Lokasi kemungkinan ada di:
echo   • src/router/index.js
echo   • src/router/index.ts
echo.
echo YANG HARUS DIUBAH:
echo.
echo DARI:
echo   import { createRouter, createWebHistory } from 'vue-router'
echo   history: createWebHistory('/SIM-PJJ/')
echo.
echo KE:
echo   import { createRouter, createWebHashHistory } from 'vue-router'
echo   history: createWebHashHistory('/SIM-PJJ/')
echo.
echo ═══════════════════════════════════════════════════════════════════
pause
echo.
echo Mencari file router...
echo.
cd "C:\New folder\Manajemen"
if errorlevel 1 (
    echo ❌ ERROR: Folder project tidak ditemukan
    pause
    exit /b 1
)

echo Membuka file router (jika ada)...
echo.

if exist "src\router\index.js" (
    echo ✅ Ditemukan: src\router\index.js
    echo Membuka dengan notepad...
    notepad "src\router\index.js"
    goto :found
)

if exist "src\router\index.ts" (
    echo ✅ Ditemukan: src\router\index.ts
    echo Membuka dengan notepad...
    notepad "src\router\index.ts"
    goto :found
)

echo ❌ File router tidak ditemukan di lokasi standard
echo.
echo Silakan cari manual file yang berisi:
echo   • createWebHistory
echo   • createRouter
echo.
pause
exit /b 1

:found
echo.
echo ═══════════════════════════════════════════════════════════════════
echo File sudah dibuka di notepad!
echo ═══════════════════════════════════════════════════════════════════
echo.
echo PETUNJUK EDIT:
echo.
echo 1. Di baris import, ubah:
echo    createWebHistory → createWebHashHistory
echo.
echo 2. Di router config, ubah:
echo    history: createWebHistory('/SIM-PJJ/')
echo    menjadi:
echo    history: createWebHashHistory('/SIM-PJJ/')
echo.
echo 3. Save file (Ctrl+S)
echo.
echo 4. Close notepad
echo.
pause
echo.
echo ═══════════════════════════════════════════════════════════════════
echo DEPLOY SEKARANG?
echo ═══════════════════════════════════════════════════════════════════
echo.
set /p deploy="Sudah save file? Deploy sekarang? (y/n): "
if /i not "%deploy%"=="y" (
    echo Deploy dibatalkan. Jalankan manual:
    echo   git add .
    echo   git commit -m "Fix: Kembali ke hash router"
    echo   git push origin main
    echo   npm run build
    echo   npm run deploy
    pause
    exit /b 0
)

echo.
echo Memulai deploy...
echo.

git add .
git commit -m "Fix: Kembali ke hash router untuk GitHub Pages compatibility"
git push origin main

if errorlevel 1 (
    echo ⚠️ WARNING: Git push mungkin gagal, lanjut build...
)

call npm run build
if errorlevel 1 (
    echo ❌ ERROR: Build gagal!
    pause
    exit /b 1
)

call npm run deploy
if errorlevel 1 (
    echo ❌ ERROR: Deploy gagal!
    pause
    exit /b 1
)

echo.
echo ═══════════════════════════════════════════════════════════════════
echo         ✅ SELESAI! DEPLOY BERHASIL!
echo ═══════════════════════════════════════════════════════════════════
echo.
echo 📋 LANGKAH SELANJUTNYA:
echo.
echo 1. ⏱️  TUNGGU 2-3 menit untuk GitHub Pages propagasi
echo.
echo 2. 🌐 BUKA website:
echo    https://ravalkyrie.github.io/SIM-PJJ/#/
echo    (Perhatikan ada # di URL sekarang)
echo.
echo 3. ✅ TEST navigasi:
echo    - https://ravalkyrie.github.io/SIM-PJJ/#/kontrak
echo    - https://ravalkyrie.github.io/SIM-PJJ/#/dashboard
echo.
echo 4. 🔄 Hard refresh: Ctrl + Shift + R
echo.
echo ═══════════════════════════════════════════════════════════════════
echo.
pause
