@echo off
echo ========================================
echo MOBILE FIX - AUTOMATED SCRIPT
echo ========================================
echo.

cd "C:\New folder\Manajemen"

echo Checking if Python is available...
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Python found! Running fix script...
    python fix_mobile.py
    if %errorlevel% equ 0 (
        echo.
        echo ========================================
        echo SUCCESS! Now building project...
        echo ========================================
        npm run build
        if %errorlevel% equ 0 (
            echo.
            echo ========================================
            echo BUILD SUCCESS! Starting dev server...
            echo ========================================
            npm run dev
        ) else (
            echo.
            echo BUILD FAILED! Check errors above.
        )
    ) else (
        echo.
        echo Script failed! Check errors above.
    )
) else (
    echo Python not found!
    echo.
    echo Please install Python or follow manual guide:
    echo   - Open: QUICK_FIX_GUIDE.md
    echo   - Edit: src\components\ContractList.tsx
    echo   - Copy from: MOBILE_SECTION_NEW_CODE.txt
    echo.
    pause
)
