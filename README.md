# 📊 SIM-PJJ - Sistem Informasi Monitoring Pembangunan Jalan dan Jembatan

Sistem manajemen kontrak untuk monitoring pembangunan jalan dan jembatan di Dinas Pekerjaan Umum dan Perumahan Rakyat, Provinsi Nusa Tenggara Timur.

![Version](https://img.shields.io/badge/version-2.4.1-blue)
![React](https://img.shields.io/badge/React-19.0.1-61dafb)
![Firebase](https://img.shields.io/badge/Firebase-12.16.0-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue)

## ✨ Fitur Utama

- 📋 **Manajemen Kontrak** - Input, edit, dan kelola data kontrak fisik
- 📊 **Dashboard Monitoring** - Visualisasi real-time progres proyek
- 📑 **Adendum & Lampiran** - Kelola perubahan dan dokumen kontrak
- 📈 **Tracking Progress** - Monitor progres fisik dan keuangan
- 🔍 **Filter & Search** - Filter berdasarkan wilayah dan tahun anggaran
- 📱 **Responsive Design** - Optimal di desktop dan mobile
- 🔐 **Firebase Backend** - Data tersimpan aman di Cloud Firestore
- 📝 **Activity Logs** - Riwayat semua aktivitas sistem

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 atau lebih tinggi)
- npm atau yarn
- Akun Firebase (untuk backend)

### Installation

1. **Clone repository**
   ```bash
   git clone https://github.com/Ravalkyrie/SIM-PJJ.git
   cd SIM-PJJ
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup Environment Variables**
   
   Copy file `.env.example` menjadi `.env`:
   ```bash
   copy .env.example .env  # Windows
   # atau
   cp .env.example .env    # Linux/Mac
   ```

4. **Konfigurasi Firebase**
   
   Dapatkan kredensial dari [Firebase Console](https://console.firebase.google.com/):
   - Buat project baru atau gunakan yang ada
   - Buka Project Settings > General
   - Scroll ke "Your apps" > Web app
   - Copy konfigurasi dan paste ke file `.env`:

   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

5. **Setup Firestore Security Rules**
   
   Di Firebase Console, buka Firestore Database > Rules, paste rules dari file `firestore.rules`:
   
   ```javascript
   // Lihat file firestore.rules untuk detail lengkap
   ```

6. **Run Development Server**
   ```bash
   npm run dev
   ```

   Aplikasi akan berjalan di `http://localhost:3000`

## 🏗️ Build & Deploy

### Build untuk Production

```bash
npm run build
```

File hasil build akan ada di folder `dist/`

### Deploy ke GitHub Pages

```bash
npm run deploy
```

Aplikasi akan otomatis di-deploy ke `https://your-username.github.io/SIM-PJJ/`

## 📂 Struktur Project

```
SIM-PJJ/
├── src/
│   ├── components/          # React components
│   │   ├── ActivityLogView.tsx
│   │   ├── ContractDetail.tsx
│   │   ├── ContractForm.tsx
│   │   ├── ContractList.tsx
│   │   └── DashboardView.tsx
│   ├── lib/                 # Utility libraries
│   │   ├── firebaseAuth.ts  # Authentication logic
│   │   └── googleDrive.ts   # Google Drive integration
│   ├── data/                # Mock data & seeds
│   │   └── mockData.ts
│   ├── App.tsx              # Main app component
│   ├── firebase.ts          # Firebase configuration
│   ├── types.ts             # TypeScript type definitions
│   ├── main.tsx             # App entry point
│   └── index.css            # Global styles
├── .env                     # Environment variables (JANGAN COMMIT!)
├── .env.example             # Template environment variables
├── firestore.rules          # Firestore security rules
├── package.json             # Dependencies & scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
└── README.md                # Dokumentasi ini
```

## 🔒 Security

⚠️ **PENTING**: Setelah setup awal, pastikan untuk:

1. **Regenerate API Keys** di Firebase Console jika keys lama sudah terekspos
2. **Jangan commit file `.env`** ke git
3. **Setup Firestore Security Rules** yang proper
4. **Enable Authentication** untuk production
5. **Review access permissions** secara berkala

## 🛠️ Development

### Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run TypeScript type checking
npm run clean      # Clean build artifacts
npm run deploy     # Deploy to GitHub Pages
```

### Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: TailwindCSS 4
- **Backend**: Firebase (Firestore + Auth)
- **Build Tool**: Vite 6
- **Icons**: Lucide React
- **Deployment**: GitHub Pages

## 📝 Firestore Collections

### `kontrak` Collection
```typescript
{
  id: string,
  firestoreId: string,
  noKontrak: string,
  namaPaket: string,
  nilaiKontrak: number,
  progresFisik: number,
  progresKeuangan: number,
  status: string,
  // ... dan field lainnya
}
```

### `activity_logs` Collection
```typescript
{
  id: string,
  timestamp: string,
  actionType: string,
  contractId: string,
  description: string,
  operator: string
}
```

## 🤝 Contributing

Contributions are welcome! Silakan:

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

Apache-2.0 License - see LICENSE file for details

## 👤 Author

**Dinas Pekerjaan Umum dan Perumahan Rakyat**  
Provinsi Nusa Tenggara Timur

---

Made with ❤️ for better infrastructure monitoring
