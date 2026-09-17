@echo off
echo ========================================
echo  SIM-PJJ v2.4.1 - Deploy Console Fix
echo ========================================
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo ERROR: package.json not found!
    echo Please run this script from the project root directory.
    pause
    exit /b 1
)

echo [1/4] Rebuilding application...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)
echo ✅ Build completed successfully
echo.

echo [2/4] Committing changes...
git add src/App.tsx CONSOLE_ERROR_FIX.md DEPLOY_FIX.md DEPLOY_FIX.bat FINAL_REPORT.md
git commit -m "fix: resolve CORS error by switching to BrowserRouter with basename"
if %errorlevel% neq 0 (
    echo WARNING: Commit failed or nothing to commit
    echo Continuing anyway...
)
echo ✅ Changes committed
echo.

echo [3/4] Pushing to GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo ERROR: Push failed!
    echo Please check your internet connection and GitHub credentials.
    pause
    exit /b 1
)
echo ✅ Pushed to GitHub successfully
echo.

echo [4/4] Deploying to GitHub Pages...
call npm run deploy
if %errorlevel% neq 0 (
    echo ERROR: Deployment failed!
    pause
    exit /b 1
)
echo ✅ Deployed to GitHub Pages successfully
echo.

echo ========================================
echo  DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Your site will be live in 2-5 minutes at:
echo https://ravalkyrie.github.io/SIM-PJJ/
echo.
echo Next steps:
echo 1. Wait a few minutes for GitHub Pages to update
echo 2. Visit the site and check browser console (F12)
echo 3. Verify all pages load without errors
echo.
pause
