/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { KontrakFisik } from '../types';

interface ContractPrintDocumentProps {
  contract: KontrakFisik;
}

export default function ContractPrintDocument({ contract }: ContractPrintDocumentProps) {
  // Format currency with safe handling
  const formatRupiah = (value: number | undefined): string => {
    if (value === undefined || value === null || isNaN(value)) {
      return 'Rp -';
    }
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format date to Indonesian format
  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  // Use local logo from public folder
  const logoUrl = `${import.meta.env.BASE_URL || '/'}images/logo-pupr.png`;

  return (
    <div 
      id="print-document" 
      style={{
        width: '297mm',
        height: '210mm',
        margin: '0 auto',
        padding: '8mm 12mm',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        pageBreakInside: 'avoid',
        breakInside: 'avoid',
        backgroundColor: '#ffffff',
        color: '#0f172a',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div style={{
        borderBottom: '2px solid #0f172a',
        paddingBottom: '8px',
        marginBottom: '8px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#ffffff',
            padding: '4px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            border: '1px solid #cbd5e1',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          }}>
            <img 
              src={logoUrl}
              alt="Logo PUPR" 
              style={{
                width: '52px',
                height: '52px',
                objectFit: 'contain',
              }}
            />
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#d97706',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              lineHeight: 1.2,
              margin: 0,
            }}>
              Dinas Pekerjaan Umum dan Perumahan Rakyat
            </p>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.025em',
              lineHeight: 1.2,
              margin: '4px 0 0 0',
            }}>
              BIDANG BINA MARGA PROVINSI NTT
            </h2>
            <p style={{
              fontSize: '10px',
              fontFamily: 'ui-monospace, monospace',
              color: '#64748b',
              letterSpacing: '0.05em',
              margin: '4px 0 0 0',
            }}>
              Lembar Monitoring Dokumen Kontrak Pekerjaan Fisik
            </p>
          </div>
        </div>
      </div>

      {/* Identitas Kontrak Header */}
      <div style={{
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '4px',
        padding: '10px 14px',
        marginBottom: '10px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ flex: 1 }}>
          <p style={{
            fontSize: '11px',
            fontWeight: 700,
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            margin: '0 0 4px 0',
          }}>
            Nomor Registrasi Kontrak
          </p>
          <p style={{
            fontFamily: 'ui-monospace, monospace',
            fontSize: '15px',
            fontWeight: 700,
            color: '#1e293b',
            lineHeight: 1.2,
            margin: 0,
          }}>
            {contract.noKontrak}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span style={{
            fontSize: '12px',
            fontWeight: 700,
            backgroundColor: '#ffffff',
            color: '#334155',
            padding: '6px 12px',
            borderRadius: '4px',
            border: '1px solid #e2e8f0',
            whiteSpace: 'nowrap',
          }}>
            TA {contract.tahunAnggaran}
          </span>
          <span style={{
            fontSize: '12px',
            fontWeight: 700,
            backgroundColor: '#fbbf24',
            color: '#0a0a0a',
            padding: '6px 12px',
            borderRadius: '4px',
            whiteSpace: 'nowrap',
          }}>
            DANA {contract.sumberDana}
          </span>
        </div>
      </div>

      {/* Nama Paket Pekerjaan - ENLARGED 2X */}
      <div style={{ marginBottom: '10px' }}>
        <h3 style={{
          fontSize: '11px',
          fontWeight: 700,
          color: '#94a3b8',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          margin: '0 0 4px 0',
        }}>
          Nama Paket Pekerjaan
        </h3>
        <p style={{
          fontSize: '28px',
          fontWeight: 800,
          color: '#0f172a',
          lineHeight: 1.3,
          margin: 0,
          maxWidth: '100%',
          wordWrap: 'break-word',
        }}>
          {contract.namaPaket}
        </p>
      </div>

      {/* Main Content Grid - 2 columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Lokasi & Wilayah - CENTER ALIGNED */}
          <div>
            <h4 style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#1e293b',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              margin: '0 0 6px 0',
            }}>
              📍 Lokasi & Wilayah
            </h4>
            <div style={{
              backgroundColor: '#f8fafc',
              padding: '10px 12px',
              borderRadius: '4px',
              border: '1px solid #e2e8f0',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, minWidth: '100px' }}>Kab/Kota</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>: {contract.kabupatenKota}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, minWidth: '100px', flexShrink: 0 }}>Ruas Jalan</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', lineHeight: 1.4 }}>: {contract.lokasiRuas}</span>
                </div>
                {contract.panjangEfektif && (
                  <div style={{ display: 'flex' }}>
                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, minWidth: '100px' }}>Pj. Efektif</span>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>: {contract.panjangEfektif}</span>
                  </div>
                )}
                {contract.kegiatanPreservasi && (
                  <div style={{ display: 'flex' }}>
                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, minWidth: '100px' }}>Preservasi</span>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>: {contract.kegiatanPreservasi}</span>
                  </div>
                )}
                {contract.waktuPemeliharaan && (
                  <div style={{ display: 'flex' }}>
                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, minWidth: '100px' }}>Wkt. Pemeliharaan</span>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>: {contract.waktuPemeliharaan}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Administrasi Pekerjaan & Stakeholders */}
          <div>
            <h4 style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#1e293b',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              margin: '0 0 6px 0',
            }}>
              💼 Administrasi Pekerjaan & Stakeholders
            </h4>
            <div style={{
              backgroundColor: '#f8fafc',
              padding: '10px 12px',
              borderRadius: '4px',
              border: '1px solid #e2e8f0',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div>
                  <p style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, margin: '0 0 3px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Penyedia Jasa (Kontraktor)
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0, lineHeight: 1.3 }}>
                    {contract.kontraktorPelaksana}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, margin: '0 0 3px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Konsultan Pengawas
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0, lineHeight: 1.3 }}>
                    {contract.konsultanPengawas}
                  </p>
                </div>
                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '6px', marginTop: '2px' }}>
                  <p style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, margin: '0 0 3px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    PPK
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: '0 0 2px 0', lineHeight: 1.3 }}>
                    {contract.pejabatPembuatKomitmen}
                  </p>
                  <p style={{ fontSize: '11px', fontFamily: 'ui-monospace, monospace', color: '#64748b', margin: 0 }}>
                    NIP: {contract.nipPpk}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Rincian Keuangan - CONSISTENT TYPOGRAPHY */}
          <div>
            <h4 style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#1e293b',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              margin: '0 0 6px 0',
            }}>
              💰 Rincian Keuangan
            </h4>
            <div style={{
              backgroundColor: '#f8fafc',
              padding: '10px 12px',
              borderRadius: '4px',
              border: '1px solid #e2e8f0',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, minWidth: '110px' }}>Anggaran DPA</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>: {formatRupiah(contract.nilaiHps)}</span>
                </div>
                <div style={{ display: 'flex' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, minWidth: '110px' }}>Nilai Kontrak</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>: {formatRupiah(contract.nilaiKontrak)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, minWidth: '110px', flexShrink: 0 }}>Tanggal Kontrak</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>: {formatDate(contract.tanggalKontrak)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Masa Waktu Pelaksanaan - WITHOUT Target Selesai */}
          <div>
            <h4 style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#1e293b',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              margin: '0 0 6px 0',
            }}>
              ⏱️ Masa Waktu Pelaksanaan
            </h4>
            <div style={{
              backgroundColor: '#f8fafc',
              padding: '10px 12px',
              borderRadius: '4px',
              border: '1px solid #e2e8f0',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, minWidth: '140px' }}>Jangka Waktu</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>: {contract.jangkaWaktu} Hari Kalender</span>
                </div>
                <div style={{ display: 'flex' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, minWidth: '140px' }}>Tanggal Mulai (SPMK)</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>: {formatDate(contract.tanggalMulai)}</span>
                </div>
                {contract.nomorSpmk && (
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, minWidth: '140px', flexShrink: 0 }}>No. SPMK</span>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', lineHeight: 1.4, wordBreak: 'break-all' }}>: {contract.nomorSpmk}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ADENDUM KONTRAK - NEW SECTION */}
          <div>
            <h4 style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#1e293b',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              margin: '0 0 6px 0',
            }}>
              📋 Adendum Kontrak
            </h4>
            <div style={{
              backgroundColor: '#f8fafc',
              padding: '10px 12px',
              borderRadius: '4px',
              border: '1px solid #e2e8f0',
            }}>
              {contract.adendum && contract.adendum.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {contract.adendum.map((adn, index) => (
                    <div key={adn.id || index} style={{ display: 'flex', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, minWidth: '100px', flexShrink: 0 }}>
                        {adn.keterangan && adn.keterangan.includes(':') ? adn.keterangan.split(':')[0] : `ADENDUM ${index + 1}`}
                      </span>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', lineHeight: 1.4, wordBreak: 'break-all' }}>
                        : {adn.noAdendum}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0, fontStyle: 'italic' }}>
                  Tidak ada adendum
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Catatan Evaluasi/Rekomendasi - Full width */}
      {contract.catatanPekerjaan && (
        <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '2px solid #f1f5f9' }}>
          <h4 style={{
            fontSize: '13px',
            fontWeight: 700,
            color: '#1e293b',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            margin: '0 0 6px 0',
          }}>
            Catatan Evaluasi / Rekomendasi Lapangan
          </h4>
          <div style={{
            backgroundColor: '#fffbeb',
            border: '1px solid #fde68a',
            padding: '10px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#334155',
            lineHeight: 1.6,
          }}>
            {contract.catatanPekerjaan}
          </div>
        </div>
      )}

      {/* NO FOOTER - Removed as per requirements */}
    </div>
  );
}

