/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { KontrakFisik } from '../types';
import DashboardView from '../components/DashboardView';

interface DashboardPageProps {
  contracts: KontrakFisik[];
  onSelectContract: (id: string) => void;
}

export default function DashboardPage({ contracts, onSelectContract }: DashboardPageProps) {
  const navigate = useNavigate();

  const handleNavigateToTab = (tab: 'list' | 'input') => {
    if (tab === 'list') {
      navigate('/kontrak');
    } else if (tab === 'input') {
      navigate('/kontrak/tambah');
    }
  };

  return (
    <DashboardView 
      contracts={contracts}
      onSelectContract={onSelectContract}
      onNavigateToTab={handleNavigateToTab}
    />
  );
}
