/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';

interface DivisiFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (nomorDivisi: number, namaDivisi: string) => void;
  availableNumbers: number[];
  editMode?: boolean;
  initialData?: {
    nomorDivisi: number;
    namaDivisi: string;
  };
}

export default function DivisiFormModal({
  isOpen,
  onClose,
  onSave,
  availableNumbers,
  editMode = false,
  initialData
}: DivisiFormModalProps) {
  const [nomorDivisi, setNomorDivisi] = useState<number>(availableNumbers[0] || 1);
  const [namaDivisi, setNamaDivisi] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (editMode && initialData) {
        setNomorDivisi(initialData.nomorDivisi);
        setNamaDivisi(initialData.namaDivisi);
      } else {
        setNomorDivisi(availableNumbers[0] || 1);
        setNamaDivisi('');
      }
      setError('');
    }
  }, [isOpen, editMode, initialData, availableNumbers]);

  const handleSubmit = () => {
    if (!namaDivisi.trim()) {
      setError('Nama divisi wajib diisi');
      return;
    }

    if (!editMode && availableNumbers.length === 0) {
      setError('Semua nomor divisi sudah digunakan');
      return;
    }

    onSave(nomorDivisi, namaDivisi.trim());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-800">
            {editMode ? 'Edit Divisi' : 'Tambah Divisi Baru'}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content (no form tag to avoid nesting) */}
        <div className="p-4 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-red-700">{error}</p>
            </div>
          )}

          {/* Nomor Divisi */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase">
              Nomor Divisi *
            </label>
            {editMode ? (
              <div className="px-3 py-2 bg-slate-100 border border-slate-200 rounded text-sm text-slate-600">
                Divisi {nomorDivisi}
              </div>
            ) : (
              <select
                value={nomorDivisi}
                onChange={(e) => setNomorDivisi(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                required
              >
                {availableNumbers.map((num) => (
                  <option key={num} value={num}>
                    Divisi {num}
                  </option>
                ))}
              </select>
            )}
            {editMode && (
              <p className="text-xs text-slate-500 mt-1">
                Nomor divisi tidak dapat diubah setelah dibuat
              </p>
            )}
          </div>

          {/* Nama Divisi */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase">
              Nama Divisi *
            </label>
            <input
              type="text"
              value={namaDivisi}
              onChange={(e) => setNamaDivisi(e.target.value)}
              placeholder="Contoh: DRAINASE, PEKERJAAN TANAH"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded hover:bg-slate-200 transition"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-amber-500 rounded hover:bg-amber-600 transition"
            >
              {editMode ? 'Simpan Perubahan' : 'Tambah Divisi'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
