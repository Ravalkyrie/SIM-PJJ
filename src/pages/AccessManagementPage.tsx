/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppUser } from '../types';
import AccessManagementView from '../components/AccessManagementView';

interface AccessManagementPageProps {
  users: AppUser[];
  onUpdateUserRole: (uid: string, newRole: AppUser['role']) => Promise<void>;
  onAddUser: (email: string, role: AppUser['role']) => Promise<void>;
  onDeleteUser: (uid: string) => Promise<void>;
  onRefresh: () => Promise<void>;
}

export default function AccessManagementPage({ 
  users, 
  onUpdateUserRole, 
  onAddUser, 
  onDeleteUser,
  onRefresh 
}: AccessManagementPageProps) {
  const navigate = useNavigate();

  const handleUpdateUserRole = async (uid: string, newRole: AppUser['role']) => {
    await onUpdateUserRole(uid, newRole);
    await onRefresh();
  };

  const handleAddUser = async (email: string, role: AppUser['role']) => {
    await onAddUser(email, role);
    await onRefresh();
  };

  const handleDeleteUser = async (uid: string) => {
    await onDeleteUser(uid);
    await onRefresh();
  };

  return (
    <AccessManagementView
      users={users}
      onUpdateUserRole={handleUpdateUserRole}
      onAddUser={handleAddUser}
      onDeleteUser={handleDeleteUser}
      onBack={() => navigate('/dashboard')}
    />
  );
}
