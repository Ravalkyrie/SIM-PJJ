/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { db } from "./firebase";
import {
  collection,
  addDoc,
  setDoc,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { User } from 'firebase/auth';
import { KontrakFisik, AdendumKontrak, DokumenLampiran, ActivityLog, KABUPATEN_PRESETS, AppUser, UserRole } from './types';
import DashboardPage from './pages/DashboardPage';
import ContractsPage from './pages/ContractsPage';
import ContractDetailPage from './pages/ContractDetailPage';
import ContractFormPage from './pages/ContractFormPage';
import ActivityLogsPage from './pages/ActivityLogsPage';
import AccessManagementPage from './pages/AccessManagementPage';
import PageTransition from './components/PageTransition';
import LoginPage from './components/LoginPage';
import { loginUser, logoutUser, onAuthChange } from './lib/auth';
import { initializeUser, getUserRole, updateUserRole, hasPermission, canAccessRoute } from './lib/userManagement';
import { 
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  LayoutDashboard,
  Files,
  History,
  FilePlus,
  Shield
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

// Main App Content Component
function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  // Authentication State
  const [user, setUser] = useState<User | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('user');
  const [authLoading, setAuthLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Master State
  const [contracts, setContracts] = useState<KontrakFisik[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [appUsers, setAppUsers] = useState<AppUser[]>([]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>('Semua');
  const [selectedRegion, setSelectedRegion] = useState<string>('Semua');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthChange(async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        console.log('✅ User logged in:', currentUser.email);
        
        // Initialize user in Firestore and get role
        try {
          const appUser = await initializeUser(currentUser);
          setCurrentUserRole(appUser.role);
          console.log('✅ User role:', appUser.role);
        } catch (error) {
          console.error('❌ Error initializing user:', error);
          setCurrentUserRole('user'); // Fallback
        }
      } else {
        console.log('⚠️ No user logged in');
        setCurrentUserRole('user');
      }
      
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Handle Login
  const handleLogin = async (email: string, password: string) => {
    setLoginLoading(true);
    setLoginError(null);
    
    try {
      const loggedInUser = await loginUser(email, password);
      setUser(loggedInUser);
    } catch (error: any) {
      setLoginError(error.message);
      throw error;
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    if (!confirm('Apakah Anda yakin ingin keluar dari sistem?')) return;
    
    try {
      await logoutUser();
      setUser(null);
      setContracts([]);
      setActivityLogs([]);
      navigate('/dashboard');
      console.log('✅ Logout berhasil');
    } catch (error: any) {
      console.error('❌ Logout gagal:', error);
      alert('Gagal logout: ' + error.message);
    }
  };

  // Load contracts from Firestore
  useEffect(() => {
    if (!user) return;

    const loadContracts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const snapshot = await getDocs(collection(db, "kontrak"));

        const data = snapshot.docs.map((docSnap) => ({
          firestoreId: docSnap.id,
          ...docSnap.data(),
        })) as KontrakFisik[];

        setContracts(data);
        console.log("✅ Berhasil mengambil", data.length, "kontrak dari Firestore");
      } catch (error: any) {
        console.error("❌ Gagal mengambil data:", error);
        setError(error.message || "Gagal memuat data kontrak");
      } finally {
        setIsLoading(false);
      }
    };

    loadContracts();
  }, [user]);

  // Load activity logs from Firestore
  useEffect(() => {
    if (!user) return;

    const loadLogs = async () => {
      try {
        const snapshot = await getDocs(collection(db, "activity_logs"));
        const data = snapshot.docs.map((docSnap) => ({
          ...docSnap.data(),
        })) as ActivityLog[];
        
        setActivityLogs(data.sort((a, b) => b.timestamp.localeCompare(a.timestamp)));
        console.log("✅ Berhasil mengambil", data.length, "log aktivitas");
      } catch (error) {
        console.error("⚠️ Gagal mengambil log aktivitas:", error);
        // Non-critical, just log the error
      }
    };

    loadLogs();
  }, [user]);

  // Load users from Firebase Authentication via Cloud Function (Admin only)
  useEffect(() => {
    if (!user || currentUserRole !== 'admin') return;

    const loadUsers = async () => {
      try {
        const { listAllUsers } = await import('./lib/userManagement');
        const users = await listAllUsers();
        
        setAppUsers(users.sort((a, b) => a.email.localeCompare(b.email)));
        console.log("✅ Berhasil mengambil", users.length, "users dari Firebase Authentication");
      } catch (error) {
        console.error("⚠️ Gagal mengambil data users:", error);
      }
    };

    loadUsers();
  }, [user, currentUserRole]);

  // Helper to add activity logs to Firestore
  const addLog = async (
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

    setActivityLogs(prev => [newLog, ...prev]);

    // Save to Firestore
    try {
      await addDoc(collection(db, "activity_logs"), newLog);
      console.log("✅ Log aktivitas disimpan ke Firestore");
    } catch (error) {
      console.error("⚠️ Gagal menyimpan log:", error);
    }
  };

  // Handle Update User Role (Admin only)
  const handleUpdateUserRole = async (uid: string, newRole: UserRole) => {
    if (currentUserRole !== 'admin') {
      throw new Error('Unauthorized: Only admins can update user roles');
    }

    try {
      await updateUserRole(uid, newRole);
      
      // Update local state
      setAppUsers(prev => 
        prev.map(u => u.uid === uid ? { ...u, role: newRole, updatedAt: new Date().toISOString() } : u)
      );
      
      console.log('✅ User role updated successfully');
    } catch (error: any) {
      console.error('❌ Failed to update user role:', error);
      throw error;
    }
  };

  // Handle Add User Manually (Admin only)
  const handleAddUser = async (email: string, role: UserRole) => {
    if (currentUserRole !== 'admin') {
      throw new Error('Unauthorized: Only admins can add users');
    }

    try {
      const { addUserManually } = await import('./lib/userManagement');
      await addUserManually(email, role);
      console.log('✅ User added successfully');
    } catch (error: any) {
      console.error('❌ Failed to add user:', error);
      throw error;
    }
  };

  // Handle Delete User (Admin only)
  const handleDeleteUser = async (uid: string) => {
    if (currentUserRole !== 'admin') {
      throw new Error('Unauthorized: Only admins can delete users');
    }

    try {
      const { deleteUser } = await import('./lib/userManagement');
      await deleteUser(uid);
      console.log('✅ User deleted successfully');
    } catch (error: any) {
      console.error('❌ Failed to delete user:', error);
      throw error;
    }
  };

  // Refresh users list
  const handleRefreshUsers = async () => {
    if (currentUserRole !== 'admin') return;

    try {
      const { listAllUsers } = await import('./lib/userManagement');
      const users = await listAllUsers();
      
      setAppUsers(users.sort((a, b) => a.email.localeCompare(b.email)));
      console.log("✅ Users list refreshed");
    } catch (error) {
      console.error("⚠️ Failed to refresh users:", error);
    }
  };

  // Select a contract to view details
  const handleSelectContract = (id: string) => {
    navigate(`/kontrak/${id}`);
    setIsMobileSidebarOpen(false);
  };

  // Delete Contract
  const handleDeleteContract = async (id: string) => {
    // Check permission
    if (!hasPermission(currentUserRole, 'delete')) {
      alert('Anda tidak memiliki izin untuk menghapus kontrak');
      return;
    }

    if (!confirm("Apakah Anda yakin ingin menghapus kontrak ini?")) return;

    try {
      const contract = contracts.find((c) => c.id === id);

      if (!contract) {
        alert("Kontrak tidak ditemukan");
        return;
      }

      // Delete from Firestore
      await deleteDoc(doc(db, "kontrak", contract.firestoreId || id));

      // Update local state
      setContracts((prev) => prev.filter((c) => c.id !== id));

      // Log the deletion
      await addLog('DELETE', contract, `Menghapus berkas kontrak "${contract.namaPaket}" dari sistem`);

      console.log("✅ Kontrak berhasil dihapus");
    } catch (error) {
      console.error("❌ Gagal menghapus kontrak:", error);
      alert("Gagal menghapus kontrak");
    }
  };
  
  // Save new/edited contract
  const handleSaveContract = async (saved: KontrakFisik) => {
    // Check permission
    if (!hasPermission(currentUserRole, 'write')) {
      alert('Anda tidak memiliki izin untuk menambah/mengubah kontrak');
      return;
    }

    try {
      const isEdit = contracts.some(c => c.id === saved.id);

      // Save to Firestore
      await setDoc(doc(db, "kontrak", saved.id), {
        ...saved,
        createdAt: new Date().toISOString(),
      });

      // Update local state
      if (isEdit) {
        // Editing
        setContracts(contracts.map((c: KontrakFisik) => c.id === saved.id ? saved : c));
        await addLog('UPDATE', saved, `Mengubah rincian data berkas kontrak "${saved.namaPaket}"`);
      } else {
        // Inserting new
        setContracts([saved, ...contracts]);
        await addLog('CREATE', saved, `Melakukan penginputan dan pendaftaran berkas kontrak baru "${saved.namaPaket}" senilai Rp ${saved.nilaiKontrak.toLocaleString('id-ID')}`);
      }

      console.log("✅ Data berhasil disimpan ke Firestore");
    } catch (error) {
      console.error("❌ Gagal menyimpan ke Firestore:", error);
      alert("Gagal menyimpan kontrak");
    }
  };

  // Quick Progress Updates from Details page
  const handleUpdateProgress = async (
    id: string, 
    progresFisik: number, 
    progresKeuangan: number, 
    status: KontrakFisik['status'],
    catatan: string
  ) => {
    // Check permission
    if (!hasPermission(currentUserRole, 'write')) {
      alert('Anda tidak memiliki izin untuk mengubah progres kontrak');
      return;
    }

    try {
      const found = contracts.find((c: KontrakFisik) => c.id === id);
      if (!found) return;

      const updatedContract: KontrakFisik = {
        ...found,
        progresFisik,
        progresKeuangan,
        status,
        catatanPekerjaan: catatan
      };

      // Save to Firestore
      await setDoc(doc(db, "kontrak", id), updatedContract);

      // Update local state
      setContracts(contracts.map((c: KontrakFisik) => c.id === id ? updatedContract : c));

      // Log the update
      await addLog('UPDATE_PROGRESS', found, `Memutakhirkan progres fisik menjadi ${progresFisik}%, keuangan menjadi ${progresKeuangan}%, dan status pekerjaan menjadi "${status}"`);
      
      console.log("✅ Progress berhasil diupdate");
    } catch (error) {
      console.error("❌ Gagal update progress:", error);
      alert("Gagal mengupdate progress");
    }
  };

  // Add Adendum	
  const handleAddAdendum = async (id: string, adendumOmit: Omit<AdendumKontrak, 'id'>) => {
    // Check permission
    if (!hasPermission(currentUserRole, 'write')) {
      alert('Anda tidak memiliki izin untuk menambah adendum');
      return;
    }

    try {
      const found = contracts.find((c: KontrakFisik) => c.id === id);
      if (!found) return;

      // Create adendum object, excluding undefined values for Firestore
      const newAdendum: AdendumKontrak = {
        id: `ADD-${Date.now()}`,
        noAdendum: adendumOmit.noAdendum,
        tanggalAdendum: adendumOmit.tanggalAdendum,
        keterangan: adendumOmit.keterangan,
        ...(adendumOmit.perubahanNilai !== undefined && { perubahanNilai: adendumOmit.perubahanNilai }),
        ...(adendumOmit.perubahanWaktu !== undefined && { perubahanWaktu: adendumOmit.perubahanWaktu })
      };

      // Business Logic: Adendums can modify contract value and execution time
      let updatedNilai = found.nilaiKontrak;
      let updatedJangka = found.jangkaWaktu;
      let updatedSelesai = found.tanggalSelesai;

      if (adendumOmit.perubahanNilai) {
        updatedNilai += adendumOmit.perubahanNilai;
      }

      if (adendumOmit.perubahanWaktu) {
        updatedJangka += adendumOmit.perubahanWaktu;
        // Recalculate target end date based on original start date
        try {
          const date = new Date(found.tanggalMulai);
          date.setDate(date.getDate() + updatedJangka);
          updatedSelesai = date.toISOString().split('T')[0];
        } catch (e) {
          console.error(e);
        }
      }

      const updatedContract: KontrakFisik = {
        ...found,
        nilaiKontrak: updatedNilai,
        jangkaWaktu: updatedJangka,
        tanggalSelesai: updatedSelesai,
        adendum: [...found.adendum, newAdendum]
      };

      // Save to Firestore
      await setDoc(doc(db, "kontrak", id), updatedContract);

      // Update local state
      setContracts(contracts.map((c: KontrakFisik) => c.id === id ? updatedContract : c));

      // Log the action
      await addLog('ADD_ADENDUM', found, `Menambahkan adendum kontrak baru No: ${adendumOmit.noAdendum} dengan alasan: "${adendumOmit.keterangan}"`);

      console.log("✅ Adendum berhasil ditambahkan");
    } catch (error) {
      console.error("❌ Gagal menambahkan adendum:", error);
      alert("Gagal menambahkan adendum");
    }
  };

  // Add Attachment
  const handleAddLampiran = async (id: string, lampiranOmit: Omit<DokumenLampiran, 'id'>) => {
    // Check permission
    if (!hasPermission(currentUserRole, 'write')) {
      alert('Anda tidak memiliki izin untuk menambah lampiran');
      return;
    }

    try {
      const found = contracts.find((c: KontrakFisik) => c.id === id);
      if (!found) return;

      const newLampiran: DokumenLampiran = {
        ...lampiranOmit,
        id: `LAMP-${Date.now()}`
      };

      const updatedContract: KontrakFisik = {
        ...found,
        lampiran: [...found.lampiran, newLampiran]
      };

      // Save to Firestore
      await setDoc(doc(db, "kontrak", id), updatedContract);

      // Update local state
      setContracts(contracts.map((c: KontrakFisik) => c.id === id ? updatedContract : c));

      // Log the action
      await addLog('ADD_LAMPIRAN', found, `Mengunggah dokumen lampiran baru "${lampiranOmit.namaFile}" (${lampiranOmit.tipeDokumen})`);

      console.log("✅ Lampiran berhasil ditambahkan");
    } catch (error) {
      console.error("❌ Gagal menambahkan lampiran:", error);
      alert("Gagal menambahkan lampiran");
    }
  };

  // Delete Attachment
  const handleDeleteLampiran = async (id: string, lampiranId: string) => {
    // Check permission
    if (!hasPermission(currentUserRole, 'delete')) {
      alert('Anda tidak memiliki izin untuk menghapus lampiran');
      return;
    }

    try {
      const found = contracts.find((c: KontrakFisik) => c.id === id);
      if (!found) return;

      const lamp = found.lampiran.find((l: DokumenLampiran) => l.id === lampiranId);
      if (!lamp) return;

      const updatedContract: KontrakFisik = {
        ...found,
        lampiran: found.lampiran.filter((l: DokumenLampiran) => l.id !== lampiranId)
      };

      // Save to Firestore
      await setDoc(doc(db, "kontrak", id), updatedContract);

      // Update local state
      setContracts(contracts.map((c: KontrakFisik) => c.id === id ? updatedContract : c));

      // Log the action
      await addLog('DELETE_LAMPIRAN', found, `Menghapus berkas lampiran "${lamp.namaFile}" dari berkas kontrak`);

      console.log("✅ Lampiran berhasil dihapus");
    } catch (error) {
      console.error("❌ Gagal menghapus lampiran:", error);
      alert("Gagal menghapus lampiran");
    }
  };

  // Helper for Breadcrumbs
  const getBreadcrumbs = () => {
    const base = [<span key="home" className="hover:text-amber-600 transition cursor-pointer" onClick={() => navigate('/dashboard')}>SIM-KONTRAK</span>];
    
    if (location.pathname === '/dashboard') {
      base.push(<span key="divider1">/</span>);
      base.push(<span key="curr" className="font-bold text-slate-800">Dasbor Utama</span>);
    } else if (location.pathname === '/kontrak') {
      base.push(<span key="divider1">/</span>);
      base.push(<span key="curr" className="font-bold text-slate-800">Daftar Kontrak</span>);
    } else if (location.pathname === '/kontrak/tambah') {
      base.push(<span key="divider1">/</span>);
      base.push(<span key="step" className="hover:text-amber-600 transition cursor-pointer" onClick={() => navigate('/kontrak')}>Daftar Kontrak</span>);
      base.push(<span key="divider2">/</span>);
      base.push(<span key="curr" className="font-bold text-slate-800">Input Berkas</span>);
    } else if (location.pathname.startsWith('/kontrak/')) {
      const contractId = location.pathname.split('/')[2];
      const contract = contracts.find(c => c.id === contractId);
      base.push(<span key="divider1">/</span>);
      base.push(<span key="step" className="hover:text-amber-600 transition cursor-pointer" onClick={() => navigate('/kontrak')}>Daftar Kontrak</span>);
      base.push(<span key="divider2">/</span>);
      base.push(<span key="curr" className="font-bold text-slate-800 truncate max-w-[200px]" title={contract?.namaPaket}>{contractId}</span>);
    } else if (location.pathname === '/log-aktivitas') {
      base.push(<span key="divider1">/</span>);
      base.push(<span key="curr" className="font-bold text-slate-800">Log Aktivitas</span>);
    } else if (location.pathname === '/hak-akses') {
      base.push(<span key="divider1">/</span>);
      base.push(<span key="curr" className="font-bold text-slate-800">Hak Akses</span>);
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
        {/* SECTION: MANAJEMEN KONTRAK */}
        <div className="px-5 py-2 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
          Manajemen Kontrak
        </div>
        
        <button
          onClick={() => { navigate('/dashboard'); setIsMobileSidebarOpen(false); }}
          className={`w-full flex items-center px-5 py-2.5 text-xs transition-all ${location.pathname === '/dashboard' ? 'bg-amber-400 text-slate-950 font-bold shadow-inner' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
        >
          <LayoutDashboard className="w-4 h-4 mr-3" />
          Dasbor Pemantauan
        </button>

        <button
          onClick={() => { navigate('/kontrak'); setIsMobileSidebarOpen(false); }}
          className={`w-full flex items-center px-5 py-2.5 text-xs transition-all ${(location.pathname === '/kontrak' || location.pathname.startsWith('/kontrak/')) ? 'bg-amber-400 text-slate-950 font-bold shadow-inner' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
        >
          <Files className="w-4 h-4 mr-3" />
          Daftar Kontrak
        </button>

        {/* Hide "Input Kontrak Baru" for visitors */}
        {currentUserRole !== 'visitor' && (
          <button
            onClick={() => { navigate('/kontrak/tambah'); setIsMobileSidebarOpen(false); }}
            className={`w-full flex items-center px-5 py-2.5 text-xs transition-all ${location.pathname === '/kontrak/tambah' ? 'bg-amber-400 text-slate-950 font-bold shadow-inner' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <FilePlus className="w-4 h-4 mr-3" />
            Input Kontrak Baru
          </button>
        )}

        {/* SECTION: SISTEM */}
        <div className="px-5 py-2 mt-4 text-[10px] uppercase font-bold text-slate-500 tracking-wider border-t border-slate-800 pt-4">
          Sistem
        </div>

        {/* Hide "Log Aktivitas" for visitors */}
        {currentUserRole !== 'visitor' && (
          <button
            onClick={() => { navigate('/log-aktivitas'); setIsMobileSidebarOpen(false); }}
            className={`w-full flex items-center px-5 py-2.5 text-xs transition-all ${location.pathname === '/log-aktivitas' ? 'bg-amber-400 text-slate-950 font-bold shadow-inner' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <History className="w-4 h-4 mr-3" />
            Log Aktivitas
          </button>
        )}

        {/* "Hak Akses" only for Admin */}
        {currentUserRole === 'admin' && (
          <button
            onClick={() => { navigate('/hak-akses'); setIsMobileSidebarOpen(false); }}
            className={`w-full flex items-center px-5 py-2.5 text-xs transition-all ${location.pathname === '/hak-akses' ? 'bg-amber-400 text-slate-950 font-bold shadow-inner' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <Shield className="w-4 h-4 mr-3" />
            Hak Akses
          </button>
        )}

        <div className="px-5 mt-6 py-3 text-xs text-slate-400 space-y-1.5 border-t border-slate-800">
          <p className="font-bold text-slate-300 leading-snug">Seksi Pembangunan Jalan Dan Jembatan</p>
          <p className="text-[10px] text-slate-500 leading-relaxed">Dinas Pekerjaan Umum Dan Perumahan Rakyat</p>
        </div>
      </nav>

      {/* Footer Sesi with Logout */}
      <div className="p-4 bg-slate-950/50 border-t border-slate-800 space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs text-white font-bold border border-slate-600">
            {user?.email?.substring(0, 2).toUpperCase() || 'AD'}
          </div>
          <div className="flex-1">
            <p className="text-white text-xs font-semibold leading-none truncate">{user?.email || 'Admin Dinas'}</p>
            <p className="text-[9px] text-slate-500 mt-1 italic">
              Role: <span className={`font-bold ${currentUserRole === 'admin' ? 'text-red-400' : currentUserRole === 'user' ? 'text-blue-400' : 'text-gray-400'}`}>
                {currentUserRole === 'admin' ? 'Admin' : currentUserRole === 'user' ? 'User' : 'Visitor'}
              </span>
            </p>
          </div>
        </div>
        
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg text-xs font-semibold transition border border-red-500/20"
        >
          <LogOut className="w-3.5 h-3.5" />
          Keluar Sistem
        </button>
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

  // Show loading spinner while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mb-4"></div>
          <p className="text-slate-400 text-sm">Memuat...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!user) {
    return (
      <LoginPage 
        onLogin={handleLogin}
        isLoading={loginLoading}
        error={loginError}
      />
    );
  }

  // Main app (authenticated users only)
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
        </header>

        {/* Content Container with High Density Spacing */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              <Route 
                path="/dashboard" 
                element={
                  <PageTransition>
                    <DashboardPage 
                      contracts={filteredContracts}
                      onSelectContract={handleSelectContract}
                    />
                  </PageTransition>
                } 
              />
              
              <Route 
                path="/kontrak" 
                element={
                  <PageTransition>
                    <ContractsPage 
                      contracts={filteredContracts}
                      onDeleteContract={handleDeleteContract}
                      userRole={currentUserRole}
                    />
                  </PageTransition>
                } 
              />
              
              <Route 
                path="/kontrak/tambah" 
                element={
                  currentUserRole !== 'visitor' ? (
                    <PageTransition>
                      <ContractFormPage 
                        contracts={contracts}
                        onSave={handleSaveContract}
                      />
                    </PageTransition>
                  ) : (
                    <Navigate to="/kontrak" replace />
                  )
                } 
              />
              
              <Route 
                path="/kontrak/:id" 
                element={
                  <PageTransition>
                    <ContractDetailPage 
                      contracts={contracts}
                      onDelete={handleDeleteContract}
                      onUpdateProgress={handleUpdateProgress}
                      onAddAdendum={handleAddAdendum}
                      onAddLampiran={handleAddLampiran}
                      onDeleteLampiran={handleDeleteLampiran}
                      userRole={currentUserRole}
                    />
                  </PageTransition>
                } 
              />
              
              <Route 
                path="/kontrak/:id/edit" 
                element={
                  currentUserRole !== 'visitor' ? (
                    <PageTransition>
                      <ContractFormPage 
                        contracts={contracts}
                        onSave={handleSaveContract}
                      />
                    </PageTransition>
                  ) : (
                    <Navigate to="/kontrak" replace />
                  )
                } 
              />
              
              <Route 
                path="/log-aktivitas" 
                element={
                  currentUserRole !== 'visitor' ? (
                    <PageTransition>
                      <ActivityLogsPage 
                        logs={activityLogs}
                        contracts={contracts}
                        onClearLogs={async () => {
                          // Check permission
                          if (!hasPermission(currentUserRole, 'delete')) {
                            alert('Anda tidak memiliki izin untuk menghapus log aktivitas');
                            return;
                          }
                          
                          if (!confirm('Apakah Anda yakin ingin menghapus semua log aktivitas?')) return;
                          try {
                            const snapshot = await getDocs(collection(db, "activity_logs"));
                            const deletePromises = snapshot.docs.map(docSnap => deleteDoc(doc(db, "activity_logs", docSnap.id)));
                            await Promise.all(deletePromises);
                            setActivityLogs([]);
                            console.log("✅ Semua log aktivitas berhasil dihapus");
                          } catch (error) {
                            console.error("❌ Gagal menghapus log:", error);
                            alert("Gagal menghapus log aktivitas");
                          }
                        }}
                      />
                    </PageTransition>
                  ) : (
                    <Navigate to="/dashboard" replace />
                  )
                } 
              />
              
              <Route 
                path="/hak-akses" 
                element={
                  currentUserRole === 'admin' ? (
                    <PageTransition>
                      <AccessManagementPage 
                        users={appUsers}
                        onUpdateUserRole={handleUpdateUserRole}
                        onAddUser={handleAddUser}
                        onDeleteUser={handleDeleteUser}
                        onRefresh={handleRefreshUsers}
                      />
                    </PageTransition>
                  ) : (
                    <Navigate to="/dashboard" replace />
                  )
                } 
              />
            </Routes>
          </AnimatePresence>
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

// Main App wrapper with Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
