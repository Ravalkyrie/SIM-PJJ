/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { db } from "./firebase";
import {
  collection,
  addDoc,
  setDoc,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { KontrakFisik, AdendumKontrak, DokumenLampiran, ActivityLog, KABUPATEN_PRESETS } from './types';
import { INITIAL_KONTRAK } from './data/mockData';
import DashboardView from './components/DashboardView';
import ContractList from './components/ContractList';
import ContractDetail from './components/ContractDetail';
import ContractForm from './components/ContractForm';
import ActivityLogView from './components/ActivityLogView';
import { 
  Building2, 
  LayoutDashboard, 
  Files, 
  FilePlus, 
  Settings, 
  Info,
  Calendar,
  Layers,
  Map,
  History
} from 'lucide-react';

const generateSeedLogs = (contractsList: KontrakFisik[]): ActivityLog[] => {
  const seed: ActivityLog[] = [];
  contractsList.forEach((c) => {
    // 1. Creation log
    seed.push({
      id: `LOG-SEED-1-${c.id}`,
      timestamp: '2026-06-10 09:15',
      actionType: 'CREATE',
      contractId: c.id,
      contractNo: c.noKontrak,
      contractName: c.namaPaket,
      description: `Mendaftarkan berkas kontrak baru dengan nilai Rp ${c.nilaiKontrak.toLocaleString('id-ID')}`,
      operator: 'Admin Dinas'
    });

    // 2. Upload lampiran log
    c.lampiran.forEach((lamp) => {
      seed.push({
        id: `LOG-SEED-LAMP-${lamp.id}`,
        timestamp: '2026-06-12 11:20',
        actionType: 'ADD_LAMPIRAN',
        contractId: c.id,
        contractNo: c.noKontrak,
        contractName: c.namaPaket,
        description: `Mengunggah berkas lampiran "${lamp.namaFile}" (${lamp.tipeDokumen})`,
        operator: 'Admin Dinas'
      });
    });

    // 3. Adendum log
    c.adendum.forEach((ad) => {
      seed.push({
        id: `LOG-SEED-ADD-${ad.id}`,
        timestamp: '2026-06-20 14:05',
        actionType: 'ADD_ADENDUM',
        contractId: c.id,
        contractNo: c.noKontrak,
        contractName: c.namaPaket,
        description: `Melakukan adendum kontrak ${ad.noAdendum}: ${ad.keterangan}`,
        operator: 'Admin Dinas'
      });
    });

    // 4. Progress log
    if (c.progresFisik > 0 || c.progresKeuangan > 0) {
      seed.push({
        id: `LOG-SEED-PROG-${c.id}`,
        timestamp: '2026-06-25 15:30',
        actionType: 'UPDATE_PROGRESS',
        contractId: c.id,
        contractNo: c.noKontrak,
        contractName: c.namaPaket,
        description: `Melakukan pemutakhiran progres fisik menjadi ${c.progresFisik}% dan progres keuangan menjadi ${c.progresKeuangan}%`,
        operator: 'Admin Dinas'
      });
    }
  });

  return seed.sort((a, b) => b.id.localeCompare(a.id));
};

export default function App() {
  // Master State
  const [contracts, setContracts] = useState<KontrakFisik[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'list' | 'input' | 'detail' | 'logs'>('dashboard');
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);
  const [contractToEdit, setContractToEdit] = useState<KontrakFisik | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>('Semua');
  const [selectedRegion, setSelectedRegion] = useState<string>('Semua');

  // Load contracts and logs from localStorage
  useEffect(() => {
  const loadContracts = async () => {
    try {
      const snapshot = await getDocs(collection(db, "kontrak"));

      const data = snapshot.docs.map((docSnap) => ({
    firestoreId: docSnap.id,
    ...docSnap.data(),
})) as KontrakFisik[];

      setContracts(data);

      console.log("Berhasil mengambil", data.length, "kontrak");
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  loadContracts();
}, []);

  // Helper to add activity logs
  const addLog = (
    actionType: ActivityLog['actionType'],
    contract: { id: string; noKontrak: string; namaPaket: string },
    description: string
  ) => {
    const formatTime = () => {
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
    };

    const newLog: ActivityLog = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: formatTime(),
      actionType,
      contractId: contract.id,
      contractNo: contract.noKontrak,
      contractName: contract.namaPaket,
      description,
      operator: 'Admin Dinas'
    };

    setActivityLogs(prev => {
      const updated = [newLog, ...prev];
      localStorage.setItem('pupr_activity_logs', JSON.stringify(updated));
      return updated;
    });
  };

  // Save contracts utility
  const saveContracts = (updated: KontrakFisik[]) => {
    setContracts(updated);
    localStorage.setItem('pupr_contracts', JSON.stringify(updated));
  };

  // Select a contract to view details
  const handleSelectContract = (id: string) => {
    setSelectedContractId(id);
    setActiveTab('detail');
    setIsMobileSidebarOpen(false);
  };

  // Edit Contract
  const handleEditContract = (id: string) => {
    const found = contracts.find(c => c.id === id);
    if (found) {
      setContractToEdit(found);
      setActiveTab('input');
    }
  };

  // Delete Contract
  const handleDeleteContract = async (id: string) => {
  if (!confirm("Apakah Anda yakin ingin menghapus kontrak ini?")) return;

  try {
    const contract = contracts.find((c) => c.id === id);

    if (!contract?.firestoreId) {
      alert("Firestore ID tidak ditemukan");
      return;
    }

    await deleteDoc(doc(db, "kontrak", contract.firestoreId));

    setContracts((prev) => prev.filter((c) => c.id !== id));

    alert("Kontrak berhasil dihapus.");
  } catch (error) {
    console.error("Gagal menghapus kontrak:", error);
    alert("Gagal menghapus kontrak.");
  }
};

  // Delete All Contracts
  const handleDeleteAllContracts = () => {
    saveContracts([]);
    
    // Log the mass deletion
    const formatTime = () => {
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
    };

    const newLog: ActivityLog = {
      id: `LOG-${Date.now()}`,
      timestamp: formatTime(),
      actionType: 'DELETE',
      contractId: 'ALL',
      contractNo: 'ALL',
      contractName: 'Semua Kontrak',
      description: 'Menghapus seluruh berkas data kontrak yang ada di dalam sistem secara permanen',
      operator: 'Admin Dinas'
    };

    setActivityLogs(prev => {
      const updated = [newLog, ...prev];
      localStorage.setItem('pupr_activity_logs', JSON.stringify(updated));
      return updated;
    });

    setSelectedContractId(null);
    setActiveTab('list');
  };
  
  // Save new/edited contract
  const handleSaveContract = async (saved: KontrakFisik) => {
    let updated: KontrakFisik[];
    if (contractToEdit) {
      // Editing
      updated = contracts.map(c => c.id === saved.id ? saved : c);
      setContractToEdit(null);
      addLog('UPDATE', saved, `Mengubah rincian data berkas kontrak "${saved.namaPaket}"`);
    } else {
      // Inserting new
      updated = [saved, ...contracts];
      addLog('CREATE', saved, `Melakukan penginputan dan pendaftaran berkas kontrak baru "${saved.namaPaket}" senilai Rp ${saved.nilaiKontrak.toLocaleString('id-ID')}`);
    }
    saveContracts(updated);
	try {
  await setDoc(
  doc(db, "kontrak", saved.id),
  {
    ...saved,
    createdAt: new Date().toISOString(),
  }
);

  console.log("Data berhasil dikirim ke Firestore");
} catch (error) {
  console.error("Gagal kirim ke Firestore:", error);
}
    setSelectedContractId(saved.id);
    setActiveTab('detail');
  };

  // Quick Progress Updates from Details page
  const handleUpdateProgress = async (
    id: string, 
    progresFisik: number, 
    progresKeuangan: number, 
    status: KontrakFisik['status'],
    catatan: string
  ) => {
    const found = contracts.find(c => c.id === id);
    const updated = contracts.map(c => {
      if (c.id === id) {
        return {
          ...c,
          progresFisik,
          progresKeuangan,
          status,
          catatanPekerjaan: catatan
        };
      }
      return c;
    });
    saveContracts(updated);
	const updatedContract = updated.find(c => c.id === id);

if (updatedContract) {
  await setDoc(doc(db, "kontrak", id), updatedContract);
}
    if (found) {
      addLog('UPDATE_PROGRESS', found, `Memutakhirkan progres fisik menjadi ${progresFisik}%, keuangan menjadi ${progresKeuangan}%, dan status pekerjaan menjadi "${status}"`);
    }
  };

  // Add Adendum	
  const handleAddAdendum = async (id: string, adendumOmit: Omit<AdendumKontrak, 'id'>) => {
    const newAdendum: AdendumKontrak = {
      ...adendumOmit,
      id: `ADD-${Date.now()}`
    };

    const found = contracts.find(c => c.id === id);
    const updated = contracts.map(c => {
      if (c.id === id) {
        // Business Logic: Adendums can modify contract value and execution time
        let updatedNilai = c.nilaiKontrak;
        let updatedJangka = c.jangkaWaktu;
        let updatedSelesai = c.tanggalSelesai;

        if (adendumOmit.perubahanNilai) {
          updatedNilai += adendumOmit.perubahanNilai;
        }

        if (adendumOmit.perubahanWaktu) {
          updatedJangka += adendumOmit.perubahanWaktu;
          // Recalculate target end date based on original start date
          try {
            const date = new Date(c.tanggalMulai);
            date.setDate(date.getDate() + updatedJangka);
            updatedSelesai = date.toISOString().split('T')[0];
          } catch (e) {
            console.error(e);
          }
        }

        return {
          ...c,
          nilaiKontrak: updatedNilai,
          jangkaWaktu: updatedJangka,
          tanggalSelesai: updatedSelesai,
          adendum: [...c.adendum, newAdendum]
        };
      }
      return c;
    });

    saveContracts(updated);
	const updatedContract = updated.find(c => c.id === id);

if (updatedContract) {
  try {
    await setDoc(
      doc(db, "kontrak", id),
      updatedContract
    );
    console.log("Adendum berhasil disimpan ke Firestore");
  } catch (error) {
    console.error("Gagal menyimpan adendum:", error);
  }
}
    if (found) {
      addLog('ADD_ADENDUM', found, `Menambahkan adendum kontrak baru No: ${adendumOmit.noAdendum} dengan alasan: "${adendumOmit.keterangan}"`);
    }
  };

  // Add Attachment
  const handleAddLampiran = async (id: string, lampiranOmit: Omit<DokumenLampiran, 'id'>) => {
    const newLampiran: DokumenLampiran = {
      ...lampiranOmit,
      id: `LAMP-${Date.now()}`
    };

    const found = contracts.find(c => c.id === id);
    const updated = contracts.map(c => {
      if (c.id === id) {
        return {
          ...c,
          lampiran: [...c.lampiran, newLampiran]
        };
      }
      return c;
    });

    saveContracts(updated);
	const updatedContract = updated.find(c => c.id === id);

if (updatedContract) {
  try {
    await setDoc(
      doc(db, "kontrak", id),
      updatedContract
    );
    console.log("Lampiran berhasil disimpan ke Firestore");
  } catch (error) {
    console.error("Gagal menyimpan lampiran:", error);
  }
}
    if (found) {
      addLog('ADD_LAMPIRAN', found, `Mengunggah dokumen lampiran baru "${lampiranOmit.namaFile}" (${lampiranOmit.tipeDokumen})`);
    }
  };

  // Delete Attachment
  const handleDeleteLampiran = async (id: string, lampiranId: string) => {
    const found = contracts.find(c => c.id === id);
    const lamp = found?.lampiran.find(l => l.id === lampiranId);
    const updated = contracts.map(c => {
      if (c.id === id) {
        return {
          ...c,
          lampiran: c.lampiran.filter(l => l.id !== lampiranId)
        };
      }
      return c;
    });

    saveContracts(updated);
	const updatedContract = updated.find(c => c.id === id);

if (updatedContract) {
  try {
    await setDoc(
      doc(db, "kontrak", id),
      updatedContract
    );
    console.log("Penghapusan lampiran berhasil disimpan");
  } catch (error) {
    console.error(error);
  }
}
    if (found && lamp) {
      addLog('DELETE_LAMPIRAN', found, `Menghapus berkas lampiran "${lamp.namaFile}" dari berkas kontrak`);
    }
  };

  // Get currently selected contract
  const selectedContract = contracts.find(c => c.id === selectedContractId);

  // Helper for Breadcrumbs
  const getBreadcrumbs = () => {
    const base = [<span key="home" className="hover:text-amber-600 transition cursor-pointer" onClick={() => setActiveTab('dashboard')}>SIM-KONTRAK</span>];
    if (activeTab === 'dashboard') {
      base.push(<span key="divider1">/</span>);
      base.push(<span key="curr" className="font-bold text-slate-800">Dasbor Utama</span>);
    } else if (activeTab === 'list') {
      base.push(<span key="divider1">/</span>);
      base.push(<span key="curr" className="font-bold text-slate-800">Daftar Kontrak</span>);
    } else if (activeTab === 'input') {
      base.push(<span key="divider1">/</span>);
      base.push(<span key="step" className="hover:text-amber-600 transition cursor-pointer" onClick={() => setActiveTab('list')}>Daftar Kontrak</span>);
      base.push(<span key="divider2">/</span>);
      base.push(<span key="curr" className="font-bold text-slate-800">{contractToEdit ? 'Edit Berkas' : 'Input Berkas'}</span>);
    } else if (activeTab === 'detail') {
      base.push(<span key="divider1">/</span>);
      base.push(<span key="step" className="hover:text-amber-600 transition cursor-pointer" onClick={() => setActiveTab('list')}>Daftar Kontrak</span>);
      base.push(<span key="divider2">/</span>);
      base.push(<span key="curr" className="font-bold text-slate-800 truncate max-w-[200px]" title={selectedContract?.namaPaket}>{selectedContract?.id}</span>);
    } else if (activeTab === 'logs') {
      base.push(<span key="divider1">/</span>);
      base.push(<span key="curr" className="font-bold text-slate-800">Log Aktivitas</span>);
    }
    return base;
  };

  // Sidebar navigation content component
  const SidebarNav = ({ showCloseButton, onClose }: { showCloseButton?: boolean; onClose?: () => void }) => (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300">
      {/* Branding */}
      <div className="p-4 bg-slate-950 flex items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/10 p-1 rounded flex items-center justify-center shrink-0 border border-slate-800 shadow-inner">
            <img 
              src="https://images.seeklogo.com/logo-png/35/1/pu-logo-png_seeklogo-355609.png" 
              alt="Logo PU" 
              className="w-7 h-7 object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h1 className="text-white font-extrabold tracking-tight text-xs leading-none" title="Sistem Informasi Monitoring Pembangunan Jalan dan Jembatan">SIM-KONTRAK PJJ</h1>
            <p className="text-[9px] text-amber-400 font-bold uppercase tracking-wider mt-1">Monitoring Jalan & Jembatan</p>
          </div>
        </div>
        {showCloseButton && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition"
            title="Tutup Menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
        <div className="px-5 py-2 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
          Manajemen Kontrak
        </div>
        
        <button
          onClick={() => { setActiveTab('dashboard'); setSelectedContractId(null); setIsMobileSidebarOpen(false); }}
          className={`w-full flex items-center px-5 py-2.5 text-xs transition-all ${activeTab === 'dashboard' ? 'bg-amber-400 text-slate-950 font-bold shadow-inner' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
        >
          <LayoutDashboard className="w-4 h-4 mr-3" />
          Dasbor Pemantauan
        </button>

        <button
          onClick={() => { setActiveTab('list'); setSelectedContractId(null); setIsMobileSidebarOpen(false); }}
          className={`w-full flex items-center px-5 py-2.5 text-xs transition-all ${(activeTab === 'list' || activeTab === 'detail') ? 'bg-amber-400 text-slate-950 font-bold shadow-inner' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
        >
          <Files className="w-4 h-4 mr-3" />
          Daftar Kontrak
        </button>

        <button
          onClick={() => { setContractToEdit(null); setActiveTab('input'); setIsMobileSidebarOpen(false); }}
          className={`w-full flex items-center px-5 py-2.5 text-xs transition-all ${activeTab === 'input' ? 'bg-amber-400 text-slate-950 font-bold shadow-inner' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
        >
          <FilePlus className="w-4 h-4 mr-3" />
          {contractToEdit ? 'Edit Kontrak Lama' : 'Input Kontrak Baru'}
        </button>

        <button
          onClick={() => { setActiveTab('logs'); setSelectedContractId(null); setIsMobileSidebarOpen(false); }}
          className={`w-full flex items-center px-5 py-2.5 text-xs transition-all ${activeTab === 'logs' ? 'bg-amber-400 text-slate-950 font-bold shadow-inner' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
        >
          <History className="w-4 h-4 mr-3" />
          Log Aktivitas
        </button>

        <div className="px-5 mt-6 py-3 text-xs text-slate-400 space-y-1.5 border-t border-slate-800">
          <p className="font-bold text-slate-300 leading-snug">Seksi Pembangunan Jalan Dan Jembatan</p>
          <p className="text-[10px] text-slate-500 leading-relaxed">Dinas Pekerjaan Umum Dan Perumahan Rakyat</p>
        </div>
      </nav>

      {/* Footer Sesi */}
      <div className="p-4 bg-slate-950/50 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs text-white font-bold border border-slate-600">
            AD
          </div>
          <div>
            <p className="text-white text-xs font-semibold leading-none">Admin Dinas</p>
            <p className="text-[9px] text-slate-500 mt-1 italic">Sesi: 2026-06-29</p>
          </div>
        </div>
      </div>
    </div>
  );

  const uniqueRegions = useMemo(() => {
    return KABUPATEN_PRESETS;
  }, []);

  const filteredContracts = useMemo(() => {
    return contracts.filter(c => {
      const matchYear = selectedYear === 'Semua' || c.tahunAnggaran.toString() === selectedYear;
      const matchRegion = selectedRegion === 'Semua' || c.kabupatenKota === selectedRegion;
      return matchYear && matchRegion;
    });
  }, [contracts, selectedYear, selectedRegion]);

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans text-slate-800 overflow-x-hidden">
      {/* Desktop Sidebar (Collapsible) */}
      <aside className={`bg-slate-900 border-r border-slate-800 hidden md:block shrink-0 sticky top-0 h-screen transition-all duration-300 ease-in-out overflow-hidden ${isSidebarOpen ? 'w-64' : 'w-0 border-r-0'}`}>
        <div className="w-64 h-full flex flex-col">
          <SidebarNav />
        </div>
      </aside>

      {/* Mobile Drawer Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setIsMobileSidebarOpen(false)}></div>
          <aside className="relative w-64 max-w-xs h-full bg-slate-900 animate-slide-in flex flex-col z-10 shadow-xl">
            <SidebarNav showCloseButton onClose={() => setIsMobileSidebarOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header Bar */}
        <header className="min-h-14 bg-white border-b border-slate-200 px-4 sm:px-6 flex flex-wrap items-center justify-between shadow-xs sticky top-0 z-30 py-2 sm:py-0 gap-3">
          <div className="flex items-center gap-3">
            {/* Hamburger Button for Mobile */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 md:hidden transition"
              title="Menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Collapse/Expand Sidebar Button for Desktop */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hidden md:block transition"
              title={isSidebarOpen ? "Sembunyikan Menu" : "Tampilkan Menu"}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isSidebarOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-slate-500 text-xs tracking-tight flex-wrap">
              {getBreadcrumbs()}
            </div>
          </div>

          {/* Quick info panel / Current budget year info */}
          <div className="flex items-center gap-3 text-xs font-medium flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 hidden sm:inline">Kabupaten/Kota:</span>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded border border-slate-300 px-2.5 py-1 text-[11px] focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer transition"
              >
                <option value="Semua">Semua Wilayah</option>
                {uniqueRegions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 hidden sm:inline">Tahun Anggaran:</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded border border-slate-300 px-2.5 py-1 text-[11px] focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer transition"
              >
                <option value="Semua">Semua Tahun</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
                <option value="2029">2029</option>
                <option value="2030">2030</option>
              </select>
            </div>
          </div>
        </header>

        {/* Content Container with High Density Spacing */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {activeTab === 'dashboard' && (
            <DashboardView 
              contracts={filteredContracts} 
              onSelectContract={handleSelectContract}
              onNavigateToTab={(tab) => {
                setActiveTab(tab);
                if (tab === 'input') setContractToEdit(null);
              }}
            />
          )}

          {activeTab === 'list' && (
            <ContractList 
              contracts={filteredContracts} 
              onSelectContract={handleSelectContract}
              onNavigateToInput={() => {
                setContractToEdit(null);
                setActiveTab('input');
              }}
              onDeleteContract={handleDeleteContract}
              onDeleteAllContracts={handleDeleteAllContracts}
            />
          )}

          {activeTab === 'detail' && selectedContract && (
            <ContractDetail 
              contract={selectedContract}
              onBack={() => setActiveTab('list')}
              onEdit={handleEditContract}
              onDelete={handleDeleteContract}
              onUpdateProgress={handleUpdateProgress}
              onAddAdendum={handleAddAdendum}
              onAddLampiran={handleAddLampiran}
              onDeleteLampiran={handleDeleteLampiran}
            />
          )}

          {activeTab === 'input' && (
            <ContractForm 
              initialContract={contractToEdit || undefined}
              onSave={handleSaveContract}
              onCancel={() => {
                if (contractToEdit) {
                  setActiveTab('detail');
                } else {
                  setActiveTab('list');
                }
                setContractToEdit(null);
              }}
            />
          )}

          {activeTab === 'logs' && (
            <ActivityLogView 
              logs={activityLogs}
              contracts={contracts}
              onClearLogs={() => {
                setActivityLogs([]);
                localStorage.setItem('pupr_activity_logs', JSON.stringify([]));
              }}
              onSelectContract={(id) => {
                setSelectedContractId(id);
                setActiveTab('detail');
              }}
            />
          )}
        </main>

        {/* Compact Footer */}
        <footer className="h-10 bg-white border-t border-slate-200 px-4 sm:px-6 flex items-center justify-between text-[10px] text-slate-400">
          <p>© 2026 Dinas Pekerjaan Umum dan Perumahan Rakyat - Provinsi Nusa Tenggara Timur</p>
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> 
              Sistem Online
            </span>
            <span>v2.4.1-stable</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
