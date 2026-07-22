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
      {/* Professional PUPR Header Banner */}
      <div id="welcome-banner" className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-xl shadow-2xl border border-slate-700/50">
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        {/* Golden Top Border Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500"></div>
        
        <div className="relative p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            {/* Left Section: Logo & Title */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 flex-1">
              {/* Logo PUPR with Premium Styling */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl blur-sm group-hover:blur-md transition-all duration-300 opacity-70"></div>
                <div className="relative w-20 h-20 bg-white p-2 rounded-2xl flex items-center justify-center shadow-xl border-2 border-yellow-400/30 group-hover:scale-105 transition-transform duration-300">
                  <img 
                    src="https://images.seeklogo.com/logo-png/35/1/pu-logo-png_seeklogo-355609.png" 
                    alt="Logo PUPR" 
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              
              {/* Title & Description */}
              <div className="text-center sm:text-left space-y-3 flex-1">
                <div className="space-y-1">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight drop-shadow-lg" 
                      title="Sistem Informasi Monitoring Kontrak Pembangunan Jalan dan Jembatan">
                    SIM-KONTRAK PJJ
                  </h1>
                  <p className="text-yellow-300 text-sm font-semibold tracking-wide drop-shadow-md">
                    Monitoring Jalan dan Jembatan
                  </p>
                </div>
                
                <p className="text-blue-100 text-sm max-w-3xl leading-relaxed hidden sm:block">
                  <span className="font-semibold text-white">Sistem Informasi Monitoring Kontrak Pembangunan Jalan dan Jembatan</span> adalah sistem informasi berbasis web yang 
                  menyediakan layanan penyimpanan dan penyajian dokumen kontrak pekerjaan fisik secara digital. Sistem ini dirancang agar 
                  dokumen yang masih aktif mudah diakses, proses monitoring lebih efektif, terintegrasi, dan mendukung pengelolaan kontrak 
                  secara <span className="text-yellow-200 font-semibold">transparan, efisien, dan akuntabel</span>.
                </p>
              </div>
            </div>
            
            {/* Right Section: Action Buttons */}
            <div className="flex gap-3 shrink-0 w-full sm:w-auto justify-center sm:justify-start">
              <button
                id="btn-nav-list"
                onClick={() => onNavigateToTab('list')}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-white/10 hover:bg-white/20 active:bg-white/5 text-white rounded-lg text-sm font-semibold border border-white/20 hover:border-white/30 transition-all duration-200 backdrop-blur-sm shadow-lg"
              >
                📋 Daftar Kontrak
              </button>
              <button
                id="btn-nav-input"
                onClick={() => onNavigateToTab('input')}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 active:from-yellow-600 active:to-yellow-700 text-blue-900 rounded-lg text-sm font-bold shadow-xl hover:shadow-2xl transition-all duration-200 border border-yellow-300"
              >
                ✨ Input Kontrak Baru
              </button>
            </div>
          </div>
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
