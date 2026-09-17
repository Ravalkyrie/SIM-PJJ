# 🚀 Tutorial Deploy SIM-KONTRAK PJJ ke GitHub Pages

**Tanggal:** 16 September 2026  
**Repository:** https://github.com/Ravalkyrie/SIM-PJJ

---

## ✅ Status Persiapan

Aplikasi sudah siap untuk di-deploy! Semua konfigurasi sudah benar:

- ✅ `package.json` sudah ada script `deploy`
- ✅ `vite.config.ts` sudah ada konfigurasi `base: '/SIM-PJJ/'`
- ✅ `gh-pages` package sudah terinstal
- ✅ Repository sudah terhubung ke GitHub
- ✅ Code sudah di-push ke branch `rollback-working-version`

---

## 📋 Langkah-langkah Deploy

### Metode 1: Deploy Otomatis dengan npm (RECOMMENDED)

#### Langkah 1: Build Production
```bash
cd "C:\New folder\Manajemen"
npm run build
```

#### Langkah 2: Deploy ke GitHub Pages
```bash
npm run deploy
```

Perintah ini akan:
1. Build aplikasi production
2. Upload ke branch `gh-pages` di GitHub
3. Aplikasi akan live di: `https://Ravalkyrie.github.io/SIM-PJJ`

---

### Metode 2: Deploy Manual (Jika Metode 1 Gagal)

#### Langkah 1: Build Production
```bash
cd "C:\New folder\Manajemen"
npm run build
```

#### Langkah 2: Install gh-pages jika belum
```bash
npm install --save-dev gh-pages
```

#### Langkah 3: Deploy Manual
```bash
npx gh-pages -d dist -b gh-pages
```

---

## ⚙️ Konfigurasi GitHub Repository

Setelah deploy, aktifkan GitHub Pages:

### Langkah 1: Buka GitHub Repository
Buka: https://github.com/Ravalkyrie/SIM-PJJ

### Langkah 2: Masuk ke Settings
- Klik tab **Settings** di repository
- Scroll ke bagian **Pages** di menu kiri

### Langkah 3: Konfigurasi Source
- **Source:** Deploy from a branch
- **Branch:** `gh-pages`
- **Folder:** `/ (root)`
- Klik **Save**

### Langkah 4: Tunggu Deploy
- GitHub akan proses deployment (1-5 menit)
- Status akan muncul di bagian atas halaman Pages
- Setelah selesai, akan muncul link: `https://Ravalkyrie.github.io/SIM-PJJ`

---

## 🔧 Konfigurasi Firebase untuk Production

**PENTING:** Setelah deploy, update Firebase Configuration:

### Langkah 1: Tambahkan Domain GitHub Pages
1. Buka Firebase Console: https://console.firebase.google.com
2. Pilih project SIM-KONTRAK PJJ
3. Masuk ke **Authentication** → **Settings**
4. Tambahkan authorized domain: `ravalkyrie.github.io`

### Langkah 2: Update Firestore Rules (Jika Perlu)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Rules untuk production
    match /{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 📱 Testing Setelah Deploy

### 1. Buka Aplikasi
```
https://Ravalkyrie.github.io/SIM-PJJ
```

### 2. Test Fitur Utama
- [ ] Login berhasil
- [ ] Dashboard loading dengan benar
- [ ] Daftar kontrak muncul
- [ ] CRUD operations working
- [ ] Hover effects bekerja
- [ ] Mobile responsive
- [ ] Firebase connection OK

### 3. Test di Multiple Browser
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

---

## 🐛 Troubleshooting

### Problem 1: Halaman 404 setelah refresh
**Solusi:** Sudah menggunakan HashRouter, harusnya tidak ada masalah.

### Problem 2: CSS tidak loading
**Solusi:** Pastikan `base: '/SIM-PJJ/'` ada di vite.config.ts

### Problem 3: Firebase Authentication Error
**Solusi:** Tambahkan domain `ravalkyrie.github.io` ke Firebase authorized domains.

### Problem 4: Deploy gagal dengan error permission
**Solusi:** 
```bash
# Setup Git credentials
git config --global user.email "your-email@example.com"
git config --global user.name "Your Name"

# Try deploy again
npm run deploy
```

### Problem 5: Build error
**Solusi:**
```bash
# Clean dan rebuild
npm run clean
npm install
npm run build
npm run deploy
```

---

## 🔄 Update Aplikasi di Masa Depan

Setiap kali ada perubahan code:

```bash
# 1. Commit changes
git add .
git commit -m "Your commit message"
git push origin rollback-working-version

# 2. Deploy to GitHub Pages
npm run deploy
```

Deploy akan otomatis build dan upload versi terbaru.

---

## 📊 Monitoring

### Check Deployment Status
1. Buka: https://github.com/Ravalkyrie/SIM-PJJ/deployments
2. Lihat status deployment terakhir
3. Klik untuk melihat detail

### Check Live Site
- URL: https://Ravalkyrie.github.io/SIM-PJJ
- Buka developer tools untuk check console errors
- Test semua fitur

---

## 🎯 Checklist Deploy

**Sebelum Deploy:**
- [x] Code sudah di-commit
- [x] Code sudah di-push ke GitHub
- [x] TypeScript compile tanpa error
- [x] Build production berhasil
- [x] Firebase config sudah benar
- [x] .env tidak ter-commit (sudah di gitignore)

**Proses Deploy:**
- [ ] Run `npm run deploy`
- [ ] Tunggu hingga selesai (1-2 menit)
- [ ] Check branch `gh-pages` muncul di GitHub
- [ ] Aktifkan GitHub Pages di Settings

**Setelah Deploy:**
- [ ] Buka URL production
- [ ] Test login/authentication
- [ ] Test CRUD operations
- [ ] Test di mobile
- [ ] Check console untuk errors
- [ ] Update Firebase authorized domains

---

## 💡 Tips

1. **Always test locally first:**
   ```bash
   npm run build
   npm run preview
   ```
   Buka http://localhost:4173 untuk test production build

2. **Use environment variables:**
   - Development: `.env`
   - Production: Firebase config dari `.env`

3. **Monitor Firebase usage:**
   - Check Firebase Console untuk usage
   - Set up billing alerts jika perlu

4. **Keep dependencies updated:**
   ```bash
   npm outdated
   npm update
   ```

---

## 📞 Support

**Jika ada masalah:**
1. Check console di browser (F12)
2. Check GitHub Actions/Pages status
3. Check Firebase Console untuk errors
4. Review documentasi ini

**Resources:**
- GitHub Pages Docs: https://pages.github.com/
- Vite Deploy Guide: https://vitejs.dev/guide/static-deploy.html
- Firebase Docs: https://firebase.google.com/docs

---

## ✅ Summary

Aplikasi SIM-KONTRAK PJJ sudah siap untuk di-deploy ke GitHub Pages dengan 1 perintah:

```bash
npm run deploy
```

Setelah deploy berhasil, aplikasi akan live di:
```
https://Ravalkyrie.github.io/SIM-PJJ
```

Good luck! 🚀
