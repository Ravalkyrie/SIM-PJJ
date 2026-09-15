# Firebase Cloud Functions Setup & Deployment

## Overview
Cloud Functions diperlukan untuk mengakses Firebase Authentication list users secara aman dari backend.

## Prerequisites

1. **Node.js** v18 atau lebih tinggi
2. **Firebase CLI** terinstall
3. **Firebase Project** sudah dikonfigurasi

## Installation Steps

### 1. Install Firebase CLI (jika belum)

```bash
npm install -g firebase-tools
```

### 2. Login ke Firebase

```bash
firebase login
```

### 3. Initialize Firebase Project (jika belum)

Di root project (`C:/New folder/Manajemen`):

```bash
firebase init
```

Pilih:
- ✅ Functions
- ✅ Hosting (optional, untuk deploy web app)

### 4. Install Dependencies di Functions

```bash
cd functions
npm install
```

### 5. Build Functions

```bash
npm run build
```

## Deploy Cloud Functions

### Deploy Semua Functions

```bash
cd C:/New folder/Manajemen
firebase deploy --only functions
```

### Deploy Function Tertentu

```bash
firebase deploy --only functions:listAllUsers
firebase deploy --only functions:updateUserRole
firebase deploy --only functions:onUserCreated
```

## Available Functions

### 1. `listAllUsers` (Callable Function)
**Purpose**: Mengambil seluruh user dari Firebase Authentication beserta rolenya

**Access**: Admin only

**Usage dari Frontend**:
```typescript
import { listAllUsers } from './lib/userManagement';

const users = await listAllUsers();
```

**Returns**:
```typescript
{
  users: [
    {
      uid: string,
      email: string,
      role: 'admin' | 'user' | 'visitor',
      isSuperAdmin: boolean
    }
  ]
}
```

### 2. `updateUserRole` (Callable Function)
**Purpose**: Mengubah role user di Firestore

**Access**: Admin only (tidak bisa mengubah Super Admin)

**Usage dari Frontend**:
```typescript
import { updateUserRole } from './lib/userManagement';

await updateUserRole(targetUid, 'admin');
```

**Parameters**:
- `targetUid`: UID user yang akan diubah
- `newRole`: 'admin' | 'user' | 'visitor'

### 3. `onUserCreated` (Auth Trigger)
**Purpose**: Otomatis membuat document di Firestore saat user baru signup

**Trigger**: Otomatis saat user baru dibuat di Firebase Authentication

**Behavior**:
- Super Admin email → role 'admin'
- User lain → role 'visitor' (default)

## Testing

### Local Emulator (Optional)

```bash
cd functions
npm run serve
```

Emulator akan berjalan di: `http://localhost:5001`

### Test dari Frontend

1. Login sebagai Admin (`sagalaarief@gmail.com`)
2. Buka menu "Hak Akses"
3. Lihat seluruh user dari Firebase Authentication
4. Klik "Edit User" untuk mengubah role

## Environment Variables

Tidak ada environment variable yang diperlukan. Firebase Admin SDK otomatis menggunakan credentials dari Firebase Project.

## Security

✅ **Function-level security**:
- Hanya authenticated users yang bisa call functions
- Hanya admin yang bisa list users dan update roles
- Super Admin tidak bisa diubah rolenya

✅ **Firestore Security Rules** (tambahkan di Firebase Console):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      // User can read their own document
      allow read: if request.auth != null && request.auth.uid == userId;
      
      // Admins can read all users
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      
      // Only admins can update user roles
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Contracts collection
    match /kontrak/{contractId} {
      // Everyone can read
      allow read: if request.auth != null;
      
      // Admin and User can write
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'user'];
    }
    
    // Activity logs
    match /activity_logs/{logId} {
      // Everyone can read
      allow read: if request.auth != null;
      
      // Admin and User can write
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'user'];
    }
  }
}
```

## Troubleshooting

### Error: "Permission Denied"

**Solusi**: Pastikan user yang login memiliki role 'admin' di Firestore

### Error: "Function not found"

**Solusi**: Deploy ulang functions
```bash
firebase deploy --only functions
```

### Error: "CORS"

**Solusi**: Functions sudah dikonfigurasi untuk callable functions, tidak perlu CORS manual

### Error: "Build failed"

**Solusi**: 
```bash
cd functions
rm -rf node_modules
npm install
npm run build
```

## Cost Estimation

Firebase Functions pricing:
- **Free Tier**: 2M invocations/month, 400K GB-seconds/month
- **Paid**: $0.40 per million invocations

Estimasi untuk aplikasi ini:
- ~10 admin users
- ~50 list users calls/day
- ~20 role updates/day
- **Total**: ~2,100 calls/month = **FREE**

## Deployment Checklist

- [ ] Install Firebase CLI
- [ ] Login to Firebase (`firebase login`)
- [ ] Install dependencies (`cd functions && npm install`)
- [ ] Build functions (`npm run build`)
- [ ] Deploy functions (`firebase deploy --only functions`)
- [ ] Update Firestore Security Rules di Firebase Console
- [ ] Test dari aplikasi (login as admin, buka Hak Akses)
- [ ] Verify user list dari Firebase Authentication muncul
- [ ] Test edit role dan simpan perubahan

## Next Steps

Setelah deploy:
1. ✅ Login sebagai Admin
2. ✅ Buka menu "Hak Akses"
3. ✅ Verifikasi semua user dari Firebase Auth muncul
4. ✅ Test edit role user
5. ✅ Login sebagai user dengan role baru untuk verifikasi

## Support

Jika ada masalah:
1. Check Firebase Console → Functions → Logs
2. Check browser console untuk error messages
3. Verify user memiliki role 'admin' di Firestore
