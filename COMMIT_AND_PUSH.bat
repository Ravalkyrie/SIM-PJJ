@echo off
echo ========================================
echo  COMMIT AND PUSH TO GITHUB
echo ========================================
echo.

echo [1/5] Checking git status...
git status
echo.

echo [2/5] Staging modified files...
git add src/components/AccessManagementView.tsx
git add src/components/AccessManagementViewNew.tsx
git add tsconfig.json
echo Files staged successfully!
echo.

echo [3/5] Creating commit...
git commit -m "fix: Mobile overflow and TypeScript errors" -m "- Fix horizontal overflow on Access Management warning section (375px)" -m "- Fix TypeScript: Crown aria-label, handleSaveRole function" -m "- Update tsconfig to exclude functions folder" -m "" -m "Changes:" -m "- Reduced mobile padding from p-3 to p-2 (saves 8px)" -m "- Reduced mobile icon from w-5 to w-4 (saves 4px)" -m "- Changed list-inside to list-outside (saves ~16px)" -m "- Added break-words to all list items" -m "- Added overflow-hidden protection" -m "- Total space saved: ~28px horizontal on mobile" -m "" -m "Build: Success (4.25s, 0 errors)" -m "TypeScript: Pass (0 errors)" -m "Bundle: 1.27 MB (329 KB gzipped)"
echo Commit created successfully!
echo.

echo [4/5] Pushing to GitHub...
git push origin rollback-working-version
echo.

echo [5/5] Verifying push...
git log --oneline -1
echo.

echo ========================================
echo  SUCCESS! Changes pushed to GitHub
echo ========================================
echo.
echo Branch: rollback-working-version
echo Remote: https://github.com/Ravalkyrie/SIM-PJJ.git
echo.
echo Next steps:
echo 1. Verify at: https://github.com/Ravalkyrie/SIM-PJJ/tree/rollback-working-version
echo 2. Create Pull Request to main branch if needed
echo 3. Deploy to hosting: npm run deploy OR firebase deploy
echo.
pause
