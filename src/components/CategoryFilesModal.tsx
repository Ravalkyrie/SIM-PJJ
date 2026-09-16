/**
 * Component untuk menampilkan file-file dalam satu kategori
 */
import React from 'react';
import { DokumenLampiran } from '../types';
import { Download, X } from 'lucide-react';

interface CategoryFilesModalProps {
  category: string;
  files: DokumenLampiran[];
  contractName: string;
  onClose: () => void;
}

export default function CategoryFilesModal({ category, files, contractName, onClose }: CategoryFilesModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col animate-scale-in">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div>
            <h3 className="text-sm font-bold text-slate-900">{category}</h3>
            <p className="text-xs text-slate-600 mt-0.5">{contractName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded transition"
          >
            <X className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between gap-3 p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded transition"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-900 truncate">{file.namaFile}</div>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                    <span>{file.tipeDokumen}</span>
                    <span>•</span>
                    <span>{file.ukuranFile}</span>
                    <span>•</span>
                    <span>{file.tanggalUpload}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (file.googleDriveUrl) {
                      window.open(file.googleDriveUrl, '_blank');
                    } else {
                      alert(`File "${file.namaFile}" tidak memiliki URL yang valid.`);
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded transition whitespace-nowrap"
                >
                  <Download className="w-3 h-3" />
                  <span>Buka</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
