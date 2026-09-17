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
  userRole?: 'admin' | 'user' | 'visitor';
}

export default function ActivityLogsPage({ logs, contracts, onClearLogs, userRole }: ActivityLogsPageProps) {
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
      userRole={userRole}
    />
  );
}
