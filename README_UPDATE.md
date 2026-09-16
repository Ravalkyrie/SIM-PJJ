# Panduan Manual Update ContractList.tsx

## Status: CategoryFilesModal sudah ditambahkan di line 589

## Yang Perlu Dilakukan:

Buka: `C:\New folder\Manajemen\src\components\ContractList.tsx`

Cari text: `LAMPIRAN ({item.lampiran.length})` (sekitar line 329)

Replace section lampiran (line 324-349) dengan kode baru.

Lihat file: MANUAL_UPDATE_GUIDE.js untuk kode lengkap.

## Perubahan Utama:

1. Judul: LAMPIRAN → BERKAS DIGITAL
2. Container: tambah border-t border-slate-100
3. Display: File individual → Grouped by category
4. Max 5 kategori visible, sisanya "+N kategori"
5. Klik kategori → buka modal (sudah ada di line 589)

## Test Setelah Update:

```bash
cd "C:\New folder\Manajemen"
npm run lint
npm run build
npm run dev
```

Backup ada di: ContractList.tsx.backup
