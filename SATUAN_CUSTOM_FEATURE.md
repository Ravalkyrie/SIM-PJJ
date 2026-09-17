# Fitur Custom Satuan - Edit Item Pekerjaan

## Ringkasan Perubahan
Menambahkan opsi satuan baru dan kemampuan untuk user mengetik satuan custom pada form Edit Item Pekerjaan.

## Satuan yang Ditambahkan

### Satuan Baru (Predefined)
- **Lembar** - untuk item seperti dokumen, plat, panel
- **Pasang** - untuk item berpasangan seperti pintu, jendela
- **Set** - untuk item dalam set/paket

### Opsi "(Lainnya)"
Ketika user memilih "(Lainnya)", muncul input text box yang memungkinkan user untuk mengetik satuan custom sesuai kebutuhan mereka.

## Daftar Lengkap Satuan

```javascript
['M3', 'M2', 'M', 'Ton', 'Unit', 'Ls', 'Kg', 'Buah', 'Liter', 'Lembar', 'Pasang', 'Set', '(Lainnya)']
```

## Fitur Implementasi

### 1. State Management
```typescript
const [satuan, setSatuan] = useState('');          // Satuan yang dipilih dari dropdown
const [customSatuan, setCustomSatuan] = useState(''); // Custom satuan jika pilih "(Lainnya)"
```

### 2. Dropdown Satuan
- Menampilkan semua opsi satuan termasuk "(Lainnya)"
- Ketika user memilih selain "(Lainnya)", custom input disembunyikan
- Ketika user memilih "(Lainnya)", custom input ditampilkan

### 3. Custom Input Field
- Hanya muncul ketika "(Lainnya)" dipilih
- Background amber untuk membedakan dari input biasa
- Placeholder: "Ketik satuan custom (misal: Paket, Titik, dll)"
- Required field validation

### 4. Validasi
```typescript
// Jika memilih "(Lainnya)", custom input wajib diisi
if (satuan === '(Lainnya)') {
  if (!customSatuan.trim()) {
    setError('Satuan lainnya wajib diisi');
    return;
  }
}
```

### 5. Submit Logic
```typescript
// Gunakan custom satuan jika "(Lainnya)" dipilih, jika tidak gunakan satuan dropdown
const finalSatuan = satuan === '(Lainnya)' ? customSatuan.trim() : satuan.trim();
```

### 6. Edit Mode Support
Ketika edit item yang memiliki satuan custom (tidak ada di predefined list):
- Dropdown otomatis set ke "(Lainnya)"
- Custom input field otomatis terisi dengan satuan dari data yang diedit
- User bisa tetap mengganti ke satuan predefined atau tetap custom

```typescript
// Check if satuan is in predefined options
if (satuanOptions.includes(initialData.satuan)) {
  setSatuan(initialData.satuan);
  setCustomSatuan('');
} else {
  // If not in options, set to "(Lainnya)" and populate custom field
  setSatuan('(Lainnya)');
  setCustomSatuan(initialData.satuan);
}
```

## UI/UX Design

### Custom Input Styling
```css
bg-amber-50          // Background amber terang
border-amber-300     // Border amber
focus:ring-amber-500 // Focus ring amber
mt-2                 // Margin top untuk spacing
```

### Clear on Switch
Ketika user mengganti pilihan dari "(Lainnya)" ke satuan predefined, custom input otomatis dikosongkan:

```typescript
onChange={(e) => {
  setSatuan(e.target.value);
  if (e.target.value !== '(Lainnya)') {
    setCustomSatuan('');
  }
}}
```

## Contoh Penggunaan

### Skenario 1: Menggunakan Satuan Predefined
1. User membuka Edit Item Pekerjaan
2. Pilih satuan dari dropdown (misal: "Lembar")
3. Input field custom tidak muncul
4. Submit form

### Skenario 2: Menggunakan Satuan Custom
1. User membuka Edit Item Pekerjaan
2. Pilih "(Lainnya)" dari dropdown
3. Input field custom muncul dengan background amber
4. User ketik satuan custom (misal: "Paket", "Titik", "Roll", dll)
5. Submit form
6. Data tersimpan dengan satuan custom

### Skenario 3: Edit Item dengan Satuan Custom
1. User edit item yang sudah ada dengan satuan custom (misal: "Roll")
2. Dropdown otomatis menunjukkan "(Lainnya)"
3. Input custom otomatis terisi "Roll"
4. User bisa:
   - Tetap gunakan "Roll" atau ganti ke custom lain
   - Atau ganti ke satuan predefined seperti "Unit"

## File yang Dimodifikasi

**File:** `src/components/ItemFormModal.tsx`

### Perubahan Detail:
1. **Line 28**: Tambah state `customSatuan`
2. **Line 33**: Update array `satuanOptions` dengan tambahan 'Lembar', 'Pasang', 'Set', '(Lainnya)'
3. **Line 41-49**: Logic untuk handle edit mode dengan custom satuan
4. **Line 57**: Reset `customSatuan` saat create mode
5. **Line 83-89**: Validasi untuk custom satuan
6. **Line 102**: Logic untuk menentukan satuan final (custom atau predefined)
7. **Line 167-192**: UI dropdown dan conditional custom input field

## Testing Checklist

- [x] Dropdown menampilkan semua satuan termasuk opsi baru
- [x] Custom input muncul ketika pilih "(Lainnya)"
- [x] Custom input tersembunyi ketika pilih satuan predefined
- [x] Validasi error muncul jika "(Lainnya)" dipilih tapi custom input kosong
- [x] Data tersimpan dengan benar (custom atau predefined)
- [x] Edit mode berfungsi untuk satuan predefined
- [x] Edit mode berfungsi untuk satuan custom
- [x] Switch dari "(Lainnya)" ke predefined membersihkan custom input
- [x] TypeScript type safety terpenuhi

## Manfaat

1. **Fleksibilitas**: User tidak terbatas pada satuan predefined
2. **User-friendly**: Interface intuitif dengan conditional input
3. **Konsistensi Data**: Satuan umum tetap standardized, custom hanya untuk kasus khusus
4. **Backward Compatible**: Item dengan satuan existing tetap berfungsi
5. **Visual Clarity**: Custom input menggunakan warna berbeda (amber) untuk clarity

## Contoh Satuan Custom yang Mungkin Digunakan
- Paket
- Titik
- Roll
- Rim
- Koli
- Dos
- Bundel
- Batang
- Helai
- Dan lain-lain sesuai kebutuhan proyek
