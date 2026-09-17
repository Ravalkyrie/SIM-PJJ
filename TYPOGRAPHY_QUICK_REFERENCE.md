# Typography Quick Reference Card

## 🎯 At a Glance

| Element | Before | After | Change |
|---------|--------|-------|--------|
| **Nama Paket (Desktop)** | 14px | **18px** | +4px ⬆️ |
| **Nama Paket (Mobile)** | 14px | **16px** | +2px ⬆️ |
| **Nomor Kontrak** | 12px | **14px** | +2px ⬆️ |
| **Section Headings** | 10px | **11px** | +1px ⬆️ |
| **Field Labels** | varies | **11px** | standardized |
| **Field Values** | varies | **14px** | standardized |
| **Stakeholder Names** | ~14px | **14px** | explicit |
| **Badges (TA/DANA)** | 10px | **11px** | +1px ⬆️ |
| **Catatan Text** | 11px | **12px** | +1px ⬆️ |

## 🎨 Visual Hierarchy

```
█████ NAMA PAKET PEKERJAAN (18px, EXTRABOLD)
────────────────────────────────────────────
███ SECTION HEADING (11px, BOLD)
  • Label (11px) : Value (14px, BOLD)
  • Label (11px) : Value (14px, BOLD)
────────────────────────────────────────────
███ SECTION HEADING (11px, BOLD)
  • Label (11px) : Value (14px, BOLD)
```

## 📱 Responsive Behavior

```
DESKTOP (≥768px)
├─ Nama Paket: text-lg (18px)
├─ Multi-column grids
└─ Larger spacing

MOBILE (<768px)
├─ Nama Paket: text-base (16px)
├─ Single-column grids
└─ Compact spacing
```

## ⚡ Key Tailwind Classes

### Nama Paket Pekerjaan
```tsx
text-base md:text-lg font-extrabold leading-snug md:leading-normal
```

### Section Headings
```tsx
text-[11px] font-bold uppercase tracking-wider
```

### Field Labels
```tsx
text-[11px] text-slate-500 font-semibold
```

### Field Values
```tsx
text-sm font-bold text-slate-800
```

## 🎯 Focus Areas

1. **PRIMARY:** Nama Paket Pekerjaan (biggest change)
2. **SECONDARY:** Section headings (more prominent)
3. **TERTIARY:** All labels & values (consistent, readable)

## ✅ Testing Checklist

- [ ] npm run build passes
- [ ] Desktop looks professional
- [ ] Mobile has no overflow
- [ ] Long names wrap properly
- [ ] All colors preserved
- [ ] Hierarchy clear

## 🚀 Deploy When

✅ Build successful  
✅ Visual testing passed  
✅ Mobile verified  
✅ No regressions found  

---

**Quick Start:**
1. Enable PowerShell: `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`
2. Build: `npm run build`
3. Test: `npm run dev`
4. Deploy when satisfied
