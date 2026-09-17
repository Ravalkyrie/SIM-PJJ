# PANDUAN PERBAIKAN MOBILE UI - STEP BY STEP

## RINGKASAN
Berkas Digital pada mobile masih menampilkan file individual, harus diganti menggunakan sistem kategori seperti desktop.

## LANGKAH-LANGKAH

### 1. BUKA FILE
Buka di VS Code: `C:\New folder\Manajemen\src\components\ContractList.tsx`

### 2. CARI SECTION YANG AKAN DIGANTI
Tekan `Ctrl+F` dan cari: `Mobile: Show individual files`

Anda akan menemukan di sekitar baris 305-373

### 3. HAPUS KODE LAMA
Hapus seluruh section dari:
```tsx
{/* Mobile: Show individual files */}
```
Sampai (dan termasuk):
```tsx
</div>
```

Yang menutup section mobile tersebut (sebelum `</div>` penutup td)

### 4. PASTE KODE BARU
Copy seluruh isi file: `MOBILE_SECTION_NEW_CODE.txt`
Paste di lokasi yang sudah dihapus tadi

### 5. SAVE FILE
Tekan `Ctrl+S` untuk save

### 6. BUILD & TEST
```bash
cd "C:\New folder\Manajemen"
npm run build
```

Jika tidak ada error TypeScript, lanjutkan test di browser

### 7. TEST DI BROWSER
- Buka aplikasi di browser
- Klik kanan > Inspect > Toggle device toolbar (Ctrl+Shift+M)
- Test berbagai ukuran:
  - 320px width
  - 390px width  
  - 768px width
  - Desktop

### 8. VERIFIKASI
✅ Tidak ada file individual di mobile
✅ Tampil chip kategori seperti desktop
✅ Mobile max 3 kategori visible
✅ Desktop max 5 kategori visible
✅ Tidak ada horizontal scroll
✅ Klik kategori navigasi ke detail page
✅ Auto-scroll ke berkas digital berfungsi

## FILE YANG DIBUAT
- `MOBILE_FIX_INSTRUCTIONS.md` - Dokumentasi teknis
- `MOBILE_SECTION_NEW_CODE.txt` - Kode replacement yang siap pakai
- `fix_mobile_rendering.ps1` - Script helper (optional)
- `QUICK_FIX_GUIDE.md` - File ini

## JIKA ADA MASALAH
1. Restore backup jika ada: `ContractList.tsx.backup`
2. Atau revert via Git: `git checkout src/components/ContractList.tsx`
3. Ulangi dari langkah 1

## BANTUAN VISUAL
Lihat screenshot yang Anda upload untuk referensi masalah:
- Screenshot 1: Desktop menampilkan kategori (BENAR)
- Screenshot 2: Mobile menampilkan file individual (SALAH - harus diperbaiki)

Setelah fix, mobile juga harus menampilkan kategori seperti desktop.
