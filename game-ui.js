// Interface utilisateur - RTS Medieval
class GameUI {
    constructor() {
        this.currentScreen = 'loading';
        this.mapCells = [];
        this.selectedCell = null;
        this.buildingMode = false;
        this.buildingType = null;
        this.gameLoop = null;
        this.notificationTimeout = null;
    }

    // Initialiser l'interface
    init() {
        this.showLoadingScreen();
        this.setupEventListeners();
        this.createMapGrid();
        
        // Simuler le chargement
        setTimeout(() => {
            this.showStartScreen();
        }, 3000);
    }

    // Afficher l'écran de chargement
    showLoadingScreen() {
        this.currentScreen = 'loading';
        document.getElementById('loading-screen').classList.remove('hidden');
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('game-screen').classList.add('hidden');
    }

    // Afficher l'écran de démarrage
    showStartScreen() {
        this.currentScreen = 'start';
        document.getElementById('loading-screen').classList.add('hidden');
        document.getElementById('start-screen').classList.remove('hidden');
        document.getElementById('game-screen').classList.add('hidden');
        
        // Focus sur le champ de nom
        document.getElementById('player-name').focus();
    }

    // Afficher l'écran de jeu
    showGameScreen() {
        this.currentScreen = 'game';
        document.getElementById('loading-screen').classList.add('hidden');
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('game-screen').classList.remove('hidden');
        
        this.startGameLoop();
    }

    // Configurer les événements
    setupEventListeners() {
        // Bouton démarrer
        document.getElementById('start-btn').addEventListener('click', () => {
            this.startGame();
        });

        // Entrée clavier sur le nom
        document.getElementById('player-name').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.startGame();
            }
        });

        // Boutons de contrôle
        document.getElementById('pause-btn').addEventListener('click', () => {
            this.togglePause();
        });

        document.getElementById('menu-btn').addEventListener('click', () => {
            this.togglePause();
        });

        document.getElementById('resume-btn').addEventListener('click', () => {
            this.togglePause();
        });

        document.getElementById('save-btn').addEventListener('click', () => {
            this.saveGame();
        });

        document.getElementById('restart-btn').addEventListener('click', () => {
            this.restartGame();
        });

        // Menu de construction
        document.getElementById('close-build-menu').addEventListener('click', () => {
            this.closeBuildMenu();
        });

        document.querySelectorAll('.build-option').forEach(option => {
            option.addEventListener('click', () => {
                this.selectBuildingType(option.dataset.building);
            });
        });

        // Prévenir le zoom sur mobile
        document.addEventListener('touchmove', (e) => {
            if (e.scale !== 1) {
                e.preventDefault();
            }
        }, { passive: false });

        // Gestion des notifications tactiles
        document.addEventListener('touchstart', (e) => {
            if (e.target.classList.contains('map-cell')) {
                e.target.classList.add('touch-active');
            }
        });

        document.addEventListener('touchend', (e) => {
            if (e.target.classList.contains('map-cell')) {
                e.target.classList.remove('touch-active');
            }
        });
    }

    // Créer la grille de la carte
    createMapGrid() {
        const mapGrid = document.getElementById('map-grid');
        mapGrid.innerHTML = '';
        this.mapCells = [];

        for (let y = 0; y < GameData.MAP_SIZE.height; y++) {
            for (let x = 0; x < GameData.MAP_SIZE.width; x++) {
                const cell = document.createElement('div');
                cell.className = 'map-cell';
                cell.dataset.x = x;
                cell.dataset.y = y;
                
                cell.addEventListener('click', () => {
                    this.handleCellClick(x, y);
                });

                mapGrid.appendChild(cell);
                this.mapCells.push(cell);
            }
        }
    }

    // Démarrer le jeu
    startGame() {
        const playerName = document.getElementById('player-name').value.trim();
        if (!playerName) {
            this.showNotification('Veuillez entrer votre nom', 'error');
            return;
        }

        gameLogic.initGame(playerName);
        this.showGameScreen();
        this.updateDisplay();
        this.showNotification(`Bienvenue ${playerName} ! Que la bataille commence !`, 'success');
    }

    // Gérer les clics sur les cellules
    handleCellClick(x, y) {
        if (this.buildingMode && this.buildingType) {
            // Mode construction
            const result = gameLogic.buildBuilding(this.buildingType, x, y);
            this.showNotification(result.message, result.success ? 'success' : 'error');
            
            if (result.success) {
                this.closeBuildMenu();
            }
        } else {
            // Mode normal
            const result = gameLogic.handleMapClick(x, y);
            if (result && result.message) {
                this.showNotification(result.message, result.success ? 'success' : 'error');
            }
        }
        
        this.updateDisplay();
    }

    // Mettre à jour l'affichage
    updateDisplay() {
        const gameState = gameLogic.getGameState();
        if (!gameState) return;

        this.updateResources(gameState.player.resources);
        this.updateMap(gameState);
        this.updateInfoPanel();
        this.updateActionPanel();
        this.checkGameStatus();
    }

    // Mettre à jour les ressources
    updateResources(resources) {
        document.getElementById('gold-count').textContent = resources.gold;
        document.getElementById('wood-count').textContent = resources.wood;
        document.getElementById('food-count').textContent = resources.food;
    }

    // Mettre à jour la carte
    updateMap(gameState) {
        // Réinitialiser les cellules
        this.mapCells.forEach(cell => {
            cell.className = 'map-cell';
            cell.innerHTML = '';
        });

        // Afficher les unités du joueur
        gameState.player.units.forEach(unit => {
            const cell = this.getCellAt(unit.x, unit.y);
            if (cell) {
                cell.classList.add('player');
                const unitStats = GameData.getEntityStats(unit.type, 'unit');
                cell.innerHTML = `<span class="unit-icon">${unitStats.icon}</span>`;
            }
        });

        // Afficher les bâtiments du joueur
        gameState.player.buildings.forEach(building => {
            const cell = this.getCellAt(building.x, building.y);
            if (cell) {
                cell.classList.add('player');
                const buildingStats = GameData.getEntityStats(building.type, 'building');
                cell.innerHTML = `<span class="building-icon">${buildingStats.icon}</span>`;
            }
        });

        // Afficher les unités ennemies
        gameState.enemy.units.forEach(unit => {
            const cell = this.getCellAt(unit.x, unit.y);
            if (cell) {
                cell.classList.add('enemy');
                const unitStats = GameData.getEntityStats(unit.type, 'unit');
                cell.innerHTML = `<span class="unit-icon">${unitStats.icon}</span>`;
            }
        });

        // Afficher les bâtiments ennemis
        gameState.enemy.buildings.forEach(building => {
            const cell = this.getCellAt(building.x, building.y);
            if (cell) {
                cell.classList.add('enemy');
                const buildingStats = GameData.getEntityStats(building.type, 'building');
                cell.innerHTML = `<span class="building-icon">${buildingStats.icon}</span>`;
            }
        });

        // Marquer la sélection
        const selectedEntities = gameLogic.getSelectedEntities();
        selectedEntities.forEach(entity => {
            const cell = this.getCellAt(entity.x, entity.y);
            if (cell) {
                cell.classList.add('selected');
            }
        });
    }

    // Obtenir la cellule à une position
    getCellAt(x, y) {
        return this.mapCells.find(cell => 
            parseInt(cell.dataset.x) === x && parseInt(cell.dataset.y) === y
        );
    }

    // Mettre à jour le panneau d'informations
    updateInfoPanel() {
        const selectedEntities = gameLogic.getSelectedEntities();
        const infoPanel = document.getElementById('selection-info');

        if (selectedEntities.length === 0) {
            infoPanel.innerHTML = '<p>Sélectionnez une unité ou un bâtiment</p>';
            return;
        }

        const entity = selectedEntities[0];
        const stats = GameData.getEntityStats(entity.type, 
            entity.hasOwnProperty('attack') ? 'unit' : 'building');

        if (stats) {
            infoPanel.innerHTML = `
                <h3>${stats.icon} ${stats.name}</h3>
                <p>Vie: ${entity.health}/${stats.health}</p>
                ${stats.attack ? `<p>Attaque: ${stats.attack}</p>` : ''}
                ${entity.owner === 'player' ? '<p style="color: #42a5f5;">Vos forces</p>' : '<p style="color: #f44336;">Ennemi</p>'}
            `;
        }
    }

    // Mettre à jour le panneau d'actions
    updateActionPanel() {
        const selectedEntities = gameLogic.getSelectedEntities();
        const actionButtons = document.getElementById('action-buttons');
        actionButtons.innerHTML = '';

        if (selectedEntities.length === 0 || selectedEntities[0].owner !== 'player') {
            return;
        }

        const entity = selectedEntities[0];
        const gameState = gameLogic.getGameState();

        // Actions pour les unités
        if (gameState.player.units.includes(entity)) {
            actionButtons.innerHTML = `
                <button class="action-btn" onclick="ui.showNotification('Cliquez sur une case pour déplacer', 'info')">
                    🚶 Déplacer
                </button>
                <button class="action-btn" onclick="ui.showNotification('Cliquez sur un ennemi pour attaquer', 'info')">
                    ⚔️ Attaquer
                </button>
            `;

            // Actions spéciales pour les paysans
            if (entity.type === 'peasant') {
                actionButtons.innerHTML += `
                    <button class="action-btn" onclick="ui.openBuildMenu()">
                        🏗️ Construire
                    </button>
                    <button class="action-btn" onclick="ui.showNotification('Fonction à venir', 'info')">
                        ⛏️ Récolter
                    </button>
                `;
            }
        }

        // Actions pour les bâtiments
        if (gameState.player.buildings.includes(entity)) {
            const buildingStats = GameData.getEntityStats(entity.type, 'building');
            if (buildingStats.produces && buildingStats.produces.length > 0) {
                buildingStats.produces.forEach(unitType => {
                    const unitStats = GameData.getEntityStats(unitType, 'unit');
                    const canAfford = GameData.canAfford(unitStats.cost, gameState.player.resources);
                    
                    actionButtons.innerHTML += `
                        <button class="action-btn ${canAfford ? '' : 'disabled'}" 
                                onclick="ui.produceUnit('${unitType}')"
                                ${canAfford ? '' : 'disabled'}>
                            ${unitStats.icon} ${unitStats.name}<br>
                            <small>${this.formatCost(unitStats.cost)}</small>
                        </button>
                    `;
                });
            }
        }
    }

    // Formater le coût
    formatCost(cost) {
        const parts = [];
        if (cost.gold) parts.push(`💰${cost.gold}`);
        if (cost.wood) parts.push(`🪵${cost.wood}`);
        if (cost.food) parts.push(`🍞${cost.food}`);
        return parts.join(' ');
    }

    // Produire une unité
    produceUnit(unitType) {
        const selectedEntities = gameLogic.getSelectedEntities();
        if (selectedEntities.length === 0) return;

        const building = selectedEntities[0];
        const result = gameLogic.produceUnit(building, unitType);
        this.showNotification(result.message, result.success ? 'success' : 'error');
        this.updateDisplay();
    }

    // Ouvrir le menu de construction
    openBuildMenu() {
        this.buildingMode = true;
        document.getElementById('build-menu').classList.remove('hidden');
        
        // Mettre à jour les options disponibles
        const gameState = gameLogic.getGameState();
        document.querySelectorAll('.build-option').forEach(option => {
            const buildingType = option.dataset.building;
            const buildingStats = GameData.getEntityStats(buildingType, 'building');
            const canAfford = GameData.canAfford(buildingStats.cost, gameState.player.resources);
            
            option.classList.toggle('disabled', !canAfford);
        });
    }

    // Fermer le menu de construction
    closeBuildMenu() {
        this.buildingMode = false;
        this.buildingType = null;
        document.getElementById('build-menu').classList.add('hidden');
    }

    // Sélectionner un type de bâtiment
    selectBuildingType(buildingType) {
        const gameState = gameLogic.getGameState();
        const buildingStats = GameData.getEntityStats(buildingType, 'building');
        
        if (!GameData.canAfford(buildingStats.cost, gameState.player.resources)) {
            this.showNotification('Ressources insuffisantes', 'error');
            return;
        }

        this.buildingType = buildingType;
        this.closeBuildMenu();
        this.showNotification(`Cliquez sur une case libre pour construire ${buildingStats.name}`, 'info');
    }

    // Basculer la pause
    togglePause() {
        const mode = gameLogic.pauseGame();
        document.getElementById('pause-menu').classList.toggle('hidden', mode === 'playing');
        
        if (mode === 'paused') {
            this.stopGameLoop();
        } else {
            this.startGameLoop();
        }
    }

    // Sauvegarder le jeu
    saveGame() {
        const saved = gameLogic.saveGame();
        this.showNotification(saved ? 'Partie sauvegardée' : 'Erreur de sauvegarde', 
                             saved ? 'success' : 'error');
    }

    // Redémarrer le jeu
    restartGame() {
        if (confirm('Êtes-vous sûr de vouloir redémarrer ?')) {
            const playerName = gameLogic.getGameState().player.name;
            gameLogic.restartGame(playerName);
            this.updateDisplay();
            this.showNotification('Partie redémarrée', 'success');
            document.getElementById('pause-menu').classList.add('hidden');
            this.startGameLoop();
        }
    }

    // Vérifier le statut du jeu
    checkGameStatus() {
        const mode = gameLogic.getGameMode();
        
        if (mode === 'victory') {
            this.stopGameLoop();
            this.showNotification('🎉 Victoire ! Vous avez vaincu l\'ennemi !', 'success');
            setTimeout(() => {
                if (confirm('Félicitations ! Voulez-vous rejouer ?')) {
                    this.restartGame();
                }
            }, 2000);
        } else if (mode === 'defeat') {
            this.stopGameLoop();
            this.showNotification('💀 Défaite ! L\'ennemi a détruit votre base !', 'error');
            setTimeout(() => {
                if (confirm('Vous avez été vaincu ! Voulez-vous réessayer ?')) {
                    this.restartGame();
                }
            }, 2000);
        }
    }

    // Afficher une notification
    showNotification(message, type = 'info') {
        const notifications = document.getElementById('notifications');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        notifications.appendChild(notification);
        
        // Supprimer après 3 secondes
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    // Démarrer la boucle de jeu
    startGameLoop() {
        if (this.gameLoop) return;
        
        this.gameLoop = setInterval(() => {
            gameLogic.update();
            this.updateDisplay();
        }, 1000); // Mise à jour toutes les secondes
    }

    // Arrêter la boucle de jeu
    stopGameLoop() {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
    }
}

// Instance globale de l'interface
const ui = new GameUI();

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameUI;
}