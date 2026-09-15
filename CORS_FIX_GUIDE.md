# 🔧 CORS Error Fix Guide

## ❌ Current Error

```
Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at 
https://us-central1-simpjj-ebfe7.cloudfunctions.net/listAllUsers
```

## ✅ Solution

The CORS errors occur because:
1. Functions region wasn't specified correctly
2. Functions need to be redeployed with the updated code

---

## 🚀 Fix Steps

### Step 1: Rebuild and Redeploy Functions

```bash
# Navigate to functions directory
cd "C:/New folder/Manajemen/functions"

# Install dependencies (if not already done)
npm install

# Build the functions
npm run build

# Go back to root
cd ..

# Deploy functions
firebase deploy --only functions
```

**Expected Output:**
```
✔  functions[listAllUsers(us-central1)]: Successful update operation
✔  functions[updateUserRole(us-central1)]: Successful update operation
✔  functions[onUserCreated(us-central1)]: Successful update operation
```

---

### Step 2: Verify Deployment

```bash
firebase functions:list
```

You should see:
- ✅ `listAllUsers(us-central1)`
- ✅ `updateUserRole(us-central1)`
- ✅ `onUserCreated(us-central1)`

---

### Step 3: Restart Development Server

```bash
# Stop current dev server (Ctrl+C)
# Then restart
npm run dev
```

---

### Step 4: Test

1. Open browser: `http://localhost:5173` (or your dev port)
2. Login as admin: `sagalaarief@gmail.com`
3. Navigate to "Hak Akses" menu
4. Check browser console - CORS errors should be gone
5. You should see ALL users from Firebase Authentication

---

## 🔍 What Changed

### File: `src/firebase.ts`
**Before:**
```typescript
export const db = getFirestore(app);
export const auth = getAuth(app);
```

**After:**
```typescript
export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app, 'us-central1'); // ✅ Added region
```


## 🛡️ Why This Fixes CORS

1. **Callable Functions** (`onCall`) automatically handle CORS when:
   - Called via Firebase SDK (`httpsCallable`)
   - Region is correctly specified
   - Functions are properly deployed

2. **Region Specification** is crucial:
   - Firebase Functions default to `us-central1`
   - Must match deployment region
   - Without region, SDK tries wrong endpoint

3. **Proper SDK Usage**:
   - `httpsCallable()` adds authentication headers automatically
   - Handles CORS preflight requests
   - Validates authentication tokens

---

## 🐛 Troubleshooting

### Issue 1: Still Getting CORS Error
**Solution:**
```bash
# Clear browser cache
# Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

# Or restart dev server
npm run dev
```

### Issue 2: "Function not found" Error
**Check:**
```bash
firebase functions:list
```

**If functions missing:**
```bash
firebase deploy --only functions --force
```

### Issue 3: "Permission Denied" Error
**Check Firestore Rules in Firebase Console > Firestore > Rules**

### Issue 4: "Internal" Error
**Check function logs:**
```bash
firebase functions:log --only listAllUsers
```

---

## 📊 Verification Checklist

After fixing, verify:

- [ ] No CORS errors in browser console
- [ ] "Hak Akses" menu loads successfully
- [ ] ALL Firebase Auth users visible (not just Firestore users)
- [ ] "Edit User" button opens modal
- [ ] Can change user roles
- [ ] Super Admin (`sagalaarief@gmail.com`) protected
- [ ] Non-admin users can't access "Hak Akses"

---

## ✅ Success Indicators

You'll know it's working when:

1. **Console Output:**
   ```
   ✅ Fetching users via Cloud Function...
   ✅ Loaded 3 users from Firebase Authentication
   ```

2. **Network Tab:**
   - Status: `200 OK` (not 404 or CORS error)
   - Response contains user array

3. **UI:**
   - User table populated
   - No loading spinner stuck
   - "Edit User" buttons clickable

---

**Last Updated:** 2026-09-15

