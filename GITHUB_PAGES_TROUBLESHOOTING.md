# GitHub Pages Troubleshooting

**Last Updated**: 18 September 2026, 13:25 WIB

---

## 🌐 Live URL

**Production**: https://ravalkyrie.github.io/SIM-PJJ/

---

## ⚠️ Common Issues & Solutions

### Issue 1: MIME Type Errors (text/html instead of text/javascript)

**Symptoms**:
```
Loading module from "https://ravalkyrie.github.io/SIM-PJJ/assets/index-CKiZDT5P.js" 
was blocked because of a disallowed MIME type ("text/html")
```

**Causes**:
1. GitHub Pages sedang propagasi deployment (butuh 1-2 menit)
2. Browser cache menyimpan versi lama
3. Assets belum ter-deploy dengan benar

**Solutions**:

#### A. Hard Refresh Browser
```
Chrome/Edge: Ctrl + Shift + R
Firefox: Ctrl + Shift + R
Safari: Cmd + Shift + R
```

#### B. Clear Browser Cache
1. Buka DevTools (F12)
2. Klik kanan pada refresh button
3. Pilih "Empty Cache and Hard Reload"

#### C. Wait for GitHub Pages Propagation
- Tunggu 2-5 menit setelah deployment
- GitHub Pages butuh waktu untuk update CDN
- Coba akses dari Incognito/Private mode

#### D. Verifikasi Assets Exists
Cek apakah file assets bisa diakses langsung:
```
https://ravalkyrie.github.io/SIM-PJJ/assets/index-CKiZDT5P.js
https://ravalkyrie.github.io/SIM-PJJ/assets/index-BThu0iTq.css
```

Jika return 404, berarti deployment belum selesai.

---

### Issue 2: Blank Page / White Screen

**Solutions**:
1. Check browser console (F12) untuk error
2. Pastikan base URL sudah benar di `vite.config.ts`
3. Clear cache dan reload
4. Cek apakah Firebase config sudah benar

---

### Issue 3: Routes Not Working (404 on Refresh)

**Cause**: GitHub Pages tidak support SPA routing secara default

**Solution**: Sudah di-handle dengan:
1. `404.html` redirect script
2. `index.html` SPA redirect handler (line 21-34)

Jika masih bermasalah:
- Pastikan `404.html` ada di root gh-pages
- Gunakan HashRouter instead of BrowserRouter (not recommended)

---

### Issue 4: Assets 404 Not Found

**Verification**:
```bash
# Cek struktur gh-pages branch
git checkout gh-pages
ls -la

# Should have:
# - index.html
# - 404.html
# - assets/
# - images/
```

**Fix**:
```bash
# Redeploy
git checkout main
npm run build
git add dist -f
git commit -m 'build: redeploy assets'
git subtree split --prefix dist main
git push origin <commit>:gh-pages --force
```

---

## ✅ Verification Checklist

Setelah deployment, verifikasi:

- [ ] https://ravalkyrie.github.io/SIM-PJJ/ loads (no blank page)
- [ ] No MIME type errors in console
- [ ] CSS loaded correctly (styling terlihat)
- [ ] JavaScript loaded (app interactive)
- [ ] Routes berfungsi (navigate antar halaman)
- [ ] Refresh page tidak 404
- [ ] Firebase connection works (login page)
- [ ] Preview cetak kontrak menampilkan font HITAM

---

## 🔄 Force Redeploy

Jika semua solusi di atas tidak berhasil:

```bash
# 1. Build fresh
cd "C:\New folder\Manajemen"
npm run clean
npm run build

# 2. Commit dist
git add dist -f
git commit -m 'build: force redeploy'

# 3. Force push to gh-pages
git subtree split --prefix dist main
git push origin <split-commit>:gh-pages --force

# 4. Wait 2-5 minutes
# 5. Clear browser cache completely
# 6. Test in Incognito mode
```

---

## 📞 Debug Commands

```bash
# Check current deployment
git log origin/gh-pages --oneline -5

# Check what's in gh-pages
git ls-tree -r gh-pages --name-only

# Check base URL in built files
grep -r "SIM-PJJ" dist/

# Verify dist structure
ls -R dist/
```

---

## 🎯 Expected Result

**Working State**:
- ✅ Page loads with styling
- ✅ No console errors
- ✅ All assets load (200 status)
- ✅ Font di preview cetak = HITAM
- ✅ Routes work on refresh

**Not Working State**:
- ❌ MIME type errors
- ❌ Blank white page
- ❌ 404 on routes
- ❌ Assets not found

---

## 💡 Tips

1. **Always wait 2-5 minutes** after deployment before testing
2. **Use Incognito mode** untuk test tanpa cache
3. **Check GitHub Actions** tab di repository untuk deployment status
4. **Mobile testing**: Cache di mobile browser lebih persistent, bisa butuh clear data app
5. **CDN Cache**: GitHub Pages pakai CDN, bisa butuh lebih lama untuk propagate

---

## 📊 Current Status

**Last Deployment**: 18 September 2026, 13:17 WIB  
**Commit gh-pages**: `33a7420`  
**Base URL**: `/SIM-PJJ/`  
**Status**: ✅ Deployed (waiting for propagation)

**Files Deployed**:
- index.html (2.08 kB)
- 404.html
- assets/index-CKiZDT5P.js (548.44 kB)
- assets/index-BThu0iTq.css (77.63 kB)
- assets/react-vendor-CCXFnprz.js (11.92 kB)
- assets/firebase-vendor-CwwEJDFX.js (690.32 kB)
- assets/html2canvas.esm-QH1iLAAe.js (202.38 kB)
- assets/jspdf.es.min-BxQQwinc.js (358.24 kB)
- assets/purify.es-BwoZCkIS.js (22.03 kB)
- assets/index.es-utM4kctD.js (159.83 kB)
- images/logo-pupr.png
- images/logo-pupr.svg

---

**Next Action**: 
1. Wait 2-5 minutes untuk GitHub Pages propagation
2. Clear browser cache (Ctrl + Shift + R)
3. Test di Incognito mode
4. Verifikasi font preview cetak sudah HITAM
