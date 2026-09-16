/**
 * Manual Update Script for ContractList.tsx
 * 
 * Find this section (around line 324-349):
 */

// OLD CODE TO FIND AND REPLACE:
/*
                {/* Berkas Digital / Lampiran *\/}
                {item.lampiran && item.lampiran.length > 0 && (
                  <div className="col-span-2 flex flex-col gap-2 pt-2">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide font-bold text-slate-500">
                      <FileText className="w-3 h-3" />
                      <span>LAMPIRAN ({item.lampiran.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {item.lampiran.map((lamp) => (
                        <button
                          key={lamp.id}
                          onClick={() => {
                            if (lamp.googleDriveUrl) {
                              window.open(lamp.googleDriveUrl, '_blank');
                            } else {
                              alert(`File "${lamp.namaFile}" tidak memiliki URL yang valid.`);
                            }
                          }}
                          className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded text-[10px] font-medium transition cursor-pointer"
                          title={`Unduh: ${lamp.namaFile}\nTipe: ${lamp.tipeDokumen}\nDiunggah: ${lamp.tanggalUpload}\nUkuran: ${lamp.ukuranFile}`}
                        >
                          <Download className="w-2.5 h-2.5" />
                          <span className="max-w-[200px] truncate">{lamp.namaFile}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
*/

// REPLACE WITH THIS NEW CODE:
/*
                {/* Berkas Digital / Lampiran - Grouped by Category *\/}
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
                )}
*/
