/**
 * Component untuk menampilkan lampiran yang dikelompokkan berdasarkan kategori
 */
import React from 'react';
import { DokumenLampiran } from '../types';
import { FolderOpen, FileText } from 'lucide-react';

// Helper function to group lampiran by category
export function groupLampiranByCategory(lampiran: DokumenLampiran[]): Map<string, DokumenLampiran[]> {
  const grouped = new Map<string, DokumenLampiran[]>();
  
  lampiran.forEach(lamp => {
    const category = lamp.tipeDokumen || 'Lainnya';
    if (!grouped.has(category)) {
      grouped.set(category, []);
    }
    grouped.get(category)!.push(lamp);
  });
  
  return grouped;
}

interface GroupedLampiranDisplayProps {
  lampiran: DokumenLampiran[];
  onCategoryClick: (category: string, files: DokumenLampiran[], contractName: string) => void;
  contractName: string;
}

export default function GroupedLampiranDisplay({ 
  lampiran, 
  onCategoryClick, 
  contractName 
}: GroupedLampiranDisplayProps) {
  if (!lampiran || lampiran.length === 0) {
    return null;
  }

  const grouped = groupLampiranByCategory(lampiran);
  const categories = Array.from(grouped.entries());
  const maxVisible = 5; // Show max 5 categories
  const visibleCategories = categories.slice(0, maxVisible);
  const remainingCount = categories.length - maxVisible;

  return (
    <div className="col-span-2 flex flex-col gap-2 pt-2 border-t border-slate-100">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide font-bold text-slate-500">
        <FileText className="w-3 h-3" />
        <span>BERKAS DIGITAL</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {visibleCategories.map(([category, files]) => (
          <button
            key={category}
            onClick={() => onCategoryClick(category, files, contractName)}
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
            onClick={() => onCategoryClick('Semua Kategori', lampiran, contractName)}
            className="flex items-center gap-1 px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-300 rounded text-[10px] font-semibold transition cursor-pointer"
            title="Lihat semua kategori"
          >
            <span>+{remainingCount} kategori</span>
          </button>
        )}
      </div>
    </div>
  );
}
