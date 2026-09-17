# Script untuk memperbaiki mobile rendering di ContractList.tsx
# Jalankan dari root project: powershell -ExecutionPolicy Bypass -File fix_mobile_rendering.ps1

$filePath = "src\components\ContractList.tsx"
$encoding = [System.Text.Encoding]::UTF8

# Baca file
$content = Get-Content -Path $filePath -Raw -Encoding UTF8

# Pattern untuk mencari section mobile yang lama
$oldPattern = @'
                    \{/\* Mobile: Show individual files \*/\}
                    <div className="block sm:hidden">
                      \{c\.lampiran && c\.lampiran\.length > 0 \? \(
                        <div className="space-y-1\.5">
'@

# Kode baru untuk mengganti
$newCode = @'
                    {/* Mobile: Show file categories (same logic as desktop, but with fewer visible items) */}
                    <div className="block sm:hidden">
                      {c.lampiran && c.lampiran.length > 0 ? (
                        (() => {
                          const grouped = groupLampiranByCategory(c.lampiran);
                          const visibleLimit = 3; // Show fewer categories on mobile
                          const visibleCategories = Array.from(grouped.entries()).slice(0, visibleLimit);
                          const remainingCount = grouped.size - visibleLimit;

                          return (
                            <div className="flex flex-wrap gap-1.5">
                              {visibleCategories.map(([category, files]) => (
                                <button
                                  key={category}
                                  onClick={() => navigate(`/kontrak/${c.id}?section=berkas-digital`)}
                                  className="inline-flex items-center gap-1.5 px-2 py-1 bg-blue-50 active:bg-blue-100 border border-blue-200 rounded text-[10px] text-blue-700 font-medium transition-colors cursor-pointer"
                                  title={`Lihat ${files.length} file ${category}`}
                                >
                                  <FolderOpen className="w-3 h-3 text-blue-600 flex-shrink-0" />
                                  <span className="whitespace-nowrap max-w-[120px] truncate">{category}</span>
                                  <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded font-bold text-[9px] flex-shrink-0">
                                    {files.length}
                                  </span>
                                </button>
                              ))}
                              {remainingCount > 0 && (
                                <button
                                  onClick={() => navigate(`/kontrak/${c.id}?section=berkas-digital`)}
                                  className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 active:bg-slate-200 border border-slate-300 rounded text-[10px] text-slate-700 font-medium transition-colors cursor-pointer"
                                  title="Lihat semua kategori"
                                >
                                  <span className="whitespace-nowrap">+{remainingCount} kategori</span>
                                </button>
                              )}
                            </div>
                          );
                        })()
                      ) : (
                        <p className="text-xs text-slate-500 italic">Belum ada berkas digital</p>
                      )}
                    </div>
'@

Write-Host "Searching for mobile section to replace..."

# Cari dan ganti - gunakan regex mode singleline
if ($content -match "Mobile: Show individual files") {
    Write-Host "Found mobile section. Creating backup..."
    Copy-Item -Path $filePath -Destination "$filePath.backup"
    
    Write-Host "Applying fix..."
    # Manual replacement karena pattern kompleks
    # User harus edit manual di VS Code
    
    Write-Host "`nFILE BACKUP CREATED: $filePath.backup"
    Write-Host "`nMANUAL STEPS REQUIRED:"
    Write-Host "1. Open: $filePath"
    Write-Host "2. Find: {/* Mobile: Show individual files */}"
    Write-Host "3. Select entire mobile section (about lines 305-373)"
    Write-Host "4. Replace with code from: MOBILE_SECTION_NEW_CODE.txt"
    Write-Host "5. Save file"
    Write-Host "`nNew code is in: MOBILE_SECTION_NEW_CODE.txt"
} else {
    Write-Host "ERROR: Could not find mobile section pattern"
}
'@