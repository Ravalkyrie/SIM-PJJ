/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ActivityLog, KontrakFisik } from '../types';
import ActivityLogView from '../components/ActivityLogView';

interface ActivityLogsPageProps {
  logs: ActivityLog[];
  contracts: KontrakFisik[];
  onClearLogs: () => void;
}

export default function ActivityLogsPage({ logs, contracts, onClearLogs }: ActivityLogsPageProps) {
  const navigate = useNavigate();

  const handleSelectContract = (id: string) => {
    navigate(`/kontrak/${id}`);
  };

  return (
    <ActivityLogView
      logs={logs}
      contracts={contracts}
      onClearLogs={onClearLogs}
      onSelectContract={handleSelectContract}
    />
  );
}
