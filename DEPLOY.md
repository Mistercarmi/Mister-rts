# 🚀 Guide de Déploiement - RTS Medieval

Guide complet pour déployer votre jeu RTS Medieval sur GitHub Pages et autres plateformes.

## 📋 Pré-requis

✅ **Aucun !** Ce projet est 100% HTML5 et ne nécessite :
- ❌ Pas de Node.js
- ❌ Pas de compilation
- ❌ Pas de serveur backend
- ❌ Pas de base de données
- ❌ Pas de dépendances externes

## 🎯 Déploiement GitHub Pages (Recommandé)

### Étape 1 : Préparer votre Repository
```bash
# 1. Forkez ou clonez ce repository
git clone https://github.com/votre-username/rts-medieval.git
cd rts-medieval

# 2. Vérifiez que tous les fichiers sont présents
ls -la
# Vous devriez voir :
# - index.html
# - style.css
# - app.js
# - game-data.js
# - game-logic.js
# - game-ui.js
# - manifest.json
# - sw.js
# - README.md
```

### Étape 2 : Activer GitHub Pages
1. **Allez sur GitHub.com** et ouvrez votre repository
2. **Cliquez sur "Settings"** (onglet en haut)
3. **Scrollez vers "Pages"** (menu de gauche)
4. **Configurez la source** :
   - Source: "Deploy from a branch"
   - Branch: "main" (ou "master")
   - Folder: "/ (root)"
5. **Cliquez "Save"**

### Étape 3 : Accéder à votre jeu
- **URL automatique** : `https://votre-username.github.io/rts-medieval`
- **Délai** : 5-10 minutes pour la première activation
- **Vérification** : Visitez l'URL dans votre navigateur

### Étape 4 : Test Mobile
1. **Ouvrez l'URL sur votre téléphone**
2. **Testez l'installation PWA** :
   - iPhone : Safari > Partager > Ajouter à l'écran d'accueil
   - Android : Chrome > Menu > Ajouter à l'écran d'accueil

## 📱 Optimisation pour Mobile

### Configuration iOS
```html
<!-- Déjà inclus dans index.html -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="RTS Medieval">
<link rel="apple-touch-icon" href="icon-192.png">
```

### Configuration Android
```json
// Déjà inclus dans manifest.json
{
  "display": "standalone",
  "orientation": "landscape-primary",
  "theme_color": "#764ba2",
  "background_color": "#667eea"
}
```

## 🌐 Autres Plateformes de Déploiement

### Netlify
```bash
# Option 1 : Drag & Drop
# 1. Zippez votre dossier
# 2. Allez sur netlify.com
# 3. Glissez-déposez votre zip

# Option 2 : Git
# 1. Connectez votre repository GitHub
# 2. Build settings : Aucun
# 3. Publish directory : .
```

### Vercel
```bash
# Option 1 : Import depuis GitHub
# 1. Allez sur vercel.com
# 2. "Import Project"
# 3. Sélectionnez votre repository
# 4. Deploy

# Option 2 : CLI
npm i -g vercel
vercel --prod
```

### Surge.sh
```bash
# Installation
npm install -g surge

# Déploiement
cd rts-medieval
surge .
# Suivez les instructions
```

### Firebase Hosting
```bash
# Installation
npm install -g firebase-tools

# Initialisation
firebase init hosting

# Configuration
# Public directory : .
# Single-page app : No
# Overwrite index.html : No

# Déploiement
firebase deploy
```

## 🎮 Personnalisation

### Modifier les Icônes
Remplacez les icônes dans `manifest.json` :
```json
{
  "icons": [
    {
      "src": "votre-icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

### Personnaliser les Couleurs
Modifiez `style.css` :
```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --accent-color: #42a5f5;
}
```

### Ajouter des Fonctionnalités
Modifiez `game-data.js` pour ajouter :
- Nouvelles unités
- Nouveaux bâtiments
- Nouvelles ressources
- Nouvelles cartes

## 🔧 Domaine Personnalisé

### GitHub Pages
1. **Créez un fichier `CNAME`** dans la racine :
```bash
echo "votre-domaine.com" > CNAME
```

2. **Configurez votre DNS** :
```
Type: CNAME
Name: www
Value: votre-username.github.io
```

### Netlify
1. **Allez dans Domain settings**
2. **Add custom domain**
3. **Configurez le DNS selon les instructions**

## 🚀 Optimisations Avancées

### Compression
```bash
# Minifiez vos fichiers CSS/JS si nécessaire
# (Optionnel car le jeu est déjà optimisé)
```

### Service Worker
Le service worker est déjà configuré pour :
- **Cache intelligent** des ressources
- **Fonctionnement hors ligne**
- **Mises à jour automatiques**

### Performance
```javascript
// Déjà optimisé dans app.js
// - Lazy loading
// - Gestion mémoire
// - Optimisations mobile
```

## 📊 Analytics (Optionnel)

### Google Analytics
Ajoutez dans `index.html` :
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

## 🔒 Sécurité

### Headers de Sécurité
Pour GitHub Pages, ajoutez `_headers` :
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
```

### Content Security Policy
Ajoutez dans `index.html` :
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';">
```

## 🧪 Tests

### Test Local
```bash
# Serveur local simple
python -m http.server 8000
# Ou
npx http-server

# Test mobile
# Utilisez l'IP de votre ordinateur
http://192.168.1.100:8000
```

### Test Production
```bash
# Lighthouse (Performance)
npx lighthouse https://votre-domaine.com --view

# Test PWA
# Vérifiez l'installation sur mobile
```

## 🐛 Dépannage

### Problèmes Courants

**GitHub Pages ne se met pas à jour :**
```bash
# Forcez un nouveau commit
git commit --allow-empty -m "Trigger GitHub Pages rebuild"
git push
```

**Service Worker ne fonctionne pas :**
```javascript
// Vérifiez dans la console
navigator.serviceWorker.ready.then(registration => {
  console.log('SW ready:', registration);
});
```

**Problèmes de cache :**
```bash
# Videz le cache du navigateur
# Ou changez le nom du cache dans sw.js
```

## 📱 Test sur Appareils

### iPhone
1. **Safari** > Développeur > Simulateur
2. **BrowserStack** pour tests réels
3. **TestFlight** pour distribution

### Android
1. **Chrome DevTools** > Device Mode
2. **Android Studio** > AVD Manager
3. **BrowserStack** pour tests réels

## 🎯 Checklist de Déploiement

- [ ] Tous les fichiers présents
- [ ] GitHub Pages activé
- [ ] URL accessible
- [ ] Test mobile iPhone
- [ ] Test mobile Android
- [ ] Installation PWA fonctionne
- [ ] Fonctionnement hors ligne
- [ ] Performance acceptable
- [ ] Pas d'erreurs console
- [ ] Domaine personnalisé (optionnel)
- [ ] Analytics configuré (optionnel)

## 🎉 Succès !

Votre jeu RTS Medieval est maintenant :
- ✅ **En ligne** sur GitHub Pages
- ✅ **Installable** sur mobile
- ✅ **Optimisé** pour la performance
- ✅ **Fonctionnel** hors ligne
- ✅ **Accessible** partout dans le monde

**Partagez le lien avec vos amis et amusez-vous ! 🏰⚔️**

---

**URL de votre jeu :** `https://votre-username.github.io/rts-medieval`