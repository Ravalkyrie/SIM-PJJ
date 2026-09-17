@echo off
REM ========================================
REM SCRIPT PUSH TO GITHUB - SIM-PJJ v2.4.1
REM ========================================
REM Status: PRODUCTION READY
REM Date: 16 September 2026
REM ========================================

echo.
echo ================================================
echo   SIM-PJJ v2.4.1 - PUSH TO GITHUB
echo ================================================
echo.

cd /d "C:\New folder\Manajemen"

REM Step 1: Show current status
echo [STEP 1] Checking git status...
git status --short
echo.

REM Step 2: Verify .env is ignored
echo [STEP 2] Verifying .env is ignored...
git check-ignore .env
if %ERRORLEVEL% EQU 0 (
    echo ✅ .env is properly ignored by git
) else (
    echo ❌ WARNING: .env is NOT ignored!
    echo STOPPING SCRIPT TO PREVENT CREDENTIAL LEAK
    pause
    exit /b 1
)
echo.

REM Step 3: Stage files (ONLY source files and docs)
echo [STEP 3] Staging files for commit...
git add src/
git add PRE_PUSH_CHECKLIST.md
git add PUSH_TO_GITHUB_GUIDE.md
git add READY_TO_PUSH_SUMMARY.md
echo ✅ Files staged
echo.

REM Step 4: Show what will be committed
echo [STEP 4] Files to be committed:
git status --short
echo.
echo ⚠️  VERIFY: Make sure .env is NOT in the list above!
echo.
pause

REM Step 5: Commit
echo [STEP 5] Creating commit...
git commit -m "feat: Mobile responsive design implementation - v2.4.1" -m "- Fixed mobile text rendering issues across all components" -m "- Improved responsive layout for 375px, 768px, 1024px+ viewports" -m "- Enhanced Breadcrumb, ContractForm, ContractList, DashboardView" -m "- Added comprehensive responsive CSS" -m "- All features tested and production ready"

if %ERRORLEVEL% EQU 0 (
    echo ✅ Commit created successfully
) else (
    echo ❌ Commit failed
    pause
    exit /b 1
)
echo.

REM Step 6: Push to remote
echo [STEP 6] Pushing to GitHub...
git push origin rollback-working-version

if %ERRORLEVEL% EQU 0 (
    echo ✅ Push successful!
) else (
    echo ❌ Push failed
    echo.
    echo Troubleshooting tips:
    echo 1. Check internet connection
    echo 2. Verify GitHub credentials
    echo 3. Try: git remote -v
    pause
    exit /b 1
)
echo.

REM Step 7: Ask if user wants to deploy
echo ================================================
echo   Push completed successfully! 🎉
echo ================================================
echo.
echo Do you want to deploy to GitHub Pages now?
echo (This will run: npm run deploy)
echo.
choice /C YN /M "Deploy to GitHub Pages"

if %ERRORLEVEL% EQU 1 (
    echo.
    echo [STEP 7] Deploying to GitHub Pages...
    call npm run deploy
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ================================================
        echo   DEPLOYMENT SUCCESSFUL! 🚀
        echo ================================================
        echo.
        echo Your app is now live at:
        echo https://ravalkyrie.github.io/SIM-PJJ/
        echo.
    ) else (
        echo ❌ Deployment failed
        echo Try running manually: npm run deploy
    )
) else (
    echo.
    echo ⏭️  Skipping deployment
    echo You can deploy later with: npm run deploy
)

echo.
echo ================================================
echo   SCRIPT COMPLETED
echo ================================================
echo.
echo Summary:
echo ✅ Code committed to: rollback-working-version
echo ✅ Pushed to: https://github.com/Ravalkyrie/SIM-PJJ
echo.
echo Next steps:
echo 1. Verify commit on GitHub
echo 2. Check GitHub Pages deployment
echo 3. Test live site functionality
echo.
pause
