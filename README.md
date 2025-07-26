# 🏰 RTS Medieval - Jeu de Stratégie en Temps Réel

Un jeu de stratégie en temps réel (RTS) médiéval/fantasy complet avec interface mobile-friendly, développé avec React, FastAPI et MongoDB.

## 🎮 Aperçu du Jeu

**RTS Medieval** est un jeu d'escarmouche où vous commandez une armée médiévale contre une IA ennemie. Gérez vos ressources, construisez des bâtiments, formez des unités et conquérez vos ennemis !

### Fonctionnalités Principales
- ⚔️ **Combat en temps réel** contre l'IA
- 🏗️ **Construction de bâtiments** (Hôtel de Ville, Caserne, Ferme, Mine, Écurie)
- 👥 **Gestion d'unités** (Paysans, Soldats, Archers, Chevaliers, Mages)
- 💰 **Système de ressources** (Or, Bois, Nourriture)
- 📱 **Interface mobile-friendly** optimisée pour tactile
- 🎯 **IA stratégique** qui adapte ses attaques
- 💾 **Sauvegarde automatique** en base de données

## 📱 Installation et Lancement Mobile

### Pour iPhone/iPad (iOS)

#### Option 1: Version Web (Recommandée)
1. **Accès direct** : Ouvrez Safari et allez sur l'URL de déploiement
2. **Ajouter à l'écran d'accueil** :
   - Appuyez sur le bouton "Partager" (📤) dans Safari
   - Sélectionnez "Ajouter à l'écran d'accueil"
   - Nommez l'app "RTS Medieval"
   - Appuyez sur "Ajouter"

3. **Lancez le jeu** depuis l'icône sur votre écran d'accueil

#### Option 2: Installation Locale
```bash
# 1. Clonez le repository
git clone https://github.com/votre-username/rts-medieval.git
cd rts-medieval

# 2. Installez les dépendances
cd frontend
yarn install
cd ../backend
pip install -r requirements.txt

# 3. Configurez la base de données
# Assurez-vous d'avoir MongoDB installé localement
# ou utilisez MongoDB Atlas (cloud)

# 4. Démarrez le backend
cd backend
uvicorn server:app --host 0.0.0.0 --port 8001

# 5. Démarrez le frontend (nouveau terminal)
cd frontend
yarn start

# 6. Accédez au jeu sur votre réseau local
# Trouvez l'IP de votre ordinateur (ex: 192.168.1.100)
# Sur iPhone: http://192.168.1.100:3000
```

### Pour Android

#### Option 1: Version Web
1. Ouvrez Chrome et allez sur l'URL de déploiement
2. Appuyez sur le menu (⋮) > "Ajouter à l'écran d'accueil"
3. Confirmez l'ajout
4. Lancez depuis l'icône créée

#### Option 2: Installation Locale
Suivez les mêmes étapes que pour iOS, mais utilisez Chrome ou Firefox sur Android.

## 🚀 Déploiement Production

### Déploiement sur Emergent (Recommandé)
1. **Connectez GitHub** dans l'interface Emergent
2. **Sauvegardez** : Cliquez "Save to GitHub"
3. **Déployez** : Cliquez "Deploy" puis "Deploy Now"
4. **Partagez** l'URL générée avec vos amis

### Déploiement Manuel
```bash
# Build pour production
cd frontend
yarn build

# Déployez sur votre service préféré (Vercel, Netlify, etc.)
# Le backend peut être déployé sur Heroku, Railway, etc.
```

## 🎯 Guide de Jeu Mobile

### Contrôles Tactiles
- **Sélection d'unité** : Appuyez sur l'unité
- **Déplacement** : Sélectionnez une unité puis appuyez sur la destination
- **Attaque** : Sélectionnez une unité puis appuyez sur la cible ennemie
- **Construction** : Sélectionnez un paysan > "Construire" > choisissez le bâtiment > appuyez sur l'emplacement
- **Production** : Appuyez sur un bâtiment > sélectionnez l'unité à produire

### Ressources
- **💰 Or** : Généré par les Mines et l'Hôtel de Ville
- **🪵 Bois** : Collecté par les Paysans
- **🍞 Nourriture** : Générée par les Fermes

### Unités
- **👨‍🌾 Paysan** : Récolte ressources et construit bâtiments
- **⚔️ Soldat** : Unité de combat rapproché
- **🏹 Archer** : Unité de combat à distance
- **🛡️ Chevalier** : Unité lourde avec beaucoup de vie
- **🧙‍♂️ Mage** : Unité magique avec attaque puissante

### Bâtiments
- **🏛️ Hôtel de Ville** : Produit des Paysans, génère de l'Or
- **🏰 Caserne** : Produit Soldats et Archers
- **🚜 Ferme** : Génère de la Nourriture
- **⛏️ Mine** : Génère de l'Or
- **🐎 Écurie** : Produit des Chevaliers

## 🔧 Configuration Technique

### Variables d'Environnement
```env
# Frontend (.env)
REACT_APP_BACKEND_URL=https://votre-backend-url.com

# Backend (.env)
MONGO_URL=mongodb://localhost:27017
DB_NAME=rts_medieval
```

### Optimisations Mobile
- **Responsive Design** : Interface adaptée aux écrans tactiles
- **Touch-friendly** : Boutons et zones de clic optimisées
- **Performance** : Animations fluides à 60fps
- **PWA Ready** : Peut être installée comme une app native

## 🛠️ Structure du Projet

```
rts-medieval/
├── frontend/                 # Application React
│   ├── src/
│   │   ├── components/      # Composants du jeu
│   │   ├── services/        # Services API
│   │   ├── hooks/           # Hooks personnalisés
│   │   └── mock/            # Données de test
│   └── public/              # Fichiers statiques
├── backend/                 # API FastAPI
│   ├── models/              # Modèles de données
│   ├── services/            # Logique métier
│   ├── routes/              # Routes API
│   └── server.py            # Serveur principal
└── README.md               # Ce fichier
```

## 🎮 Conseils de Stratégie

### Début de Partie
1. **Explorez** la carte avec vos Paysans
2. **Construisez** des Fermes pour la nourriture
3. **Bâtissez** des Mines pour l'or
4. **Formez** une armée équilibrée

### Tactiques Avancées
- **Micro-management** : Contrôlez individuellement vos unités
- **Économie** : Équilibrez production et expansion
- **Défense** : Protégez vos bâtiments de production
- **Attaque** : Ciblez les bâtiments ennemis prioritaires

## 🐛 Dépannage

### Problèmes Courants
- **Connexion API** : Vérifiez que le backend est démarré
- **Ressources insuffisantes** : Construisez plus de bâtiments de production
- **Unités qui ne répondent pas** : Rechargez la page
- **Performance lente** : Fermez les autres applications

### Support Mobile
- **iPhone** : iOS 12+ et Safari
- **Android** : Android 7+ et Chrome
- **Connexion** : WiFi recommandé pour les meilleures performances

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
- Rapporter des bugs
- Proposer des améliorations
- Ajouter de nouvelles fonctionnalités
- Améliorer l'interface mobile

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

## 👨‍💻 Développé avec

- **Frontend** : React, TailwindCSS, Axios
- **Backend** : FastAPI, MongoDB, Python
- **Mobile** : PWA, Responsive Design
- **Déploiement** : Emergent Platform

---

**Amusez-vous bien et que la meilleure stratégie gagne ! ⚔️🏰**