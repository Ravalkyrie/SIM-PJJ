#!/usr/bin/env python3
# Mobile Fix - Automated Script
import os

file_path = r"C:\New folder\Manajemen\src\components\ContractList.tsx"

# Backup
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()
with open(file_path + ".backup", 'w', encoding='utf-8') as f:
    f.write(content)

# Find & Replace
old = '                    {/* Mobile: Show individual files */}'
new = '                    {/* Mobile: Show file categories (same logic as desktop, but with fewer visible items) */}'
content = content.replace(old, new)

# Replace the large section - Part 1
old_section_start = '''                    <div className="block sm:hidden">
                      {c.lampiran && c.lampiran.length > 0 ? (
                        <div className="space-y-1.5">
                          {c.lampiran.slice(0, 4).map((lamp, idx) => ('''

new_section_start = '''                    <div className="block sm:hidden">
                      {c.lampiran && c.lampiran.length > 0 ? (
                        (() => {
                          const grouped = groupLampiranByCategory(c.lampiran);
                          const visibleLimit = 3;
                          const visibleCategories = Array.from(grouped.entries()).slice(0, visibleLimit);
                          const remainingCount = grouped.size - visibleLimit;

                          return (
                            <div className="flex flex-wrap gap-1.5">
                              {visibleCategories.map(([category, files]) => ('''

# Find the section to replace
if old_section_start in content:
    # Find full old section
    start_idx = content.find(old_section_start)
    end_marker = '                      )}\n                    </div>'
    end_idx = content.find(end_marker, start_idx) + len(end_marker)
    
    # Extract and replace
    old_full_section = content[start_idx:end_idx]
    
    # Build new section (simplified)
    new_section = '''                    <div className="block sm:hidden">
                      {c.lampiran && c.lampiran.length > 0 ? (
                        (() => {
                          const grouped = groupLampiranByCategory(c.lampiran);
                          const visibleLimit = 3;
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
                    </div>'''
    
    content = content.replace(old_full_section, new_section)
    
    # Save
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ SUCCESS! File updated.")
    print("🚀 Run: npm run build && npm run dev")
else:
    print("❌ Pattern not found. Check file manually.")
