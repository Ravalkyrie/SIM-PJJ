/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DokumenLampiran {
  id: string;
  namaFile: string;
  tipeDokumen: string;
  tanggalUpload: string;
  ukuranFile: string;
  googleDriveFileId?: string;
  googleDriveUrl?: string;
}

export interface AdendumKontrak {
  id: string;
  noAdendum: string;
  tanggalAdendum: string;
  perubahanNilai?: number; // Nilai perubahan (bisa positif/negatif)
  perubahanWaktu?: number; // Perubahan hari kalender
  keterangan: string;
}

export interface KontrakFisik {
  id: string;
  noKontrak: string;
  tanggalKontrak: string;
  namaPaket: string;
  lokasiRuas: string;
  kabupatenKota: string;
  nilaiKontrak: number;
  nilaiHps: number;
  sumberDana: string;
  tahunAnggaran: number;
  kontraktorPelaksana: string;
  konsultanPengawas: string;
  jangkaWaktu: number; // Hari kalender
  tanggalMulai: string; // SPMK Date
  tanggalSelesai: string; // Target Selesai
  progresFisik: number; // 0 - 100%
  progresKeuangan: number; // 0 - 100%
  status: 'Persiapan' | 'Pelaksanaan' | 'Kritis' | 'PHO' | 'FHO' | 'Selesai';
  pejabatPembuatKomitmen: string;
  nipPpk: string;
  catatanPekerjaan: string;
  kegiatanPreservasi?: string;
  panjangEfektif?: string;
  adendum: AdendumKontrak[];
  lampiran: DokumenLampiran[];
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  actionType: 'CREATE' | 'UPDATE' | 'DELETE' | 'ADD_ADENDUM' | 'ADD_LAMPIRAN' | 'DELETE_LAMPIRAN' | 'UPDATE_PROGRESS';
  contractId: string;
  contractNo: string;
  contractName: string;
  description: string;
  operator: string;
}

// Actual Kab/Kota in Provinsi Nusa Tenggara Timur (NTT)
export const KABUPATEN_PRESETS = [
  "Kabupaten Kupang",
  "Kota Kupang",
  "Kabupaten Belu",
  "Kabupaten Malaka",
  "Kabupaten Timor Tengah Utara",
  "Kabupaten Timor Tengah Selatan",
  "Kabupaten Alor",
  "Kabupaten Flores Timur",
  "Kabupaten Sikka",
  "Kabupaten Ende",
  "Kabupaten Ngada",
  "Kabupaten Nagekeo",
  "Kabupaten Manggarai",
  "Kabupaten Manggarai Barat",
  "Kabupaten Manggarai Timur",
  "Kabupaten Lembata",
  "Kabupaten Rote Ndao",
  "Kabupaten Sabu Raijua",
  "Kabupaten Sumba Timur",
  "Kabupaten Sumba Barat",
  "Kabupaten Sumba Tengah",
  "Kabupaten Sumba Barat Daya"
];

