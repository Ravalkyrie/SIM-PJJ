# App.tsx Update Checklist

## Persiapan
- [ ] Backup: `copy src\App.tsx src\App.old.tsx`
- [ ] Install dependencies: `npm install`

## Edit App.tsx

### 1. Imports (baris ~1-46)
- [ ] Tambah: `import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';`
- [ ] Tambah: `import { AnimatePresence } from 'framer-motion';`
- [ ] Tambah: `import PageTransition from './components/PageTransition';`
- [ ] Tambah: `import SidebarNav from './components/SidebarNav';`
- [ ] Tambah: `import Breadcrumb from './components/Breadcrumb';`
- [ ] Hapus: unused icon imports (Building2, LayoutDashboard, Files, FilePlus, etc)

### 2. State (baris ~111-113)
- [ ] Hapus: `const [activeTab, setActiveTab] = useState<...>('dashboard');`
- [ ] Hapus: `const [selectedContractId, setSelectedContractId] = useState<...>(null);`
- [ ] Hapus: `const [contractToEdit, setContractToEdit] = useState<...>(null);`

### 3. Router Hooks (awal function AppContent)
- [ ] Tambah: `const navigate = useNavigate();`
- [ ] Tambah: `const location = useLocation();`

### 4. Handlers
- [ ] Update `handleLogout`: ganti `setActiveTab('dashboard')` → `navigate('/dashboard')`
- [ ] Update `handleSelectContract`: ganti `setSelectedContractId + setActiveTab` → `navigate(\`/kontrak/${id}\`)`
- [ ] Hapus function `handleEditContract` (sudah tidak diperlukan)
- [ ] Update `handleDeleteContract`: hapus `if (selectedContractId === id)` block
- [ ] Update `handleSaveContract`: hapus `setSelectedContractId + setActiveTab` di akhir

### 5. Remove Unused
- [ ] Hapus function `getBreadcrumbs()` (sekarang di components/Breadcrumb.tsx)
- [ ] Hapus inline component `SidebarNav` (sekarang di components/SidebarNav.tsx)
- [ ] Hapus variable `selectedContract` (tidak diperlukan di App level)

### 6. Render - Sidebar
- [ ] Ganti inline `<SidebarNav ...>` dengan `<SidebarNav isSidebarOpen={isSidebarOpen} />`
- [ ] Lakukan untuk desktop sidebar DAN mobile sidebar

### 7. Render - Header
- [ ] Ganti inline breadcrumb logic dengan `<Breadcrumb />`

### 8. Render - Main Content
- [ ] Hapus semua conditional: `{activeTab === 'dashboard' && (<Dashboard.../>)}`
- [ ] Ganti dengan:
```jsx
<main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
  <AnimatePresence mode="wait">
    <PageTransition key={location.pathname}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage contracts={filteredContracts} onSelectContract={handleSelectContract} />} />
        <Route path="/kontrak" element={<ContractsPage contracts={filteredContracts} onDeleteContract={handleDeleteContract} />} />
        <Route path="/kontrak/:id" element={<ContractDetailPage contracts={contracts} onDelete={handleDeleteContract} onUpdateProgress={handleUpdateProgress} onAddAdendum={handleAddAdendum} onAddLampiran={handleAddLampiran} onDeleteLampiran={handleDeleteLampiran} />} />
        <Route path="/kontrak/tambah" element={<ContractFormPage contracts={contracts} onSave={handleSaveContract} />} />
        <Route path="/kontrak/:id/edit" element={<ContractFormPage contracts={contracts} onSave={handleSaveContract} />} />
        <Route path="/log-aktivitas" element={<ActivityLogsPage logs={activityLogs} contracts={contracts} onClearLogs={handleClearLogs} />} />
      </Routes>
    </PageTransition>
  </AnimatePresence>
</main>
```

### 9. Export (akhir file)
- [ ] Rename function `App()` → `AppContent()`
- [ ] Tambah wrapper baru:
```typescript
export default function App() {
  return (
    <Router basename="/SIM-PJJ">
      <AppContent />
    </Router>
  );
}
```

## Testing
- [ ] TypeScript check: `npm run lint`
- [ ] Build test: `npm run build`
- [ ] Dev server: `npm run dev`
- [ ] Test navigasi: Dashboard, Kontrak, Detail, Edit, Tambah, Logs
- [ ] Test browser back/forward
- [ ] Test refresh halaman
- [ ] Test Firebase CRUD
- [ ] Deploy: `npm run deploy`

## Verification
- [ ] URL berubah saat klik menu
- [ ] Breadcrumb update otomatis
- [ ] Menu aktif sesuai URL
- [ ] Page transition smooth
- [ ] No console errors
- [ ] Firebase tetap jalan
- [ ] Auth tetap jalan
- [ ] GitHub Pages accessible
