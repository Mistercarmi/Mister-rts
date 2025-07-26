# 🚀 Guide de Déploiement - RTS Medieval

Guide complet pour déployer RTS Medieval sur différentes plateformes.

## 📋 Prérequis

- Node.js 16+ et Yarn
- Python 3.8+ et pip
- MongoDB (local ou Atlas)
- Git

## 🌐 Déploiement sur Emergent (Recommandé)

### 1. Préparation
```bash
# Vérifiez que tout fonctionne localement
yarn install-all
yarn dev

# Testez sur mobile
yarn mobile-dev
```

### 2. Déploiement
1. **Connectez GitHub** dans l'interface Emergent
2. **Sauvegardez** : Cliquez "Save to GitHub"
3. **Déployez** : Cliquez "Deploy" puis "Deploy Now"
4. **Configurez** : Ajustez les variables d'environnement si nécessaire

### 3. Configuration Mobile
- L'application sera automatiquement optimisée pour mobile
- PWA installable sur iOS et Android
- Interface responsive incluse

## 🎯 Déploiement Vercel + Railway

### Frontend (Vercel)
```bash
# 1. Préparez le build
cd frontend
yarn build

# 2. Déployez sur Vercel
npx vercel --prod
```

### Backend (Railway)
```bash
# 1. Créez un projet Railway
railway login
railway init

# 2. Déployez
railway up
```

## 🌊 Déploiement Netlify + Heroku

### Frontend (Netlify)
```bash
# 1. Build
cd frontend
yarn build

# 2. Déployez
netlify deploy --prod --dir=build
```

### Backend (Heroku)
```bash
# 1. Créez l'app Heroku
heroku create rts-medieval-api

# 2. Configurez MongoDB
heroku addons:create mongolab:sandbox

# 3. Déployez
git subtree push --prefix backend heroku main
```

## 🐳 Déploiement Docker

### 1. Frontend Dockerfile
```dockerfile
# frontend/Dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn build
EXPOSE 3000
CMD ["yarn", "start"]
```

### 2. Backend Dockerfile
```dockerfile
# backend/Dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8001
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8001"]
```

### 3. Docker Compose
```yaml
# docker-compose.yml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
    environment:
      - REACT_APP_BACKEND_URL=http://backend:8001

  backend:
    build: ./backend
    ports:
      - "8001:8001"
    depends_on:
      - mongodb
    environment:
      - MONGO_URL=mongodb://mongodb:27017
      - DB_NAME=rts_medieval

  mongodb:
    image: mongo:5.0
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

## 📱 Optimisations Mobile

### PWA Configuration
```javascript
// Service Worker automatiquement configuré
// Manifest.json optimisé pour mobile
// Installation automatique sur iOS/Android
```

### Performance Mobile
```javascript
// Optimisations incluses :
// - Lazy loading
// - Image optimization
// - Touch optimizations
// - Responsive design
```

## 🔧 Variables d'Environnement

### Frontend (.env)
```env
REACT_APP_BACKEND_URL=https://votre-backend-url.com
REACT_APP_MOBILE_OPTIMIZED=true
REACT_APP_PWA_ENABLED=true
```

### Backend (.env)
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=rts_medieval
CORS_ORIGINS=https://votre-frontend-url.com
```

## 🌍 Domaine Personnalisé

### Emergent
1. Allez dans les paramètres de déploiement
2. Cliquez "Custom Domain"
3. Ajoutez votre domaine
4. Configurez les DNS

### Autres Plateformes
```bash
# Vercel
vercel domains add yourdomain.com

# Netlify
netlify domains:add yourdomain.com
```

## 📊 Monitoring et Analytics

### Monitoring Backend
```python
# Ajoutez à server.py
import logging
from fastapi import FastAPI
from prometheus_fastapi_instrumentator import Instrumentator

app = FastAPI()
Instrumentator().instrument(app).expose(app)
```

### Analytics Frontend
```javascript
// Ajoutez Google Analytics ou similaire
gtag('config', 'GA_TRACKING_ID');
```

## 🛡️ Sécurité

### Backend
```python
# Ajoutez des middlewares de sécurité
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware

app.add_middleware(HTTPSRedirectMiddleware)
```

### Frontend
```javascript
// Configuration CSP
const helmet = require('helmet');
app.use(helmet());
```

## 🔄 CI/CD

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy RTS Medieval
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Deploy to Emergent
      run: |
        # Script de déploiement automatique
```

## 📱 Tests Mobile

### Tests Automatisés
```bash
# Tests sur différents navigateurs
yarn test:mobile:ios
yarn test:mobile:android
```

### Tests Manuels
1. **iPhone Safari** : Testez l'installation PWA
2. **Android Chrome** : Vérifiez les performances
3. **Responsive** : Testez différentes tailles d'écran

## 🚨 Dépannage

### Problèmes Courants
```bash
# Build errors
yarn clean && yarn install-all

# Mobile issues
yarn mobile-dev

# Database connection
# Vérifiez MONGO_URL dans .env
```

### Logs
```bash
# Backend logs
tail -f backend/logs/app.log

# Frontend logs
# Consultez la console du navigateur
```

## 📈 Performance

### Optimisations
- **Lazy loading** des composants
- **Image optimization** automatique
- **Caching** intelligent
- **Compression** gzip

### Métriques
- **LCP** < 2.5s
- **FID** < 100ms
- **CLS** < 0.1
- **TTI** < 5s

## 🎮 Post-Déploiement

### 1. Tests
- Vérifiez toutes les fonctionnalités
- Testez sur mobile
- Validez les performances

### 2. Monitoring
- Surveillez les erreurs
- Analysez les performances
- Suivez l'utilisation

### 3. Maintenance
- Mises à jour régulières
- Surveillance des logs
- Optimisations continues

---

**Votre jeu RTS Medieval est maintenant prêt pour le monde ! 🌍⚔️**