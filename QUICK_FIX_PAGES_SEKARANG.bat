@echo off
chcp 65001 >nul
color 0A
cls

echo ╔════════════════════════════════════════════════════════════════╗
echo ║        QUICK FIX - GitHub Pages Blank After Deploy            ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 🔧 Script ini akan force redeploy ke GitHub Pages
echo.
echo ⚠️  PASTIKAN KAMU SUDAH:
echo    1. Set GitHub Pages settings ke branch: gh-pages
echo    2. Pilih folder: / (root)
echo    3. Klik Save
echo.
echo    Belum? Buka dulu: 
echo    https://github.com/Ravalkyrie/SIM-PJJ/settings/pages
echo.
pause
echo.
echo ═══════════════════════════════════════════════════════════════════
echo 📦 Step 1: Building production files...
echo ═══════════════════════════════════════════════════════════════════
echo.

call npm run build

if %errorlevel% neq 0 (
    echo.
    echo ❌ Build GAGAL! Cek error di atas.
    pause
    exit /b 1
)

echo.
echo ✅ Build berhasil!
echo.
echo ═══════════════════════════════════════════════════════════════════
echo 🚀 Step 2: Deploying to GitHub Pages (gh-pages branch)...
echo ═══════════════════════════════════════════════════════════════════
echo.

call npm run deploy

if %errorlevel% neq 0 (
    echo.
    echo ❌ Deploy GAGAL! Cek error di atas.
    pause
    exit /b 1
)

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                    ✅ DEPLOYMENT SELESAI!                      ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 📋 LANGKAH SELANJUTNYA:
echo.
echo 1. Tunggu 2-3 menit untuk GitHub Pages propagation
echo.
echo 2. Buka browser dan akses:
echo    https://ravalkyrie.github.io/SIM-PJJ/
echo.
echo 3. Hard refresh browser (Ctrl+Shift+R atau Ctrl+F5)
echo.
echo 4. Jika masih blank, cek GitHub Pages settings:
echo    https://github.com/Ravalkyrie/SIM-PJJ/settings/pages
echo.
echo    Pastikan:
echo    ✓ Source: Deploy from a branch
echo    ✓ Branch: gh-pages
echo    ✓ Folder: / (root)
echo.
echo ═══════════════════════════════════════════════════════════════════
echo.
pause
