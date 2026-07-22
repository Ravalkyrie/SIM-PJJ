# ⚠️ PERINGATAN KEAMANAN - WAJIB DIBACA!

## 🚨 STATUS SAAT INI: API KEYS TEREKSPOS

API Keys Firebase Anda **SUDAH TEREKSPOS** di GitHub karena ter-commit di file berikut:
- `firebase-applet-config.json` (sudah dihapus dari tracking)
- `src/firebase.ts` (sudah diperbaiki)
- `src/lib/firebaseAuth.ts` (sudah diperbaiki)

### ⚡ TINDAKAN YANG HARUS SEGERA DILAKUKAN:

#### 1. Regenerate Firebase API Keys

**LANGKAH-LANGKAH:**

1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Pilih project Anda: `simpjj-ebfe7`
3. Klik ⚙️ Settings > Project Settings
4. Di tab "General", scroll ke "Your apps"
5. Pilih web app Anda
6. Klik tombol **"Reset API key"** atau **"Generate new key"**
7. Copy kredensial baru ke file `.env` Anda

#### 2. Update File .env

Setelah mendapat kredensial baru, update file `.env`:

```env
VITE_FIREBASE_API_KEY=<NEW_API_KEY_HERE>
VITE_FIREBASE_AUTH_DOMAIN=simpjj-ebfe7.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=simpjj-ebfe7
VITE_FIREBASE_STORAGE_BUCKET=simpjj-ebfe7.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1066406666067
VITE_FIREBASE_APP_ID=<NEW_APP_ID_HERE>
```

#### 3. Setup Firestore Security Rules

**SANGAT PENTING!** Tanpa security rules yang proper, database Anda bisa diakses siapa saja!

1. Buka Firebase Console > Firestore Database
2. Klik tab **"Rules"**
3. Copy-paste rules dari file `firestore.rules` di repository ini
4. Klik **"Publish"**

**Rules Template:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Hanya allow read/write untuk authenticated users
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

#### 4. Enable Authentication (Opsional tapi Direkomendasikan)

Untuk production, WAJIB enable authentication:

1. Firebase Console > Authentication
2. Klik "Get Started"
3. Enable method:
   - **Email/Password** (basic)
   - **Google Sign-In** (recommended)
4. Add authorized domains untuk production

#### 5. Hapus Keys Lama dari Git History (Advanced)

Karena keys sudah ter-commit ke GitHub, orang bisa melihat history. Untuk benar-benar aman:

**Opsi A: Hapus Sensitive Commits (Destructive)**
```bash
# PERINGATAN: Ini akan mengubah git history!
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch firebase-applet-config.json" \
  --prune-empty --tag-name-filter cat -- --all

git push origin --force --all
```

**Opsi B: Buat Repository Baru (Recommended)**
1. Buat repository baru di GitHub
2. Clone code terbaru yang sudah diperbaiki
3. Push ke repository baru
4. Arsipkan/hapus repository lama

## 📋 CHECKLIST KEAMANAN

Sebelum deploy ke production, pastikan:

- [ ] API Keys sudah di-regenerate
- [ ] File `.env` sudah diupdate dengan keys baru
- [ ] File `.env` TIDAK ter-commit ke git
- [ ] `.gitignore` sudah include `.env`
- [ ] `firebase-applet-config.json` sudah dihapus
- [ ] Firestore Security Rules sudah disetup
- [ ] Firebase Authentication sudah di-enable
- [ ] Test akses database dengan rules baru
- [ ] Repository lama sudah di-archive (jika buat baru)

## 🔐 BEST PRACTICES

### Environment Variables
- ✅ Gunakan `.env` untuk sensitive data
- ✅ Commit `.env.example` sebagai template
- ❌ JANGAN commit `.env` ke git
- ❌ JANGAN hardcode API keys di code

### Firebase Security
- ✅ Selalu gunakan Security Rules
- ✅ Enable Authentication untuk production
- ✅ Review rules secara berkala
- ✅ Monitor Firebase usage dashboard
- ❌ JANGAN biarkan database public

### Code Repository
- ✅ Review files sebelum commit
- ✅ Gunakan `.gitignore` dengan benar
- ✅ Setup pre-commit hooks (optional)
- ❌ JANGAN commit secrets

## 📞 BUTUH BANTUAN?

Jika mengalami kesulitan:
1. Baca dokumentasi Firebase: https://firebase.google.com/docs
2. Check Firebase Status: https://status.firebase.google.com
3. Firebase Support: https://firebase.google.com/support

## ⏰ TIMELINE

**Prioritas TINGGI - Lakukan dalam 24 jam:**
- [ ] Regenerate Firebase API Keys
- [ ] Setup Firestore Security Rules

**Prioritas MEDIUM - Lakukan dalam 1 minggu:**
- [ ] Enable Firebase Authentication
- [ ] Clean up git history

**Prioritas LOW - Lakukan sebelum production:**
- [ ] Setup monitoring & alerts
- [ ] Backup strategy
- [ ] Disaster recovery plan

---

**Terakhir diupdate:** 2026-07-22  
**Status:** 🔴 CRITICAL - Memerlukan tindakan segera
