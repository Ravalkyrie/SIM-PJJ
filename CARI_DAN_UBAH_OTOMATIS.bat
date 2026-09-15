@echo off
chcp 65001 > nul
color 0A
echo.
echo ═══════════════════════════════════════════════════════════════════
echo      🔍 CARI DAN UBAH FILE ROUTER OTOMATIS
echo ═══════════════════════════════════════════════════════════════════
echo.
echo Script ini akan:
echo 1. Mencari file yang berisi "createWebHistory"
echo 2. Membuat backup
echo 3. Mengubah ke "createWebHashHistory"
echo 4. Deploy otomatis
echo.
echo ⚠️ PERHATIAN: Pastikan Anda sudah di folder project yang benar!
echo.
set /p project_path="Masukkan path lengkap folder project (contoh: C:\New folder\Manajemen): "
echo.
cd /d "%project_path%"
if errorlevel 1 (
    echo ❌ ERROR: Folder tidak ditemukan!
    pause
    exit /b 1
)
echo ✅ Folder ditemukan: %project_path%
echo.
echo ═══════════════════════════════════════════════════════════════════
echo 📂 MENCARI FILE ROUTER...
echo ═══════════════════════════════════════════════════════════════════
echo.

:: Cari file yang berisi createWebHistory
for /r %%f in (*.js *.ts *.vue) do (
    findstr /i /c:"createWebHistory" "%%f" >nul 2>&1
    if not errorlevel 1 (
        echo.
        echo ✅ DITEMUKAN: %%f
        echo.
        set "router_file=%%f"
        goto :found
    )
)

echo ❌ Tidak ditemukan file yang berisi "createWebHistory"
echo.
echo Kemungkinan:
echo 1. File sudah menggunakan createWebHashHistory
echo 2. File ada di lokasi tidak standard
echo 3. Project menggunakan routing lain
echo.
pause
exit /b 1

:found
echo.
echo ═══════════════════════════════════════════════════════════════════
echo 📋 ISI FILE SAAT INI:
echo ═══════════════════════════════════════════════════════════════════
echo.
type "%router_file%"
echo.
echo ═══════════════════════════════════════════════════════════════════
echo.
set /p confirm="Apakah ini file router yang benar? (y/n): "
if /i not "%confirm%"=="y" (
    echo Dibatalkan.
    pause
    exit /b 0
)

echo.
echo ═══════════════════════════════════════════════════════════════════
echo 💾 MEMBUAT BACKUP...
echo ═══════════════════════════════════════════════════════════════════
echo.
copy "%router_file%" "%router_file%.backup"
echo ✅ Backup dibuat: %router_file%.backup
echo.

echo ═══════════════════════════════════════════════════════════════════
echo ✏️ MENGUBAH FILE...
echo ═══════════════════════════════════════════════════════════════════
echo.

:: Buat file temporary untuk hasil edit
set "temp_file=%temp%\router_temp_%random%.txt"

:: Ubah createWebHistory menjadi createWebHashHistory
powershell -Command "(Get-Content '%router_file%') -replace 'createWebHistory', 'createWebHashHistory' | Set-Content '%temp_file%'"

:: Copy hasil ke file asli
copy /y "%temp_file%" "%router_file%" >nul
del "%temp_file%"

echo ✅ File berhasil diubah!
echo.
echo ═══════════════════════════════════════════════════════════════════
echo 📋 ISI FILE SETELAH DIUBAH:
echo ═══════════════════════════════════════════════════════════════════
echo.
type "%router_file%"
echo.
echo ═══════════════════════════════════════════════════════════════════
echo.
set /p deploy="Deploy sekarang? (y/n): "
if /i not "%deploy%"=="y" (
    echo.
    echo File sudah diubah, tapi tidak di-deploy.
    echo Deploy manual dengan:
    echo   git add .
    echo   git commit -m "Fix: Hash router"
    echo   git push origin main
    echo   npm run build
    echo   npm run deploy
    pause
    exit /b 0
)

echo.
echo ═══════════════════════════════════════════════════════════════════
echo 🚀 DEPLOY...
echo ═══════════════════════════════════════════════════════════════════
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
    echo.
    echo Mengembalikan file dari backup...
    copy /y "%router_file%.backup" "%router_file%" >nul
    echo File dikembalikan.
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
echo File yang diubah: %router_file%
echo Backup tersimpan: %router_file%.backup
echo.
echo 📋 LANGKAH SELANJUTNYA:
echo.
echo 1. ⏱️  TUNGGU 2-3 menit untuk GitHub Pages propagasi
echo.
echo 2. 🌐 BUKA website:
echo    https://ravalkyrie.github.io/SIM-PJJ/#/
echo.
echo 3. ✅ TEST navigasi - semua konten seharusnya tampil normal
echo.
echo 4. 🔄 Jika masih bermasalah, hard refresh: Ctrl + Shift + R
echo.
echo ═══════════════════════════════════════════════════════════════════
echo.
pause
