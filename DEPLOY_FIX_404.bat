@echo off
chcp 65001 >nul
echo ========================================
echo   DEPLOY FIX - GitHub Pages 404 Error
echo ========================================
echo.
echo Langkah yang akan dilakukan:
echo 1. Clean build folder
echo 2. Rebuild project dengan HashRouter
echo 3. Copy 404.html ke dist folder
echo 4. Deploy ke GitHub Pages
echo.
echo Tekan Ctrl+C untuk membatalkan, atau
pause

echo.
echo [1/4] Membersihkan folder dist...
if exist dist rmdir /s /q dist
echo ✓ Folder dist dibersihkan

echo.
echo [2/4] Building project...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Build gagal!
    pause
    exit /b 1
)
echo ✓ Build berhasil

echo.
echo [3/4] Menyalin 404.html ke dist...
copy public\404.html dist\404.html
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Gagal copy 404.html
    pause
    exit /b 1
)
echo ✓ 404.html berhasil disalin ke dist

echo.
echo [4/4] Deploying ke GitHub Pages...
call npm run deploy
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Deploy gagal!
    pause
    exit /b 1
)

echo.
echo ========================================
echo   ✓ DEPLOYMENT BERHASIL!
echo ========================================
echo.
echo URL Aplikasi: https://ravalkyrie.github.io/SIM-PJJ/
echo.
echo PENTING - Cara mengakses yang benar:
echo 1. Akses: https://ravalkyrie.github.io/SIM-PJJ/
echo 2. URL akan otomatis menjadi: https://ravalkyrie.github.io/SIM-PJJ/#/
echo 3. Halaman dashboard: https://ravalkyrie.github.io/SIM-PJJ/#/dashboard
echo.
echo Tunggu 2-3 menit untuk propagasi GitHub Pages,
echo lalu refresh browser dengan Ctrl+F5
echo.
echo Jika masih error 404:
echo - Clear browser cache (Ctrl+Shift+Delete)
echo - Gunakan mode Incognito/Private
echo - Akses langsung ke: https://ravalkyrie.github.io/SIM-PJJ/#/
echo.
pause
