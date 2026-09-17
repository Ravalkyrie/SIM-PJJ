# 📋 REVISI ANALISIS FINAL: Fitur Uraian Pekerjaan

## ✅ KOREKSI BERDASARKAN FEEDBACK

### ❌ SALAH (Analisis Pertama)
- Uraian Pekerjaan sebagai menu sidebar baru
- Section di ContractDetail untuk output saja
- Route terpisah untuk input

### ✅ BENAR (Koreksi)
- Uraian Pekerjaan adalah BAGIAN dari form Input/Edit Kontrak
- TIDAK ADA menu sidebar baru
- Output ditampilkan di Detail Kontrak sebagai section

---

## 🎯 STRUKTUR DATA FINAL

```typescript
// File: src/types.ts (TAMBAHKAN)

interface ItemPekerjaan {
  id: string;
  kodeItem: string;
  uraian: string;
  satuan: string;
  hargaSatuan: number;
  volume: number;
  jumlahHarga: number;       // AUTO: hargaSatuan × volume
  bobot: number;             // AUTO: % dari total
}

interface DivisiPekerjaan {
  id: string;
  nomorDivisi: number;       // 1-10 ONLY
  namaDivisi: string;        // User input
  items: ItemPekerjaan[];
  totalDivisi?: number;      // AUTO
}

interface UraianPekerjaan {
  id: string;
  contractId: string;        // WAJIB
  divisiList: DivisiPekerjaan[];
  totalDivisi?: number;
  totalItem?: number;
  totalNilaiPekerjaan?: number;
  createdAt?: string;
  updatedAt?: string;
}
```

---

## 🔄 ALUR INPUT/EDIT KONTRAK

### Form Structure (ContractForm.tsx)
```
INPUT/EDIT KONTRAK FORM
├── A. Identifikasi Kontrak
├── B. Paket & Lokasi
├── C. Rincian Keuangan
├── D. Kalender Pelaksanaan
├── E. Administrasi PPK
├── F. Progres & Evaluasi
└── G. Uraian Pekerjaan ⬅️ NEW
     ├── Summary
     ├── [+ Tambah Divisi]
     └── Divisi List (Accordion)
```

### Flow Input Baru:
```
1. Tambah Kontrak Baru
2. Isi Section A-F
3. Section G: Tambah Divisi
4. Pilih nomor divisi (1-10)
5. Isi nama divisi
6. Tambah item pekerjaan
7. Simpan Kontrak
```

### Flow Edit:
```
1. Edit Kontrak
2. Section G sudah ada data
3. CRUD divisi/item
4. Simpan Perubahan
```

---

## 📄 OUTPUT DETAIL KONTRAK

### Section Order (ContractDetail.tsx)
```
1. Action Header
2. Informasi Kontrak
3. Lokasi & Wilayah
4. Rincian Keuangan
5. Administrasi
6. Masa Waktu Pelaksanaan
7. RINCIAN URAIAN PEKERJAAN ⬅️ NEW (line ~490)
   ├── Summary (read-only)
   └── Accordion Divisi
8. Daftar Adendum
9. Berkas Digital
```

### Empty State:
```
"Belum ada uraian pekerjaan untuk kontrak ini."
```
