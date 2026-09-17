# 📋 ANALISIS PRE-IMPLEMENTATION: Fitur Input Uraian Pekerjaan

## 🔍 STRUKTUR PROJECT YANG DITEMUKAN

### 1. Struktur Folder
```
C:\New folder\Manajemen\
├── src/
│   ├── components/          # Komponen UI
│   ├── pages/              # Halaman routing
│   ├── lib/                # Helper functions
│   ├── data/               # Mock data
│   ├── types.ts            # TypeScript interfaces
│   ├── firebase.ts         # Firebase config
│   └── App.tsx             # Main app & routing
```

### 2. TypeScript Interfaces (src/types.ts)

**Existing:**
- `KontrakFisik` - Interface untuk kontrak
- `AdendumKontrak` - Interface untuk adendum
- `DokumenLampiran` - Interface untuk lampiran
- `ActivityLog` - Interface untuk log
- `AppUser` & `UserRole` - Interface untuk user

### 3. Firebase/Firestore

**File:** `src/firebase.ts`
**Collections:**
- `kontrak` - Data kontrak
- `activity_logs` - Log aktivitas
- `users` - User management

### 4. Routing (HashRouter)

```
/ → redirect to /dashboard
/dashboard → DashboardPage
/kontrak → ContractsPage
/kontrak/tambah → ContractFormPage
/kontrak/:id → ContractDetailPage
/kontrak/:id/edit → ContractFormPage (edit)
/log-aktivitas → ActivityLogsPage
/hak-akses → AccessManagementPage
```

### 5. ContractDetail Sections (URUTAN PENTING)

**Current order:**
1. Action Header
2. Informasi Kontrak
3. Lokasi & Wilayah
4. Rincian Keuangan
5. Administrasi & Stakeholders
6. **Masa Waktu Pelaksanaan** ⬅️ AFTER THIS
7. **[INSERT URAIAN PEKERJAAN HERE]** ⬅️ NEW SECTION
8. Daftar Adendum Kontrak ⬅️ BEFORE THIS
9. Berkas Kontrak Digital

**Insert Location:** Line 490-500 di `ContractDetail.tsx`

---

## 📊 RENCANA STRUKTUR DATA

### TypeScript Interfaces (BARU)

```typescript
interface ItemPekerjaan {
  id: string;
  kodeItem: string;
  uraian: string;
  satuan: string;
  hargaSatuan: number;
  volume: number;
  jumlahHarga: number;  // AUTO: hargaSatuan × volume
  bobot: number;         // AUTO: % dari total
}

interface DivisiPekerjaan {
  id: string;
  nomorDivisi: number;   // 1-10 only
  namaDivisi: string;
  items: ItemPekerjaan[];
  totalDivisi?: number;  // AUTO: SUM items
}

interface UraianPekerjaan {
  id: string;
  contractId: string;    // Link to KontrakFisik
  divisiList: DivisiPekerjaan[];
  totalDivisi?: number;
  totalItem?: number;
  totalNilaiPekerjaan?: number;
  createdAt?: string;
  updatedAt?: string;
}
```

### Firestore Structure

**Collection:** `uraian_pekerjaan`

```
uraian_pekerjaan/
  {docId}/
    contractId: "KTR-001"
    divisiList: [
      {
        id: "DIV-2",
        nomorDivisi: 2,
        namaDivisi: "DRAINASE",
        items: [...],
        totalDivisi: 173720000
      },
      ...
    ]
    totalDivisi: 4
    totalItem: 17
    totalNilaiPekerjaan: 2873020000
```

**Keunggulan:**
- One document per contract
- Easy to query
- Nested structure
- Auto-calculated totals
