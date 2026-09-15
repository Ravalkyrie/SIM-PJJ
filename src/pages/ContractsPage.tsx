/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { KontrakFisik, UserRole } from '../types';
import ContractList from '../components/ContractList';

interface ContractsPageProps {
  contracts: KontrakFisik[];
  onDeleteContract: (id: string) => void;
  onDeleteAllContracts?: () => void;
  userRole?: UserRole;
}

export default function ContractsPage({ 
  contracts, 
  onDeleteContract,
  onDeleteAllContracts,
  userRole = 'user'
}: ContractsPageProps) {
  const navigate = useNavigate();

  const handleSelectContract = (id: string) => {
    navigate(`/kontrak/${id}`);
  };

  const handleNavigateToInput = () => {
    navigate('/kontrak/tambah');
  };

  return (
    <ContractList 
      contracts={contracts}
      onSelectContract={handleSelectContract}
      onNavigateToInput={handleNavigateToInput}
      onDeleteContract={onDeleteContract}
      onDeleteAllContracts={onDeleteAllContracts}
      userRole={userRole}
    />
  );
}
