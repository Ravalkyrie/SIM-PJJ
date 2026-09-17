## 🗄️ STRUKTUR FIRESTORE FINAL

### Collection: `uraian_pekerjaan`

**Query:** `where("contractId", "==", contractId)`

```javascript
uraian_pekerjaan/
  {autoId}/
    contractId: "KTR-001"      // WAJIB, unique
    divisiList: [
      {
        id: "DIV-001-2",
        nomorDivisi: 2,          // 1-10, fixed
        namaDivisi: "DRAINASE",  // editable
        items: [
          {
            id: "ITEM-001",
            kodeItem: "2.1.(1)",
            uraian: "Galian untuk Drainase",
            satuan: "M3",
            hargaSatuan: 70000,
            volume: 266,
            jumlahHarga: 18620000,    // AUTO
            bobot: 0.65               // AUTO
          }
        ],
        totalDivisi: 173720000
      }
    ],
    totalDivisi: 4,
    totalItem: 17,
    totalNilaiPekerjaan: 2873020000,
    createdAt: "2026-09-17T...",
    updatedAt: "2026-09-17T..."
```

**Rules:**
- Satu dokumen per kontrak
- Hanya divisi yang ditambahkan user
- Tidak ada divisi kosong

---

## 📝 FILES TO CREATE/EDIT

### NEW FILES (6 files)

1. **src/lib/uraianPekerjaan.ts**
   - Calculate functions
   - Validate nomor divisi

2. **src/components/UraianPekerjaanFormSection.tsx**
   - Section untuk ContractForm
   - CRUD divisi & items

3. **src/components/UraianPekerjaanDisplaySection.tsx**
   - Section untuk ContractDetail
   - Read-only display

4. **src/components/DivisiFormModal.tsx**
   - Modal add/edit divisi

5. **src/components/ItemFormModal.tsx**
   - Modal add/edit item

6. **src/components/DeleteConfirmModal.tsx** (optional)
   - Confirmation untuk delete

### EDIT FILES (5 files)

1. **src/types.ts**
   - Tambah 3 interfaces

2. **src/components/ContractForm.tsx**
   - Insert Section G (line ~520)
   - State management uraian pekerjaan

3. **src/components/ContractDetail.tsx**
   - Insert display section (line ~490)

4. **src/App.tsx**
   - Handlers save/load uraian pekerjaan
   - Firestore CRUD

5. **src/pages/ContractFormPage.tsx**
   - Load existing uraian saat edit
   - Pass to ContractForm

---

## ⚠️ POIN PENTING

### 1. TIDAK ADA Menu/Sidebar Baru
- Uraian Pekerjaan = bagian dari form kontrak
- Tidak ada route baru
- Tidak ada menu navigation baru

### 2. Input di ContractForm
- Section G setelah Section F
- State tersimpan dalam form
- Save bersama kontrak

### 3. Output di ContractDetail
- Section setelah Masa Waktu Pelaksanaan
- Sebelum Daftar Adendum
- Read-only accordion

### 4. Divisi 1-10
- Pilihan tetap 1-10
- User pilih yang digunakan
- Yang tidak digunakan tidak disimpan
- Tidak ada divisi kosong

### 5. Validasi
- Nomor divisi tidak duplikat per kontrak
- Nomor divisi tidak bisa diubah setelah dibuat
- Nama divisi bisa diubah

### 6. Perhitungan Auto
```javascript
jumlahHarga = hargaSatuan × volume
totalDivisi = SUM(items.jumlahHarga)
totalNilaiPekerjaan = SUM(divisi.totalDivisi)
bobot = (jumlahHarga / totalNilaiPekerjaan) × 100
```

### 7. Firestore
- Collection: `uraian_pekerjaan`
- Link via `contractId`
- One document per contract
- Data tidak tercampur antar kontrak

### 8. Mobile Responsive
- Card layout untuk mobile
- Tidak ada horizontal overflow
- Accordion tetap berfungsi

### 9. Tidak Merusak Existing
- HashRouter tetap
- Firebase config tetap
- Existing features tidak tersentuh

### 10. No Excel Import (Fase Ini)
- Excel hanya referensi
- Input manual via form

---

## ✅ APPROVAL CHECKLIST

- [x] Uraian Pekerjaan = bagian form kontrak (bukan menu baru)
- [x] Input di Section G ContractForm
- [x] Output di ContractDetail setelah Masa Waktu
- [x] Divisi 1-10, user pilih yang digunakan
- [x] Tidak ada divisi kosong
- [x] Validasi nomor divisi tidak duplikat
- [x] Auto-calculate totals & bobot
- [x] Firestore structure defined
- [x] Mobile responsive
- [x] Tidak merusak existing features
- [ ] **WAITING FOR USER APPROVAL** ⬅️

---

**Status:** ⏸️ **MENUNGGU APPROVAL**

Apakah revisi ini sudah sesuai dengan requirement Anda?
Silakan review dan beri approval untuk mulai implementasi.
