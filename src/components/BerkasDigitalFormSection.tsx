/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DokumenLampiran } from '../types';
import { Trash2, AlertTriangle, Paperclip, ExternalLink, Link as LinkIcon } from 'lucide-react';

interface BerkasDigitalFormSectionProps {
  lampiranList: DokumenLampiran[];
  onChange: (lampiranList: DokumenLampiran[]) => void;
}

export default function BerkasDigitalFormSection({ lampiranList, onChange }: BerkasDigitalFormSectionProps) {
  const [showForm, setShowForm] = useState(false);
  
  const [namaFile, setNamaFile] = useState('');
  const [tipeDokumen, setTipeDokumen] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const resetForm = () => {
    setNamaFile('');
    setTipeDokumen('');
    setLinkUrl('');
    setErrorMsg(null);
  };

  const handleAdd = () => {
    setShowForm(true);
    resetForm();
  };

  const handleSave = () => {
    if (!namaFile.trim()) {
      setErrorMsg('Nama file/dokumen wajib diisi');
      return;
    }
    if (!tipeDokumen.trim()) {
      setErrorMsg('Tipe dokumen wajib dipilih');
      return;
    }
    if (!linkUrl.trim()) {
      setErrorMsg('URL/Link dokumen wajib diisi');
      return;
    }
    try {
      new URL(linkUrl);
    } catch {
      setErrorMsg('URL tidak valid. Pastikan URL dimulai dengan http:// atau https://');
      return;
    }
    const now = new Date();
    const newLampiran: DokumenLampiran = {
      id: `LAMP-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      namaFile,
      tipeDokumen,
      tanggalUpload: now.toISOString().split('T')[0],
      googleDriveUrl: linkUrl
    };
    onChange([...lampiranList, newLampiran]);
    setShowForm(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus berkas ini?')) return;
    onChange(lampiranList.filter(lamp => lamp.id !== id));
  };

  const handleCancel = () => {
    setShowForm(false);
    resetForm();
  };

  const handleOpenLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };



  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-4 space-y-3">
      <div className="flex justify-between items-center pb-2 border-b border-slate-200">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Paperclip className="w-4 h-4 text-indigo-600" />
          Berkas Kontrak Digital
        </h3>
        <button
          type="button"
          onClick={handleAdd}
          className="text-[10px] text-amber-600 hover:text-amber-700 font-bold uppercase tracking-wider flex items-center gap-0.5 cursor-pointer"
        >
          + Tambah Link
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

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Nama File/Dokumen *</label>
            <input
              type="text"
              value={namaFile}
              onChange={(e) => setNamaFile(e.target.value)}
              placeholder="Contoh: Surat Perjanjian Kontrak"
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-slate-900"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Tipe Dokumen *</label>
            <select
              value={tipeDokumen}
              onChange={(e) => setTipeDokumen(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-slate-900"
            >
              <option value="">-- Pilih Tipe Dokumen --</option>
              <option value="Kontrak">Kontrak</option>
              <option value="SPMK">SPMK</option>
              <option value="Adendum">Adendum</option>
              <option value="Berita Acara PHO">Berita Acara PHO</option>
              <option value="Berita Acara FHO">Berita Acara FHO</option>
              <option value="Laporan Progress">Laporan Progress</option>
              <option value="Dokumentasi">Dokumentasi</option>
              <option value="As Built Drawing">As Built Drawing</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">URL/Link Dokumen *</label>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://drive.google.com/file/d/..."
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-slate-900"
            />
            <p className="text-[9px] text-slate-500 italic">Paste link Google Drive, Dropbox, atau URL lainnya</p>
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
              Tambahkan
            </button>
          </div>
        </div>
      )}

      {lampiranList.length === 0 ? (
        <div className="text-center py-6 text-slate-500 text-xs">
          <Paperclip className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p>Belum ada berkas digital yang ditambahkan.</p>
          <p className="text-[10px] mt-1">Klik "Tambah Link" untuk menambahkan.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {lampiranList.map((lampiran) => (
            <div key={lampiran.id} className="bg-slate-50 border border-slate-200 rounded p-3 space-y-2">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-[9px] font-bold rounded">
                      {lampiran.tipeDokumen}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(lampiran.tanggalUpload).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-800 mb-1">{lampiran.namaFile}</p>
                  {lampiran.googleDriveUrl && (
                    <button
                      type="button"
                      onClick={() => handleOpenLink(lampiran.googleDriveUrl!)}
                      className="inline-flex items-center gap-1 text-[10px] text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                    >
                      <LinkIcon className="w-3 h-3" />
                      Buka Link
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(lampiran.id)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded transition cursor-pointer ml-2"
                  title="Hapus Berkas"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
