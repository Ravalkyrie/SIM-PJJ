/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Files, History } from 'lucide-react';

interface SidebarNavProps {
  isSidebarOpen: boolean;
}

export default function SidebarNav({ isSidebarOpen }: SidebarNavProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: 'Dasbor Utama', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'kontrak', label: 'Data Kontrak', icon: Files, path: '/kontrak' },
    { id: 'logs', label: 'Log Aktivitas', icon: History, path: '/log-aktivitas' },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === path;
    if (path === '/kontrak') return location.pathname.startsWith('/kontrak');
    if (path === '/log-aktivitas') return location.pathname === path;
    return false;
  };

  return (
    <nav className="mt-6 space-y-1 px-3">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path);
        
        return (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              active
                ? 'bg-amber-500 text-slate-900 shadow-md'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Icon className={`w-5 h-5 shrink-0 ${active ? 'text-slate-900' : ''}`} />
            {isSidebarOpen && <span className="truncate">{item.label}</span>}
          </button>
        );
      })}
    </nav>
  );
}
