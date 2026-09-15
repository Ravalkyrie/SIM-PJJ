# 📋 DAFTAR PERUBAHAN RESPONSIF - Quick Reference

## File: AccessManagementView.tsx

### 1. Container Utama (Line ~125)
```typescript
// DARI:
<div className="space-y-6">

// JADI:
<div className="space-y-4 sm:space-y-6 p-3 sm:p-0">
```

### 2. Header (Line ~127-135)
```typescript
// Button class DARI:
className="flex items-center gap-2 px-4 py-2 bg-blue-500..."

// Button class JADI:
className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition whitespace-nowrap w-full sm:w-auto text-sm sm:text-base"
```

### 3. Title
```typescript
// DARI:
<h1 className="text-2xl font-bold...">

// JADI:
<h1 className="text-xl sm:text-2xl font-bold...">
```

### 4. Grid Info Boxes (Line ~140)
```typescript
// DARI:
<div className="grid grid-cols-3 gap-4">

// JADI:
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
```

### 5. Table Section (Line ~185)
Tambahkan class `hidden md:block` ke div table:
```typescript
<div className="hidden md:block overflow-x-auto">
  <table className="w-full">
```

### 6. Mobile Card View (Tambahkan setelah table)
Tambahkan sebelum closing `</div>` container table:
```typescript
{/* Mobile Card View */}
<div className="md:hidden divide-y divide-slate-200">
  {users.length === 0 ? (
    <div className="px-4 py-12 text-center text-slate-500 text-sm">
      Belum ada user terdaftar. Klik "Tambah User" untuk menambahkan.
    </div>
  ) : (
    users.map((user) => {
      const isSuperAdmin = user.email === SUPER_ADMIN_EMAIL;
      return (
        <div key={user.uid} className="p-4 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-base font-semibold text-slate-600 flex-shrink-0">
              {user.email.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-800 text-sm truncate">
                  {user.displayName || user.email.split('@')[0]}
                </span>
                {isSuperAdmin && <Crown className="w-4 h-4 text-yellow-500 flex-shrink-0" />}
              </div>
              <p className="text-xs text-slate-600 mt-0.5 truncate">{user.email}</p>
              <div className="mt-2">{getRoleBadge(user.role)}</div>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => handleOpenEditModal(user)}
              disabled={isSuperAdmin || loading}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Edit2 className="w-4 h-4" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => handleDeleteUser(user)}
              disabled={isSuperAdmin || loading}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
              <span>Hapus</span>
            </button>
          </div>
        </div>
      );
    })
  )}
</div>
```

### 7. Modal Responsive (Line ~350+)
```typescript
// Modal container DARI:
<div className="bg-white rounded-lg shadow-xl w-full max-w-md">

// Modal container JADI:
<div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
```

```typescript
// Modal padding DARI:
<div className="p-6">

// Modal padding JADI:
<div className="p-4 sm:p-6">
```

```typescript
// Input DARI:
<input className="w-full px-4 py-2 border...">

// Input JADI:
<input className="w-full px-3 sm:px-4 py-2 border text-sm sm:text-base...">
```

### 8. Icon Sizes di getRoleIcon()
```typescript
// DARI:
<Shield className="w-5 h-5 text-red-500" />

// JADI:
<Shield className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
```

---

## ✅ CHECKLIST PERUBAHAN

- [ ] Container: `space-y-4 sm:space-y-6 p-3 sm:p-0`
- [ ] Header: Responsive flex + button full width mobile
- [ ] Title: `text-xl sm:text-2xl`
- [ ] Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- [ ] Table: `hidden md:block`
- [ ] Mobile cards: `md:hidden` view ditambahkan
- [ ] Modal: `max-h-[90vh] overflow-y-auto`
- [ ] Modal padding: `p-4 sm:p-6`
- [ ] Input: `text-sm sm:text-base`
- [ ] Icons: `w-4 h-4 sm:w-5 sm:h-5`

---

## 🧪 TEST SETELAH EDIT

```bash
npm run build
npm run dev
```

Test di DevTools (F12 → Responsive Mode):
- Mobile: 375px (iPhone SE)
- Tablet: 768px (iPad)
- Desktop: 1920px

---

**Total Changes:** ~10 sections
**Estimated Time:** 30 menit
