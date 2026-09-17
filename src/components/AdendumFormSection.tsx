/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AdendumKontrak } from '../types';
import { Plus, Edit, Trash2, AlertTriangle, FileText, Calendar } from 'lucide-react';
import { formatRupiah } from './DashboardView';

interface AdendumFormSectionProps {
  adendumList: AdendumKontrak[];
  onChange: (adendumList: AdendumKontrak[]) => void;
}

export default function AdendumFormSection({ adendumList, onChange }: AdendumFormSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [noAdendum, setNoAdendum] = useState('');
  const [tanggalAdendum, setTanggalAdendum] = useState('');
  const [perubahanNilai, setPerubahanNilai] = useState<number | ''>('');
  const [perubahanWaktu, setPerubahanWaktu] = useState<number | ''>('');
  const [keterangan, setKeterangan] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const resetForm = () => {
    setNoAdendum('');
    setTanggalAdendum('');
    setPerubahanNilai('');
    setPerubahanWaktu('');
    setKeterangan('');
    setErrorMsg(null);
    setEditingId(null);
  };

  const handleAdd = () => {
    setShowForm(true);
    resetForm();
  };

  const handleEdit = (adendum: AdendumKontrak) => {
    setNoAdendum(adendum.noAdendum);
    setTanggalAdendum(adendum.tanggalAdendum);
    setPerubahanNilai(adendum.perubahanNilai || '');
    setPerubahanWaktu(adendum.perubahanWaktu || '');
    setKeterangan(adendum.keterangan);
    setEditingId(adendum.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!noAdendum.trim()) {
      setErrorMsg('Nomor adendum wajib diisi');
      return;
    }
    if (!tanggalAdendum) {
      setErrorMsg('Tanggal adendum wajib diisi');
      return;
    }
    if (!keterangan.trim()) {
      setErrorMsg('Keterangan adendum wajib diisi');
      return;
    }

    if (editingId) {
      const updated = adendumList.map(ad => {
        if (ad.id === editingId) {
          const updatedAdendum: AdendumKontrak = {
            id: editingId,
            noAdendum,
            tanggalAdendum,
            keterangan
          };
          if (perubahanNilai !== '') {
            updatedAdendum.perubahanNilai = Number(perubahanNilai);
          }
          if (perubahanWaktu !== '') {
            updatedAdendum.perubahanWaktu = Number(perubahanWaktu);
          }
          return updatedAdendum;
        }
        return ad;
      });
      onChange(updated);
    } else {
      const newAdendum: AdendumKontrak = {
        id: `ADD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        noAdendum,
        tanggalAdendum,
        keterangan
      };
      if (perubahanNilai !== '') {
        newAdendum.perubahanNilai = Number(perubahanNilai);
      }
      if (perubahanWaktu !== '') {
        newAdendum.perubahanWaktu = Number(perubahanWaktu);
      }
      onChange([...adendumList, newAdendum]);
    }

    setShowForm(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus adendum ini?')) return;
    onChange(adendumList.filter(ad => ad.id !== id));
  };

  const handleCancel = () => {
    setShowForm(false);
    resetForm();
  };



  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-4 space-y-3">
      <div className="flex justify-between items-center pb-2 border-b border-slate-200">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-purple-600" />
          Daftar Adendum Kontrak
        </h3>
        <button
          type="button"
          onClick={handleAdd}
          className="text-[10px] text-amber-600 hover:text-amber-700 font-bold uppercase tracking-wider flex items-center gap-0.5 cursor-pointer"
        >
          + Tambah Adendum
        </button>
      </div>

      {showForm && (
        <div className="bg-slate-50 border border-slate-200 rounded p-3 space-y-3 animate-fade-in">
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-2 text-[10px] font-medium animate-slide-in flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Nomor Adendum *</label>
              <input
                type="text"
                value={noAdendum}
                onChange={(e) => setNoAdendum(e.target.value)}
                placeholder="Contoh: Add. 1 - VVVK - 06.V/060/005/2025"
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Tanggal Adendum *</label>
              <input
                type="date"
                value={tanggalAdendum}
                onChange={(e) => setTanggalAdendum(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Perubahan Nilai (Rp)</label>
              <input
                type="number"
                value={perubahanNilai}
                onChange={(e) => setPerubahanNilai(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Contoh: 50000000 (positif/negatif)"
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-slate-900"
              />
              <p className="text-[9px] text-slate-500 italic">Kosongkan jika tidak ada perubahan nilai</p>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Perubahan Waktu (Hari)</label>
              <input
                type="number"
                value={perubahanWaktu}
                onChange={(e) => setPerubahanWaktu(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Contoh: 30 (positif/negatif)"
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-slate-900"
              />
              <p className="text-[9px] text-slate-500 italic">Kosongkan jika tidak ada perubahan waktu</p>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Keterangan/Alasan Adendum *</label>
            <textarea
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              rows={2}
              placeholder="Contoh: Adendum I: Perubahan Volume Pekerjaan"
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-slate-900 resize-none"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded text-xs transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded text-xs transition cursor-pointer"
            >
              {editingId ? 'Simpan Perubahan' : 'Tambahkan'}
            </button>
          </div>
        </div>
      )}


      {adendumList.length === 0 ? (
        <div className="text-center py-6 text-slate-500 text-xs">
          <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p>Belum ada adendum kontrak yang ditambahkan.</p>
          <p className="text-[10px] mt-1">Klik "Tambah Adendum" untuk menambahkan.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {adendumList.map((adendum, idx) => (
            <div key={adendum.id} className="bg-slate-50 border border-slate-200 rounded p-3 space-y-2">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[9px] font-bold rounded">
                      Adendum {idx + 1}
                    </span>
                    <span className="text-[10px] text-slate-600">{adendum.noAdendum}</span>
                  </div>
                  <p className="text-xs font-medium text-slate-800 mb-1">{adendum.keterangan}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(adendum.tanggalAdendum).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    {adendum.perubahanNilai !== undefined && (
                      <span className={adendum.perubahanNilai >= 0 ? "text-emerald-600 font-bold" : "text-rose-600 font-bold"}>
                        Nilai: {adendum.perubahanNilai >= 0 ? '+' : ''}{formatRupiah(adendum.perubahanNilai)}
                      </span>
                    )}
                    {adendum.perubahanWaktu !== undefined && (
                      <span className="text-amber-600 font-bold">
                        Waktu: {adendum.perubahanWaktu >= 0 ? '+' : ''}{adendum.perubahanWaktu} Hari
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-1.5 ml-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(adendum)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition cursor-pointer"
                    title="Edit Adendum"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(adendum.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
                    title="Hapus Adendum"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
