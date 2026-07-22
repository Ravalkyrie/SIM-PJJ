# 📚 Tutorial Lengkap: Update Code ke GitHub

## 🎯 Panduan Step-by-Step untuk Pemula

---

## 📋 Persiapan

### 1. Pastikan Git Sudah Terinstall
Buka Command Prompt (CMD) dan ketik:
```bash
git --version
```

Jika muncul versi Git (contoh: `git version 2.40.0`), berarti Git sudah terinstall. ✅

Jika belum, download dari: https://git-scm.com/download/win

---

## 🚀 Cara Update Code ke GitHub

### METODE 1: Menggunakan Command Prompt (CMD) - RECOMMENDED

#### Step 1: Buka Command Prompt
- Tekan `Windows + R`
- Ketik `cmd`
- Tekan Enter

#### Step 2: Masuk ke Folder Project
```bash
cd "C:\New folder\Manajemen"
```

#### Step 3: Cek Status File yang Berubah
```bash
git status
```

Anda akan melihat daftar file yang berubah (warna merah = belum di-stage)

#### Step 4: Tambahkan Semua File yang Berubah
```bash
git add .
```

**Atau** tambahkan file spesifik saja:
```bash
git add src/types.ts
git add src/components/ContractForm.tsx
git add src/components/ContractList.tsx
git add src/components/ContractDetail.tsx
```

#### Step 5: Commit Perubahan (Beri Pesan/Keterangan)
```bash
git commit -m "Add waktu pemeliharaan feature & UI reorganization"
```

**Tips Commit Message yang Baik:**
- `"Add waktu pemeliharaan field"`
- `"Fix: Remove target selesai from form"`
- `"Update: Move tanggal kontrak to lokasi section"`
- `"Feature: Add maintenance time field"`

#### Step 6: Push ke GitHub
```bash
git push origin main
```

**Atau** jika branch Anda bernama `master`:
```bash
git push origin master
```

#### Step 7: Verifikasi
- Buka browser
- Go to: https://github.com/Ravalkyrie/SIM-PJJ
- Refresh halaman
- Lihat apakah commit terbaru muncul ✅

---

### METODE 2: Menggunakan Visual Studio Code

#### Step 1: Buka Project di VS Code
- Buka VS Code
- File → Open Folder
- Pilih folder: `C:\New folder\Manajemen`

#### Step 2: Buka Source Control Panel
- Klik icon "Source Control" di sidebar kiri (icon seperti cabang)
- Atau tekan `Ctrl + Shift + G`

#### Step 3: Stage Changes
- Lihat daftar file yang berubah
- Klik tanda `+` di sebelah file untuk stage
- Atau klik `+` di sebelah "Changes" untuk stage semua file

#### Step 4: Commit
- Ketik pesan commit di kotak input di atas
  - Contoh: `"Add waktu pemeliharaan feature"`
- Tekan `Ctrl + Enter` atau klik tombol ✓ (Commit)

#### Step 5: Push
- Klik tombol "..." (More Actions)
- Pilih "Push"
- Atau tekan `Ctrl + Shift + P` → ketik "Git: Push" → Enter

#### Step 6: Verifikasi di GitHub
- Buka https://github.com/Ravalkyrie/SIM-PJJ
- Refresh dan cek commit terbaru ✅

---

### METODE 3: Menggunakan GitHub Desktop (Optional)

#### Step 1: Install GitHub Desktop
Download dari: https://desktop.github.com/

#### Step 2: Login ke GitHub
- Buka GitHub Desktop
- File → Options → Sign In
- Login dengan akun GitHub Anda

#### Step 3: Add Repository
- File → Add Local Repository
- Pilih folder: `C:\New folder\Manajemen`

#### Step 4: Commit Changes
- Lihat file yang berubah di panel kiri
- Centang file yang ingin di-commit
- Tulis commit message di bawah
- Klik "Commit to main"

#### Step 5: Push
- Klik tombol "Push origin" di atas
- Tunggu sampai selesai

#### Step 6: Verifikasi
- Klik "View on GitHub"
- Atau buka https://github.com/Ravalkyrie/SIM-PJJ

---

## 🎯 Setelah Push: Deploy ke GitHub Pages

### Cara Deploy (2 Pilihan)

#### Option A: Deploy via Command Prompt
```bash
cd "C:\New folder\Manajemen"
npm run deploy
```

Ini akan:
1. Build aplikasi secara otomatis
2. Deploy ke branch `gh-pages`
3. Aplikasi akan live di: https://Ravalkyrie.github.io/SIM-PJJ

#### Option B: Deploy Manual Step-by-Step
```bash
cd "C:\New folder\Manajemen"

# 1. Build aplikasi
npm run build

# 2. Deploy
npx gh-pages -d dist
```

---

## 🔍 Command Git yang Sering Digunakan

### Cek Status
```bash
git status
# Melihat file mana yang berubah
```

### Tambah File
```bash
git add .
# Tambah semua file yang berubah

git add src/types.ts
# Tambah file spesifik
```

### Commit
```bash
git commit -m "Pesan commit Anda"
# Simpan perubahan dengan pesan
```

### Push
```bash
git push origin main
# Kirim ke GitHub (branch main)

git push origin master
# Kirim ke GitHub (branch master)
```

### Pull (Ambil Update dari GitHub)
```bash
git pull origin main
# Ambil perubahan terbaru dari GitHub
```

### Lihat History Commit
```bash
git log
# Lihat riwayat commit

git log --oneline
# Lihat riwayat dalam format singkat
```

### Batalkan Perubahan
```bash
git checkout -- namafile.txt
# Batalkan perubahan pada file tertentu (sebelum commit)

git reset HEAD namafile.txt
# Unstage file (batalkan git add)
```

---

## ⚠️ Troubleshooting

### Error: "Permission denied"
**Penyebab:** Tidak punya akses ke repository

**Solution:**
```bash
# Login dengan GitHub CLI
gh auth login

# Atau gunakan Personal Access Token
# Buat token di: https://github.com/settings/tokens
```

### Error: "Your local changes would be overwritten"
**Penyebab:** Ada konflik dengan versi di GitHub

**Solution:**
```bash
# Simpan perubahan lokal terlebih dahulu
git stash

# Pull dari GitHub
git pull origin main

# Kembalikan perubahan lokal
git stash pop
```

### Error: "fatal: not a git repository"
**Penyebab:** Folder belum di-init sebagai git repo

**Solution:**
```bash
cd "C:\New folder\Manajemen"
git init
git remote add origin https://github.com/Ravalkyrie/SIM-PJJ.git
```

### Error: "npm run deploy failed"
**Solution:**
```bash
# Clear cache dan rebuild
npm run clean
npm install
npm run deploy
```

---

## 📝 Workflow yang Direkomendasikan

### Setiap Kali Ada Perubahan Code:

```bash
# 1. Cek status
git status

# 2. Add file yang berubah
git add .

# 3. Commit dengan pesan yang jelas
git commit -m "Update: Deskripsi perubahan"

# 4. Push ke GitHub
git push origin main

# 5. Deploy ke GitHub Pages (jika perlu)
npm run deploy
```

### Contoh Complete Workflow:

```bash
# Masuk ke folder project
cd "C:\New folder\Manajemen"

# Cek status
git status

# Stage semua perubahan
git add .

# Commit dengan pesan
git commit -m "Feature: Add waktu pemeliharaan & reorganize UI"

# Push ke GitHub
git push origin main

# Deploy ke GitHub Pages
npm run deploy
```

**Done!** ✅ Code Anda sudah terupdate di GitHub!

---

## 🎓 Tips & Best Practices

### 1. Commit Message yang Baik
✅ **GOOD:**
- `"Add waktu pemeliharaan field to contract form"`
- `"Fix: Remove target selesai from detail view"`
- `"Update: Move tanggal kontrak to location section"`

❌ **BAD:**
- `"update"`
- `"fix bug"`
- `"changes"`

### 2. Commit Sering (Small Commits)
- Jangan tunggu banyak perubahan
- Commit setiap fitur selesai
- Lebih mudah untuk tracking dan rollback

### 3. Pull Sebelum Push
```bash
# Selalu pull terlebih dahulu untuk menghindari konflik
git pull origin main
git push origin main
```

### 4. Jangan Commit File Sensitif
File yang **JANGAN** di-commit:
- `.env` (sudah ada di .gitignore) ✅
- `node_modules/` (sudah ada di .gitignore) ✅
- File password atau API keys
- File log atau temporary

### 5. Branch Strategy (Advanced)
```bash
# Buat branch untuk fitur baru
git checkout -b feature/waktu-pemeliharaan

# Develop di branch
git add .
git commit -m "Add feature"

# Merge ke main
git checkout main
git merge feature/waktu-pemeliharaan
git push origin main
```

---

## 📞 Quick Reference Card

```bash
# BASIC WORKFLOW
cd "C:\New folder\Manajemen"  # Masuk folder
git status                     # Cek status
git add .                      # Stage semua
git commit -m "Message"        # Commit
git push origin main           # Push ke GitHub
npm run deploy                 # Deploy app

# USEFUL COMMANDS
git log                        # Lihat history
git diff                       # Lihat perubahan
git branch                     # Lihat branch
git pull                       # Ambil update

# EMERGENCY
git stash                      # Simpan sementara
git reset --hard HEAD          # Batalkan semua (HATI-HATI!)
```

---

## ✅ Checklist Update Code

Sebelum push ke GitHub:

- [ ] Code sudah di-test locally
- [ ] Tidak ada error di console
- [ ] File .env tidak termasuk dalam commit
- [ ] Commit message jelas dan deskriptif
- [ ] Sudah pull latest dari GitHub (jika bekerja dalam tim)

Setelah push:

- [ ] Verifikasi commit muncul di GitHub
- [ ] Deploy ke GitHub Pages (jika perlu)
- [ ] Test aplikasi di live URL
- [ ] Verify tidak ada error di production

---

## 🎉 Selesai!

Anda sekarang tahu cara update code ke GitHub!

**Untuk update code Anda sekarang, jalankan:**

```bash
cd "C:\New folder\Manajemen"
git add .
git commit -m "Add waktu pemeliharaan feature & UI updates"
git push origin main
npm run deploy
```

**Live URL:** https://Ravalkyrie.github.io/SIM-PJJ

---

**Created by:** Kiro AI Assistant  
**Date:** 22 Juli 2026  
**Version:** 1.0
