/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { KontrakFisik, KABUPATEN_PRESETS } from '../types';
import { formatBriefRupiah } from './DashboardView';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Eye, 
  RefreshCcw, 
  Plus,
  AlertTriangle,
  Coins,
  Trash2,
  FileText,
  Download
} from 'lucide-react';

interface ContractListProps {
  contracts: KontrakFisik[];
  onSelectContract: (id: string) => void;
  onNavigateToInput: () => void;
  onDeleteContract: (id: string) => void;
  onDeleteAllContracts?: () => void;
}

export default function ContractList({ contracts, onSelectContract, onNavigateToInput, onDeleteContract, onDeleteAllContracts }: ContractListProps) {
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTahun, setSelectedTahun] = useState<string>('Semua');
  const [selectedSumberDana, setSelectedSumberDana] = useState<string>('Semua');
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua');
  const [selectedKabupaten, setSelectedKabupaten] = useState<string>('Semua');

  // Custom alert & confirmation states
  const [contractToDelete, setContractToDelete] = useState<{ id: string; namaPaket: string } | null>(null);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => prev && prev.message === message ? null : prev);
    }, 3500);
  };

  // Unique lists for filters
  const listTahun = useMemo(() => {
    return ['Semua', ...Array.from(new Set(contracts.map(c => c.tahunAnggaran.toString())))].sort().reverse();
  }, [contracts]);

  const listSumberDana = useMemo(() => {
    return ['Semua', ...Array.from(new Set(contracts.map(c => c.sumberDana)))];
  }, [contracts]);

  const listStatus = useMemo(() => {
    return ['Semua', 'Persiapan', 'Pelaksanaan', 'Kritis', 'PHO', 'FHO', 'Selesai'];
  }, []);

  const listKabupaten = useMemo(() => {
    return ['Semua', ...KABUPATEN_PRESETS];
  }, []);

  // Reset Filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedTahun('Semua');
    setSelectedSumberDana('Semua');
    setSelectedStatus('Semua');
    setSelectedKabupaten('Semua');
  };

  // Filtered Contracts
  const filteredContracts = useMemo(() => {
    return contracts.filter(contract => {
      const matchSearch = 
        contract.namaPaket.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.noKontrak.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.kontraktorPelaksana.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.pejabatPembuatKomitmen.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.lokasiRuas.toLowerCase().includes(searchTerm.toLowerCase());

      const matchTahun = selectedTahun === 'Semua' || contract.tahunAnggaran.toString() === selectedTahun;
      const matchSumberDana = selectedSumberDana === 'Semua' || contract.sumberDana === selectedSumberDana;
      const matchStatus = selectedStatus === 'Semua' || contract.status === selectedStatus;
      const matchKabupaten = selectedKabupaten === 'Semua' || contract.kabupatenKota === selectedKabupaten;

      return matchSearch && matchTahun && matchSumberDana && matchStatus && matchKabupaten;
    });
  }, [contracts, searchTerm, selectedTahun, selectedSumberDana, selectedStatus, selectedKabupaten]);

  return (
    <div className="space-y-4">
      {/* List Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Daftar Kontrak Pekerjaan Fisik</h1>
          <p className="text-xs text-slate-500">Kelola, cari, dan tinjau berkas kontrak Bidang Bina Marga</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          {contracts.length > 0 && onDeleteAllContracts && (
            <button
              id="btn-delete-all-contracts"
              onClick={() => setShowDeleteAllConfirm(true)}
              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 active:bg-red-200 text-red-700 font-bold text-xs rounded border border-red-200 shadow-sm transition shrink-0 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Hapus Semua Kontrak
            </button>
          )}
          <button
            id="btn-add-contract"
            onClick={onNavigateToInput}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-bold text-xs rounded shadow-md transition shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            Input Kontrak Baru
          </button>
        </div>
      </div>

      {/* Filter and Search Panel */}
      <div id="search-filter-panel" className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-4">
        {/* Search Input */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            id="search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari berdasarkan nama paket, no kontrak, kontraktor pelaksana, PPK..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none font-sans text-slate-900 transition-colors"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Filter Tahun */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Tahun Anggaran
            </label>
            <select
              value={selectedTahun}
              onChange={(e) => setSelectedTahun(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-amber-500 outline-none text-slate-800 font-sans transition"
            >
              {listTahun.map(t => (
                <option key={t} value={t}>{t === 'Semua' ? 'Semua Tahun' : `Tahun ${t}`}</option>
              ))}
            </select>
          </div>

          {/* Filter Sumber Dana */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Coins className="w-3.5 h-3.5" /> Sumber Dana
            </label>
            <select
              value={selectedSumberDana}
              onChange={(e) => setSelectedSumberDana(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-amber-500 outline-none text-slate-800 font-sans transition"
            >
              {listSumberDana.map(s => (
                <option key={s} value={s}>{s === 'Semua' ? 'Semua Sumber Dana' : `Dana ${s}`}</option>
              ))}
            </select>
          </div>

          {/* Filter Status */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Status Pekerjaan
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-amber-500 outline-none text-slate-800 font-sans transition"
            >
              {listStatus.map(s => (
                <option key={s} value={s}>{s === 'Semua' ? 'Semua Status' : s.toUpperCase()}</option>
              ))}
            </select>
          </div>

          {/* Filter Wilayah */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Wilayah Kab/Kota
            </label>
            <select
              value={selectedKabupaten}
              onChange={(e) => setSelectedKabupaten(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-amber-500 outline-none text-slate-800 font-sans transition"
            >
              {listKabupaten.map(k => (
                <option key={k} value={k}>{k === 'Semua' ? 'Semua Wilayah' : k}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Filters Reset & Info */}
        <div className="flex justify-between items-center text-xs text-slate-500 pt-2.5 border-t border-slate-100">
          <p>
            Ditemukan <span className="font-bold text-slate-800">{filteredContracts.length}</span> kontrak dari total <span className="font-semibold">{contracts.length}</span>
          </p>
          {(searchTerm !== '' || selectedTahun !== 'Semua' || selectedSumberDana !== 'Semua' || selectedStatus !== 'Semua' || selectedKabupaten !== 'Semua') && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-amber-600 hover:text-amber-700 font-bold uppercase tracking-wider cursor-pointer transition"
            >
              <RefreshCcw className="w-3 h-3" />
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Contracts Table/Grid */}
      {filteredContracts.length === 0 ? (
        <div id="no-contracts-fallback" className="bg-white border border-slate-200 rounded-lg p-10 text-center space-y-3 shadow-xs">
          <p className="text-slate-400 font-medium text-xs">Tidak ada berkas kontrak yang cocok dengan pencarian Anda.</p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded transition"
          >
            Bersihkan Pencarian
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                  <th className="py-3 px-4 w-[18%]">No. Kontrak / TA</th>
                  <th className="py-3 px-4 w-[34%]">Nama Paket Pekerjaan</th>
                  <th className="py-3 px-4 w-[16%]">Penyedia Jasa (Kontraktor)</th>
                  <th className="py-3 px-4 w-[14%] text-right">Nilai Kontrak</th>
                  <th className="py-3 px-4 w-[11%] text-center">Progres Fisik</th>
                  <th className="py-3 px-4 w-[7%] text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredContracts.map((contract) => {
                  const statusColors = {
                    'Persiapan': 'bg-slate-100 text-slate-700 border-slate-200',
                    'Pelaksanaan': 'bg-blue-50 text-blue-700 border-blue-200',
                    'Kritis': 'bg-rose-50 text-rose-700 border-rose-200',
                    'PHO': 'bg-amber-50 text-amber-700 border-amber-200',
                    'FHO': 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    'Selesai': 'bg-teal-50 text-teal-700 border-teal-200',
                  };

                  return (
                    <tr 
                      key={contract.id}
                      className="hover:bg-slate-50/70 transition duration-150 group cursor-pointer"
                      onClick={() => onSelectContract(contract.id)}
                    >
                      <td className="py-3.5 px-4 space-y-1 align-top">
                        <p className="font-mono text-[11px] text-slate-600 font-bold line-clamp-1 group-hover:text-amber-600 transition-colors">
                          {contract.noKontrak}
                        </p>
                        {contract.nomorSpmk && (
                          <p className="font-mono text-[10px] text-slate-500 line-clamp-1 italic">
                            SPMK: {contract.nomorSpmk}
                          </p>
                        )}
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                            TA {contract.tahunAnggaran}
                          </span>
                          <span className="text-[9px] font-bold bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100">
                            {contract.sumberDana}
                          </span>
                          {contract.kegiatanPreservasi && (
                            <span className="text-[9px] font-bold bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-100">
                              {contract.kegiatanPreservasi}
                            </span>
                          )}
                          {contract.waktuPemeliharaan && (
                            <span className="text-[9px] font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-100">
                              🔧 {contract.waktuPemeliharaan}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 space-y-1 align-top">
                        <h4 className="font-bold text-slate-900 leading-normal">
                          {contract.namaPaket}
                        </h4>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 flex-wrap">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{contract.kabupatenKota} — {contract.lokasiRuas}</span>
                          {contract.panjangEfektif && (
                            <span className="text-[9px] bg-indigo-50 text-indigo-700 px-1 py-0.2 rounded border border-indigo-100 font-bold ml-1.5 shrink-0">
                              Pj: {contract.panjangEfektif}
                            </span>
                          )}
                        </p>
                        {contract.lampiran && contract.lampiran.length > 0 && (
                          <div className="flex items-center gap-1.5 mt-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-0.5 mr-0.5">
                              <FileText className="w-3 h-3 text-slate-400" />
                              Lampiran ({contract.lampiran.length}):
                            </span>
                            {contract.lampiran.map((lamp) => {
                              const typeColors: Record<string, string> = {
                                'SPK': 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
                                'SPMK': 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
                                'Adendum': 'bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100',
                                'BAST-1': 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
                                'FHO': 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100',
                                'Lainnya': 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                              };
                              const color = typeColors[lamp.tipeDokumen] || 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100';
                              return (
                                <span key={lamp.id} className="inline-flex items-center">
                                  {lamp.googleDriveUrl ? (
                                    <a
                                      href={lamp.googleDriveUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      title={`Buka & Unduh Berkas: ${lamp.namaFile}`}
                                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded border flex items-center gap-1 transition ${color}`}
                                    >
                                      <span>{lamp.tipeDokumen}</span>
                                      <Download className="w-2.5 h-2.5 shrink-0" />
                                    </a>
                                  ) : (
                                    <button
                                      onClick={() => showToast(`Mengunduh berkas "${lamp.namaFile}" (Simulasi)...`, 'info')}
                                      title={`Unduh Berkas: ${lamp.namaFile}`}
                                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded border flex items-center gap-1 transition ${color}`}
                                    >
                                      <span>{lamp.tipeDokumen}</span>
                                      <Download className="w-2.5 h-2.5 shrink-0" />
                                    </button>
                                  )}
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 align-top text-slate-700 font-semibold space-y-1">
                        <p className="line-clamp-1 text-[11px]">{contract.kontraktorPelaksana}</p>
                        <span className={`inline-flex items-center text-[9px] font-bold px-1.5 py-0.5 rounded border ${statusColors[contract.status]}`}>
                          {contract.status === 'Kritis' && <AlertTriangle className="w-3 h-3 text-rose-600 mr-1" />}
                          {contract.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 align-top text-right font-bold text-slate-900">
                        <p className="text-[11px]">{formatBriefRupiah(contract.nilaiKontrak)}</p>
                        {contract.adendum.length > 0 && (
                          <p className="text-[9px] text-amber-600 font-bold mt-1 uppercase tracking-wider">
                            +{contract.adendum.length} Adendum
                          </p>
                        )}
                      </td>
                      <td className="py-3.5 px-4 align-top text-center space-y-1.5">
                        <div className="flex items-center justify-center gap-1">
                          <span className="font-bold text-slate-800">{contract.progresFisik}%</span>
                        </div>
                        {/* Progress line */}
                        <div className="w-16 mx-auto bg-slate-100 rounded-full h-1">
                          <div 
                            className={`h-1 rounded-full ${contract.status === 'Kritis' ? 'bg-rose-500' : 'bg-blue-600'}`}
                            style={{ width: `${contract.progresFisik}%` }}
                          ></div>
                        </div>
                        <p className="text-[9px] text-slate-400 font-semibold">Keu: {contract.progresKeuangan}%</p>
                      </td>
                      <td className="py-3.5 px-4 align-middle text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectContract(contract.id);
                            }}
                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-slate-100 rounded transition"
                            title="Lihat Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setContractToDelete({ id: contract.id, namaPaket: contract.namaPaket });
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition"
                            title="Hapus Kontrak"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile & Tablet Card View */}
          <div className="block lg:hidden divide-y divide-slate-100">
            {filteredContracts.map((contract) => {
              const statusColors = {
                'Persiapan': 'bg-slate-100 text-slate-700 border-slate-200',
                'Pelaksanaan': 'bg-blue-50 text-blue-700 border-blue-200',
                'Kritis': 'bg-rose-50 text-rose-700 border-rose-200',
                'PHO': 'bg-amber-50 text-amber-700 border-amber-200',
                'FHO': 'bg-emerald-50 text-emerald-700 border-emerald-200',
                'Selesai': 'bg-teal-50 text-teal-700 border-teal-200',
              };

              return (
                <div 
                  key={contract.id}
                  onClick={() => onSelectContract(contract.id)}
                  className="p-4 space-y-2 hover:bg-slate-50/70 transition cursor-pointer"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <span className="text-[10px] font-mono text-slate-500 truncate block font-bold">
                        {contract.noKontrak}
                      </span>
                      {contract.nomorSpmk && (
                        <span className="text-[9px] font-mono text-slate-400 block italic">
                          SPMK: {contract.nomorSpmk}
                        </span>
                      )}
                    </div>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${statusColors[contract.status]}`}>
                      {contract.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                      TA {contract.tahunAnggaran}
                    </span>
                    <span className="text-[9px] font-bold bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100">
                      {contract.sumberDana}
                    </span>
                    {contract.kegiatanPreservasi && (
                      <span className="text-[9px] font-bold bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-100">
                        {contract.kegiatanPreservasi}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 leading-normal line-clamp-2 text-xs">
                      {contract.namaPaket}
                    </h4>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 flex-wrap">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{contract.kabupatenKota} — {contract.lokasiRuas}</span>
                      {contract.panjangEfektif && (
                        <span className="text-[9px] bg-indigo-50 text-indigo-700 px-1 py-0.2 rounded border border-indigo-100 font-bold shrink-0">
                          Pj: {contract.panjangEfektif}
                        </span>
                      )}
                    </p>
                    {contract.lampiran && contract.lampiran.length > 0 && (
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-0.5 mr-0.5">
                          <FileText className="w-3 h-3 text-slate-400" />
                          ({contract.lampiran.length}):
                        </span>
                        {contract.lampiran.map((lamp) => {
                          const typeColors: Record<string, string> = {
                            'SPK': 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
                            'SPMK': 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
                            'Adendum': 'bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100',
                            'BAST-1': 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
                            'FHO': 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100',
                            'Lainnya': 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          };
                          const color = typeColors[lamp.tipeDokumen] || 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100';
                          return (
                            <span key={lamp.id} className="inline-flex items-center">
                              {lamp.googleDriveUrl ? (
                                <a
                                  href={lamp.googleDriveUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title={`Buka & Unduh Berkas: ${lamp.namaFile}`}
                                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded border flex items-center gap-1 transition ${color}`}
                                >
                                  <span>{lamp.tipeDokumen}</span>
                                  <Download className="w-2.5 h-2.5 shrink-0" />
                                </a>
                              ) : (
                                <button
                                  onClick={() => showToast(`Mengunduh berkas "${lamp.namaFile}" (Simulasi)...`, 'info')}
                                  title={`Unduh Berkas: ${lamp.namaFile}`}
                                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded border flex items-center gap-1 transition ${color}`}
                                >
                                  <span>{lamp.tipeDokumen}</span>
                                  <Download className="w-2.5 h-2.5 shrink-0" />
                                </button>
                              )}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
                    <div>
                      <p className="text-slate-400 text-[9px] uppercase font-bold tracking-wider">Penyedia Jasa</p>
                      <p className="font-semibold text-slate-700 line-clamp-1">{contract.kontraktorPelaksana}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-400 text-[9px] uppercase font-bold tracking-wider">Nilai Kontrak</p>
                      <p className="font-bold text-slate-900">{formatBriefRupiah(contract.nilaiKontrak)}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded p-2 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Fisik: <strong className="text-slate-800 font-bold">{contract.progresFisik}%</strong></span>
                    <span className="text-slate-300">|</span>
                    <span className="text-slate-500">Keuangan: <strong className="text-slate-800 font-bold">{contract.progresKeuangan}%</strong></span>
                    <div className="w-12 bg-slate-200 rounded-full h-1 shrink-0 ml-2">
                      <div 
                        className="bg-blue-600 h-1 rounded-full" 
                        style={{ width: `${contract.progresFisik}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-1">
                    <span className="text-[10px] text-slate-400 italic">Klik untuk melihat detail lengkap</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setContractToDelete({ id: contract.id, namaPaket: contract.namaPaket });
                      }}
                      className="p-1 px-2 text-rose-600 hover:bg-rose-50 rounded transition flex items-center gap-1 text-[11px] font-bold"
                      title="Hapus Kontrak"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Hapus
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm bg-slate-900 text-white rounded-lg shadow-xl border border-slate-800 p-3.5 flex items-start gap-2.5 animate-slide-in">
          {toast.type === 'success' && <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5 shrink-0" />}
          {toast.type === 'error' && <div className="w-2 h-2 bg-rose-500 rounded-full mt-1.5 shrink-0" />}
          {toast.type === 'info' && <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 shrink-0" />}
          <div className="flex-1 text-[11px] font-medium leading-relaxed">{toast.message}</div>
          <button onClick={() => setToast(null)} className="text-slate-400 hover:text-white text-xs font-bold shrink-0">&times;</button>
        </div>
      )}

      {/* Single Delete Confirmation Modal */}
      {contractToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-md w-full p-5 space-y-4 animate-scale-in">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2 bg-rose-50 rounded border border-rose-100">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">Hapus Paket Kontrak?</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Apakah Anda yakin ingin menghapus dokumen kontrak untuk paket pekerjaan <strong className="text-slate-800">"{contractToDelete.namaPaket}"</strong>? Tindakan ini bersifat permanen dan tidak dapat dibatalkan.
            </p>
            <div className="flex gap-2 justify-end text-xs pt-1">
              <button
                onClick={() => setContractToDelete(null)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded transition cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onDeleteContract(contractToDelete.id);
                  showToast(`Paket "${contractToDelete.namaPaket}" berhasil dihapus`, 'success');
                  setContractToDelete(null);
                }}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded transition shadow-sm cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {showDeleteAllConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-md w-full p-5 space-y-4 animate-scale-in">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-2 bg-red-50 rounded border border-red-100">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">Hapus Semua Paket Kontrak?</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tindakan ini akan menghapus <strong className="text-red-600">SEMUA</strong> dokumen kontrak yang terdaftar di dalam sistem database penyimpanan lokal. Tindakan ini bersifat permanen dan tidak dapat dibatalkan.
            </p>
            <div className="flex gap-2 justify-end text-xs pt-1">
              <button
                onClick={() => setShowDeleteAllConfirm(false)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded transition cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  if (onDeleteAllContracts) {
                    onDeleteAllContracts();
                    showToast("Semua paket kontrak berhasil dihapus dari sistem", 'success');
                  }
                  setShowDeleteAllConfirm(false);
                }}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded transition shadow-sm cursor-pointer"
              >
                Ya, Hapus Semua
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
