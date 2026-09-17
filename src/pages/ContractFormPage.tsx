/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { KontrakFisik, UraianPekerjaan } from '../types';
import ContractForm from '../components/ContractForm';

interface ContractFormPageProps {
  contracts: KontrakFisik[];
  uraianPekerjaanMap: Map<string, UraianPekerjaan>;
  onSave: (contract: KontrakFisik, uraianPekerjaan: UraianPekerjaan) => void;
}

export default function ContractFormPage({ contracts, uraianPekerjaanMap, onSave }: ContractFormPageProps) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const isEdit = !!id;
  const contractToEdit = isEdit ? contracts.find(c => c.id === id) : undefined;
  const uraianPekerjaanToEdit = isEdit && id ? uraianPekerjaanMap.get(id) : undefined;

  const handleSave = (contract: KontrakFisik, uraianPekerjaan: UraianPekerjaan) => {
    onSave(contract, uraianPekerjaan);
    if (isEdit) {
      navigate(`/kontrak/${contract.id}`);
    } else {
      navigate('/kontrak');
    }
  };

  const handleCancel = () => {
    if (isEdit && contractToEdit) {
      navigate(`/kontrak/${id}`);
    } else {
      navigate('/kontrak');
    }
  };

  return (
    <ContractForm
      initialContract={contractToEdit}
      initialUraianPekerjaan={uraianPekerjaanToEdit}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}
