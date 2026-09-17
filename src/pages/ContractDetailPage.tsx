/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { KontrakFisik, AdendumKontrak, DokumenLampiran, UserRole, UraianPekerjaan } from '../types';
import ContractDetail from '../components/ContractDetail';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

interface ContractDetailPageProps {
  contracts: KontrakFisik[];
  uraianPekerjaanMap: Map<string, UraianPekerjaan>;
  onDelete: (id: string) => void;
  onUpdateProgress: (id: string, progresFisik: number, progresKeuangan: number, status: KontrakFisik['status'], catatan: string) => void;
  onAddAdendum: (id: string, adendum: Omit<AdendumKontrak, 'id'>) => void;
  onUpdateAdendum: (id: string, adendumId: string, adendum: Omit<AdendumKontrak, 'id'>) => void;
  onDeleteAdendum: (id: string, adendumId: string) => void;
  onAddLampiran: (id: string, lampiran: Omit<DokumenLampiran, 'id'>) => void;
  onDeleteLampiran: (id: string, lampiranId: string) => void;
  userRole?: UserRole;
}

export default function ContractDetailPage({
  contracts,
  uraianPekerjaanMap,
  onDelete,
  onUpdateProgress,
  onAddAdendum,
  onUpdateAdendum,
  onDeleteAdendum,
  onAddLampiran,
  onDeleteLampiran,
  userRole = 'user'
}: ContractDetailPageProps) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();

  const contract = contracts.find(c => c.id === id);
  const uraianPekerjaan = id ? uraianPekerjaanMap.get(id) : undefined;

  // Handle automatic scroll to section
  useEffect(() => {
    const section = searchParams.get('section');
    if (section === 'berkas-digital' && contract) {
      // Wait for DOM to be fully rendered
      const timer = setTimeout(() => {
        const element = document.getElementById('berkas-digital');
        if (element) {
          // Calculate offset for sticky header (if any)
          const headerOffset = 80; // Adjust based on your header height
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });

          // Add subtle highlight effect
          element.classList.add('highlight-section');
          setTimeout(() => {
            element.classList.remove('highlight-section');
          }, 2000);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [searchParams, contract]);

  const handleBack = () => {
    navigate('/kontrak');
  };

  const handleEdit = (contractId: string) => {
    navigate(`/kontrak/${contractId}/edit`);
  };

  const handleDelete = (contractId: string) => {
    onDelete(contractId);
    navigate('/kontrak');
  };

  if (!contract) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="p-6 bg-amber-50 rounded-full border-2 border-amber-200">
          <AlertTriangle className="w-16 h-16 text-amber-600" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-800">Kontrak Tidak Ditemukan</h2>
          <p className="text-sm text-slate-600 max-w-md">
            Paket kontrak dengan ID <span className="font-mono font-bold text-slate-800">{id}</span> tidak ditemukan dalam database sistem.
          </p>
        </div>
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition shadow-md cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Daftar Kontrak
        </button>
      </div>
    );
  }

  return (
    <ContractDetail
      contract={contract}
      uraianPekerjaan={uraianPekerjaan}
      onBack={handleBack}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onUpdateProgress={onUpdateProgress}
      onAddAdendum={onAddAdendum}
      onUpdateAdendum={onUpdateAdendum}
      onDeleteAdendum={onDeleteAdendum}
      onAddLampiran={onAddLampiran}
      onDeleteLampiran={onDeleteLampiran}
      userRole={userRole}
    />
  );
}
