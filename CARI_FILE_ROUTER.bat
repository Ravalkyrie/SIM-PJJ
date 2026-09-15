@echo off
chcp 65001 > nul
color 0B
echo.
echo ═══════════════════════════════════════════════════════════════════
echo      🔍 CARI FILE ROUTER - SEARCH ROUTER FILE
echo ═══════════════════════════════════════════════════════════════════
echo.
echo File router tidak ditemukan di lokasi standard.
echo Script ini akan mencari di seluruh project.
echo.
pause
echo.
echo Masuk ke folder project...
cd "C:\New folder\Manajemen"
if errorlevel 1 (
    echo ❌ ERROR: Folder project tidak ditemukan
    pause
    exit /b 1
)
echo.
echo ═══════════════════════════════════════════════════════════════════
echo 📂 MENCARI FILE YANG BERISI "createWebHistory"...
echo ═══════════════════════════════════════════════════════════════════
echo.
findstr /s /i /m "createWebHistory" *.js *.ts *.vue 2>nul
if errorlevel 1 (
    echo ⚠️ Tidak ditemukan file dengan "createWebHistory"
    echo.
    echo Mencoba cari "vue-router"...
    echo.
    findstr /s /i /m "vue-router" *.js *.ts *.vue 2>nul
    if errorlevel 1 (
        echo ❌ Tidak ditemukan file dengan "vue-router"
    )
)
echo.
echo ═══════════════════════════════════════════════════════════════════
echo 📂 MENCARI FILE YANG BERISI "createRouter"...
echo ═══════════════════════════════════════════════════════════════════
echo.
findstr /s /i /m "createRouter" *.js *.ts *.vue 2>nul
if errorlevel 1 (
    echo ⚠️ Tidak ditemukan file dengan "createRouter"
)
echo.
echo ═══════════════════════════════════════════════════════════════════
echo 📂 STRUKTUR FOLDER SRC...
echo ═══════════════════════════════════════════════════════════════════
echo.
if exist "src" (
    dir /b /s "src\*.js" 2>nul
    dir /b /s "src\*.ts" 2>nul
    dir /b /s "src\*.vue" 2>nul
    echo.
    echo Struktur folder src:
    tree /F src
) else (
    echo ❌ Folder src tidak ditemukan!
)
echo.
echo ═══════════════════════════════════════════════════════════════════
echo 📂 CEK APAKAH ADA VITE.CONFIG...
echo ═══════════════════════════════════════════════════════════════════
echo.
if exist "vite.config.js" (
    echo ✅ vite.config.js DITEMUKAN
    type vite.config.js
)
if exist "vite.config.ts" (
    echo ✅ vite.config.ts DITEMUKAN
    type vite.config.ts
)
echo.
echo ═══════════════════════════════════════════════════════════════════
echo 📂 CEK PACKAGE.JSON...
echo ═══════════════════════════════════════════════════════════════════
echo.
if exist "package.json" (
    echo ✅ package.json DITEMUKAN
    type package.json | findstr /i "vue-router"
) else (
    echo ❌ package.json tidak ditemukan
)
echo.
echo ═══════════════════════════════════════════════════════════════════
echo.
echo HASIL PENCARIAN:
echo Silakan screenshot hasil di atas dan kirim untuk analisa lebih lanjut.
echo.
echo Atau, cari manual file yang berisi:
echo   • "createWebHistory" atau "createWebHashHistory"
echo   • "vue-router"
echo   • "createRouter"
echo.
echo File tersebut adalah file router yang perlu diubah.
echo.
pause
