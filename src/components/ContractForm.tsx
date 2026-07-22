/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { KontrakFisik, KABUPATEN_PRESETS } from '../types';
import { FileText, Coins, MapPin, Calendar, Clock, User, Check, ArrowLeft, RefreshCcw, AlertTriangle } from 'lucide-react';

interface ContractFormProps {
  initialContract?: KontrakFisik;
  onSave: (contract: KontrakFisik) => void;
  onCancel: () => void;
}

const addDaysToDate = (dateStr: string, days: number): string => {
  if (!dateStr || isNaN(days) || days <= 0) return '';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  } catch (e) {
    return '';
  }
};

export default function ContractForm({ initialContract, onSave, onCancel }: ContractFormProps) {
  const isEdit = !!initialContract;

  // Form Fields
  const [noKontrak, setNoKontrak] = useState('');
  const [tanggalKontrak, setTanggalKontrak] = useState('');
  const [namaPaket, setNamaPaket] = useState('');
  const [lokasiRuas, setLokasiRuas] = useState('');
  const [panjangEfektif, setPanjangEfektif] = useState('');
  const [kabupatenKota, setKabupatenKota] = useState(KABUPATEN_PRESETS[0]);
  const [nilaiKontrak, setNilaiKontrak] = useState<number | ''>('');
  const [nilaiHps, setNilaiHps] = useState<number | ''>('');
  const [sumberDana, setSumberDana] = useState<string>('DAU');
  const [tahunAnggaran, setTahunAnggaran] = useState<number>(new Date().getFullYear());
  const [kontraktorPelaksana, setKontraktorPelaksana] = useState('');
  const [konsultanPengawas, setKonsultanPengawas] = useState('');
  const [jangkaWaktu, setJangkaWaktu] = useState<number | ''>('');
  const [tanggalMulai, setTanggalMulai] = useState('');
  const [tanggalSelesai, setTanggalSelesai] = useState('');
  const [nomorSpmk, setNomorSpmk] = useState('');
  const [progresFisik, setProgresFisik] = useState<number>(0);
  const [progresKeuangan, setProgresKeuangan] = useState<number>(0);
  const [status, setStatus] = useState<KontrakFisik['status']>('Persiapan');
  const [pejabatPembuatKomitmen, setPejabatPembuatKomitmen] = useState('');
  const [nipPpk, setNipPpk] = useState('');
  const [catatanPekerjaan, setCatatanPekerjaan] = useState('');
  const [kegiatanPreservasi, setKegiatanPreservasi] = useState('');
  const [waktuPemeliharaan, setWaktuPemeliharaan] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Auto calculate target completion date
  useEffect(() => {
    if (tanggalMulai && jangkaWaktu && typeof jangkaWaktu === 'number') {
      const calculated = addDaysToDate(tanggalMulai, jangkaWaktu);
      if (calculated) {
        setTanggalSelesai(calculated);
      }
    }
  }, [tanggalMulai, jangkaWaktu]);

  // Load initial values for editing
  useEffect(() => {
    if (initialContract) {
      setNoKontrak(initialContract.noKontrak);
      setTanggalKontrak(initialContract.tanggalKontrak);
      setNamaPaket(initialContract.namaPaket);
      setLokasiRuas(initialContract.lokasiRuas);
      setPanjangEfektif(initialContract.panjangEfektif || '');
      setKabupatenKota(initialContract.kabupatenKota);
      setNilaiKontrak(initialContract.nilaiKontrak);
      setNilaiHps(initialContract.nilaiHps);
      setSumberDana(initialContract.sumberDana);
      setTahunAnggaran(initialContract.tahunAnggaran);
      setKontraktorPelaksana(initialContract.kontraktorPelaksana);
      setKonsultanPengawas(initialContract.konsultanPengawas);
      setJangkaWaktu(initialContract.jangkaWaktu);
      setTanggalMulai(initialContract.tanggalMulai);
      setNomorSpmk(initialContract.nomorSpmk || '');
      setTanggalSelesai(initialContract.tanggalSelesai);
      setProgresFisik(initialContract.progresFisik);
      setProgresKeuangan(initialContract.progresKeuangan);
      setStatus(initialContract.status);
      setPejabatPembuatKomitmen(initialContract.pejabatPembuatKomitmen);
      setNipPpk(initialContract.nipPpk);
      setCatatanPekerjaan(initialContract.catatanPekerjaan);
      setKegiatanPreservasi(initialContract.kegiatanPreservasi || '');
      setWaktuPemeliharaan(initialContract.waktuPemeliharaan || '');
    } else {
      setNoKontrak('');
      setTanggalKontrak('');
      setNamaPaket('');
      setLokasiRuas('');
      setPanjangEfektif('');
      setKabupatenKota(KABUPATEN_PRESETS[0] || 'Kupang');
      setNilaiKontrak('');
      setNilaiHps('');
      setSumberDana('DAU');
      setTahunAnggaran(new Date().getFullYear());
      setKontraktorPelaksana('');
      setKonsultanPengawas('');
      setJangkaWaktu('');
      setTanggalMulai('');
      setTanggalSelesai('');
      setProgresFisik(0);
      setProgresKeuangan(0);
      setStatus('Persiapan');
      setPejabatPembuatKomitmen('');
      setNipPpk('');
      setCatatanPekerjaan('');
      setKegiatanPreservasi('');
    }
  }, [initialContract]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!noKontrak || !namaPaket || !lokasiRuas || !nilaiKontrak || !nilaiHps || !jangkaWaktu || !tanggalMulai) {
      setErrorMsg("Mohon lengkapi kolom isian yang bertanda bintang (*)");
      // Scroll smoothly to top of form so user sees the message
      const element = document.getElementById("contract-form-title");
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    setErrorMsg(null);

    const savedContract: KontrakFisik = {
      id: initialContract?.id || `KTR-${Date.now()}`,
      noKontrak,
      tanggalKontrak: tanggalKontrak || new Date().toISOString().split('T')[0],
      namaPaket,
      lokasiRuas,
      kabupatenKota,
      nilaiKontrak: Number(nilaiKontrak),
      nilaiHps: Number(nilaiHps),
      sumberDana,
      tahunAnggaran: Number(tahunAnggaran),
      kontraktorPelaksana,
      konsultanPengawas,
      jangkaWaktu: Number(jangkaWaktu),
      tanggalMulai,
      nomorSpmk: nomorSpmk || undefined,
      tanggalSelesai: tanggalSelesai || addDaysToDate(tanggalMulai, Number(jangkaWaktu)),
      progresFisik,
      progresKeuangan,
      status,
      pejabatPembuatKomitmen,
      nipPpk,
      catatanPekerjaan,
      kegiatanPreservasi,
      panjangEfektif: panjangEfektif || '',
      waktuPemeliharaan: waktuPemeliharaan || undefined,
      adendum: initialContract?.adendum || [],
      lampiran: initialContract?.lampiran || []
    };

    onSave(savedContract);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Form Header */}
      <div id="contract-form-title" className="flex items-center gap-3 pb-3 border-b border-slate-200">
        <button
          onClick={onCancel}
          className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800 transition cursor-pointer"
          title="Kembali"
        >
          <ArrowLeft className="w-4 h-4 text-amber-500" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {isEdit ? "Edit Dokumen Kontrak" : "Input Kontrak Pekerjaan Fisik Baru"}
          </h1>
          <p className="text-xs text-slate-500">
            {isEdit ? "Perbarui informasi kontrak fisik yang sudah terdaftar" : "Daftarkan berkas perjanjian kontrak baru bidang Bina Marga"}
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-lg flex items-start gap-2.5 animate-slide-in">
          <AlertTriangle className="w-4.5 h-4.5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold">Gagal Menyimpan</p>
            <p className="text-[11px] font-medium">{errorMsg}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Form Fields (Col span 2) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Card 1: Informasi Kontrak Induk */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-4 space-y-3.5">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <FileText className="w-4 h-4 text-amber-500" />
                A. Identifikasi & Dokumen Kontrak Induk
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Nomor Kontrak *</label>
                  <input
                    type="text"
                    value={noKontrak}
                    onChange={(e) => setNoKontrak(e.target.value)}
                    placeholder="Contoh: 602/DBM/CTR/.../2026"
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-slate-900 transition-colors"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Tanggal Kontrak</label>
                  <input
                    type="date"
                    value={tanggalKontrak}
                    onChange={(e) => setTanggalKontrak(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-slate-900 font-sans transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Tahun Anggaran *</label>
                  <select
                    value={tahunAnggaran}
                    onChange={(e) => setTahunAnggaran(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-slate-900 transition"
                    required
                  >
                    <option value={2030}>2030</option>
                    <option value={2029}>2029</option>
                    <option value={2028}>2028</option>
                    <option value={2027}>2027</option>
                    <option value={2026}>2026</option>
                    <option value={2025}>2025</option>
                    <option value={2024}>2024</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Sumber Pendanaan *</label>
                  <select
                    value={sumberDana}
                    onChange={(e) => setSumberDana(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-slate-900 transition"
                    required
                  >
                    <option value="DAU">DAU (Dana Alokasi Umum)</option>
                    <option value="DAK">DAK (Dana Alokasi Khusus)</option>
                    <option value="PAD">PAD (Pendapatan Asli Daerah)</option>
                    <option value="PKB">PKB (Pajak Kendaraan Bermotor)</option>
                    <option value="Pinjaman SMI">Pinjaman SMI (Sarana Multi Infrastruktur)</option>
                    <option value="Hibah">Hibah</option>
                    <option value="DBH">DBH (Dana Bagi Hasil)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Card 2: Paket & Lokasi Pekerjaan */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-4 space-y-3.5">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <MapPin className="w-4 h-4 text-rose-500" />
                B. Spesifikasi Paket & Lokasi Wilayah
              </h3>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Nama Paket Pekerjaan Konstruksi Fisik *</label>
                  <input
                    type="text"
                    value={namaPaket}
                    onChange={(e) => setNamaPaket(e.target.value)}
                    placeholder="Contoh: Rehabilitasi / Pelebaran Jalan Ruas Soreang - Ciwidey..."
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-slate-900 transition-colors"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Ruas Jalan *</label>
                    <input
                      type="text"
                      value={lokasiRuas}
                      onChange={(e) => setLokasiRuas(e.target.value)}
                      placeholder="Contoh: Ruas Soreang - Ciwidey Km. 24 - 32"
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-slate-900"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Wilayah Kabupaten/Kota (Provinsi NTT) *</label>
                    <select
                      value={kabupatenKota}
                      onChange={(e) => setKabupatenKota(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-slate-900 transition"
                    >
                      {KABUPATEN_PRESETS.map((kab) => (
                        <option key={kab} value={kab}>{kab}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Panjang Efektif Penanganan</label>
                    <input
                      type="text"
                      value={panjangEfektif}
                      onChange={(e) => setPanjangEfektif(e.target.value)}
                      placeholder="Contoh: 12,5 Km atau 350 M"
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-slate-100 pt-2.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Kegiatan Preservasi Jalan</label>
                    <select
                      value={kegiatanPreservasi}
                      onChange={(e) => setKegiatanPreservasi(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-slate-900 transition"
                    >
                      <option value="">- Bukan Preservasi / Tidak Ada -</option>
                      <option value="Rehabilitasi">Rehabilitasi</option>
                      <option value="Rekonstruksi">Rekonstruksi</option>
                      <option value="Long Segment">Long Segment</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Waktu Pemeliharaan</label>
                    <input
                      type="text"
                      value={waktuPemeliharaan}
                      onChange={(e) => setWaktuPemeliharaan(e.target.value)}
                      placeholder="Contoh: 180 Hari Kalender atau 6 Bulan"
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-slate-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Keuangan & Pelaksana */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-4 space-y-3.5">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <Coins className="w-4 h-4 text-emerald-600" />
                C. Nilai Anggaran & Mitra Kerja
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Anggaran DPA *</label>
                  <input
                    type="number"
                    value={nilaiHps}
                    onChange={(e) => setNilaiHps(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Contoh: 15000000000 (tanpa titik/koma)"
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-slate-900 font-sans"
                    required
                  />
                  {nilaiHps !== '' && (
                    <p className="text-[9px] text-amber-600 font-bold tracking-wide uppercase">Terformat: {Number(nilaiHps).toLocaleString('id-ID')}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Nilai Kontrak (Hasil Tender) *</label>
                  <input
                    type="number"
                    value={nilaiKontrak}
                    onChange={(e) => setNilaiKontrak(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Contoh: 14850000000"
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-slate-900 font-sans"
                    required
                  />
                  {nilaiKontrak !== '' && (
                    <p className="text-[9px] text-amber-600 font-bold tracking-wide uppercase">Terformat: {Number(nilaiKontrak).toLocaleString('id-ID')}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Penyedia Jasa (Kontraktor Pelaksana) *</label>
                  <input
                    type="text"
                    value={kontraktorPelaksana}
                    onChange={(e) => setKontraktorPelaksana(e.target.value)}
                    placeholder="Contoh: PT. Karya Maju Utama"
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-slate-900"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Konsultan Pengawas *</label>
                  <input
                    type="text"
                    value={konsultanPengawas}
                    onChange={(e) => setKonsultanPengawas(e.target.value)}
                    placeholder="Contoh: PT. Visi Nusantara Konsultindo"
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-slate-900"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Form Fields (Col span 1) */}
          <div className="space-y-4">
            {/* Card 4: Masa Pelaksanaan */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-4 space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <Clock className="w-4 h-4 text-amber-500" />
                D. Kalender Pelaksanaan
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Jangka Waktu Pelaksanaan (Hari) *</label>
                  <input
                    type="number"
                    value={jangkaWaktu}
                    onChange={(e) => setJangkaWaktu(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Contoh: 180"
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-slate-900 font-sans"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Tanggal Mulai Kerja (SPMK) *</label>
                  <input
                    type="date"
                    value={tanggalMulai}
                    onChange={(e) => setTanggalMulai(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-slate-900 font-sans"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Nomor SPMK</label>
                  <input
                    type="text"
                    value={nomorSpmk}
                    onChange={(e) => setNomorSpmk(e.target.value)}
                    placeholder="Contoh: 602/DBM/SPMK/.../2026"
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-slate-900 font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase flex justify-between">
                    <span>Target Tanggal Selesai</span>
                    <span className="text-[9px] text-amber-600 font-bold uppercase tracking-wider">Auto-kalkulasi</span>
                  </label>
                  <input
                    type="date"
                    value={tanggalSelesai}
                    onChange={(e) => setTanggalSelesai(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded text-slate-600 cursor-not-allowed font-bold font-sans"
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Card 5: Stakeholder Pembuat Komitmen */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-4 space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <User className="w-4 h-4 text-violet-500" />
                E. Pejabat Pembuat Komitmen (PPK)
              </h3>

              <div className="space-y-2.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Nama PPK Bina Marga *</label>
                  <input
                    type="text"
                    value={pejabatPembuatKomitmen}
                    onChange={(e) => setPejabatPembuatKomitmen(e.target.value)}
                    placeholder="Contoh: Supriatna, S.T., M.Eng."
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-slate-900"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">NIP PPK Bina Marga *</label>
                  <input
                    type="text"
                    value={nipPpk}
                    onChange={(e) => setNipPpk(e.target.value)}
                    placeholder="Contoh: 198104112006041002"
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-slate-900 font-mono"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Card 6: Progres Fisik & Keuangan */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-4 space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                F. Progres & Evaluasi Awal
              </h3>

              <div className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between font-bold text-slate-700 text-[10px] uppercase">
                    <span>Progres Fisik Rencana (%)</span>
                    <span className="font-bold text-blue-600">{progresFisik}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={progresFisik}
                      onChange={(e) => setProgresFisik(Number(e.target.value))}
                      className="flex-1 accent-slate-900 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
                    />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={progresFisik}
                      onChange={(e) => {
                        const val = Math.min(100, Math.max(0, Number(e.target.value)));
                        setProgresFisik(val);
                      }}
                      className="w-14 px-1.5 py-1 text-center bg-white border border-slate-200 rounded font-bold text-slate-800"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-bold text-slate-700 text-[10px] uppercase">
                    <span>Progres Keuangan (%)</span>
                    <span className="font-bold text-emerald-600">{progresKeuangan}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={progresKeuangan}
                      onChange={(e) => setProgresKeuangan(Number(e.target.value))}
                      className="flex-1 accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
                    />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={progresKeuangan}
                      onChange={(e) => {
                        const val = Math.min(100, Math.max(0, Number(e.target.value)));
                        setProgresKeuangan(val);
                      }}
                      className="w-14 px-1.5 py-1 text-center bg-white border border-slate-200 rounded font-bold text-slate-800"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Status Paket Pekerjaan</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as KontrakFisik['status'])}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-slate-900 transition"
                  >
                    <option value="Persiapan">Persiapan (Kesiapan Lahan/Pre-Con)</option>
                    <option value="Pelaksanaan">Pelaksanaan Pekerjaan</option>
                    <option value="Kritis">Kritis (Keterlambatan Progres)</option>
                    <option value="PHO">PHO (Serah Terima Awal)</option>
                    <option value="FHO">FHO (Serah Terima Akhir)</option>
                    <option value="Selesai">Selesai Masa Pemeliharaan</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Catatan / Keterangan Tambahan */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-4 space-y-1.5">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">G. Keterangan / Catatan Tambahan (Evaluasi Lapangan)</label>
          <textarea
            value={catatanPekerjaan}
            onChange={(e) => setCatatanPekerjaan(e.target.value)}
            rows={2}
            placeholder="Tulis kendala lapangan (pembebasan utilitas, cuaca buruk, koordinasi instansi, rekayasa lapangan dll.)"
            className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-slate-900 resize-none"
          ></textarea>
        </div>

        {/* Form Actions */}
        <div className="flex gap-2.5 justify-end pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded text-xs transition cursor-pointer"
          >
            Batalkan
          </button>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded shadow-md transition cursor-pointer"
          >
            <Check className="w-3.5 h-3.5 text-amber-400" />
            {isEdit ? "Simpan Perubahan" : "Daftarkan Berkas Kontrak"}
          </button>
        </div>
      </form>
    </div>
  );
}
