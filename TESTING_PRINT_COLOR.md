# Quick Testing Guide - Preview Cetak Kontrak

## ✅ Langkah Testing

### 1. Buka Aplikasi
```
npm run dev
```

### 2. Navigasi ke Detail Kontrak
- Pilih salah satu kontrak dari daftar
- Klik untuk membuka detail

### 3. Buka Preview Cetak
- Cari dan klik tombol dengan icon Printer
- Atau cari tombol "Preview Cetak Kontrak"

### 4. Verifikasi Visual
Pastikan SEMUA teks di area preview berwarna **HITAM**:

✅ Header:
- [ ] "Dinas Pekerjaan Umum dan Perumahan Rakyat"
- [ ] "BIDANG BINA MARGA PROVINSI NTT"
- [ ] "Lembar Monitoring Dokumen Kontrak Pekerjaan Fisik"

✅ Identitas:
- [ ] "Nomor Registrasi Kontrak"
- [ ] Nomor kontrak (contoh: PUPR.BM.05.01/600.2.10.2/SPK/...)
- [ ] Badge "TA 2025"
- [ ] Badge "DANA PKB"

✅ Nama Paket:
- [ ] Label "Nama Paket Pekerjaan"
- [ ] Nama paket (contoh: Penanganan Long Segmen...)

✅ Lokasi & Wilayah:
- [ ] Label: Kab/Kota, Ruas Jalan, Pj. Efektif, dll
- [ ] Value: Kabupaten Manggarai Timur, nama ruas, dsb

✅ Administrasi:
- [ ] Label: Penyedia Jasa, Konsultan Pengawas, PPK
- [ ] Value: Nama kontraktor, konsultan, PPK, NIP

✅ Rincian Keuangan:
- [ ] Label: Anggaran DPA, Nilai Kontrak, Tanggal Kontrak
- [ ] Value: Rp 4.000.000.000, tanggal, dsb

✅ Masa Waktu:
- [ ] Label: Jangka Waktu, Tanggal Mulai, No. SPMK
- [ ] Value: 120 Hari Kalender, tanggal, nomor

✅ Adendum:
- [ ] Heading "Adendum Kontrak"
- [ ] Label dan nomor adendum
- [ ] Atau teks "Tidak ada adendum"

✅ Catatan:
- [ ] Heading "Catatan Evaluasi / Rekomendasi Lapangan"
- [ ] Isi catatan

### 5. Test Print Preview
- Tekan `Ctrl + P` atau klik tombol "Print"
- Pastikan pada print preview, semua font tetap hitam
- **JANGAN** ada warna abu-abu, biru, orange, atau warna lain pada teks

### 6. Test Download PDF (Opsional)
- Klik tombol "Download PDF"
- Tunggu hingga PDF terbentuk
- Buka PDF dan pastikan semua font hitam

### 7. Verifikasi Layout TIDAK Berubah
- [ ] Ukuran font sama
- [ ] Posisi elemen sama
- [ ] Spacing dan padding sama
- [ ] Border dan background masih ada (tidak hilang)
- [ ] Logo masih terlihat
- [ ] Layout 2-kolom masih rapi

## ❌ Yang TIDAK Boleh Berubah

- Ukuran halaman (A4 landscape)
- Ukuran font
- Ketebalan font (bold tetap bold)
- Posisi elemen
- Background colors (abu-abu muda, kuning muda tetap ada)
- Border (garis pemisah)
- Logo PUPR
- Badge background (kuning pada "DANA PKB")
- Icon emoji (📍, 💼, 💰, ⏱️, 📋)

## 🐛 Jika Menemukan Masalah

### Masalah: Ada teks yang masih berwarna lain
**Solusi**: Cek file `ContractPrintDocument.tsx` dan cari warna tersebut

### Masalah: Layout berubah
**Solusi**: Pastikan hanya property `color` yang diubah, bukan yang lain

### Masalah: Print tidak hitam
**Solusi**: Cek CSS print di `ContractPrintPreview.tsx`, pastikan `print-color-adjust: exact`

## 📊 Expected Result

**SEBELUM:**
- Label berwarna abu-abu (#64748b)
- Value berwarna slate gelap (#0f172a)
- Heading berwarna slate (#1e293b)
- Header orange (#d97706)

**SESUDAH:**
- SEMUA teks berwarna hitam (#000000)
- Background dan border tetap seperti semula
- Layout tidak berubah

## ✅ Success Criteria

1. ✅ Build berhasil tanpa error
2. ✅ TypeScript compilation success
3. ✅ Semua font di preview cetak berwarna hitam
4. ✅ Print preview (Ctrl+P) menampilkan font hitam
5. ✅ PDF download menampilkan font hitam
6. ✅ Layout dan spacing tidak berubah
7. ✅ Background colors tetap ada
8. ✅ Border dan garis pemisah tetap ada
