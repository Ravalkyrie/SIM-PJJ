/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { KontrakFisik, AdendumKontrak, DokumenLampiran } from '../types';
import { formatRupiah, formatBriefRupiah } from './DashboardView';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  FileText, 
  Calendar, 
  MapPin, 
  Briefcase, 
  Clock, 
  User, 
  AlertTriangle, 
  Plus, 
  Paperclip, 
  X, 
  Download,
  Check,
  TrendingUp,
  Coins,
  History,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  MoreVertical,
  ExternalLink,
  Search,
  Database,
  Cloud,
  Copy,
  Link as LinkIcon
} from 'lucide-react';

interface ContractDetailProps {
  contract: KontrakFisik;
  onBack: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateProgress: (id: string, progresFisik: number, progresKeuangan: number, status: KontrakFisik['status'], catatan: string) => void;
  onAddAdendum: (id: string, adendum: Omit<AdendumKontrak, 'id'>) => void;
  onAddLampiran: (id: string, lampiran: Omit<DokumenLampiran, 'id'>) => void;
  onDeleteLampiran: (id: string, lampiranId: string) => void;
}

export default function ContractDetail({ 
  contract, 
  onBack, 
  onEdit, 
  onDelete, 
  onUpdateProgress,
  onAddAdendum,
  onAddLampiran,
  onDeleteLampiran
}: ContractDetailProps) {
  // Local state for interactive progress updates
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);
  const [localFisik, setLocalFisik] = useState(contract.progresFisik);
  const [localKeuangan, setLocalKeuangan] = useState(contract.progresKeuangan);
  const [localStatus, setLocalStatus] = useState(contract.status);
  const [localCatatan, setLocalCatatan] = useState(contract.catatanPekerjaan);

  // Sync local state when contract prop changes
  useEffect(() => {
    setLocalFisik(contract.progresFisik);
    setLocalKeuangan(contract.progresKeuangan);
    setLocalStatus(contract.status);
    setLocalCatatan(contract.catatanPekerjaan);
  }, [contract]);

  // Local state for Adendum Form
  const [showAdendumForm, setShowAdendumForm] = useState(false);
  const [noAdendum, setNoAdendum] = useState('');
  const [tanggalAdendum, setTanggalAdendum] = useState('');
  const [perubahanNilai, setPerubahanNilai] = useState<number | ''>('');
  const [perubahanWaktu, setPerubahanWaktu] = useState<number | ''>('');
  const [keteranganAdendum, setKeteranganAdendum] = useState('');

  // Local state for File Upload (URL/Link Berkas)
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [namaFile, setNamaFile] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [tipeDokumen, setTipeDokumen] = useState<string>('Dokumen Kontrak');

  // Delete safety check
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Custom states for alerts & modals
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [fileToDelete, setFileToDelete] = useState<DokumenLampiran | null>(null);
  const [errorAdendum, setErrorAdendum] = useState<string | null>(null);
  const [errorUpload, setErrorUpload] = useState<string | null>(null);
  
  // Grouping and sub-menu state for uploaded files
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [activeFileMenu, setActiveFileMenu] = useState<string | null>(null);

  // Search & Filter state for uploaded files
  const [fileSearch, setFileSearch] = useState('');
  const [fileCategoryFilter, setFileCategoryFilter] = useState('Semua');

  const getCategoryColor = (cat: string) => {
    const norm = (cat || 'Dokumen Kontrak').toLowerCase();
    if (norm.includes('kontrak')) {
      return 'bg-blue-50 text-blue-700 border-blue-200';
    } else if (norm.includes('pcm') || norm.includes('rmk')) {
      return 'bg-amber-50 text-amber-700 border-amber-200';
    } else if (norm.includes('back up mc') || norm.includes('kuantitas')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    } else if (norm.includes('drawing')) {
      return 'bg-purple-50 text-purple-700 border-purple-200';
    } else if (norm.includes('justifikasi')) {
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    } else if (norm.includes('laporan')) {
      return 'bg-rose-50 text-rose-700 border-rose-200';
    } else if (norm.includes('addendum')) {
      return 'bg-orange-50 text-orange-700 border-orange-200';
    } else if (norm.includes('jmf') || norm.includes('dmf') || norm.includes('jmd')) {
      return 'bg-cyan-50 text-cyan-700 border-cyan-200';
    } else if (norm.includes('quality')) {
      return 'bg-teal-50 text-teal-700 border-teal-200';
    } else if (norm.includes('jaminan') || norm.includes('sertifikat')) {
      return 'bg-violet-50 text-violet-700 border-violet-200';
    } else if (norm.includes('pho') || norm.includes('pelaksanaan 0%')) {
      return 'bg-slate-100 text-slate-800 border-slate-300';
    }
    return 'bg-slate-50 text-slate-600 border-slate-200';
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => prev && prev.message === message ? null : prev);
    }, 4000);
  };

  // Calculate Tender savings
  const tenderSavings = contract.nilaiHps - contract.nilaiKontrak;
  const savingsPercent = contract.nilaiHps > 0 ? (tenderSavings / contract.nilaiHps) * 100 : 0;

  // Handle progress saving
  const handleSaveProgress = () => {
    onUpdateProgress(contract.id, localFisik, localKeuangan, localStatus, localCatatan);
    setIsUpdatingProgress(false);
    showToast("Progres pekerjaan berhasil diperbarui!", "success");
  };

  // Handle adding Adendum
  const handleSaveAdendum = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noAdendum || !tanggalAdendum) {
      setErrorAdendum("Nomor adendum dan tanggal harus diisi!");
      return;
    }
    setErrorAdendum(null);
    onAddAdendum(contract.id, {
      noAdendum,
      tanggalAdendum,
      perubahanNilai: perubahanNilai === '' ? undefined : Number(perubahanNilai),
      perubahanWaktu: perubahanWaktu === '' ? undefined : Number(perubahanWaktu),
      keterangan: keteranganAdendum
    });
    // Reset
    setNoAdendum('');
    setTanggalAdendum('');
    setPerubahanNilai('');
    setPerubahanWaktu('');
    setKeteranganAdendum('');
    setShowAdendumForm(false);
    showToast(`Adendum No. ${noAdendum} berhasil ditambahkan!`, "success");
  };

  const handleSaveUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaFile.trim()) {
      setErrorUpload("Silakan masukkan Nama Berkas terlebih dahulu!");
      return;
    }
    if (!linkUrl.trim()) {
      setErrorUpload("Silakan masukkan Tautan / URL Berkas terlebih dahulu!");
      return;
    }

    let finalUrl = linkUrl.trim();
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = 'https://' + finalUrl;
    }

    setErrorUpload(null);

    onAddLampiran(contract.id, {
      namaFile: namaFile.trim(),
      tipeDokumen,
      tanggalUpload: new Date().toISOString().split('T')[0],
      ukuranFile: "Link",
      googleDriveUrl: finalUrl
    });

    setNamaFile('');
    setLinkUrl('');
    setTipeDokumen('Dokumen Kontrak');
    setShowUploadForm(false);
    showToast(`Tautan "${namaFile.trim()}" berhasil ditambahkan!`, "success");
  };

  const handleDeleteFile = async (lamp: DokumenLampiran) => {
    setFileToDelete(lamp);
  };

  const executeDeleteFile = (lamp: DokumenLampiran) => {
    onDeleteLampiran(contract.id, lamp.id);
    showToast(`Berkas "${lamp.namaFile}" berhasil dihapus.`, "success");
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3.5 border-b border-slate-200">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-bold text-xs uppercase tracking-wider transition group cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-amber-500" />
          Kembali ke Daftar Kontrak
        </button>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => onEdit(contract.id)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-bold shadow-sm transition cursor-pointer"
          >
            <Edit className="w-3.5 h-3.5 text-amber-400" />
            Edit Kontrak
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1 px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-600 border border-slate-200 rounded text-xs font-bold transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
            Hapus Kontrak
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal Overlay */}
      {showDeleteConfirm && (
        <div id="delete-modal" className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg border border-slate-200 max-w-md w-full p-5 space-y-4 animate-scale-in">
            <div className="flex items-center gap-2.5 text-rose-600">
              <div className="p-2 bg-rose-50 rounded-full">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider">Hapus Dokumen Kontrak?</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tindakan ini tidak dapat dibatalkan. Berkas kontrak <strong>"{contract.namaPaket}"</strong> beserta seluruh adendum dan lampiran terkait akan terhapus permanen dari sistem penyimpanan lokal.
            </p>
            <div className="flex gap-2 justify-end text-xs">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded transition cursor-pointer"
              >
                Batalkan
              </button>
              <button
                onClick={() => {
                  onDelete(contract.id);
                  onBack();
                }}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded transition cursor-pointer"
              >
                Ya, Hapus Kontrak
              </button>
            </div>
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

      {/* Single File Delete Confirmation Modal */}
      {fileToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-md w-full p-5 space-y-4 animate-scale-in">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2 bg-rose-50 rounded border border-rose-100">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">Hapus Berkas Lampiran?</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Apakah Anda yakin ingin menghapus berkas lampiran <strong className="text-slate-800">"{fileToDelete.namaFile}"</strong>?
            </p>
            <div className="flex gap-2 justify-end text-xs pt-1">
              <button
                onClick={() => setFileToDelete(null)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded transition cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  const temp = fileToDelete;
                  setFileToDelete(null);
                  executeDeleteFile(temp);
                }}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded transition shadow-sm cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Columns: Contract Document Card */}
        <div className="lg:col-span-2 space-y-4">
          {/* Official Document Sheet */}
          <div id="document-sheet" className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            {/* Kop Surat / Government Accent */}
            <div className="bg-slate-900 text-white p-4 flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left border-b border-slate-950">
              <div className="w-12 h-12 bg-white/10 p-1 rounded flex items-center justify-center shrink-0 border border-slate-700 shadow-inner">
                <img 
                  src="https://images.seeklogo.com/logo-png/35/1/pu-logo-png_seeklogo-355609.png" 
                  alt="Logo PU" 
                  className="w-10 h-10 object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Dinas Pekerjaan Umum dan Perumahan Rakyat</p>
                <h2 className="text-sm font-extrabold tracking-tight">BIDANG BINA MARGA PROVINSI NTT</h2>
                <p className="text-[10px] font-mono text-slate-400">Lembar Monitoring Dokumen Kontrak Pekerjaan Fisik</p>
              </div>
            </div>

            {/* Document Content */}
            <div className="p-4 space-y-4 text-xs">
              {/* No Kontrak Banner */}
              <div className="bg-slate-50 border border-slate-200 rounded p-3 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div className="space-y-0.5">
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Nomor Registrasi Kontrak</p>
                  <p className="font-mono text-xs font-bold text-slate-800">{contract.noKontrak}</p>
                </div>
                <div className="flex gap-1.5">
                  <span className="text-[10px] font-bold bg-white text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                    TA {contract.tahunAnggaran}
                  </span>
                  <span className="text-[10px] font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded">
                    DANA {contract.sumberDana}
                  </span>
                </div>
              </div>

              {/* Paket Pekerjaan */}
              <div className="space-y-0.5">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nama Paket Pekerjaan</h3>
                <p className="text-sm font-bold text-slate-900 leading-snug">{contract.namaPaket}</p>
              </div>

              {/* Section 1: Lokasi & Nilai */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3.5 border-t border-slate-100">
                {/* Lokasi */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    Lokasi & Wilayah
                  </h4>
                  <div className="space-y-2 bg-slate-50 p-3 rounded border border-slate-200">
                    <div className="flex flex-col sm:grid sm:grid-cols-3 sm:gap-1">
                      <span className="text-slate-500 font-semibold">Kab/Kota</span>
                      <span className="sm:col-span-2 font-bold text-slate-800"><span className="hidden sm:inline">: </span>{contract.kabupatenKota}</span>
                    </div>
                    <div className="flex flex-col sm:grid sm:grid-cols-3 sm:gap-1">
                      <span className="text-slate-500 font-semibold">Ruas Jalan</span>
                      <span className="sm:col-span-2 font-medium text-slate-700 leading-tight"><span className="hidden sm:inline">: </span>{contract.lokasiRuas}</span>
                    </div>
                    {contract.panjangEfektif && (
                      <div className="flex flex-col sm:grid sm:grid-cols-3 sm:gap-1">
                        <span className="text-slate-500 font-semibold">Pj. Efektif</span>
                        <span className="sm:col-span-2 font-bold text-indigo-600"><span className="hidden sm:inline">: </span>{contract.panjangEfektif}</span>
                      </div>
                    )}
                    {contract.kegiatanPreservasi && (
                      <div className="flex flex-col sm:grid sm:grid-cols-3 sm:gap-1">
                        <span className="text-slate-500 font-semibold">Preservasi</span>
                        <span className="sm:col-span-2 font-bold text-amber-700"><span className="hidden sm:inline">: </span>{contract.kegiatanPreservasi}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Nilai Kontrak */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Rincian Keuangan
                  </h4>
                  <div className="space-y-2 bg-slate-50 p-3 rounded border border-slate-200">
                    <div className="flex flex-col sm:grid sm:grid-cols-3 sm:gap-1">
                      <span className="text-slate-500">Anggaran DPA</span>
                      <span className="sm:col-span-2 font-medium text-slate-700"><span className="hidden sm:inline">: </span>{formatRupiah(contract.nilaiHps)}</span>
                    </div>
                    <div className="flex flex-col sm:grid sm:grid-cols-3 sm:gap-1">
                      <span className="text-slate-500 font-bold">Nilai Kontrak</span>
                      <span className="sm:col-span-2 font-extrabold text-slate-900 text-xs"><span className="hidden sm:inline">: </span>{formatRupiah(contract.nilaiKontrak)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Administrasi Pelaksana */}
              <div className="space-y-2 pt-3.5 border-t border-slate-100">
                <h4 className="text-[10px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                  Administrasi Pekerjaan & Stakeholders
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  <div className="bg-slate-50 p-2.5 rounded border border-slate-200 space-y-0.5">
                    <p className="text-slate-500 font-semibold text-[9px] uppercase tracking-wider">Penyedia Jasa (Kontraktor)</p>
                    <p className="font-bold text-slate-800 leading-tight">{contract.kontraktorPelaksana}</p>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded border border-slate-200 space-y-0.5">
                    <p className="text-slate-500 font-semibold text-[9px] uppercase tracking-wider">Konsultan Pengawas</p>
                    <p className="font-bold text-slate-800 leading-tight">{contract.konsultanPengawas}</p>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded border border-slate-200 space-y-0.5">
                    <p className="text-slate-500 font-semibold text-[9px] uppercase tracking-wider">Pejabat Pembuat Komitmen (PPK)</p>
                    <p className="font-bold text-slate-800 leading-tight">{contract.pejabatPembuatKomitmen}</p>
                    <p className="text-[9px] text-slate-400 font-mono">NIP: {contract.nipPpk}</p>
                  </div>
                </div>
              </div>

              {/* Section 3: Jadwal Pelaksanaan */}
              <div className="space-y-2 pt-3.5 border-t border-slate-100">
                <h4 className="text-[10px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  Masa Waktu Pelaksanaan
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-slate-50 p-3 rounded border border-slate-200">
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-slate-500 font-semibold">Jangka Waktu</p>
                    <p className="font-bold text-slate-800">{contract.jangkaWaktu} Hari Kalender</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-slate-500 font-semibold">Tanggal Mulai (SPMK)</p>
                    <p className="font-bold text-slate-800">{contract.tanggalMulai}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-slate-500 font-semibold">Target Selesai</p>
                    <p className="font-bold text-slate-800">{contract.tanggalSelesai}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-slate-500 font-semibold">Tanggal Kontrak</p>
                    <p className="font-bold text-slate-700">{contract.tanggalKontrak}</p>
                  </div>
                </div>
              </div>

              {/* Catatan Pekerjaan */}
              <div className="space-y-1.5 pt-3.5 border-t border-slate-100">
                <h4 className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">Catatan Evaluasi / Rekomendasi Lapangan</h4>
                <div className="bg-amber-50/50 border border-amber-200 p-3 rounded text-[11px] text-slate-700 leading-relaxed font-sans">
                  {contract.catatanPekerjaan || "Tidak ada catatan evaluasi khusus untuk pekerjaan ini."}
                </div>
              </div>
            </div>
          </div>

          {/* Adendum Section */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-3.5">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <div className="space-y-0.5">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <History className="w-4 h-4 text-violet-600 animate-spin-slow" />
                  Daftar Adendum Kontrak
                </h3>
                <p className="text-[10px] text-slate-500">Riwayat amandemen pekerjaan tambah/kurang atau kompensasi waktu</p>
              </div>
              <button
                id="btn-add-adendum"
                onClick={() => setShowAdendumForm(!showAdendumForm)}
                className="flex items-center gap-1 text-[10px] font-bold text-amber-600 hover:text-amber-700 uppercase tracking-wider cursor-pointer transition"
              >
                {showAdendumForm ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                {showAdendumForm ? "Batal" : "Tambah Adendum"}
              </button>
            </div>

            {/* Inline Adendum Form */}
            {showAdendumForm && (
              <form id="adendum-form" onSubmit={handleSaveAdendum} className="bg-slate-50 border border-slate-200 rounded p-3 space-y-3 animate-fade-in text-xs">
                {errorAdendum && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-800 p-2.5 rounded text-[11px] font-medium animate-slide-in flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{errorAdendum}</span>
                  </div>
                )}
                <h4 className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Formulir Input Adendum Baru</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500">Nomor Adendum</label>
                    <input
                      type="text"
                      value={noAdendum}
                      onChange={(e) => setNoAdendum(e.target.value)}
                      placeholder="Contoh: 602/DBM/CTR/.../ADD-01"
                      className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded focus:ring-1 focus:ring-amber-500 outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500">Tanggal Adendum</label>
                    <input
                      type="date"
                      value={tanggalAdendum}
                      onChange={(e) => setTanggalAdendum(e.target.value)}
                      className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded focus:ring-1 focus:ring-amber-500 outline-none font-sans"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500">Perubahan Nilai (Kosongkan jika tetap)</label>
                    <input
                      type="number"
                      value={perubahanNilai}
                      onChange={(e) => setPerubahanNilai(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="Rp. Positif (tambah) / Negatif (kurang)"
                      className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded focus:ring-1 focus:ring-amber-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500">Perubahan Waktu (Hari Kalender)</label>
                    <input
                      type="number"
                      value={perubahanWaktu}
                      onChange={(e) => setPerubahanWaktu(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="Jumlah hari penambahan waktu"
                      className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded focus:ring-1 focus:ring-amber-500 outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500">Keterangan Perubahan</label>
                  <textarea
                    value={keteranganAdendum}
                    onChange={(e) => setKeteranganAdendum(e.target.value)}
                    rows={2}
                    placeholder="Sebab perubahan spesifikasi teknis / utilitas..."
                    className="w-full p-2 text-xs bg-white border border-slate-200 rounded focus:ring-1 focus:ring-amber-500 outline-none resize-none"
                    required
                  ></textarea>
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="submit"
                    className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded transition cursor-pointer"
                  >
                    Simpan Adendum
                  </button>
                </div>
              </form>
            )}

            {/* Adendums list */}
            {contract.adendum.length === 0 ? (
              <p className="text-[11px] text-slate-400 italic text-center py-2 bg-slate-50 rounded border border-slate-200 border-dashed">Belum ada adendum untuk kontrak induk ini.</p>
            ) : (
              <div className="divide-y divide-slate-100 text-xs">
                {contract.adendum.map((add, index) => (
                  <div key={add.id} className="py-2.5 first:pt-0 last:pb-0 space-y-1.5">
                    <div className="flex justify-between items-start gap-2">
                      <p className="font-bold text-slate-800">
                        {index + 1}. Adendum No: <span className="font-mono text-xs text-indigo-600 font-bold">{add.noAdendum}</span>
                      </p>
                      <span className="text-[10px] text-slate-500 font-bold">{add.tanggalAdendum}</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-200">{add.keterangan}</p>
                    
                    <div className="flex gap-4 text-[10px] font-bold text-slate-500 pl-1">
                      {add.perubahanNilai !== undefined && (
                        <span>
                          Perubahan Anggaran: <strong className={add.perubahanNilai >= 0 ? "text-emerald-600 font-bold" : "text-rose-600 font-bold"}>
                            {add.perubahanNilai >= 0 ? '+' : ''}{formatRupiah(add.perubahanNilai)}
                          </strong>
                        </span>
                      )}
                      {add.perubahanWaktu !== undefined && (
                        <span>
                          Penyesuaian Waktu: <strong className="text-amber-600 font-bold">+{add.perubahanWaktu} Hari</strong>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Attachments List */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-3.5">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Paperclip className="w-4 h-4 text-indigo-600" />
                Berkas Kontrak Digital
              </h3>
              <button
                id="btn-add-file"
                onClick={() => setShowUploadForm(!showUploadForm)}
                className="text-[10px] text-amber-600 hover:text-amber-700 font-bold uppercase tracking-wider flex items-center gap-0.5 cursor-pointer"
              >
                {showUploadForm ? "Batal" : "+ Tambah Link"}
              </button>
            </div>

            {/* Document Upload Form (URL Input) */}
            {showUploadForm && (
              <form id="upload-form" onSubmit={handleSaveUpload} className="bg-slate-50 border border-slate-200 rounded p-3 space-y-3 text-[11px] animate-fade-in">
                {errorUpload && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-800 p-2 text-[10px] font-medium animate-slide-in flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
                    <span>{errorUpload}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <p className="font-bold text-slate-700 uppercase tracking-wider text-[9px]">Tambah Tautan Berkas Digital</p>
                </div>
                
                {/* Nama Berkas */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-600">Nama Berkas / Dokumen:</label>
                  <input
                    type="text"
                    value={namaFile}
                    onChange={(e) => setNamaFile(e.target.value)}
                    placeholder="Contoh: Hasil Scan Kontrak PUPR, Gambar Kerja MC 0, dll."
                    className="w-full p-1.5 bg-white border border-slate-200 rounded focus:ring-1 focus:ring-amber-500 outline-none text-slate-800"
                    required
                  />
                </div>

                {/* Tautan URL */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-600">Tautan / URL Dokumen (Google Drive, Dropbox, dll):</label>
                  <input
                    type="text"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="Contoh: https://drive.google.com/..."
                    className="w-full p-1.5 bg-white border border-slate-200 rounded focus:ring-1 focus:ring-amber-500 outline-none text-slate-800"
                    required
                  />
                </div>

                {/* Document Type select */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-600">Kategori Berkas:</label>
                  <select
                    value={tipeDokumen}
                    onChange={(e) => setTipeDokumen(e.target.value)}
                    className="w-full p-1.5 bg-white border border-slate-200 rounded focus:ring-1 focus:ring-amber-500 outline-none"
                  >
                    <option value="Dokumen Kontrak">Dokumen Kontrak</option>
                    <option value="PCM">PCM (Pre Construction Meeting)</option>
                    <option value="RMK">RMK (Rencana Mutu Kontrak)</option>
                    <option value="BACK UP MC 0%">BACK UP MC 0%</option>
                    <option value="Shop Drawing">Shop Drawing</option>
                    <option value="Justifikasi Teknis">Justifikasi Teknis</option>
                    <option value="Laporan Harian">Laporan Harian</option>
                    <option value="Laporan Bulanan & mingguan">Laporan Bulanan & Mingguan</option>
                    <option value="Back Up Data Kuantitas">Back Up Data Kuantitas</option>
                    <option value="Addendum I">Addendum I</option>
                    <option value="Addendum II">Addendum II</option>
                    <option value="Jaminan">Jaminan</option>
                    <option value="JMF">JMF (Job Mix Formula)</option>
                    <option value="DMF">DMF (Design Mix Formula)</option>
                    <option value="JMD">JMD (Job Mix Design)</option>
                    <option value="Back Up Quality">Back Up Quality</option>
                    <option value="Back Up Final Quality">Back Up Final Quality</option>
                    <option value="As Built Drawing">As Built Drawing</option>
                    <option value="Request Ijin Kerja">Request Ijin Kerja</option>
                    <option value="Sertifikat Bulanan">Sertifikat Bulanan</option>
                    <option value="Berita Acara PHO">Berita Acara PHO</option>
                    <option value="Dokumen Pelaksanaan 0% 50% 100%">Dokumen Pelaksanaan 0% 50% 100%</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded transition cursor-pointer text-xs shadow-sm flex items-center justify-center gap-1.5"
                >
                  Simpan Tautan Berkas
                </button>
              </form>
            )}

            {/* List of Files */}
            {contract.lampiran.length === 0 ? (
              <p className="text-[11px] text-slate-400 italic text-center py-4 bg-slate-50 border border-slate-200 border-dashed rounded">
                Belum ada dokumen pindaian (PDF) yang diunggah.
              </p>
            ) : (() => {
              // Gather all unique categories actually present in the uploaded files
              const presentCategories = ['Semua', ...Array.from(new Set(contract.lampiran.map(l => l.tipeDokumen || 'Dokumen Kontrak')))];

              // Filtered list
              const filteredList = contract.lampiran.filter(lamp => {
                const query = fileSearch.toLowerCase().trim();
                const matchesSearch = query === '' || 
                  lamp.namaFile.toLowerCase().includes(query) || 
                  (lamp.tipeDokumen || 'Dokumen Kontrak').toLowerCase().includes(query);
                const matchesCategory = fileCategoryFilter === 'Semua' || lamp.tipeDokumen === fileCategoryFilter;
                return matchesSearch && matchesCategory;
              });

              return (
                <div className="space-y-3.5 text-xs">
                  {/* Search and Filters Bar */}
                  <div className="space-y-2 bg-slate-50 p-2.5 rounded border border-slate-200/80">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={fileSearch}
                        onChange={(e) => setFileSearch(e.target.value)}
                        placeholder="Cari nama berkas atau kategori..."
                        className="w-full pl-7.5 pr-2.5 py-1 text-[11px] bg-white border border-slate-200 rounded focus:ring-1 focus:ring-amber-500 outline-none text-slate-800"
                      />
                    </div>
                    
                    {presentCategories.length > 1 && (
                      <div className="flex flex-wrap gap-1 items-center">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mr-1">Filter Kategori:</span>
                        {presentCategories.map(cat => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setFileCategoryFilter(cat)}
                            className={`px-2 py-0.5 rounded text-[9.5px] font-bold transition cursor-pointer border ${
                              fileCategoryFilter === cat 
                                ? 'bg-amber-400 border-amber-400 text-slate-950 font-extrabold' 
                                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Dynamic Items Listing (Flat, Detailed) */}
                  {filteredList.length === 0 ? (
                    <p className="text-[11px] text-slate-400 italic text-center py-4 bg-slate-50/50 border border-slate-200 border-dashed rounded">
                      Tidak ada berkas yang cocok dengan filter atau kata kunci pencarian.
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                      {filteredList.map((lamp) => {
                        const isPdf = lamp.namaFile.toLowerCase().endsWith('.pdf') || (lamp.googleDriveUrl && lamp.googleDriveUrl.toLowerCase().includes('.pdf'));
                        const isDoc = lamp.namaFile.toLowerCase().endsWith('.docx') || lamp.namaFile.toLowerCase().endsWith('.doc') || (lamp.googleDriveUrl && (lamp.googleDriveUrl.toLowerCase().includes('.docx') || lamp.googleDriveUrl.toLowerCase().includes('.doc')));
                        
                        return (
                          <div 
                            key={lamp.id} 
                            className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white hover:bg-slate-50/50 border border-slate-200 rounded-lg shadow-2xs hover:shadow-xs transition-all gap-2"
                          >
                            {/* Left details: Icon & Name & Badge */}
                            <div className="flex items-start gap-2.5 max-w-full sm:max-w-[70%]">
                              <div className={`p-2 rounded shrink-0 flex items-center justify-center ${
                                isPdf ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                                isDoc ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                                'bg-amber-50 text-amber-600 border border-amber-100'
                              }`}>
                                <LinkIcon className="w-4 h-4" />
                              </div>
                              <div className="space-y-1 min-w-0">
                                <p 
                                  className="font-bold text-slate-800 text-[11px] leading-snug break-all line-clamp-2" 
                                  title={lamp.namaFile}
                                >
                                  {lamp.namaFile}
                                </p>
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <span className={`inline-flex items-center text-[9px] font-extrabold px-1.5 py-0.5 rounded border tracking-wide uppercase ${getCategoryColor(lamp.tipeDokumen)}`}>
                                    {lamp.tipeDokumen || 'Dokumen Kontrak'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Middle details & Actions in standard grid/flex */}
                            <div className="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-end gap-3 w-full sm:w-auto mt-1 sm:mt-0 pl-1 sm:pl-0 border-t border-slate-100 sm:border-t-0 pt-2 sm:pt-0">
                              <div className="flex flex-col text-[10px] text-slate-400 font-mono text-left sm:text-right space-y-0.5 shrink-0">
                                <span className="flex items-center sm:justify-end gap-1 font-medium">
                                  <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                                  {lamp.tanggalUpload}
                                </span>
                                <span className="flex items-center sm:justify-end gap-1 font-medium">
                                  <Database className="w-3 h-3 text-slate-400 shrink-0" />
                                  {lamp.ukuranFile}
                                </span>
                              </div>

                              {/* Action buttons (Direct, no dropdown) */}
                              <div className="flex items-center gap-1.5 shrink-0">
                                {lamp.googleDriveUrl && (
                                  <a
                                    href={lamp.googleDriveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 hover:text-indigo-800 rounded border border-indigo-200 text-[10px] font-bold transition shadow-2xs shrink-0"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                                    Buka Link
                                  </a>
                                )}
                                
                                <button
                                  type="button"
                                  onClick={() => handleDeleteFile(lamp)}
                                  className="p-1.5 hover:bg-rose-50 text-rose-500 hover:text-rose-700 border border-transparent hover:border-rose-150 rounded transition cursor-pointer shrink-0"
                                  title="Hapus Berkas"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>

        {/* Right Column: Execution Tracking & Attachments */}
        <div className="space-y-4">
          {/* Interactive Progress Tracking */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-4">
            <div className="flex justify-between items-center pb-1">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Progres & Status Real-time
              </h3>
              {!isUpdatingProgress ? (
                <button
                  onClick={() => {
                    setLocalFisik(contract.progresFisik);
                    setLocalKeuangan(contract.progresKeuangan);
                    setLocalStatus(contract.status);
                    setLocalCatatan(contract.catatanPekerjaan);
                    setIsUpdatingProgress(true);
                  }}
                  className="text-[10px] text-amber-600 hover:text-amber-700 font-bold uppercase tracking-wider flex items-center gap-0.5 cursor-pointer"
                >
                  <Edit className="w-3 h-3 text-amber-500" /> Perbarui
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsUpdatingProgress(false)}
                    className="text-[10px] text-slate-400 hover:text-slate-600 font-bold uppercase tracking-wider"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSaveProgress}
                    className="text-[10px] text-emerald-600 hover:text-emerald-800 font-bold uppercase tracking-wider"
                  >
                    Simpan
                  </button>
                </div>
              )}
            </div>

            {/* Read-Only State Display */}
            {!isUpdatingProgress ? (
              <div className="space-y-3.5 text-xs">
                {/* Physical Progress */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500 font-semibold">Realisasi Fisik</span>
                    <span className="font-bold text-slate-900">{contract.progresFisik}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 border border-slate-200">
                    <div 
                      className={`h-full rounded-full ${contract.status === 'Kritis' ? 'bg-rose-500 animate-pulse' : 'bg-blue-600'}`} 
                      style={{ width: `${contract.progresFisik}%` }}
                    ></div>
                  </div>
                </div>

                {/* Financial Progress */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500 font-semibold">Penyerapan Keuangan</span>
                    <span className="font-bold text-slate-900">{contract.progresKeuangan}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 border border-slate-200">
                    <div 
                      className="bg-emerald-600 h-full rounded-full" 
                      style={{ width: `${contract.progresKeuangan}%` }}
                    ></div>
                  </div>
                </div>

                {/* Status Indicator Big */}
                <div className="pt-1.5">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status Lapangan</p>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800 text-xs">{contract.status.toUpperCase()}</p>
                      <p className="text-[9px] text-slate-400 font-semibold">
                        {contract.status === 'Kritis' ? 'Deviasi tinggi, butuh evaluasi' : 'Progres sesuai target jadwal'}
                      </p>
                    </div>
                    {contract.status === 'Kritis' ? (
                      <div className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping"></div>
                    ) : contract.status === 'Selesai' || contract.status === 'FHO' ? (
                      <div className="w-4.5 h-4.5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              // Updating Progress Form
              <div className="space-y-3 bg-slate-50 p-3 rounded border border-slate-200 text-[11px] animate-fade-in">
                {/* Physical Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Realisasi Fisik:</span>
                    <span className="text-blue-600 font-extrabold">{localFisik}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={localFisik}
                      onChange={(e) => setLocalFisik(Number(e.target.value))}
                      className="flex-1 accent-slate-900 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
                    />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={localFisik}
                      onChange={(e) => {
                        const val = Math.min(100, Math.max(0, Number(e.target.value)));
                        setLocalFisik(val);
                      }}
                      className="w-14 px-1.5 py-1 text-center bg-white border border-slate-200 rounded font-bold text-slate-800"
                    />
                  </div>
                </div>

                {/* Financial Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Penyerapan Keuangan:</span>
                    <span className="text-emerald-600 font-extrabold">{localKeuangan}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={localKeuangan}
                      onChange={(e) => setLocalKeuangan(Number(e.target.value))}
                      className="flex-1 accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
                    />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={localKeuangan}
                      onChange={(e) => {
                        const val = Math.min(100, Math.max(0, Number(e.target.value)));
                        setLocalKeuangan(val);
                      }}
                      className="w-14 px-1.5 py-1 text-center bg-white border border-slate-200 rounded font-bold text-slate-800"
                    />
                  </div>
                </div>

                {/* Status Selector */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-600">Status Pekerjaan:</label>
                  <select
                    value={localStatus}
                    onChange={(e) => setLocalStatus(e.target.value as KontrakFisik['status'])}
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded focus:ring-1 focus:ring-amber-500 outline-none"
                  >
                    <option value="Persiapan">Persiapan</option>
                    <option value="Pelaksanaan">Pelaksanaan</option>
                    <option value="Kritis">Kritis (Keterlambatan/Deviasi)</option>
                    <option value="PHO">PHO (Serah Terima Awal)</option>
                    <option value="FHO">FHO (Serah Terima Akhir)</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>

                {/* Catatan Field */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-600">Catatan/Rekomendasi:</label>
                  <textarea
                    value={localCatatan}
                    onChange={(e) => setLocalCatatan(e.target.value)}
                    rows={2}
                    placeholder="Catat kendala teknis atau deviasi progres..."
                    className="w-full p-2 bg-white border border-slate-200 rounded focus:ring-1 focus:ring-amber-500 outline-none resize-none text-[11px]"
                  ></textarea>
                </div>

                <div className="flex gap-2 pt-1 justify-end">
                  <button
                    onClick={() => setIsUpdatingProgress(false)}
                    className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 rounded text-slate-700 font-bold"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSaveProgress}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 rounded text-white font-bold shadow-sm"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
