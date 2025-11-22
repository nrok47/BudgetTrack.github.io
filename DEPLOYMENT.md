# 🚀 Deployment Guide

## Quick Start (Development)

The application is currently running at: **http://localhost:3000**

```bash
npm run dev
```

---

## 📦 Production Build

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

Preview the production build locally before deploying.

---

## 🌐 Deployment Options

### Option 1: GitHub Pages (Recommended)

Since your repository is `BudgetTrack.github.io`, you can deploy directly to GitHub Pages:

1. **Update `vite.config.ts`** to set the base path:

```typescript
export default defineConfig({
  plugins: [react()],
  base: '/', // or '/repository-name/' if not using .github.io domain
  // ... rest of config
})
```

2. **Build the project**:
```bash
npm run build
```

3. **Deploy to GitHub Pages**:

**Option A: Using GitHub Actions** (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm install
        
      - name: Build
        run: npm run build
        
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

**Option B: Manual Deployment**

```bash
# Build the project
npm run build

# Navigate to dist folder
cd dist

# Initialize git and push to gh-pages branch
git init
git add -A
git commit -m 'deploy'
git push -f git@github.com:nrok47/BudgetTrack.github.io.git main:gh-pages

cd -
```

4. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: Deploy from branch
   - Branch: `gh-pages` / `(root)`
   - Save

Your site will be available at: `https://nrok47.github.io/BudgetTrack.github.io/`

---

### Option 2: Vercel

1. **Install Vercel CLI** (optional):
```bash
npm install -g vercel
```

2. **Deploy**:
```bash
vercel
```

Or connect your GitHub repository at [vercel.com](https://vercel.com) for automatic deployments.

---

### Option 3: Netlify

1. **Install Netlify CLI** (optional):
```bash
npm install -g netlify-cli
```

2. **Build**:
```bash
npm run build
```

3. **Deploy**:
```bash
netlify deploy --prod --dir=dist
```

Or drag-and-drop the `dist` folder at [netlify.com/drop](https://app.netlify.com/drop)

---

### Option 4: Static Hosting (Apache/Nginx)

1. **Build**:
```bash
npm run build
```

2. **Copy files**:
   - Upload all files from `dist/` to your web server
   - Configure server to serve `index.html` for all routes

**Nginx Configuration**:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Apache Configuration** (.htaccess):
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## 🔧 Environment Configuration

### Base URL Configuration

If deploying to a subdirectory, update `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/subdirectory/', // e.g., '/budget-tracker/'
  // ...
})
```

---

## 📝 Pre-Deployment Checklist

- [ ] Update `projects.csv` with actual project data
- [ ] Test all features in production build (`npm run build && npm run preview`)
- [ ] Verify dark mode works correctly
- [ ] Test drag-and-drop functionality
- [ ] Verify CSV export/import works
- [ ] Check responsive design on mobile/tablet
- [ ] Test localStorage persistence
- [ ] Verify all Thai characters display correctly
- [ ] Check browser compatibility (Chrome, Firefox, Safari, Edge)

---

## 🐛 Troubleshooting Deployment

### Issue: Blank page after deployment
**Solution**: Check the `base` path in `vite.config.ts` matches your deployment path

### Issue: 404 errors on page refresh
**Solution**: Configure server to always serve `index.html` (see server configs above)

### Issue: CSV file not loading
**Solution**: Ensure `public/projects.csv` is included in the build and accessible

### Issue: Fonts not loading
**Solution**: Check Google Fonts CDN is accessible from your deployment

---

## 🔒 Security Considerations

- All data is stored client-side (localStorage)
- No backend API calls
- CSV file is publicly accessible
- Consider adding authentication if deploying with sensitive data

---

## 📊 Performance Optimization

The build is already optimized with:
- Tree shaking (removes unused code)
- Minification (compressed JS/CSS)
- Code splitting (lazy loading)
- Vite's fast build system

---

## 🔄 Continuous Deployment

For automatic deployments on every push to main:

1. Use GitHub Actions (see Option 1 above)
2. Or connect to Vercel/Netlify for auto-deploy on git push
3. Set up branch protection rules for quality control

---

## 📱 Progressive Web App (PWA) - Optional

To make the app installable, you can add:

1. **Install plugin**:
```bash
npm install -D vite-plugin-pwa
```

2. **Update vite.config.ts**:
```typescript
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Project Budget Tracker',
        short_name: 'Budget Tracker',
        description: 'ตารางกำกับและติดตามโครงการ',
        theme_color: '#2563eb',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
```

---

## 🎯 Recommended Deployment: GitHub Pages

For this project, GitHub Pages is recommended because:
- ✅ Free hosting
- ✅ HTTPS by default
- ✅ Custom domain support
- ✅ Easy integration with GitHub repository
- ✅ Automatic deployments with GitHub Actions
- ✅ Good performance with CDN

---

## 📞 Support

For deployment issues, check:
- Vite documentation: https://vitejs.dev/guide/static-deploy.html
- React documentation: https://react.dev/learn/start-a-new-react-project
- GitHub Pages docs: https://docs.github.com/en/pages
