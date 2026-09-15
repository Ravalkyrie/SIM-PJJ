@echo off
chcp 65001 > nul
color 0C
echo.
echo ═══════════════════════════════════════════════════════════════════
echo         ⚠️ ROLLBACK: KEMBALIKAN KE VERSI YANG BEKERJA
echo ═══════════════════════════════════════════════════════════════════
echo.
echo MASALAH:
echo ✅ Website normal sebelum favicon fix
echo ❌ Konten kosong setelah favicon fix
echo.
echo ───────────────────────────────────────────────────────────────────
echo 🔄 PROSES ROLLBACK OTOMATIS
echo ───────────────────────────────────────────────────────────────────
echo.
echo Script ini akan:
echo 1. Cek git history
echo 2. Tampilkan commit sebelum favicon fix
echo 3. Rollback ke commit yang benar
echo 4. Deploy ulang
echo.
echo ⚠️ PERHATIAN: Backup dulu jika ada perubahan yang belum di-commit!
echo.
pause
echo.
echo ───────────────────────────────────────────────────────────────────
echo 📂 Masuk ke folder project...
echo ───────────────────────────────────────────────────────────────────
cd "C:\New folder\Manajemen"
if errorlevel 1 (
    echo ❌ ERROR: Folder project tidak ditemukan!
    echo    Path: C:\New folder\Manajemen
    pause
    exit /b 1
)
echo ✅ Folder project ditemukan
echo.
echo ───────────────────────────────────────────────────────────────────
echo 📋 Menampilkan commit history (10 terakhir)...
echo ───────────────────────────────────────────────────────────────────
echo.
git log --oneline -10
echo.
echo ───────────────────────────────────────────────────────────────────
echo.
echo ⚠️ INSTRUKSI:
echo.
echo 1. Lihat daftar commit di atas
echo 2. Cari commit SEBELUM "Fix: Favicon tidak muncul"
echo 3. Copy HASH (kode 7 digit) dari commit yang benar
echo.
echo Contoh:
echo   abc1234 Fix: Favicon tidak muncul  ← SKIP INI
echo   def5678 Update kontrak module      ← ROLLBACK KE SINI (copy: def5678)
echo.
set /p COMMIT_HASH="Masukkan COMMIT HASH yang ingin di-rollback (atau ketik 'cancel' untuk batal): "
echo.
if /i "%COMMIT_HASH%"=="cancel" (
    echo ❌ Rollback dibatalkan
    pause
    exit /b 0
)
echo ───────────────────────────────────────────────────────────────────
echo 🔄 Rollback ke commit: %COMMIT_HASH%
echo ───────────────────────────────────────────────────────────────────
git checkout %COMMIT_HASH%
if errorlevel 1 (
    echo ❌ ERROR: Gagal rollback ke commit %COMMIT_HASH%
    echo    Pastikan commit hash benar
    pause
    exit /b 1
)
echo ✅ Rollback berhasil
echo.
echo ───────────────────────────────────────────────────────────────────
echo 🌿 Membuat branch baru: rollback-working-version
echo ───────────────────────────────────────────────────────────────────
git checkout -b rollback-working-version
if errorlevel 1 (
    echo ⚠️ WARNING: Branch mungkin sudah ada, lanjut deploy...
)
echo.
echo ───────────────────────────────────────────────────────────────────
echo 🔨 Building project...
echo ───────────────────────────────────────────────────────────────────
call npm run build
if errorlevel 1 (
    echo ❌ ERROR: Build gagal
    pause
    exit /b 1
)
echo ✅ Build berhasil
echo.
echo ───────────────────────────────────────────────────────────────────
echo 🚀 Deploying ke GitHub Pages...
echo ───────────────────────────────────────────────────────────────────
call npm run deploy
if errorlevel 1 (
    echo ❌ ERROR: Deploy gagal
    pause
    exit /b 1
)
echo.
echo ═══════════════════════════════════════════════════════════════════
echo         ✅ ROLLBACK & DEPLOY SELESAI!
echo ═══════════════════════════════════════════════════════════════════
echo.
echo 📋 LANGKAH SELANJUTNYA:
echo.
echo 1. ⏱️  TUNGGU 2-3 menit untuk GitHub Pages propagasi
echo.
echo 2. 🌐 BUKA website: https://ravalkyrie.github.io/SIM-PJJ/
echo.
echo 3. 🔄 Hard refresh browser: Ctrl + Shift + R
echo.
echo 4. ✅ CEK apakah konten sudah muncul normal
echo.
echo 5. ⚠️  JIKA MASIH BERMASALAH:
echo    - Clear browser cache (Ctrl + Shift + Delete)
echo    - Coba browser lain atau incognito mode
echo    - Cek console browser untuk error (F12)
echo.
echo ═══════════════════════════════════════════════════════════════════
echo.
pause
