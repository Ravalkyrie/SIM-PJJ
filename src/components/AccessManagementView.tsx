/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppUser, SUPER_ADMIN_EMAIL } from '../types';
import { Shield, UserCheck, Eye, Crown, AlertTriangle, Edit2, X, Plus, Trash2 } from 'lucide-react';

interface AccessManagementViewProps {
  users: AppUser[];
  onUpdateUserRole: (uid: string, newRole: AppUser['role']) => Promise<void>;
  onAddUser: (email: string, role: AppUser['role']) => Promise<void>;
  onDeleteUser: (uid: string) => Promise<void>;
  onBack: () => void;
}

export default function AccessManagementView({ 
  users, 
  onUpdateUserRole, 
  onAddUser, 
  onDeleteUser,
  onBack 
}: AccessManagementViewProps) {
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [selectedRole, setSelectedRole] = useState<AppUser['role'] | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Add User Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<AppUser['role']>('user');

  const handleOpenEditModal = (user: AppUser) => {
    setEditingUser(user);
    setSelectedRole(user.role);
  };

  const handleCloseEditModal = () => {
    setEditingUser(null);
    setSelectedRole(null);
  };

  const handleOpenAddModal = () => {
    setShowAddModal(true);
    setNewUserEmail('');
    setNewUserRole('user');
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewUserEmail('');
    setNewUserRole('user');
  };

  const handleAddUser = async () => {
    if (!newUserEmail.trim()) {
      alert('Email wajib diisi');
      return;
    }

    setLoading(true);
    try {
      await onAddUser(newUserEmail.trim(), newUserRole);
      handleCloseAddModal();
      alert('✅ User berhasil ditambahkan');
    } catch (error: any) {
      alert(error.message || 'Gagal menambahkan user');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (user: AppUser) => {
    if (user.email === SUPER_ADMIN_EMAIL) {
      alert('Super Admin tidak dapat dihapus');
      return;
    }

    const confirmed = confirm(
      `Apakah Anda yakin ingin menghapus akses untuk:\n\n${user.email}\n\nCatatan: Ini hanya menghapus data hak akses dari sistem, tidak menghapus akun Firebase Authentication.`
    );

    if (!confirmed) return;

    setLoading(true);
    try {
      await onDeleteUser(user.uid);
      alert('✅ User berhasil dihapus dari sistem');
    } catch (error: any) {
      alert(error.message || 'Gagal menghapus user');
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role: AppUser['role']) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-5 h-5 text-red-500" />;
      case 'user':
        return <UserCheck className="w-5 h-5 text-blue-500" />;
      case 'visitor':
        return <Eye className="w-5 h-5 text-gray-500" />;
    }
  };

  const getRoleBadge = (role: AppUser['role']) => {
    const badges = {
      admin: 'bg-red-100 text-red-700 border-red-300',
      user: 'bg-blue-100 text-blue-700 border-blue-300',
      visitor: 'bg-gray-100 text-gray-700 border-gray-300'
    };

    const labels = {
      admin: 'Admin',
      user: 'User',
      visitor: 'Visitor'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${badges[role]}`}>
        {labels[role]}
      </span>
    );
  };

  const handleSaveRole = async () => {
    if (!editingUser || !selectedRole) return;
    
    setLoading(true);
    try {
      await onUpdateUserRole(editingUser.uid, selectedRole);
      handleCloseEditModal();
      alert('✅ Role berhasil diubah');
    } catch (error: any) {
      alert(error.message || 'Gagal mengubah hak akses');
    } finally {
      setLoading(false);
    }
  };

  const isSuperAdmin = (email: string) => email === SUPER_ADMIN_EMAIL;

  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 px-1 sm:px-6">
      {/* Header */}
      <div className="mb-3 sm:mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-1 sm:gap-3 min-w-0">
            <Shield className="w-5 h-5 sm:w-8 sm:h-8 text-slate-700 flex-shrink-0" />
            <h1 className="text-lg sm:text-2xl font-bold text-slate-800 truncate">Manajemen Hak Akses</h1>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-0.5 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-xs sm:text-base whitespace-nowrap flex-shrink-0"
          >
            <Plus className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Tambah User</span>
            <span className="sm:hidden">Tambah</span>
          </button>
        </div>
        <p className="text-sm sm:text-base text-slate-600">Kelola role dan hak akses pengguna aplikasi</p>
      </div>

      {/* Info Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-2 sm:p-4">
          <div className="flex items-center gap-0.5 sm:gap-2 mb-1 sm:mb-2">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0" />
            <h3 className="font-semibold text-red-800 text-xs sm:text-base">Admin</h3>
          </div>
          <p className="text-[9px] sm:text-sm text-red-700 leading-tight line-clamp-2">Akses penuh ke seluruh fitur aplikasi termasuk manajemen hak akses</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-4">
          <div className="flex items-center gap-0.5 sm:gap-2 mb-1 sm:mb-2">
            <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
            <h3 className="font-semibold text-blue-800 text-xs sm:text-base">User</h3>
          </div>
          <p className="text-[9px] sm:text-sm text-blue-700 leading-tight line-clamp-2">Dapat mengelola paket pekerjaan (tambah, edit, hapus)</p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 sm:p-4">
          <div className="flex items-center gap-0.5 sm:gap-2 mb-1 sm:mb-2">
            <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
            <h3 className="font-semibold text-gray-800 text-xs sm:text-base">Visitor</h3>
          </div>
          <p className="text-[9px] sm:text-sm text-gray-700 leading-tight line-clamp-2">Hanya dapat melihat data (read-only)</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed min-w-[640px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-1 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-slate-700 uppercase tracking-wider w-[25%]">Pengguna
                </th>
                <th className="px-1 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-slate-700 uppercase tracking-wider w-[30%]">Email
                </th>
                <th className="px-1 sm:px-4 py-2 sm:py-3 text-center text-[10px] sm:text-xs font-medium text-slate-700 uppercase tracking-wider w-[20%]">Role
                </th>
                <th className="px-1 sm:px-4 py-2 sm:py-3 text-center text-[10px] sm:text-xs font-medium text-slate-700 uppercase tracking-wider w-[25%] sm:w-auto">Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {users.map((user) => {
                const isSuperAdminUser = isSuperAdmin(user.email);

                return (
                  <tr key={user.uid} className="hover:bg-slate-50">
                    <td className="px-0.5 sm:px-4 py-2 sm:py-3">
                      <div className="flex items-center gap-1 sm:gap-0.5 sm:gap-2 min-w-0">
                        <div className="flex-shrink-0 hidden sm:block">{getRoleIcon(user.role)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1">
                            <p className="font-medium text-slate-900 text-[10px] sm:text-sm truncate max-w-[70px] sm:max-w-none">{user.displayName || 'User'}</p>
                            {isSuperAdminUser && (
                              <Crown className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 flex-shrink-0" aria-label="Super Admin" />
                            )}
                          </div>
                          <p className="text-[9px] sm:text-xs text-slate-500 truncate max-w-[90px] sm:max-w-none">
                            {user.createdAt ? `${new Date(user.createdAt).toLocaleDateString('id-ID')}` : ''}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-0.5 sm:px-4 py-2 sm:py-3">
                      <p className="text-[10px] sm:text-sm text-slate-700 truncate max-w-[110px] sm:max-w-none">{user.email}</p>
                    </td>
                    <td className="px-0.5 sm:px-4 py-2 sm:py-3 text-center">
                      <div className="flex justify-center">
                        {getRoleBadge(user.role)}
                      </div>
                    </td>
                    <td className="px-0.5 sm:px-4 py-2 sm:py-3 text-center">
                      <div className="flex items-center justify-center gap-0.5 sm:gap-0.5 sm:gap-2">
                        <button
                          onClick={() => handleOpenEditModal(user)}
                          disabled={loading || isSuperAdminUser}
                          className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                          title={isSuperAdminUser ? "Super Admin tidak dapat diedit" : "Edit Role"}
                        >
                          <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          disabled={loading || isSuperAdminUser}
                          className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                          title={isSuperAdminUser ? "Super Admin tidak dapat dihapus" : "Hapus User"}
                        >
                          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-slate-400" />
            <p>Belum ada pengguna terdaftar</p>
          </div>
        )}
      </div>

      {/* Warning Note */}
      <div className="mt-4 sm:mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-2 sm:p-4 overflow-hidden">
        <div className="flex gap-2">
          <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-yellow-800 min-w-0 flex-1">
            <p className="font-semibold mb-1">Perhatian:</p>
            <ul className="list-disc list-outside space-y-1 pl-4">
              <li className="break-words">Super Admin ({SUPER_ADMIN_EMAIL}) tidak dapat diubah atau dihapus</li>
              <li className="break-words">User ditambahkan secara manual melalui tombol "Tambah User"</li>
              <li className="break-words">Saat login pertama, user akan terhubung dengan akun Firebase Auth mereka</li>
              <li className="break-words">Perubahan role akan langsung berlaku saat pengguna login berikutnya</li>
              <li className="break-words">Hapus user hanya menghapus data hak akses, tidak menghapus akun Firebase Auth</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Edit Role Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800">Edit Hak Akses User</h3>
              <button
                onClick={handleCloseEditModal}
                className="text-slate-400 hover:text-slate-600"
                disabled={loading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <div className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-800">
                  {editingUser.email}
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Role / Hak Akses
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 border-2 border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition">
                    <input
                      type="radio"
                      name="role"
                      value="admin"
                      checked={selectedRole === 'admin'}
                      onChange={(e) => setSelectedRole(e.target.value as AppUser['role'])}
                      className="w-4 h-4 text-red-600"
                      disabled={loading}
                    />
                    <div className="flex items-center gap-0.5 sm:gap-2">
                      <Shield className="w-5 h-5 text-red-500" />
                      <div>
                        <div className="font-medium text-slate-800">Admin</div>
                        <div className="text-xs text-slate-500">Akses penuh ke semua fitur</div>
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 border-2 border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition">
                    <input
                      type="radio"
                      name="role"
                      value="user"
                      checked={selectedRole === 'user'}
                      onChange={(e) => setSelectedRole(e.target.value as AppUser['role'])}
                      className="w-4 h-4 text-blue-600"
                      disabled={loading}
                    />
                    <div className="flex items-center gap-0.5 sm:gap-2">
                      <UserCheck className="w-5 h-5 text-blue-500" />
                      <div>
                        <div className="font-medium text-slate-800">User</div>
                        <div className="text-xs text-slate-500">Dapat mengelola kontrak</div>
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 border-2 border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition">
                    <input
                      type="radio"
                      name="role"
                      value="visitor"
                      checked={selectedRole === 'visitor'}
                      onChange={(e) => setSelectedRole(e.target.value as AppUser['role'])}
                      className="w-4 h-4 text-gray-600"
                      disabled={loading}
                    />
                    <div className="flex items-center gap-0.5 sm:gap-2">
                      <Eye className="w-5 h-5 text-gray-500" />
                      <div>
                        <div className="font-medium text-slate-800">Visitor</div>
                        <div className="text-xs text-slate-500">Hanya dapat melihat data</div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t border-slate-200">
              <button
                onClick={handleCloseEditModal}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Batal
              </button>
              <button
                onClick={handleSaveRole}
                disabled={loading || !selectedRole}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800">Tambah User Baru</h3>
              <button
                onClick={handleCloseAddModal}
                className="text-slate-400 hover:text-slate-600"
                disabled={loading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
                <p className="text-xs text-slate-500 mt-1">
                  User akan ditambahkan ke sistem dengan email ini
                </p>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Role / Hak Akses
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-0.5 sm:gap-2 sm:gap-3 p-2 sm:p-3 border-2 border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition">
                    <input
                      type="radio"
                      name="newUserRole"
                      value="admin"
                      checked={newUserRole === 'admin'}
                      onChange={(e) => setNewUserRole(e.target.value as AppUser['role'])}
                      className="w-4 h-4 text-red-600 flex-shrink-0"
                      disabled={loading}
                    />
                    <div className="flex items-center gap-0.5 sm:gap-2 min-w-0">
                      <Shield className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-red-500 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="font-medium text-slate-800 text-sm sm:text-base">Admin</div>
                        <div className="text-xs text-slate-500 truncate">Akses penuh ke semua fitur</div>
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center gap-0.5 sm:gap-2 sm:gap-3 p-2 sm:p-3 border-2 border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition">
                    <input
                      type="radio"
                      name="newUserRole"
                      value="user"
                      checked={newUserRole === 'user'}
                      onChange={(e) => setNewUserRole(e.target.value as AppUser['role'])}
                      className="w-4 h-4 text-blue-600 flex-shrink-0"
                      disabled={loading}
                    />
                    <div className="flex items-center gap-0.5 sm:gap-2 min-w-0">
                      <UserCheck className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="font-medium text-slate-800 text-sm sm:text-base">User</div>
                        <div className="text-xs text-slate-500 truncate">Dapat mengelola kontrak</div>
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center gap-0.5 sm:gap-2 sm:gap-3 p-2 sm:p-3 border-2 border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition">
                    <input
                      type="radio"
                      name="newUserRole"
                      value="visitor"
                      checked={newUserRole === 'visitor'}
                      onChange={(e) => setNewUserRole(e.target.value as AppUser['role'])}
                      className="w-4 h-4 text-gray-600 flex-shrink-0"
                      disabled={loading}
                    />
                    <div className="flex items-center gap-0.5 sm:gap-2 min-w-0">
                      <Eye className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="font-medium text-slate-800 text-sm sm:text-base">Visitor</div>
                        <div className="text-xs text-slate-500 truncate">Hanya dapat melihat data</div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t border-slate-200">
              <button
                onClick={handleCloseAddModal}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Batal
              </button>
              <button
                onClick={handleAddUser}
                disabled={loading || !newUserEmail.trim()}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Menambahkan...' : 'Tambah User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}









