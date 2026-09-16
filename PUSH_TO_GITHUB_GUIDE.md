# 🚀 PANDUAN PUSH KE GITHUB - SIM-PJJ v2.4.1

**Status**: ✅ Ready to Push  
**Branch**: rollback-working-version  
**Target**: GitHub Repository (Ravalkyrie/SIM-PJJ)

---

## 📋 LANGKAH-LANGKAH PUSH

### **STEP 1: Verifikasi Git Status**

```bash
cd "C:\New folder\Manajemen"
git status
```

**Expected Output:**
- Modified files di `src/components/`, `src/pages/`
- `.env` file TIDAK terlihat (sudah di .gitignore) ✅

---

### **STEP 2: Stage Files untuk Commit**

```bash
# Stage HANYA file yang diperlukan (JANGAN ADD .env!)
git add src/
git add *.md
git add package.json
git add vite.config.ts
git add tsconfig.json
```

**⚠️ PENTING**: 
- **JANGAN** run `git add .` (bisa include .env)
- **JANGAN** commit file `.env`
- **JANGAN** commit folder `node_modules/`

---

### **STEP 3: Verifikasi Staged Files**

```bash
git status
```

**Pastikan:**
- ✅ Staged files adalah src/, *.md, config files
- ❌ `.env` TIDAK ada di staged files
- ❌ `node_modules/` TIDAK ada di staged files

---

### **STEP 4: Commit Changes**

```bash
git commit -m "feat: Mobile responsive design implementation - v2.4.1

- Fixed mobile text rendering issues
- Improved responsive layout for all components
- Enhanced breadcrumb navigation for mobile
- Optimized ContractForm, ContractList, DashboardView
- Added comprehensive responsive CSS
- All pages tested on 375px, 768px, 1024px viewports
- Production ready and deployment tested"
```

---

### **STEP 5: Push ke Remote Repository**

```bash
# Push ke branch rollback-working-version
git push origin rollback-working-version
```

**Jika ada error "Permission denied":**
```bash
# Set remote URL dengan token
git remote set-url origin https://YOUR_GITHUB_TOKEN@github.com/Ravalkyrie/SIM-PJJ.git
git push origin rollback-working-version
```

---

### **STEP 6: Merge ke Main (Optional)**

Jika ingin merge ke main branch:

```bash
# Switch ke main
git checkout main

# Pull latest changes
git pull origin main

# Merge dari rollback-working-version
git merge rollback-working-version

# Push ke main
git push origin main
```

---

### **STEP 7: Deploy ke GitHub Pages**

```bash
# Build dan deploy
npm run deploy
```

**Expected:**
- Build success di folder `dist/`
- Automatic push ke branch `gh-pages`
- Deployed URL: `https://ravalkyrie.github.io/SIM-PJJ/`

---

## 🔍 VERIFIKASI SETELAH PUSH

### 1. **Cek GitHub Repository**
- Buka: https://github.com/Ravalkyrie/SIM-PJJ
- Pastikan commit terbaru muncul
- Cek file yang di-commit (PASTIKAN .env TIDAK ada)

### 2. **Cek GitHub Pages Deployment**
- Buka: https://ravalkyrie.github.io/SIM-PJJ/
- Test semua fitur berfungsi
- Test mobile responsive (DevTools → Device Toolbar)

### 3. **Test Functionality**
- Login dengan akun Firebase
- Cek Dashboard
- Cek Contract List
- Cek Contract Form
- Cek mobile view (F12 → Toggle Device Toolbar)

---

## ⚠️ TROUBLESHOOTING

### **Issue 1: "Permission denied (publickey)"**
**Solution:**
```bash
# Set remote dengan HTTPS (bukan SSH)
git remote set-url origin https://github.com/Ravalkyrie/SIM-PJJ.git

# Atau gunakan GitHub Personal Access Token
git remote set-url origin https://YOUR_TOKEN@github.com/Ravalkyrie/SIM-PJJ.git
```

### **Issue 2: ".env accidentally committed"**
**Solution:**
```bash
# Remove .env from git tracking (JANGAN hapus file!)
git rm --cached .env

# Commit the removal
git commit -m "chore: Remove .env from tracking"

# Push
git push origin rollback-working-version
```

### **Issue 3: "npm run deploy failed"**
**Solution:**
```bash
# Clear cache
rmdir /s /q dist
rmdir /s /q node_modules\.cache

# Rebuild
npm run build

# Try deploy again
npm run deploy
```

### **Issue 4: "Merge conflict"**
**Solution:**
```bash
# Abort merge
git merge --abort

# Pull latest main
git checkout main
git pull origin main

# Try merge again with strategy
git merge rollback-working-version --strategy-option theirs
```

---

## 📊 FILES YANG AKAN DI-COMMIT

### ✅ Modified Files (Should be committed):
```
src/components/Breadcrumb.tsx
src/components/ContractForm.tsx
src/components/ContractList.tsx
src/components/ContractDetail.tsx
src/components/DashboardView.tsx
src/index.css
src/pages/ContractDetailPage.tsx
PRE_PUSH_CHECKLIST.md (NEW)
PUSH_TO_GITHUB_GUIDE.md (NEW)
```

### ❌ Files TIDAK boleh di-commit:
```
.env                    # Sensitive credentials
node_modules/           # Already in .gitignore
dist/                   # Build output
*.log                   # Log files
```

---

## 🎯 CHECKLIST FINAL

Sebelum push, pastikan:

- [ ] Dev server stopped (Ctrl+C)
- [ ] `.env` file TIDAK di-stage
- [ ] `git status` tidak menampilkan `.env`
- [ ] Commit message clear dan descriptive
- [ ] No sensitive data in commit
- [ ] Branch name correct: `rollback-working-version`

---

## 📞 NEED HELP?

Jika ada masalah:
1. Stop dan jangan force push
2. Backup changes: `git stash`
3. Check documentation: `README.md`
4. Review changes: `git diff`

---

**Prepared by**: Kiro AI  
**Date**: 16 September 2026  
**Version**: v2.4.1-stable
