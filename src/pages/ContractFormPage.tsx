/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { KontrakFisik } from '../types';
import ContractForm from '../components/ContractForm';

interface ContractFormPageProps {
  contracts: KontrakFisik[];
  onSave: (contract: KontrakFisik) => void;
}

export default function ContractFormPage({ contracts, onSave }: ContractFormPageProps) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const isEdit = !!id;
  const contractToEdit = isEdit ? contracts.find(c => c.id === id) : undefined;

  const handleSave = (contract: KontrakFisik) => {
    onSave(contract);
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
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}
