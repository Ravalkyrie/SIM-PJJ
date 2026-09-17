/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { ItemPekerjaan } from '../types';

interface ItemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<ItemPekerjaan, 'id' | 'jumlahHarga' | 'bobot'>) => void;
  editMode?: boolean;
  initialData?: ItemPekerjaan;
}

export default function ItemFormModal({
  isOpen,
  onClose,
  onSave,
  editMode = false,
  initialData
}: ItemFormModalProps) {
  const [kodeItem, setKodeItem] = useState('');
  const [uraian, setUraian] = useState('');
  const [satuan, setSatuan] = useState('');
  const [customSatuan, setCustomSatuan] = useState('');
  const [hargaSatuan, setHargaSatuan] = useState<number | ''>('');
  const [volume, setVolume] = useState<number | ''>('');
  const [error, setError] = useState('');

  const satuanOptions = ['M3', 'M2', 'M', 'Ton', 'Unit', 'Ls', 'Kg', 'Buah', 'Liter', 'Lembar', 'Pasang', 'Set', '(Lainnya)'];

  useEffect(() => {
    if (isOpen) {
      if (editMode && initialData) {
        setKodeItem(initialData.kodeItem);
        setUraian(initialData.uraian);
        
        // Check if satuan is in predefined options
        if (satuanOptions.includes(initialData.satuan)) {
          setSatuan(initialData.satuan);
          setCustomSatuan('');
        } else {
          // If not in options, set to "(Lainnya)" and populate custom field
          setSatuan('(Lainnya)');
          setCustomSatuan(initialData.satuan);
        }
        
        setHargaSatuan(initialData.hargaSatuan);
        setVolume(initialData.volume);
      } else {
        setKodeItem('');
        setUraian('');
        setSatuan(satuanOptions[0]);
        setCustomSatuan('');
        setHargaSatuan('');
        setVolume('');
      }
      setError('');
    }
  }, [isOpen, editMode, initialData]);

  const calculateJumlah = () => {
    if (typeof hargaSatuan === 'number' && typeof volume === 'number') {
      return hargaSatuan * volume;
    }
    return 0;
  };

  const handleSubmit = () => {
    if (!kodeItem.trim()) {
      setError('Kode item wajib diisi');
      return;
    }

    if (!uraian.trim()) {
      setError('Uraian pekerjaan wajib diisi');
      return;
    }

    // Validate satuan - if "(Lainnya)" is selected, check custom input
    if (satuan === '(Lainnya)') {
      if (!customSatuan.trim()) {
        setError('Satuan lainnya wajib diisi');
        return;
      }
    }

    if (hargaSatuan === '' || hargaSatuan <= 0) {
      setError('Harga satuan harus lebih dari 0');
      return;
    }

    if (volume === '' || volume <= 0) {
      setError('Volume harus lebih dari 0');
      return;
    }

    // Use custom satuan if "(Lainnya)" is selected, otherwise use selected option
    const finalSatuan = satuan === '(Lainnya)' ? customSatuan.trim() : satuan.trim();

    onSave({
      kodeItem: kodeItem.trim(),
      uraian: uraian.trim(),
      satuan: finalSatuan,
      hargaSatuan: Number(hargaSatuan),
      volume: Number(volume)
    });
    onClose();
  };

  if (!isOpen) return null;

  const jumlahHarga = calculateJumlah();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white flex items-center justify-between p-4 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-800">
            {editMode ? 'Edit Item Pekerjaan' : 'Tambah Item Pekerjaan'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            <X className="w-5 h-5" />
          </button>
        </div>


        <div className="p-4 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-red-700">{error}</p>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase">Kode Item *</label>
            <input
              type="text"
              value={kodeItem}
              onChange={(e) => setKodeItem(e.target.value)}
              placeholder="Contoh: 2.1.(1), 6.3.(4)"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase">Uraian Pekerjaan *</label>
            <textarea
              value={uraian}
              onChange={(e) => setUraian(e.target.value)}
              placeholder="Contoh: Galian untuk Drainase"
              rows={3}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none resize-none"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase">Satuan *</label>
            <select
              value={satuan}
              onChange={(e) => {
                setSatuan(e.target.value);
                // Clear custom satuan when switching away from "(Lainnya)"
                if (e.target.value !== '(Lainnya)') {
                  setCustomSatuan('');
                }
              }}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              required
            >
              {satuanOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            
            {/* Custom satuan input - shown only when "(Lainnya)" is selected */}
            {satuan === '(Lainnya)' && (
              <input
                type="text"
                value={customSatuan}
                onChange={(e) => setCustomSatuan(e.target.value)}
                placeholder="Ketik satuan custom (misal: Paket, Titik, dll)"
                className="w-full px-3 py-2 text-sm bg-amber-50 border border-amber-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none mt-2"
                required
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">Harga Satuan (Rp) *</label>
              <input
                type="number"
                value={hargaSatuan}
                onChange={(e) => setHargaSatuan(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="70000"
                min="0"
                step="1"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                required
              />
              {typeof hargaSatuan === 'number' && (
                <p className="text-xs text-amber-600 font-medium">
                  Rp{hargaSatuan.toLocaleString('id-ID')}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">Volume *</label>
              <input
                type="number"
                value={volume}
                onChange={(e) => setVolume(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="266"
                min="0"
                step="0.01"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                required
              />
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded p-3">
            <label className="text-xs font-bold text-amber-700 uppercase block mb-1">
              Jumlah Harga (Otomatis)
            </label>
            <p className="text-lg font-bold text-amber-900">
              Rp{jumlahHarga.toLocaleString('id-ID')}
            </p>
            <p className="text-xs text-amber-600 mt-1">
              {typeof hargaSatuan === 'number' && typeof volume === 'number'
                ? `${hargaSatuan.toLocaleString('id-ID')} × ${volume} = ${jumlahHarga.toLocaleString('id-ID')}`
                : 'Masukkan harga satuan dan volume'}
            </p>
          </div>

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
              {editMode ? 'Simpan Perubahan' : 'Tambah Item'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
