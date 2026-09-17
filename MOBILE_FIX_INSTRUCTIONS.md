# PERBAIKAN RESPONSIVE MOBILE - BERKAS DIGITAL

## MASALAH
Pada tampilan mobile, section "Berkas Digital" di daftar kontrak masih menampilkan file individual satu per satu, berbeda dengan desktop yang sudah menggunakan sistem kategori.

## FILE YANG HARUS DIUBAH
`C:\New folder\Manajemen\src\components\ContractList.tsx`

## LOKASI PERUBAHAN
**Baris 305-373** - Section Mobile rendering untuk lampiran

## PERUBAHAN YANG DIPERLUKAN

Ganti section dengan comment `{/* Mobile: Show individual files */}` menjadi menggunakan logic grouping yang sama dengan desktop.

### KEY CHANGES:
1. Gunakan `groupLampiranByCategory(c.lampiran)` untuk mobile
2. Set `visibleLimit = 3` untuk mobile (desktop = 5)
3. Render chip/badge kategori dengan wrapping, bukan list file individual
4. Tambahkan responsive classes: `text-[10px]`, `w-3 h-3`, `max-w-[120px] truncate`
5. Gunakan `active:` pseudo-class untuk touch feedback
6. Navigate ke `/kontrak/${c.id}?section=berkas-digital` saat klik

### STRUKTUR BARU:
```tsx
{/* Mobile: Show file categories */}
<div className="block sm:hidden">
  {c.lampiran && c.lampiran.length > 0 ? (
    (() => {
      const grouped = groupLampiranByCategory(c.lampiran);
      const visibleLimit = 3;
      const visibleCategories = Array.from(grouped.entries()).slice(0, visibleLimit);
      const remainingCount = grouped.size - visibleLimit;
      
      return (
        <div className="flex flex-wrap gap-1.5">
          {visibleCategories.map(([category, files]) => (
            <button key={category} onClick={() => navigate(`/kontrak/${c.id}?section=berkas-digital`)}>
              {/* Category badge with count */}
            </button>
          ))}
          {remainingCount > 0 && <button>{`+${remainingCount} kategori`}</button>}
        </div>
      );
    })()
  ) : (
    <p className="text-xs text-slate-500 italic">Belum ada berkas digital</p>
  )}
</div>
```

## TESTING
- Test viewport: 320px, 390px, 640px, 768px, 1280px
- Verify no horizontal scroll
- Verify kategori grouping works
- Verify navigation to detail page works

**Status**: Instruksi manual siap
