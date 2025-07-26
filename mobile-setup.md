# 📱 Guide d'Installation Mobile - RTS Medieval

Guide détaillé pour installer et jouer à RTS Medieval sur votre téléphone mobile.

## 🍎 Installation sur iPhone/iPad

### Méthode 1: Application Web (PWA) - Recommandée

1. **Ouvrez Safari** sur votre iPhone/iPad
2. **Allez sur l'URL** : `https://votre-url-de-deploiement.com`
3. **Attendez le chargement** complet du jeu
4. **Ajoutez à l'écran d'accueil** :
   - Appuyez sur l'icône "Partager" (📤) en bas de l'écran
   - Faites défiler et sélectionnez "Ajouter à l'écran d'accueil"
   - Changez le nom en "RTS Medieval" si désiré
   - Appuyez sur "Ajouter"

5. **Lancez le jeu** depuis l'icône sur votre écran d'accueil

### Méthode 2: Installation Locale

**Prérequis :**
- iPhone/iPad avec iOS 12+
- Ordinateur sur le même réseau WiFi
- Xcode (pour le développement avancé)

**Étapes :**

1. **Sur votre ordinateur** :
```bash
# Clonez le projet
git clone https://github.com/votre-username/rts-medieval.git
cd rts-medieval

# Installez les dépendances
cd frontend && yarn install
cd ../backend && pip install -r requirements.txt

# Configurez les variables d'environnement
# Dans frontend/.env, remplacez par l'IP de votre ordinateur
echo "REACT_APP_BACKEND_URL=http://192.168.1.100:8001" > frontend/.env
```

2. **Trouvez l'IP de votre ordinateur** :
   - **Mac** : `ifconfig | grep inet`
   - **Windows** : `ipconfig`
   - **Linux** : `ip addr show`

3. **Démarrez les services** :
```bash
# Terminal 1 - Backend
cd backend
uvicorn server:app --host 0.0.0.0 --port 8001

# Terminal 2 - Frontend
cd frontend
yarn start
```

4. **Sur votre iPhone** :
   - Ouvrez Safari
   - Allez à `http://[IP-DE-VOTRE-ORDINATEUR]:3000`
   - Exemple : `http://192.168.1.100:3000`

## 🤖 Installation sur Android

### Méthode 1: Application Web (PWA)

1. **Ouvrez Chrome** sur votre Android
2. **Allez sur l'URL** : `https://votre-url-de-deploiement.com`
3. **Attendez le chargement** complet
4. **Ajoutez à l'écran d'accueil** :
   - Appuyez sur le menu (⋮) en haut à droite
   - Sélectionnez "Ajouter à l'écran d'accueil"
   - Confirmez le nom "RTS Medieval"
   - Appuyez sur "Ajouter"

5. **Lancez** depuis l'icône créée

### Méthode 2: Installation Locale

Suivez les mêmes étapes que pour iPhone, mais utilisez Chrome sur Android.

## 🎮 Optimisations pour Mobile

### Contrôles Tactiles Optimisés

**Gestures Supportés :**
- **Tap** : Sélection d'unité/bâtiment
- **Tap & Hold** : Informations détaillées
- **Double Tap** : Action rapide
- **Swipe** : Navigation sur la carte
- **Pinch** : Zoom (si implémenté)

**Zones de Clic Agrandies :**
- Unités : 40x40px minimum
- Bâtiments : 48x48px minimum
- Boutons : 44x44px minimum (standard iOS)

### Interface Mobile-Friendly

**Adaptations :**
- **Panels flottants** : Informations contextuelles
- **Boutons plus grands** : Faciles à presser
- **Feedback visuel** : Confirmations d'actions
- **Notifications** : Alerts pour événements importants

## 🔧 Configuration Avancée

### Performance Mobile

**Optimisations :**
```javascript
// Dans votre .env
REACT_APP_MOBILE_OPTIMIZED=true
REACT_APP_REDUCE_ANIMATIONS=false
REACT_APP_ENABLE_TOUCH_FEEDBACK=true
```

**Paramètres recommandés :**
- **Fréquence d'images** : 60fps
- **Résolution** : Auto-adaptative
- **Batterie** : Mode économie disponible

### Connectivité

**Réseau :**
- **WiFi** : Recommandé pour les meilleures performances
- **4G/5G** : Supporté avec optimisations
- **Hors ligne** : Sauvegarde locale temporaire

## 🛠️ Dépannage Mobile

### Problèmes Courants

**Le jeu ne se charge pas :**
1. Vérifiez votre connexion internet
2. Rechargez la page (pull down dans Safari)
3. Videz le cache du navigateur
4. Redémarrez le navigateur

**Interface trop petite :**
1. Orientez l'écran en paysage
2. Utilisez le zoom du navigateur
3. Ajustez la taille de police du système

**Contrôles ne répondent pas :**
1. Désactivez d'autres applications
2. Redémarrez l'application
3. Vérifiez la mémoire disponible

**Performances lentes :**
1. Fermez les applications en arrière-plan
2. Activez le mode économie d'énergie
3. Réduisez les animations dans les paramètres

### Compatibilité

**iOS :**
- **Minimum** : iOS 12+
- **Recommandé** : iOS 15+
- **Navigateur** : Safari (optimal), Chrome (supporté)

**Android :**
- **Minimum** : Android 7+
- **Recommandé** : Android 10+
- **Navigateur** : Chrome (optimal), Firefox (supporté)

## 🎯 Conseils de Jeu Mobile

### Stratégies Tactiles

**Gestion d'Unités :**
- **Sélection multiple** : Tap plusieurs unités rapidement
- **Déplacement de groupe** : Sélectionnez puis tap destination
- **Formation** : Organisez vos unités en formations

**Interface Efficace :**
- **Raccourcis** : Mémorisez les zones de boutons
- **Gestures** : Utilisez les gestes pour naviguer
- **Priorités** : Concentrez-vous sur les actions importantes

### Modes de Jeu

**Mode Portrait :**
- Interface compacte
- Contrôles essentiels
- Parfait pour les actions rapides

**Mode Paysage :**
- Vue complète de la carte
- Tous les contrôles disponibles
- Expérience optimale

## 📊 Statistiques et Suivi

### Métriques de Performance

**Surveillance :**
- FPS en temps réel
- Latence réseau
- Utilisation mémoire
- État de la batterie

**Optimisations Auto :**
- Réduction automatique de la qualité si nécessaire
- Mise en pause pendant les appels
- Sauvegarde automatique avant fermeture

## 🔄 Mises à Jour

### Système de Mise à Jour

**Auto-Update :**
- Vérification automatique des mises à jour
- Installation transparente
- Notification des nouveautés

**Mises à Jour Manuelles :**
- Rechargement de la page
- Vider le cache si nécessaire
- Redémarrage de l'application

---

**Profitez de RTS Medieval sur mobile ! 📱⚔️**