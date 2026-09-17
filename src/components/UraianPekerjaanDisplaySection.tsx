/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Briefcase } from 'lucide-react';
import { UraianPekerjaan } from '../types';
import './ContractDetailTypography.css';

interface UraianPekerjaanDisplaySectionProps {
  uraianPekerjaan: UraianPekerjaan | null;
}

export default function UraianPekerjaanDisplaySection({
  uraianPekerjaan
}: UraianPekerjaanDisplaySectionProps) {
  const [expandedDivisi, setExpandedDivisi] = useState<string[]>([]);

  const toggleDivisi = (divisiId: string) => {
    setExpandedDivisi(prev =>
      prev.includes(divisiId)
        ? prev.filter(id => id !== divisiId)
        : [...prev, divisiId]
    );
  };

  if (!uraianPekerjaan || uraianPekerjaan.divisiList.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 mb-4 pb-2 border-b border-slate-200 contract-detail-uraian-section-title">
          <Briefcase className="w-5 h-5 text-amber-500" />
          Rincian Uraian Pekerjaan
        </h3>
        <div className="text-center py-8">
          <p className="text-sm text-slate-500 contract-detail-value">
            Belum ada uraian pekerjaan untuk kontrak ini.
          </p>
          <p className="text-xs text-slate-400 mt-2 contract-detail-small">
            Uraian pekerjaan dapat ditambahkan melalui form Edit Kontrak.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 space-y-4">
      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-200 contract-detail-uraian-section-title">
        <Briefcase className="w-5 h-5 text-amber-500" />
        Rincian Uraian Pekerjaan
      </h3>

      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-amber-700 font-medium mb-1 contract-detail-label">Total Divisi</p>
            <p className="text-2xl font-bold text-amber-900 contract-detail-uraian-summary">{uraianPekerjaan.totalDivisi || 0}</p>
          </div>
          <div>
            <p className="text-xs text-amber-700 font-medium mb-1 contract-detail-label">Total Item</p>
            <p className="text-2xl font-bold text-amber-900 contract-detail-uraian-summary">{uraianPekerjaan.totalItem || 0}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-amber-700 font-medium mb-1 contract-detail-label">Total Nilai Pekerjaan</p>
            <p className="text-2xl font-bold text-amber-900 contract-detail-uraian-summary">
              Rp{(uraianPekerjaan.totalNilaiPekerjaan || 0).toLocaleString('id-ID')}
            </p>
          </div>
        </div>
      </div>


      <div className="space-y-3">
        {uraianPekerjaan.divisiList.map((divisi) => {
          const isExpanded = expandedDivisi.includes(divisi.id);
          
          // Calculate Bobot Divisi
          const totalNilaiPekerjaan = uraianPekerjaan.totalNilaiPekerjaan || 0;
          const bobotDivisi = totalNilaiPekerjaan > 0 
            ? (divisi.totalDivisi / totalNilaiPekerjaan) * 100 
            : 0;
          
          return (
            <div key={divisi.id} className="border border-slate-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleDivisi(divisi.id)}
                className="w-full bg-gradient-to-r from-slate-50 to-slate-100 p-4 hover:from-slate-100 hover:to-slate-200 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="text-slate-600">
                    {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-bold text-slate-900 contract-detail-uraian-divisi-title">
                      DIVISI {divisi.nomorDivisi} — {divisi.namaDivisi}
                    </p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-600 mt-1 contract-detail-uraian-meta">
                      <span>{divisi.items.length} item pekerjaan</span>
                      <span className="hidden sm:inline">|</span>
                      <span>Total: Rp{(divisi.totalDivisi || 0).toLocaleString('id-ID')}</span>
                      <span className="hidden sm:inline">|</span>
                      <span className="font-semibold text-amber-700">Bobot: {bobotDivisi.toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="p-4 bg-white border-t border-slate-200">
                  {divisi.items.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-4 contract-detail-value">Tidak ada item pekerjaan</p>
                  ) : (
                    <div className="space-y-3">
                      {divisi.items.map((item) => (
                        <div key={item.id} className="bg-slate-50 border border-slate-200 rounded-lg p-4 hover:border-amber-300 transition">
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex-1">
                              <p className="text-sm font-bold text-slate-900 mb-1 contract-detail-uraian-item-name">
                                {item.kodeItem} - {item.uraian}
                              </p>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 contract-detail-uraian-meta">
                                <span>Satuan: <span className="font-semibold">{item.satuan}</span></span>
                                <span>Volume: <span className="font-semibold">{item.volume.toLocaleString('id-ID')}</span></span>
                                <span>Harga Satuan: <span className="font-semibold">Rp{item.hargaSatuan.toLocaleString('id-ID')}</span></span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-amber-700 font-medium contract-detail-uraian-meta">Bobot</p>
                              <p className="text-lg font-bold text-amber-900 contract-detail-value-important">{item.bobot.toFixed(2)}%</p>
                            </div>
                          </div>
                          <div className="pt-3 border-t border-slate-300">
                            <div className="flex justify-between items-center">
                              <p className="text-xs text-slate-600 font-medium contract-detail-uraian-meta">Jumlah Harga</p>
                              <p className="text-base font-bold text-slate-900 contract-detail-value-important">
                                Rp{item.jumlahHarga.toLocaleString('id-ID')}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

