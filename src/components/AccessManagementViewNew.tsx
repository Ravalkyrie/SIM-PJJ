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

  const isSuperAdmin = (email: string) => email === SUPER_ADMIN_EMAIL;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-slate-700" />
            <h1 className="text-2xl font-bold text-slate-800">Manajemen Hak Akses</h1>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            <Plus className="w-5 h-5" />
            Tambah User
          </button>
        </div>
        <p className="text-slate-600">Kelola role dan hak akses pengguna aplikasi</p>
      </div>

      {/* Info Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-red-800">Admin</h3>
          </div>
          <p className="text-sm text-red-700">Akses penuh ke seluruh fitur aplikasi termasuk manajemen hak akses</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <UserCheck className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-blue-800">User</h3>
          </div>
          <p className="text-sm text-blue-700">Dapat mengelola kontrak dan melihat log aktivitas</p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-800">Visitor</h3>
          </div>
          <p className="text-sm text-gray-700">Hanya dapat melihat data paket pekerjaan</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left p-4 font-semibold text-slate-700">Email</th>
              <th className="text-left p-4 font-semibold text-slate-700">Hak Akses</th>
              <th className="text-right p-4 font-semibold text-slate-700">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center p-8 text-slate-500">
                  Belum ada user yang ditambahkan. Klik "Tambah User" untuk menambah user baru.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.uid} className="border-b border-slate-100 hover:bg-slate-50 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {isSuperAdmin(user.email) && (
                        <Crown className="w-5 h-5 text-yellow-500" />
                      )}
                      <span className="font-medium text-slate-800">{user.email}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2 justify-end">
                      {isSuperAdmin(user.email) ? (
                        <div className="flex items-center gap-2 text-amber-600 text-sm">
                          <AlertTriangle className="w-4 h-4" />
                          <span>Tidak dapat diubah</span>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => handleOpenEditModal(user)}
                            disabled={loading}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user)}
                            disabled={loading}
                            className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                            Hapus
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <Plus className="w-6 h-6 text-blue-500" />
                <h2 className="text-xl font-bold text-slate-800">Tambah User Baru</h2>
              </div>
              <button
                onClick={handleCloseAddModal}
                disabled={loading}
                className="p-1 hover:bg-slate-100 rounded-lg transition disabled:opacity-50"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email User <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="contoh@email.com"
                  disabled={loading}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Masukkan email user yang akan diberikan akses
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Hak Akses <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 border-2 border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition">
                    <input
                      type="radio"
                      name="newUserRole"
                      value="admin"
                      checked={newUserRole === 'admin'}
                      onChange={(e) => setNewUserRole(e.target.value as AppUser['role'])}
                      disabled={loading}
                      className="w-4 h-4 text-red-600"
                    />
                    <div className="flex items-center gap-2">
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
                      name="newUserRole"
                      value="user"
                      checked={newUserRole === 'user'}
                      onChange={(e) => setNewUserRole(e.target.value as AppUser['role'])}
                      disabled={loading}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div className="flex items-center gap-2">
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
                      name="newUserRole"
                      value="visitor"
                      checked={newUserRole === 'visitor'}
                      onChange={(e) => setNewUserRole(e.target.value as AppUser['role'])}
                      disabled={loading}
                      className="w-4 h-4 text-gray-600"
                    />
                    <div className="flex items-center gap-2">
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
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <Edit2 className="w-6 h-6 text-blue-500" />
                <h2 className="text-xl font-bold text-slate-800">Edit User</h2>
              </div>
              <button
                onClick={handleCloseEditModal}
                disabled={loading}
                className="p-1 hover:bg-slate-100 rounded-lg transition disabled:opacity-50"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email User
                  </label>
                  <input
                    type="email"
                    value={editingUser.email}
                    disabled
                    className="w-full px-4 py-2 bg-slate-100 border border-slate-300 rounded-lg text-slate-600 cursor-not-allowed"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Email tidak dapat diubah
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Hak Akses
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
                      <div className="flex items-center gap-2">
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
                      <div className="flex items-center gap-2">
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
                      <div className="flex items-center gap-2">
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
            </div>

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
    </div>
  );
}

