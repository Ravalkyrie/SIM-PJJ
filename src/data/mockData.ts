/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { KontrakFisik } from '../types';

export const INITIAL_KONTRAK: KontrakFisik[] = [
  {
    id: "KTR-001",
    noKontrak: "602/DBM/CTR/045-REH-JLN/2026",
    tanggalKontrak: "2026-03-12",
    namaPaket: "Rehabilitasi Mayor Ruas Jalan Kupang - Ba'a",
    lokasiRuas: "Ruas Kupang - Ba'a, Km. 12+000 s/d Km. 19+500",
    kabupatenKota: "Kabupaten Kupang",
    nilaiKontrak: 14850000000, // Rp 14,85 Miliar
    nilaiHps: 15500000000,
    sumberDana: "DAU",
    tahunAnggaran: 2026,
    kontraktorPelaksana: "PT. Karya Selaras Abadi",
    konsultanPengawas: "PT. Rekayasa Nusantara Konsultindo",
    jangkaWaktu: 180, // Hari Kalender
    tanggalMulai: "2026-03-20",
    tanggalSelesai: "2026-09-15",
    progresFisik: 65,
    progresKeuangan: 50,
    status: "Pelaksanaan",
    pejabatPembuatKomitmen: "Ir. Hermawan Prasetyo, M.T.",
    nipPpk: "197508242002121003",
    catatanPekerjaan: "Pekerjaan pelebaran jalan di Km 15 sedang berlangsung. Deviasi +2.5% dari rencana target mingguan. Cuaca cukup mendukung.",
    kegiatanPreservasi: "Rehabilitasi",
    adendum: [
      {
        id: "ADD-001-1",
        noAdendum: "602/DBM/CTR/045-ADD-01/2026",
        tanggalAdendum: "2026-05-15",
        perubahanNilai: 150000000, // Penambahan Rp 150 Juta untuk relokasi pipa PDAM
        perubahanWaktu: 15, // Tambahan 15 hari
        keterangan: "Pekerjaan tambah-kurang akibat adanya utilitas pipa PDAM yang berada di bahu jalan pelebaran."
      }
    ],
    lampiran: [
      {
        id: "LAMP-001-1",
        namaFile: "Kontrak_Induk_Kupang_Baa.pdf",
        tipeDokumen: "Dokumen Kontrak",
        tanggalUpload: "2026-03-12",
        ukuranFile: "12.4 MB"
      },
      {
        id: "LAMP-001-2",
        namaFile: "SPMK_Kupang_Baa.pdf",
        tipeDokumen: "PCM",
        tanggalUpload: "2026-03-20",
        ukuranFile: "1.8 MB"
      },
      {
        id: "LAMP-001-3",
        namaFile: "Adendum_1_PDAM_Signed.pdf",
        tipeDokumen: "Addendum I",
        tanggalUpload: "2026-05-16",
        ukuranFile: "3.5 MB"
      }
    ]
  },
  {
    id: "KTR-002",
    noKontrak: "602/DBM/CTR/012-PMP-JLN/2026",
    tanggalKontrak: "2026-02-05",
    namaPaket: "Peningkatan Kapasitas Struktur Jalan Provinsi Ruas Atambua - Weliman",
    lokasiRuas: "Ruas Atambua - Weliman, Km. 05+100 s/d Km. 11+400",
    kabupatenKota: "Kabupaten Belu",
    nilaiKontrak: 23410000000, // Rp 23.41 Miliar
    nilaiHps: 24500000000,
    sumberDana: "PKB",
    tahunAnggaran: 2026,
    kontraktorPelaksana: "PT. Hutama Jaya Konstruksi",
    konsultanPengawas: "PT. Visi Global Engineering",
    jangkaWaktu: 120,
    tanggalMulai: "2026-02-15",
    tanggalSelesai: "2026-06-14",
    progresFisik: 100,
    progresKeuangan: 100,
    status: "PHO",
    pejabatPembuatKomitmen: "Supriatna, S.T., M.Eng.",
    nipPpk: "198104112006041002",
    catatanPekerjaan: "Pekerjaan utama perkerasan aspal telah selesai 100%. Telah dilakukan pra-PHO pada tanggal 10 Juni 2026. Menunggu masa pemeliharaan.",
    kegiatanPreservasi: "Rekonstruksi",
    adendum: [],
    lampiran: [
      {
        id: "LAMP-002-1",
        namaFile: "Kontrak_Signed_Atambua_Weliman.pdf",
        tipeDokumen: "Dokumen Kontrak",
        tanggalUpload: "2026-02-05",
        ukuranFile: "18.1 MB"
      },
      {
        id: "LAMP-002-2",
        namaFile: "BA_Serah_Terima_PHO_Atambua.pdf",
        tipeDokumen: "Berita Acara PHO",
        tanggalUpload: "2026-06-15",
        ukuranFile: "4.2 MB"
      }
    ]
  },
  {
    id: "KTR-003",
    noKontrak: "602/DBM/CTR/088-PGB-CIM/2026",
    tanggalKontrak: "2026-04-18",
    namaPaket: "Pembangunan Jembatan Gantung Lera (Tahap II)",
    lokasiRuas: "Kecamatan Alor Barat Laut, Ruas Sungai Lera",
    kabupatenKota: "Kabupaten Alor",
    nilaiKontrak: 8920000000, // Rp 8.92 Miliar
    nilaiHps: 9000000000,
    sumberDana: "Pinjaman SMI",
    tahunAnggaran: 2026,
    kontraktorPelaksana: "CV. Pilar Utama Nusantara",
    konsultanPengawas: "CV. Archipelindo Consult",
    jangkaWaktu: 150,
    tanggalMulai: "2026-04-25",
    tanggalSelesai: "2026-09-21",
    progresFisik: 32,
    progresKeuangan: 30,
    status: "Pelaksanaan",
    pejabatPembuatKomitmen: "Ir. Hermawan Prasetyo, M.T.",
    nipPpk: "197508242002121003",
    catatanPekerjaan: "Pondasi sumuran dan pilar jembatan barat telah selesai cor. Saat ini fokus pabrikasi girder baja.",
    adendum: [],
    lampiran: [
      {
        id: "LAMP-003-1",
        namaFile: "Dokumen_Kontrak_Jembatan_Lera.pdf",
        tipeDokumen: "Dokumen Kontrak",
        tanggalUpload: "2026-04-19",
        ukuranFile: "9.7 MB"
      }
    ]
  },
  {
    id: "KTR-004",
    noKontrak: "602/DBM/CTR/102-KRT-SMG/2026",
    tanggalKontrak: "2026-05-02",
    namaPaket: "Pelebaran Jalan Strategis Provinsi Ruas Labuan Bajo - Waecicu",
    lokasiRuas: "Ruas Labuan Bajo - Waecicu Coastal Road",
    kabupatenKota: "Kabupaten Manggarai Barat",
    nilaiKontrak: 19550000000, // Rp 19.55 Miliar
    nilaiHps: 20000000000,
    sumberDana: "Hibah",
    tahunAnggaran: 2026,
    kontraktorPelaksana: "PT. Samudra Pasifik Konstruksi",
    konsultanPengawas: "PT. Visi Global Engineering",
    jangkaWaktu: 210,
    tanggalMulai: "2026-05-10",
    tanggalSelesai: "2026-12-05",
    progresFisik: 15,
    progresKeuangan: 15,
    status: "Pelaksanaan",
    pejabatPembuatKomitmen: "Supriatna, S.T., M.Eng.",
    nipPpk: "198104112006041002",
    catatanPekerjaan: "Mengalami keterlambatan progres sekitar -5% karena kendala pengerjaan galian tebing batu.",
    adendum: [],
    lampiran: [
      {
        id: "LAMP-004-1",
        namaFile: "Kontrak_Labuan_Bajo_Waecicu.pdf",
        tipeDokumen: "Dokumen Kontrak",
        tanggalUpload: "2026-05-03",
        ukuranFile: "15.0 MB"
      },
      {
        id: "LAMP-004-2",
        namaFile: "SPMK_Labuan_Bajo_Waecicu.pdf",
        tipeDokumen: "PCM",
        tanggalUpload: "2026-05-10",
        ukuranFile: "1.2 MB"
      }
    ]
  },
  {
    id: "KTR-005",
    noKontrak: "602/DBM/CTR/005-MNT-CJP/2025",
    tanggalKontrak: "2025-01-20",
    namaPaket: "Pemeliharaan Rutin Jalan dan Jembatan Koridor Ende - Detusoko",
    lokasiRuas: "Lintas Ende - Detusoko - Kelimutu",
    kabupatenKota: "Kabupaten Ende",
    nilaiKontrak: 4500000000,
    nilaiHps: 4500000000,
    sumberDana: "DBH",
    tahunAnggaran: 2025,
    kontraktorPelaksana: "CV. Guna Bakti Mandiri",
    konsultanPengawas: "CV. Archipelindo Consult",
    jangkaWaktu: 340,
    tanggalMulai: "2025-01-25",
    tanggalSelesai: "2025-12-31",
    progresFisik: 100,
    progresKeuangan: 100,
    status: "FHO",
    pejabatPembuatKomitmen: "Ir. Hermawan Prasetyo, M.T.",
    nipPpk: "197508242002121003",
    catatanPekerjaan: "Pekerjaan pemeliharaan rutin satu tahun penuh selesai dengan baik.",
    kegiatanPreservasi: "Long Segment",
    adendum: [],
    lampiran: [
      {
        id: "LAMP-005-1",
        namaFile: "BAST_FHO_Ende_Detusoko.pdf",
        tipeDokumen: "Dokumen Pelaksanaan 0% 50% 100%",
        tanggalUpload: "2025-12-28",
        ukuranFile: "3.2 MB"
      }
    ]
  }
];
