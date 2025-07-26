# 🏰 RTS Medieval - Jeu Mobile HTML5

Un jeu de stratégie en temps réel (RTS) médiéval/fantasy **100% HTML5** optimisé pour iPhone et Android, jouable directement depuis GitHub Pages.

## 🎮 Jouer Maintenant

### ▶️ Accès Direct
Cliquez simplement sur le lien GitHub Pages pour jouer immédiatement :
**[▶️ JOUER MAINTENANT](https://votre-username.github.io/rts-medieval)**

### 📱 Installation sur iPhone
1. **Ouvrez Safari** et allez sur le lien ci-dessus
2. **Appuyez sur "Partager"** (📤) en bas de l'écran
3. **Sélectionnez "Ajouter à l'écran d'accueil"**
4. **Nommez "RTS Medieval"** et appuyez sur "Ajouter"
5. **Lancez depuis l'icône** sur votre écran d'accueil

### 📱 Installation sur Android
1. **Ouvrez Chrome** et allez sur le lien ci-dessus
2. **Appuyez sur le menu** (⋮) en haut à droite
3. **Sélectionnez "Ajouter à l'écran d'accueil"**
4. **Confirmez l'installation**
5. **Lancez depuis l'icône** créée

## 🎯 Pourquoi cette version ?

### ✅ Avantages
- **Aucune installation requise** - Joue directement dans le navigateur
- **Pas de serveur nécessaire** - Fonctionne 100% côté client
- **Sauvegarde locale** - Vos parties sont sauvées dans le navigateur
- **Fonctionne hors ligne** - Jouez même sans connexion
- **Optimisé mobile** - Interface tactile parfaite pour iPhone/Android
- **Progressive Web App** - Installable comme une vraie app
- **Pas de compilation** - Code HTML/CSS/JavaScript pur

### 🚀 Hébergement GitHub Pages
Le jeu est automatiquement hébergé sur GitHub Pages :
1. **Forkez** ce repository
2. **Activez GitHub Pages** dans les paramètres
3. **Votre jeu est en ligne** à `https://votre-username.github.io/rts-medieval`

## 🎮 Fonctionnalités du Jeu

### 🏗️ Bâtiments
- **🏛️ Hôtel de Ville** - Produit des paysans, génère de l'or
- **🏰 Caserne** - Produit soldats et archers
- **🚜 Ferme** - Génère de la nourriture
- **⛏️ Mine** - Génère de l'or
- **🐎 Écurie** - Produit des chevaliers

### 👥 Unités
- **👨‍🌾 Paysan** - Récolte ressources et construit
- **⚔️ Soldat** - Combat rapproché
- **🏹 Archer** - Combat à distance
- **🛡️ Chevalier** - Unité lourde
- **🧙‍♂️ Mage** - Attaques magiques

### 💰 Ressources
- **💰 Or** - Monnaie principale
- **🪵 Bois** - Matériau de construction
- **🍞 Nourriture** - Maintien des unités

### 🤖 IA Ennemie
- **Stratégie adaptative** - L'IA s'adapte à votre style
- **Production automatique** - Crée des unités en continu
- **Attaques coordonnées** - Cible vos points faibles

## 🎯 Comment Jouer

### 🎮 Contrôles Tactiles
- **Tap** - Sélectionner une unité/bâtiment
- **Tap sur case vide** - Déplacer l'unité sélectionnée
- **Tap sur ennemi** - Attaquer la cible
- **Boutons d'action** - Construire, produire, etc.

### 📱 Interface Mobile
- **Mode paysage recommandé** - Meilleure expérience
- **Zones tactiles optimisées** - Boutons assez grands
- **Notifications visuelles** - Feedback des actions
- **Sauvegarde automatique** - Partie sauvée en continu

### 🎯 Objectifs
1. **Développez** votre base avec des bâtiments
2. **Formez** une armée équilibrée
3. **Gérez** vos ressources efficacement
4. **Attaquez** et détruisez la base ennemie
5. **Victoire** - Détruisez l'Hôtel de Ville ennemi

## 📁 Structure du Projet

```
rts-medieval/
├── index.html          # Page principale
├── style.css           # Styles et animations
├── app.js              # Application principale
├── game-data.js        # Données du jeu
├── game-logic.js       # Logique de jeu
├── game-ui.js          # Interface utilisateur
├── manifest.json       # Configuration PWA
├── sw.js              # Service Worker
└── README.md          # Ce fichier
```

## 🔧 Développement Local

### Installation
```bash
# 1. Clonez le repository
git clone https://github.com/votre-username/rts-medieval.git
cd rts-medieval

# 2. Lancez un serveur local
# Option 1: Python
python -m http.server 8000

# Option 2: Node.js
npx http-server

# Option 3: Live Server (VSCode)
# Installez l'extension Live Server et cliquez "Go Live"
```

### Test Mobile
```bash
# Trouvez l'IP de votre ordinateur
ipconfig  # Windows
ifconfig  # Mac/Linux

# Accédez depuis votre téléphone
http://[votre-IP]:8000
```

## 🚀 Déploiement

### GitHub Pages (Recommandé)
1. **Forkez** ce repository
2. **Activez GitHub Pages** :
   - Allez dans Settings
   - Scroll vers GitHub Pages
   - Source: "Deploy from a branch"
   - Branch: "main" / "master"
   - Folder: "/ (root)"
3. **Votre jeu est en ligne** !

### Autres Plateformes
- **Netlify** : Drag & drop le dossier
- **Vercel** : Import depuis GitHub
- **Surge.sh** : `surge .` dans le dossier

## 📱 Optimisations Mobile

### Performance
- **Pas de frameworks lourds** - HTML/CSS/JS pur
- **Animations 60fps** - Optimisées pour mobile
- **Service Worker** - Cache intelligent
- **Lazy loading** - Chargement progressif

### Compatibilité
- **iOS 12+** - Safari optimisé
- **Android 7+** - Chrome optimisé
- **PWA compliant** - Installable
- **Responsive design** - S'adapte aux écrans

### Fonctionnalités
- **Mode hors ligne** - Jouez sans connexion
- **Sauvegarde locale** - Vos parties persistent
- **Notifications** - Feedback visuel
- **Gestion d'orientation** - Paysage recommandé

## 🎮 Conseils de Jeu

### 🏁 Début de Partie
1. **Construisez des fermes** - Sécurisez votre nourriture
2. **Bâtissez des mines** - Générez de l'or
3. **Formez des paysans** - Étendez votre économie
4. **Construisez une caserne** - Préparez la guerre

### ⚔️ Stratégie
- **Équilibrez** économie et militaire
- **Protégez** vos bâtiments de production
- **Diversifiez** votre armée
- **Attaquez** les points faibles ennemis

### 🏆 Victoire
- **Détruisez l'Hôtel de Ville** ennemi
- **Éliminez toutes les unités** ennemies
- **Survivez** aux attaques de l'IA

## 🐛 Dépannage

### Problèmes Courants
- **Jeu ne se charge pas** : Rechargez la page
- **Interface trop petite** : Tournez en mode paysage
- **Partie non sauvée** : Vérifiez le stockage du navigateur
- **Performances lentes** : Fermez les autres onglets

### Support
- **iPhone** : iOS 12+ avec Safari
- **Android** : Android 7+ avec Chrome
- **Desktop** : Chrome, Firefox, Safari, Edge

## 🤝 Contribution

### Améliorations Possibles
- **Nouvelles unités** - Ajoutez des types d'unités
- **Cartes multiples** - Différents terrains
- **Multijoueur** - Bataille entre joueurs
- **Campagne** - Mode histoire
- **Améliorations** - Système d'upgrades

### Comment Contribuer
1. **Forkez** le projet
2. **Créez** une branche feature
3. **Commitez** vos changements
4. **Pushez** vers votre fork
5. **Créez** une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

## 🎉 Crédits

- **Concept** : Jeu RTS classique adapté pour mobile
- **Développement** : HTML5, CSS3, JavaScript ES6
- **Icônes** : Emojis natifs pour compatibilité maximale
- **Animations** : CSS3 avec optimisations mobile

---

**🏰 Amusez-vous bien et que la meilleure stratégie gagne ! ⚔️**

## 🔗 Liens Utiles

- [Jouer au jeu](https://votre-username.github.io/rts-medieval)
- [Code source](https://github.com/votre-username/rts-medieval)
- [Signaler un bug](https://github.com/votre-username/rts-medieval/issues)
- [Contribuer](https://github.com/votre-username/rts-medieval/pulls)