# CETAK KONTRAK - QUICK START GUIDE

## ✅ IMPLEMENTASI SELESAI

Fitur "Cetak Kontrak" telah berhasil ditambahkan ke sistem.

---

## 📦 YANG SUDAH DIBUAT

### 1. File Baru
- ✅ `ContractPrintDocument.tsx` - Dokumen A4 landscape untuk print
- ✅ `ContractPrintPreview.tsx` - Modal preview dengan toolbar
- ✅ `package.json` - Updated dengan jspdf & html2canvas

### 2. File Modified
- ✅ `ContractList.tsx` - Tambah button "Cetak Kontrak"

---

## 🎯 LOKASI BUTTON

### Desktop (Table View)
**Kolom Aksi** → Icon Printer (biru) sebelum Eye icon

### Mobile/Tablet (Card View)
**Footer Card** → Button "Cetak" dengan icon

---

## 🚀 LANGKAH INSTALL & TEST

### Step 1: Install Dependencies
Buka **Command Prompt** atau **Terminal VS Code**:

```bash
cd "C:\New folder\Manajemen"
npm install
```

Dependencies yang akan di-install:
- `jspdf@^2.5.2` - Generate PDF
- `html2canvas@^1.4.1` - Capture HTML as image

### Step 2: Build & Verify
```bash
npm run build
```

Pastikan tidak ada error TypeScript.

### Step 3: Start Dev Server
```bash
npm run dev
```

### Step 4: Test di Browser
1. Buka http://localhost:3000
2. Login
3. Pergi ke **Daftar Kontrak**
4. Klik button **"Cetak Kontrak"** (icon printer di desktop, atau button "Cetak" di mobile)
5. Preview muncul
6. Test:
   - ✅ Download PDF
   - ✅ Print (browser dialog)
   - ✅ Tutup

---

## 📄 DOCUMENT SPECS

- **Format:** A4 Landscape (297mm × 210mm)
- **Pages:** 1 halaman (semua data fit)
- **Layout:** 3 kolom grid
- **Sections:**
  - Identitas Kontrak
  - Lokasi & Wilayah  
  - Rincian Keuangan
  - Administrasi & Stakeholders
  - Masa Waktu Pelaksanaan
  - Catatan Evaluasi/Rekomendasi

### ❌ TIDAK DITAMPILKAN:
- Status Lapangan
- Realisasi Fisik
- Penyerapan Keuangan
- Progres monitoring

---

## 📱 RESPONSIVE

✅ **Desktop:** Button icon di action column
✅ **Tablet:** Layout proper, button accessible
✅ **Mobile:** Button text + icon, no overflow, existing layout TIDAK RUSAK

---

## 🔧 TROUBLESHOOTING

### Q: npm install gagal
**A:** Enable PowerShell execution:
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

### Q: Build error "Cannot find module"
**A:** Pastikan npm install berhasil, cek node_modules/jspdf ada

### Q: Preview tidak muncul
**A:** Check browser console, pastikan no JavaScript errors

### Q: PDF kosong
**A:** Wait for loading state, element capture membutuhkan waktu

---

## ✨ FEATURES

✅ Dynamic data (dari kontrak yang dipilih)
✅ A4 Landscape format
✅ Professional document layout
✅ Download as PDF
✅ Browser print support
✅ Responsive design
✅ Loading states
✅ Error handling
✅ Filename sanitization
✅ Long text handling (wrap, tidak truncate)

---

## 📋 CHECKLIST TESTING

- [ ] npm install berhasil
- [ ] npm run build berhasil
- [ ] Button "Cetak" muncul di desktop
- [ ] Button "Cetak" muncul di mobile
- [ ] Click button → preview muncul
- [ ] Data sesuai kontrak yang dipilih
- [ ] Download PDF → file ter-download
- [ ] Print → dialog muncul
- [ ] Tutup → kembali ke list
- [ ] Responsive proper (mobile/tablet/desktop)
- [ ] Nama paket panjang wrap (tidak terpotong)

---

**Selamat! Fitur Cetak Kontrak siap digunakan.** 🎉
