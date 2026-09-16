import re

# Read the file
with open(r'C:\New folder\Manajemen\src\components\ContractList.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Find and replace the lampiran section
old_pattern = r'(\{/\* Berkas Digital / Lampiran \*/\}[\s\S]*?{item\.lampiran && item\.lampiran\.length > 0 && \([\s\S]*?<div className="col-span-2 flex flex-col gap-2 pt-2">[\s\S]*?<div className="flex items-center gap-1\.5 text-\[10px\] uppercase tracking-wide font-bold text-slate-500">[\s\S]*?<FileText className="w-3 h-3" />[\s\S]*?<span>LAMPIRAN \(\{item\.lampiran\.length\}\)</span>[\s\S]*?</div>[\s\S]*?<div className="flex flex-wrap gap-1\.5">[\s\S]*?\{item\.lampiran\.map\(\(lamp\) => \([\s\S]*?key=\{lamp\.id\}[\s\S]*?onClick=\{\(\) => \{[\s\S]*?if \(lamp\.googleDriveUrl\) \{[\s\S]*?window\.open\(lamp\.googleDriveUrl, \'_blank\'\);[\s\S]*?\} else \{[\s\S]*?alert\(`File "\$\{lamp\.namaFile\}" tidak memiliki URL yang valid\.`\);[\s\S]*?\}[\s\S]*?\}\}[\s\S]*?className="flex items-center gap-1\.5 px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded text-\[10px\] font-medium transition cursor-pointer"[\s\S]*?title=\{`Unduh: \$\{lamp\.namaFile\}\\nTipe: \$\{lamp\.tipeDokumen\}\\nDiunggah: \$\{lamp\.tanggalUpload\}\\nUkuran: \$\{lamp\.ukuranFile\}`\}[\s\S]*?>[\s\S]*?<Download className="w-2\.5 h-2\.5" />[\s\S]*?<span className="max-w-\[200px\] truncate">\{lamp\.namaFile\}</span>[\s\S]*?</button>[\s\S]*?\)\)\}[\s\S]*?</div>[\s\S]*?</div>[\s\S]*?\)\})'

new_text = '''                {/* Berkas Digital / Lampiran - Grouped by Category */}
                {item.lampiran && item.lampiran.length > 0 && (
                  <div className="col-span-2 flex flex-col gap-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide font-bold text-slate-500">
                      <FileText className="w-3 h-3" />
                      <span>BERKAS DIGITAL</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {(() => {
                        const grouped = groupLampiranByCategory(item.lampiran);
                        const categories = Array.from(grouped.entries());
                        const maxVisible = 5;
                        const visibleCategories = categories.slice(0, maxVisible);
                        const remainingCount = categories.length - maxVisible;

                        return (
                          <>
                            {visibleCategories.map(([category, files]) => (
                              <button
                                key={category}
                                onClick={() => setCategoryModal({ 
                                  category, 
                                  files, 
                                  contractName: item.namaPaket 
                                })}
                                className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded text-[10px] font-semibold transition cursor-pointer"
                                title={`Klik untuk melihat ${files.length} file dalam kategori "${category}"`}
                              >
                                <FolderOpen className="w-3 h-3" />
                                <span className="max-w-[140px] truncate">{category}</span>
                                <span className="px-1 py-0.5 bg-indigo-600 text-white rounded text-[9px] font-bold">
                                  {files.length}
                                </span>
                              </button>
                            ))}
                            {remainingCount > 0 && (
                              <button
                                onClick={() => setCategoryModal({ 
                                  category: 'Semua Kategori', 
                                  files: item.lampiran, 
                                  contractName: item.namaPaket 
                                })}
                                className="flex items-center gap-1 px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-300 rounded text-[10px] font-semibold transition cursor-pointer"
                                title="Lihat semua kategori"
                              >
                                <span>+{remainingCount} kategori</span>
                              </button>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}'''

# Try to replace
if re.search(old_pattern, content):
    content = re.sub(old_pattern, new_text, content)
    print("Pattern found and replaced!")
else:
    print("Pattern not found. Searching for simpler pattern...")
    # Try simpler pattern
    lines = content.split('\n')
    for i, line in enumerate(lines):
        if 'LAMPIRAN ({item.lampiran.length})' in line:
            print(f"Found at line {i+1}")
            
# Write back
with open(r'C:\New folder\Manajemen\src\components\ContractList.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Update complete!")
