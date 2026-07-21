/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { ActivityLog, KontrakFisik } from '../types';
import { 
  History, 
  Search, 
  Trash2, 
  Plus, 
  Edit, 
  TrendingUp, 
  Paperclip, 
  FileSignature, 
  XCircle, 
  Calendar, 
  User, 
  SlidersHorizontal,
  ChevronRight,
  Database
} from 'lucide-react';

interface ActivityLogViewProps {
  logs: ActivityLog[];
  contracts: KontrakFisik[];
  onClearLogs: () => void;
  onSelectContract: (id: string) => void;
}

export default function ActivityLogView({ logs, contracts, onClearLogs, onSelectContract }: ActivityLogViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('Semua');
  const [filterContract, setFilterContract] = useState<string>('Semua');

  // Statistics
  const stats = useMemo(() => {
    const total = logs.length;
    const createCount = logs.filter(l => l.actionType === 'CREATE').length;
    const updateCount = logs.filter(l => l.actionType === 'UPDATE' || l.actionType === 'UPDATE_PROGRESS').length;
    const adendumCount = logs.filter(l => l.actionType === 'ADD_ADENDUM').length;
    const lampiranCount = logs.filter(l => l.actionType === 'ADD_LAMPIRAN').length;

    return { total, createCount, updateCount, adendumCount, lampiranCount };
  }, [logs]);

  // Unique contracts mentioned in logs
  const loggedContracts = useMemo(() => {
    const map = new Map<string, string>();
    logs.forEach(l => {
      if (l.contractId && l.contractName) {
        map.set(l.contractId, l.contractName);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [logs]);

  // Filtering logs
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchSearch = 
        (log.contractName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.contractNo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.operator || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchType = filterType === 'Semua' || log.actionType === filterType;
      const matchContract = filterContract === 'Semua' || log.contractId === filterContract;

      return matchSearch && matchType && matchContract;
    });
  }, [logs, searchTerm, filterType, filterContract]);

  // Helper for rendering badges and icons based on Action Type
  const getActionConfig = (type: ActivityLog['actionType']) => {
    switch (type) {
      case 'CREATE':
        return {
          icon: <Plus className="w-3.5 h-3.5 text-emerald-600" />,
          bgColor: 'bg-emerald-50 border-emerald-200',
          textColor: 'text-emerald-700',
          label: 'Kontrak Baru'
        };
      case 'UPDATE':
        return {
          icon: <Edit className="w-3.5 h-3.5 text-blue-600" />,
          bgColor: 'bg-blue-50 border-blue-200',
          textColor: 'text-blue-700',
          label: 'Ubah Data'
        };
      case 'UPDATE_PROGRESS':
        return {
          icon: <TrendingUp className="w-3.5 h-3.5 text-cyan-600" />,
          bgColor: 'bg-cyan-50 border-cyan-200',
          textColor: 'text-cyan-700',
          label: 'Progres Mingguan'
        };
      case 'ADD_ADENDUM':
        return {
          icon: <FileSignature className="w-3.5 h-3.5 text-amber-600" />,
          bgColor: 'bg-amber-50 border-amber-200',
          textColor: 'text-amber-700',
          label: 'Adendum Kontrak'
        };
      case 'ADD_LAMPIRAN':
        return {
          icon: <Paperclip className="w-3.5 h-3.5 text-indigo-600" />,
          bgColor: 'bg-indigo-50 border-indigo-200',
          textColor: 'text-indigo-700',
          label: 'Unggah Lampiran'
        };
      case 'DELETE_LAMPIRAN':
        return {
          icon: <XCircle className="w-3.5 h-3.5 text-rose-600" />,
          bgColor: 'bg-rose-50 border-rose-200',
          textColor: 'text-rose-700',
          label: 'Hapus Lampiran'
        };
      case 'DELETE':
        return {
          icon: <Trash2 className="w-3.5 h-3.5 text-red-600" />,
          bgColor: 'bg-red-50 border-red-200',
          textColor: 'text-red-700',
          label: 'Hapus Kontrak'
        };
    }
  };

  const handleClearConfirm = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus semua histori aktivitas?')) {
      onClearLogs();
    }
  };

  return (
    <div id="activity-log-view" className="space-y-6">
      {/* Title section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-900 text-amber-400 rounded-lg shadow-sm">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 leading-none">Log Aktivitas Sistem</h2>
            <p className="text-xs text-slate-500 mt-1.5 leading-normal">
              Histori perekaman aktivitas penginputan data, pembaruan progres fisik/keuangan, adendum, dan berkas lampiran.
            </p>
          </div>
        </div>
        {logs.length > 0 && (
          <button
            onClick={handleClearConfirm}
            className="flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800 px-3.5 py-1.5 text-xs font-bold rounded-lg border border-red-200 transition shrink-0 self-start sm:self-center cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Bersihkan Histori
          </button>
        )}
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Aktivitas</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black text-slate-800">{stats.total}</span>
            <span className="text-[10px] text-slate-500 font-semibold">kali tercatat</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Kontrak Baru</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black text-emerald-600">{stats.createCount}</span>
            <span className="text-[10px] text-slate-500 font-semibold">berkas</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Pembaruan</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black text-blue-600">{stats.updateCount}</span>
            <span className="text-[10px] text-slate-500 font-semibold">aktivitas</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Adendum CCO</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black text-amber-600">{stats.adendumCount}</span>
            <span className="text-[10px] text-slate-500 font-semibold">perubahan</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs col-span-2 lg:col-span-1">
          <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">Lampiran Dokumen</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black text-indigo-600">{stats.lampiranCount}</span>
            <span className="text-[10px] text-slate-500 font-semibold">file diunggah</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Panel */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3.5">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          Filter & Pencarian Log
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Keyword Search */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari kata kunci paket, no kontrak, detail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-slate-900 transition"
            />
          </div>

          {/* Filter Type */}
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-slate-700 cursor-pointer transition font-medium"
            >
              <option value="Semua">Semua Jenis Aktivitas</option>
              <option value="CREATE">Kontrak Baru (CREATE)</option>
              <option value="UPDATE">Ubah Data (UPDATE)</option>
              <option value="UPDATE_PROGRESS">Progres Mingguan</option>
              <option value="ADD_ADENDUM">Adendum Kontrak</option>
              <option value="ADD_LAMPIRAN">Unggah Lampiran</option>
              <option value="DELETE_LAMPIRAN">Hapus Lampiran</option>
              <option value="DELETE">Hapus Kontrak (DELETE)</option>
            </select>
          </div>

          {/* Filter specific contract */}
          <div>
            <select
              value={filterContract}
              onChange={(e) => setFilterContract(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-slate-700 cursor-pointer transition font-medium"
            >
              <option value="Semua">Semua Paket Kontrak</option>
              {loggedContracts.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Logs Timeline List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="py-12 text-center">
            <History className="w-10 h-10 text-slate-300 mx-auto stroke-1" />
            <p className="text-sm font-bold text-slate-400 mt-3">Tidak ada histori aktivitas ditemukan</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Cobalah ubah filter pencarian atau lakukan penginputan data baru untuk menambahkan riwayat log.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredLogs.map((log) => {
              const config = getActionConfig(log.actionType);
              const exists = contracts.some(c => c.id === log.contractId);

              return (
                <div key={log.id} className="p-4 hover:bg-slate-50 transition flex items-start gap-3.5 group">
                  {/* Action Icon Circle */}
                  <div className={`p-2 rounded-full border shrink-0 ${config?.bgColor} flex items-center justify-center mt-0.5`}>
                    {config?.icon}
                  </div>

                  {/* Log description */}
                  <div className="flex-1 space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      {/* Action Type Tag */}
                      <span className={`text-[9px] font-black tracking-wide uppercase px-2 py-0.5 rounded-full border border-current ${config?.textColor} ${config?.bgColor}`}>
                        {config?.label}
                      </span>
                      {/* Operator info */}
                      <span className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold">
                        <User className="w-3 h-3" />
                        {log.operator}
                      </span>
                      {/* Time info */}
                      <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                        <Calendar className="w-3 h-3" />
                        {log.timestamp}
                      </span>
                    </div>

                    {/* Main Log Message */}
                    <p className="text-xs text-slate-800 leading-relaxed font-medium">
                      {log.description}
                    </p>

                    {/* Contract context metadata */}
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-bold">
                        ID: {log.contractId}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        No: {log.contractNo}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium truncate max-w-xs md:max-w-md">
                        {log.contractName}
                      </span>

                      {/* Select contract detail shortcut button */}
                      {log.actionType !== 'DELETE' && exists && (
                        <button
                          onClick={() => onSelectContract(log.contractId)}
                          className="text-[10px] font-bold text-amber-600 hover:text-amber-700 flex items-center gap-0.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          Lihat Kontrak
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
