# 🚀 Quick Deployment Guide - SIM-PJJ

## Status Verifikasi
✅ **SEMUA CODE SUDAH DIPERIKSA DAN SIAP DEPLOY**

---

## 📋 Pre-Deployment Checklist

### ⚠️ CRITICAL - Security Update Required
**SEBELUM DEPLOY, LAKUKAN INI TERLEBIH DAHULU:**

1. **Regenerate Firebase API Keys** (Keys sudah terekspos di GitHub)
   - Buka [Firebase Console](https://console.firebase.google.com/)
   - Pilih project: `simpjj-ebfe7`
   - Go to Project Settings → General
   - Scroll ke "Your apps" section
   - Klik "Regenerate" untuk Web API Key
   - Copy keys yang baru

2. **Update File .env**
   ```bash
   # Edit file: C:\New folder\Manajemen\.env
   # Ganti dengan keys yang baru dari Firebase Console
   ```

3. **Verify .gitignore**
   ```bash
   # Pastikan .env ada di .gitignore
   # Jangan commit .env ke GitHub!
   ```

---

## 🎯 Deployment Commands

### Option 1: Quick Deploy (Recommended)
```bash
cd "C:\New folder\Manajemen"
npm run deploy
```

Ini akan otomatis:
1. Build aplikasi (`npm run build`)
2. Deploy ke GitHub Pages (`gh-pages -d dist`)

### Option 2: Manual Step-by-Step
```bash
cd "C:\New folder\Manajemen"

# 1. Build aplikasi
npm run build

# 2. Preview build (optional)
npm run preview

# 3. Deploy ke GitHub Pages
npx gh-pages -d dist
```

---

## ✅ Verification After Deploy

### 1. Check GitHub Pages
- URL: https://Ravalkyrie.github.io/SIM-PJJ
- Status: Should show "Active" in GitHub Settings → Pages

### 2. Test Functionality
- [ ] Login page loads
- [ ] Can login with email/password
- [ ] Dashboard shows data
- [ ] Can create new contract
- [ ] Can edit contract
- [ ] Can delete contract
- [ ] Firestore sync works
- [ ] No console errors

---

## 🔍 Fitur yang Telah Ditambahkan

### ✅ Waktu Pemeliharaan
- **Input:** Section B form
- **Display:** Badge di list + detail di Lokasi & Wilayah
- **Format:** Text bebas (contoh: "180 Hari Kalender")

### ✅ UI Reorganization
- **Dihapus:** "Target Selesai" dari Masa Waktu Pelaksanaan
- **Dipindah:** "Tanggal Kontrak" ke Lokasi & Wilayah

---

## 🔧 Troubleshooting

### Error: "Failed to deploy"
**Solution:**
```bash
# Clear cache dan rebuild
npm run clean
npm install
npm run deploy
```

### Error: "Firebase configuration error"
**Solution:**
- Verify .env file exists
- Check all VITE_FIREBASE_* variables are set
- Restart dev server if testing locally

### Error: "Authentication failed"
**Solution:**
- Check Firebase Authentication is enabled
- Verify email/password provider is active
- Check user exists in Firebase Console

### Error: "404 on GitHub Pages"
**Solution:**
- Wait 5-10 minutes for GitHub Pages to update
- Check `vite.config.ts` has correct base path: `/SIM-PJJ/`
- Verify `homepage` in `package.json`: `https://Ravalkyrie.github.io/SIM-PJJ`

---

## 📊 Build Output Expected

```
✓ built in XXXXms
dist/index.html                   XX.XX kB
dist/assets/index-xxxxx.css       XX.XX kB
dist/assets/index-xxxxx.js        XXX.XX kB
dist/assets/react-vendor-xxxxx.js XXX.XX kB
dist/assets/firebase-vendor-xxxxx.js XXX.XX kB
```

---

## 🎓 Post-Deployment

### Update Repository
```bash
# Commit changes (if any)
git add .
git commit -m "Deploy: Add waktu pemeliharaan feature & UI updates"
git push origin main
```

### Monitor Logs
- Check GitHub Actions tab for deployment status
- Monitor Firebase Console for errors
- Check browser console for client-side errors

---

## 📞 Quick Reference

### URLs
- **Live App:** https://Ravalkyrie.github.io/SIM-PJJ
- **Repository:** https://github.com/Ravalkyrie/SIM-PJJ
- **Firebase Console:** https://console.firebase.google.com/

### Commands
```bash
npm run dev      # Local development
npm run build    # Build production
npm run preview  # Preview build locally
npm run deploy   # Deploy to GitHub Pages
npm run lint     # TypeScript check
```

### Files Changed (This Session)
- ✅ `src/types.ts` - Added waktuPemeliharaan
- ✅ `src/components/ContractForm.tsx` - Input field
- ✅ `src/components/ContractList.tsx` - Badge display
- ✅ `src/components/ContractDetail.tsx` - Display + UI changes

---

## ✅ Final Check Before Deploy

```bash
# 1. Firebase keys updated? ⚠️
[ ] Yes, keys sudah diganti dengan yang baru

# 2. .env file ada dan correct?
[ ] Yes, all VITE_FIREBASE_* variables set

# 3. Code changes committed?
[ ] Yes, all changes committed to Git

# 4. Ready to deploy?
[ ] Yes, let's deploy!
```

---

## 🚀 Deploy Now!

```bash
cd "C:\New folder\Manajemen"
npm run deploy
```

**Expected Output:**
```
> predeploy
> npm run build

✓ built in XXXXms

> deploy  
> gh-pages -d dist

Published
```

**Done! 🎉**  
Visit: https://Ravalkyrie.github.io/SIM-PJJ

---

**Maintainer:** Kiro AI Assistant  
**Date:** 22 Juli 2026  
**Status:** ✅ VERIFIED & READY
