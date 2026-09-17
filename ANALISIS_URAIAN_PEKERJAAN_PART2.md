## 🎯 RENCANA IMPLEMENTASI

### FASE 1: Type Definitions
**File:** `src/types.ts` - Tambahkan 3 interfaces baru

### FASE 2: Helper Functions
**File:** `src/lib/uraianPekerjaan.ts` - CRUD functions

### FASE 3: UI Components (BARU)
1. `src/components/UraianPekerjaanSection.tsx` - Main section
2. `src/components/DivisiFormModal.tsx` - Add/Edit divisi
3. `src/components/ItemFormModal.tsx` - Add/Edit item

### FASE 4: Integration
1. `src/App.tsx` - Add handlers & state management
2. `src/components/ContractDetail.tsx` - Insert section (line 490)
3. `src/pages/ContractDetailPage.tsx` - Pass props

### FASE 5: Validations & Calculations
- `jumlahHarga` = `hargaSatuan` × `volume`
- `totalDivisi` = SUM(`items.jumlahHarga`)
- `totalNilaiPekerjaan` = SUM(`divisi.totalDivisi`)
- `bobot` = (`jumlahHarga` / `totalNilaiPekerjaan`) × 100
- Validate: Divisi 1-10 tidak duplikat

### FASE 6: Mobile Responsive
- Desktop: Accordion + table/grid
- Mobile: Card vertical layout

---

## 🔧 TECHNICAL DECISIONS

### 1. Insert Location
**File:** `src/components/ContractDetail.tsx`
**Line:** After line 490 (Masa Waktu Pelaksanaan)
**Before:** Line 501 (Adendum Section)

### 2. Component Strategy
**Decision:** Modular components (Option B)
- Separate UraianPekerjaanSection
- Reusable, maintainable
- Clean code structure

### 3. Form Strategy
**Decision:** Modal Forms (Option A)
- Add/Edit divisi via modal
- Add/Edit item via modal
- Clean UI, no layout disruption

### 4. Data Loading
**When:** Load saat ContractDetailPage mount
**Query:** `uraian_pekerjaan` where `contractId == id`
**State:** Store di App.tsx, pass via props

### 5. Empty State
```tsx
Belum ada uraian pekerjaan untuk kontrak ini.
[+ Tambah Divisi Pertama]
```

---

## 📝 FILES TO CREATE/EDIT

### BARU (5 files)
1. `src/types.ts` - **EDIT** (add interfaces)
2. `src/lib/uraianPekerjaan.ts` - **NEW**
3. `src/components/UraianPekerjaanSection.tsx` - **NEW**
4. `src/components/DivisiFormModal.tsx` - **NEW**
5. `src/components/ItemFormModal.tsx` - **NEW**

### EDIT (3 files)
1. `src/App.tsx` - Add handlers & state
2. `src/components/ContractDetail.tsx` - Insert section
3. `src/pages/ContractDetailPage.tsx` - Pass props

---

## 🎨 UI/UX DESIGN

### Summary Card
```
┌──────────────────────────────────────┐
│ RINCIAN URAIAN PEKERJAAN             │
│ Total Divisi: 4 | Total Item: 17    │
│ Total Nilai: Rp2.873.020.000         │
│ [+ Tambah Divisi]                    │
└──────────────────────────────────────┘
```

### Divisi Accordion (Collapsed)
```
▶ DIVISI 2 — DRAINASE
  Total: Rp173.720.000 | 3 items
```

### Divisi Accordion (Expanded)
```
▼ DIVISI 2 — DRAINASE
  [+ Tambah Item] [Edit] [Hapus]
  
  ┌────────────────────────────────┐
  │ 2.1.(1) Galian Drainase        │
  │ M3 | 266 × Rp70.000            │
  │ Total: Rp18.620.000 (0.65%)    │
  │ [Edit] [Hapus]                 │
  └────────────────────────────────┘
```

---

## ⚠️ TIDAK BOLEH DIUBAH

1. HashRouter
2. Firebase config
3. Existing collections
4. KontrakFisik interface
5. Login/Auth
6. Dashboard, ContractList
7. Adendum & Lampiran sections

---

## ✅ APPROVAL CHECKLIST

- [x] Struktur project analyzed
- [x] Data structure designed
- [x] TypeScript interfaces defined
- [x] Insert location identified
- [x] Component strategy chosen
- [x] UI/UX pattern designed
- [ ] **WAITING FOR USER APPROVAL** ⬅️

---

**Status:** ⏸️ **MENUNGGU PERSETUJUAN**

Apakah rencana implementasi ini sudah sesuai?
Silakan review dan beri persetujuan untuk mulai coding.
