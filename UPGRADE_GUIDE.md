# Upgrade Routing Guide

## Status: Komponen Siap, App.tsx Perlu Update Manual

### ✅ Yang Sudah Dibuat:
1. Pages: Dashboard, Contracts, ContractDetail, ContractForm, ActivityLogs
2. Components: PageTransition, SidebarNav, Breadcrumb
3. public/404.html (GitHub Pages SPA support)
4. package.json updated (react-router-dom, framer-motion)

### ⚠️ Yang Perlu Dilakukan:

#### 1. Install Dependencies
```bash
cd "C:/New folder/Manajemen"
npm install
```

#### 2. Update App.tsx
File terlalu besar untuk edit otomatis. Perubahan manual:

**Tambah imports:**
```typescript
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/PageTransition';
import SidebarNav from './components/SidebarNav';
import Breadcrumb from './components/Breadcrumb';
```

**Hapus state:**
```typescript
// HAPUS:
const [activeTab, setActiveTab] = ...
const [selectedContractId, setSelectedContractId] = ...
const [contractToEdit, setContractToEdit] = ...
```

**Tambah di AppContent():**
```typescript
const navigate = useNavigate();
const location = useLocation();
```

**Update handlers:**
```typescript
// OLD: setActiveTab('detail')
// NEW: navigate('/kontrak')

const handleSelectContract = (id: string) => {
  navigate(`/kontrak/${id}`);
};
```

**Ganti render dengan:**
```typescript
<main>
  <AnimatePresence mode="wait">
    <PageTransition key={location.pathname}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<DashboardPage ... />} />
        <Route path="/kontrak" element={<ContractsPage ... />} />
        <Route path="/kontrak/:id" element={<ContractDetailPage ... />} />
        <Route path="/kontrak/tambah" element={<ContractFormPage ... />} />
        <Route path="/kontrak/:id/edit" element={<ContractFormPage ... />} />
        <Route path="/log-aktivitas" element={<ActivityLogsPage ... />} />
      </Routes>
    </PageTransition>
  </AnimatePresence>
</main>
```

**Wrap export:**
```typescript
export default function App() {
  return (
    <Router basename="/SIM-PJJ">
      <AppContent />
    </Router>
  );
}
```

#### 3. Test
```bash
npm run dev
npm run build
npm run deploy
```

## Routes:
- /dashboard
- /kontrak
- /kontrak/:id
- /kontrak/tambah
- /kontrak/:id/edit
- /log-aktivitas
