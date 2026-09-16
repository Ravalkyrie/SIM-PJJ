/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Breadcrumb() {
  const location = useLocation();
  const navigate = useNavigate();

  const getBreadcrumbs = () => {
    const path = location.pathname;
    
    if (path === '/dashboard') {
      return [
        { label: 'SIM-KONTRAK', onClick: () => navigate('/dashboard') },
        { label: 'Dasbor Utama', active: true }
      ];
    } else if (path === '/kontrak') {
      return [
        { label: 'SIM-KONTRAK', onClick: () => navigate('/dashboard') },
        { label: 'Data Kontrak', active: true }
      ];
    } else if (path === '/kontrak/tambah') {
      return [
        { label: 'SIM-KONTRAK', onClick: () => navigate('/dashboard') },
        { label: 'Data Kontrak', onClick: () => navigate('/kontrak') },
        { label: 'Tambah Kontrak', active: true }
      ];
    } else if (path.match(/^\/kontrak\/[^/]+\/edit$/)) {
      return [
        { label: 'SIM-KONTRAK', onClick: () => navigate('/dashboard') },
        { label: 'Data Kontrak', onClick: () => navigate('/kontrak') },
        { label: 'Detail Kontrak', onClick: () => navigate(path.replace('/edit', '')) },
        { label: 'Edit Kontrak', active: true }
      ];
    } else if (path.match(/^\/kontrak\/[^/]+$/)) {
      return [
        { label: 'SIM-KONTRAK', onClick: () => navigate('/dashboard') },
        { label: 'Data Kontrak', onClick: () => navigate('/kontrak') },
        { label: 'Detail Kontrak', active: true }
      ];
    } else if (path === '/log-aktivitas') {
      return [
        { label: 'SIM-KONTRAK', onClick: () => navigate('/dashboard') },
        { label: 'Log Aktivitas', active: true }
      ];
    }

    return [{ label: 'SIM-KONTRAK', active: true }];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="flex items-center gap-2 text-xs overflow-x-auto whitespace-nowrap pb-1">
      {breadcrumbs.map((crumb, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && <span className="text-slate-400 shrink-0">/</span>}
          {crumb.active ? (
            <span className="font-bold text-slate-800 break-words" style={{wordBreak: 'break-word'}}>{crumb.label}</span>
          ) : (
            <button
              onClick={crumb.onClick}
              className="hover:text-amber-600 transition cursor-pointer text-slate-600 shrink-0"
            >
              {crumb.label}
            </button>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
