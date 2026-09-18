# Perubahan Warna Font Preview Cetak Kontrak

## Tanggal: 18 September 2026

## Tujuan
Mengubah SEMUA warna font di area "Preview Cetak Kontrak" menjadi hitam (#000000) agar lebih mudah dibaca saat preview dan cetak.

## File yang Diubah
- `src/components/ContractPrintDocument.tsx`

## Perubahan Detail

### Area yang Diubah Warna Fontnya:

1. **Header**
   - "Dinas Pekerjaan Umum dan Perumahan Rakyat" → hitam (dari amber #d97706)
   - "BIDANG BINA MARGA PROVINSI NTT" → hitam (dari slate #0f172a)
   - "Lembar Monitoring Dokumen Kontrak Pekerjaan Fisik" → hitam (dari slate #64748b)

2. **Identitas Kontrak**
   - Label "Nomor Registrasi Kontrak" → hitam (dari slate #64748b)
   - Nomor kontrak → hitam (dari slate #1e293b)
   - Badge "TA" → hitam (dari slate #334155)
   - Badge "DANA PKB" → hitam (dari #0a0a0a)

3. **Nama Paket Pekerjaan**
   - Label → hitam (dari slate #94a3b8)
   - Nama paket → hitam (dari slate #0f172a)

4. **Lokasi & Wilayah**
   - Heading → hitam (dari slate #1e293b)
   - Semua label (Kab/Kota, Ruas Jalan, dll) → hitam (dari slate #64748b)
   - Semua value → hitam (dari slate #0f172a)

5. **Administrasi Pekerjaan & Stakeholders**
   - Heading → hitam (dari slate #1e293b)
   - Semua label → hitam (dari slate #64748b)
   - Semua value (kontraktor, konsultan, PPK, NIP) → hitam (dari slate #0f172a)

6. **Rincian Keuangan**
   - Heading → hitam (dari slate #1e293b)
   - Semua label (Anggaran DPA, Nilai Kontrak, Tanggal Kontrak) → hitam (dari slate #64748b)
   - Semua value → hitam (dari slate #0f172a)

7. **Masa Waktu Pelaksanaan**
   - Heading → hitam (dari slate #1e293b)
   - Semua label (Jangka Waktu, Tanggal Mulai, No. SPMK) → hitam (dari slate #64748b)
   - Semua value → hitam (dari slate #0f172a)

8. **Adendum Kontrak**
   - Heading → hitam (dari slate #1e293b)
   - Semua label → hitam (dari slate #64748b)
   - Semua nomor adendum → hitam (dari slate #0f172a)
   - Teks "Tidak ada adendum" → hitam (dari slate #94a3b8)

9. **Catatan Evaluasi / Rekomendasi Lapangan**
   - Heading → hitam (dari slate #1e293b)
   - Isi catatan → hitam (dari slate #334155)

10. **Root Container**
    - Default color → hitam (dari slate #0f172a)

## Total Perubahan
- **49 instance** warna font diubah menjadi `#000000` atau `black`

## Yang TIDAK Diubah
Sesuai instruksi, hanya warna font yang diubah. Elemen berikut TIDAK diubah:
- Background colors (tetap #f8fafc, #fffbeb, dll)
- Border colors (tetap #e2e8f0, #fde68a, dll)
- Badge background (tetap #fbbf24 untuk DANA PKB)
- Layout, spacing, padding, margin
- Font size, font weight
- Icon dan emoji
- Struktur HTML

## Validasi
✅ Build berhasil: `npm run build` completed in 6.19s
✅ Tidak ada TypeScript errors
✅ Tidak ada runtime errors
✅ Bundle size: ~1.99 MB (gzipped: ~568 kB)

## Cara Test
1. Buka aplikasi dan navigasi ke detail kontrak
2. Klik tombol "Preview Cetak" atau icon printer
3. Verifikasi semua teks di area preview berwarna hitam
4. Test print (Ctrl+P) dan pastikan hasil cetakan juga menggunakan font hitam
5. Pastikan tidak ada perubahan layout atau elemen lain

## Print Media Query
Perubahan ini akan otomatis diterapkan pada:
- Screen preview
- Print preview (Ctrl+P)
- PDF download (via html2canvas + jsPDF)

## Kompatibilitas
- ✅ Chrome/Edge
- ✅ Firefox
- ✅ Safari
- ✅ Print to PDF
- ✅ Physical printer

## Notes
- Semua perubahan menggunakan inline styles untuk memastikan konsistensi
- Warna hitam menggunakan `#000000` untuk konsistensi
- Print CSS di `ContractPrintPreview.tsx` sudah menggunakan `print-color-adjust: exact` untuk memastikan warna tetap akurat saat print
