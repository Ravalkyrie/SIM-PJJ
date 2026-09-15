@echo off
REM ================================================================
REM FAVICON FIX DEPLOYMENT - MANUAL COMMANDS
REM ================================================================
REM 
REM Jalankan command ini satu per satu di CMD/Terminal
REM Copy paste baris demi baris
REM 
REM ================================================================

echo Step 1: Masuk ke folder project
cd "C:\New folder\Manajemen"

echo Step 2: Cek branch saat ini
git branch

echo Step 3: Pindah ke branch main (jika belum)
git checkout main

echo Step 4: Pull perubahan terbaru
git pull origin main

echo Step 5: Add file index.html yang sudah diubah
git add index.html

echo Step 6: Add dokumentasi favicon fix
git add FIX_FAVICON_ISSUE.txt DEPLOY_FAVICON_FIX.txt RINGKASAN_FAVICON_FIX.txt ACTION_FAVICON_FIX.txt FAVICON_FIX_SUMMARY.txt INDEX_DOKUMENTASI.txt

echo Step 7: Commit perubahan
git commit -m "Fix: Favicon tidak muncul di GitHub Pages - ubah ke relative path"

echo Step 8: Push ke GitHub
git push origin main

echo Step 9: Build project
npm run build

echo Step 10: Deploy ke GitHub Pages
npm run deploy

echo.
echo ================================================================
echo DEPLOYMENT SELESAI!
echo Tunggu 2-3 menit, lalu test di:
echo https://ravalkyrie.github.io/SIM-PJJ/
echo ================================================================
