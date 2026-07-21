/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { KontrakFisik } from '../types';
import { 
  FileText, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  ShieldAlert, 
  DollarSign,
  MapPin,
  Calendar
} from 'lucide-react';

interface DashboardViewProps {
  contracts: KontrakFisik[];
  onSelectContract: (id: string) => void;
  onNavigateToTab: (tab: 'list' | 'input') => void;
}

export const formatRupiah = (value: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

export const formatBriefRupiah = (value: number): string => {
  if (value >= 1_000_000_000) {
    return `Rp ${(value / 1_000_000_000).toFixed(2)} Miliar`;
  }
  if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toFixed(2)} Juta`;
  }
  return formatRupiah(value);
};

export default function DashboardView({ contracts, onSelectContract, onNavigateToTab }: DashboardViewProps) {
  // Calculations
  const totalContracts = contracts.length;
  const totalValue = contracts.reduce((sum, c) => sum + c.nilaiKontrak, 0);
  
  const avgProgress = totalContracts > 0 
    ? Math.round(contracts.reduce((sum, c) => sum + c.progresFisik, 0) / totalContracts) 
    : 0;

  const avgKeuangan = totalContracts > 0 
    ? Math.round(contracts.reduce((sum, c) => sum + c.progresKeuangan, 0) / totalContracts) 
    : 0;

  const statusCounts = contracts.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const activeCount = (statusCounts['Pelaksanaan'] || 0) + (statusCounts['Persiapan'] || 0) + (statusCounts['Kritis'] || 0);
  const completedCount = (statusCounts['PHO'] || 0) + (statusCounts['FHO'] || 0) + (statusCounts['Selesai'] || 0);
  const criticalCount = statusCounts['Kritis'] || 0;

  // Group by funding sources
  const fundingSources = contracts.reduce((acc, c) => {
    acc[c.sumberDana] = (acc[c.sumberDana] || 0) + c.nilaiKontrak;
    return acc;
  }, {} as Record<string, number>);

  // Recent 3 contracts
  const recentContracts = [...contracts]
    .sort((a, b) => new Date(b.tanggalKontrak).getTime() - new Date(a.tanggalKontrak).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div id="welcome-banner" className="bg-slate-900 rounded-lg p-6 text-white border border-slate-800 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          {/* Logo PUPR */}
          <div className="w-16 h-16 bg-white/10 p-1.5 rounded-lg flex items-center justify-center shrink-0 border border-slate-700 shadow-inner">
            <img 
              src="https://images.seeklogo.com/logo-png/35/1/pu-logo-png_seeklogo-355609.png" 
              alt="Logo PU" 
              className="w-13 h-13 object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="text-center sm:text-left space-y-1.5">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-snug" title="Sistem Informasi Monitoring Pembangunan Jalan dan Jembatan">
              SIM-KONTRAK PJJ
            </h1>
            <p className="text-slate-400 text-xs max-w-2xl leading-relaxed text-justify">
              Sistem Informasi Monitoring Kontrak Pembangunan Jalan dan Jembatan adalah sistem informasi berbasis web yang menyediakan layanan penyimpanan dan penyajian dokumen kontrak pekerjaan fisik secara digital. Sistem ini dirancang agar dokumen yang masih aktif mudah diakses, proses monitoring lebih efektif, terintegrasi, dan mendukung pengelolaan kontrak secara transparan, efisien, dan akuntabel.
            </p>
          </div>
        </div>
        <div className="flex gap-2 shrink-0 w-full sm:w-auto justify-center sm:justify-start">
          <button
            id="btn-nav-list"
            onClick={() => onNavigateToTab('list')}
            className="flex-1 sm:flex-none px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-white rounded text-xs font-semibold border border-slate-700 transition cursor-pointer"
          >
            Daftar Kontrak
          </button>
          <button
            id="btn-nav-input"
            onClick={() => onNavigateToTab('input')}
            className="flex-1 sm:flex-none px-3.5 py-1.5 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-slate-950 rounded text-xs font-bold shadow-sm transition cursor-pointer"
          >
            + Input Kontrak Baru
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div id="analytics-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Paket */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Paket Fisik</p>
            <p className="text-2xl font-bold text-slate-900">{totalContracts}</p>
            <p className="text-[11px] text-slate-500">
              <span className="text-emerald-600 font-bold">{completedCount} Selesai</span> • {activeCount} Aktif
            </p>
          </div>
          <div className="p-2 bg-slate-100 text-slate-700 border border-slate-200 rounded">
            <FileText className="w-4 h-4" />
          </div>
        </div>

        {/* Card 2: Total Nilai Kontrak */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Anggaran Kontrak</p>
            <p className="text-xl font-bold text-emerald-700">{formatBriefRupiah(totalValue)}</p>
            <p className="text-[11px] text-slate-400">
              Dari {totalContracts} paket konstruksi aktif
            </p>
          </div>
          <div className="p-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>

        {/* Card 3: Rata-rata Progres Fisik */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex items-start justify-between">
          <div className="space-y-1 w-full mr-2">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Rata-rata Progres Fisik</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-slate-900">{avgProgress}%</p>
              <span className="text-[10px] text-slate-400">Keuangan: {avgKeuangan}%</span>
            </div>
            {/* Simple progress bar */}
            <div className="w-full bg-slate-100 rounded-full h-1 mt-2">
              <div 
                className="bg-blue-600 h-1 rounded-full" 
                style={{ width: `${avgProgress}%` }}
              ></div>
            </div>
          </div>
          <div className="p-2 bg-blue-50 text-blue-600 border border-blue-200 rounded shrink-0">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>

        {/* Card 4: Status Kritis */}
        <div className={`bg-white p-4 rounded-lg border shadow-xs flex items-start justify-between transition-colors ${criticalCount > 0 ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200'}`}>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Kontrak Kritis (Deviasi)</p>
            <p className={`text-2xl font-bold ${criticalCount > 0 ? 'text-rose-600' : 'text-slate-900'}`}>{criticalCount}</p>
            <p className="text-[11px] text-slate-400 leading-tight">
              {criticalCount > 0 ? 'Perlu tindakan Show Cause Meeting' : 'Semua paket berjalan lancar'}
            </p>
          </div>
          <div className={`p-2 rounded border ${criticalCount > 0 ? 'bg-rose-100 text-rose-600 border-rose-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Updates & Activity */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                Daftar Paket Pekerjaan Terbaru
              </h2>
              <p className="text-xs text-slate-500">Daftar paket pekerjaan fisik bina marga terakhir didaftarkan</p>
            </div>
            <button
              onClick={() => onNavigateToTab('list')}
              className="text-xs text-amber-600 hover:text-amber-700 font-bold uppercase tracking-wider"
            >
              Lihat Semua →
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentContracts.map((contract) => {
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
                  className="py-3 first:pt-0 last:pb-0 hover:bg-slate-50/80 rounded px-2 -mx-2 transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3"
                  onClick={() => onSelectContract(contract.id)}
                >
                  <div className="space-y-1 md:max-w-[70%]">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                        TA {contract.tahunAnggaran}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border font-bold ${statusColors[contract.status]}`}>
                        {contract.status === 'PHO' ? 'PHO (Serah Terima Awal)' : contract.status === 'FHO' ? 'FHO (Serah Terima Akhir)' : contract.status.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1 hover:text-amber-600 transition">
                      {contract.namaPaket}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {contract.kabupatenKota} — {contract.lokasiRuas}
                    </p>
                  </div>

                  <div className="flex items-center justify-between md:text-right gap-4 border-t md:border-t-0 pt-2 md:pt-0 border-slate-100 shrink-0">
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-slate-950">{formatBriefRupiah(contract.nilaiKontrak)}</p>
                      <p className="text-[9px] font-semibold uppercase text-slate-400 tracking-wider">Nilai Kontrak</p>
                    </div>
                    <div className="space-y-0.5 min-w-[70px]">
                      <div className="flex items-center md:justify-end gap-1.5">
                        <span className="text-xs font-bold text-slate-800">{contract.progresFisik}%</span>
                      </div>
                      <p className="text-[9px] font-semibold uppercase text-slate-400 tracking-wider">Fisik</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Funding and Details */}
        <div className="space-y-6">
          {/* Funding Sources breakdown */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 space-y-4">
            <div>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Pendanaan APBD / APBN / DAK
              </h2>
              <p className="text-xs text-slate-500">Pembagian nilai paket berdasarkan sumber pendanaan</p>
            </div>

            <div className="space-y-3">
              {Object.entries(fundingSources).map(([source, value]) => {
                const percentage = totalValue > 0 ? (value / totalValue) * 100 : 0;
                const sourceColors: Record<string, string> = {
                  'APBD': 'bg-blue-600',
                  'APBN': 'bg-amber-400',
                  'DAK': 'bg-emerald-600',
                  'PHJD': 'bg-purple-600',
                  'Lainnya': 'bg-slate-500'
                };
                const bgCol = sourceColors[source] || 'bg-slate-400';

                return (
                  <div key={source} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium text-slate-700">
                      <span className="font-bold text-slate-800">Dana {source}</span>
                      <span className="text-slate-500 font-mono text-[11px]">{formatBriefRupiah(value)} ({Math.round(percentage)}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div className={`${bgCol} h-1.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick info panel / PUPR Bina Marga Contacts */}
          <div className="bg-white rounded-lg p-5 border border-slate-200 space-y-3 shadow-xs">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              Kelengkapan Dokumen Kontrak
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Berkas digital wajib diunggah untuk menunjang keterbukaan informasi dan e-audit:
            </p>
            <ul className="text-xs text-slate-600 space-y-2 list-none pl-1">
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 flex items-center justify-center bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-full text-[10px] font-bold">✓</span>
                SPK / Dokumen Utama Kontrak
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 flex items-center justify-center bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-full text-[10px] font-bold">✓</span>
                Rencana Mutu Kontrak (RMK)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 flex items-center justify-center bg-amber-100 border border-amber-300 text-amber-800 rounded-full text-[10px] font-bold">!</span>
                Gambar Rencana Teknis (DED)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 flex items-center justify-center bg-slate-100 border border-slate-300 text-slate-500 rounded-full text-[10px] font-bold"></span>
                Laporan Mingguan & Bulanan
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
