// Logique de jeu - RTS Medieval
class GameLogic {
    constructor() {
        this.gameState = null;
        this.gameMode = 'playing'; // 'playing', 'paused', 'victory', 'defeat'
        this.selectedEntities = [];
        this.pendingAction = null;
        this.aiStrategy = GameData.AI_STRATEGIES.BALANCED;
        this.aiLastMove = Date.now();
        this.resourceLastUpdate = Date.now();
    }

    // Initialiser le jeu
    initGame(playerName) {
        this.gameState = GameData.getInitialGameState(playerName);
        this.gameMode = 'playing';
        this.selectedEntities = [];
        this.saveGame();
        return this.gameState;
    }

    // Sauvegarder le jeu
    saveGame() {
        try {
            const saveData = {
                gameState: this.gameState,
                gameMode: this.gameMode,
                timestamp: Date.now()
            };
            localStorage.setItem('rts_medieval_save', JSON.stringify(saveData));
            return true;
        } catch (error) {
            console.error('Erreur de sauvegarde:', error);
            return false;
        }
    }

    // Charger le jeu
    loadGame() {
        try {
            const saveData = localStorage.getItem('rts_medieval_save');
            if (saveData) {
                const parsed = JSON.parse(saveData);
                this.gameState = parsed.gameState;
                this.gameMode = parsed.gameMode;
                return true;
            }
        } catch (error) {
            console.error('Erreur de chargement:', error);
        }
        return false;
    }

    // Obtenir l'état actuel du jeu
    getGameState() {
        return this.gameState;
    }

    // Sélectionner une entité
    selectEntity(x, y) {
        if (!this.gameState) return null;

        // Chercher une unité à cette position
        const unit = this.findEntityAt(x, y, 'unit');
        if (unit && unit.owner === 'player') {
            this.selectedEntities = [unit];
            return { type: 'unit', entity: unit };
        }

        // Chercher un bâtiment à cette position
        const building = this.findEntityAt(x, y, 'building');
        if (building && building.owner === 'player') {
            this.selectedEntities = [building];
            return { type: 'building', entity: building };
        }

        // Aucune entité sélectionnée
        this.selectedEntities = [];
        return null;
    }

    // Trouver une entité à une position donnée
    findEntityAt(x, y, type) {
        if (!this.gameState) return null;

        if (type === 'unit') {
            return [...this.gameState.player.units, ...this.gameState.enemy.units]
                .find(unit => unit.x === x && unit.y === y);
        } else if (type === 'building') {
            return [...this.gameState.player.buildings, ...this.gameState.enemy.buildings]
                .find(building => building.x === x && building.y === y);
        }

        return null;
    }

    // Vérifier si une position est occupée
    isPositionOccupied(x, y) {
        return this.findEntityAt(x, y, 'unit') || this.findEntityAt(x, y, 'building');
    }

    // Déplacer une unité
    moveUnit(unit, targetX, targetY) {
        if (!this.gameState || !unit || unit.owner !== 'player') {
            return { success: false, message: GameData.MESSAGES.INVALID_ACTION };
        }

        if (!GameData.isValidPosition(targetX, targetY)) {
            return { success: false, message: 'Position invalide' };
        }

        if (this.isPositionOccupied(targetX, targetY)) {
            return { success: false, message: GameData.MESSAGES.POSITION_OCCUPIED };
        }

        unit.x = targetX;
        unit.y = targetY;
        
        this.saveGame();
        return { success: true, message: GameData.MESSAGES.UNIT_MOVED };
    }

    // Attaquer une cible
    attackTarget(attacker, target) {
        if (!this.gameState || !attacker || !target || attacker.owner !== 'player') {
            return { success: false, message: GameData.MESSAGES.INVALID_ACTION };
        }

        if (target.owner === 'player') {
            return { success: false, message: 'Impossible d\'attaquer ses propres unités' };
        }

        const attackerStats = GameData.getEntityStats(attacker.type, 'unit');
        const damage = attackerStats.attack;
        
        target.health -= damage;
        
        if (target.health <= 0) {
            this.removeEntity(target);
        }

        this.checkVictoryConditions();
        this.saveGame();
        return { success: true, message: GameData.MESSAGES.UNIT_ATTACKED };
    }

    // Construire un bâtiment
    buildBuilding(buildingType, x, y) {
        if (!this.gameState) {
            return { success: false, message: GameData.MESSAGES.INVALID_ACTION };
        }

        const buildingStats = GameData.getEntityStats(buildingType, 'building');
        if (!buildingStats) {
            return { success: false, message: 'Type de bâtiment invalide' };
        }

        if (!GameData.canAfford(buildingStats.cost, this.gameState.player.resources)) {
            return { success: false, message: GameData.MESSAGES.INSUFFICIENT_RESOURCES };
        }

        if (!GameData.isValidPosition(x, y)) {
            return { success: false, message: 'Position invalide' };
        }

        if (this.isPositionOccupied(x, y)) {
            return { success: false, message: GameData.MESSAGES.POSITION_OCCUPIED };
        }

        GameData.deductResources(buildingStats.cost, this.gameState.player.resources);

        const newBuilding = {
            id: GameData.generateId('building'),
            type: buildingType,
            x: x,
            y: y,
            health: buildingStats.health,
            owner: 'player'
        };

        this.gameState.player.buildings.push(newBuilding);
        this.saveGame();
        return { success: true, message: GameData.MESSAGES.BUILDING_BUILT };
    }

    // Produire une unité
    produceUnit(building, unitType) {
        if (!this.gameState || !building || building.owner !== 'player') {
            return { success: false, message: GameData.MESSAGES.INVALID_ACTION };
        }

        const buildingStats = GameData.getEntityStats(building.type, 'building');
        const unitStats = GameData.getEntityStats(unitType, 'unit');

        if (!buildingStats || !unitStats) {
            return { success: false, message: 'Type d\'unité invalide' };
        }

        if (!buildingStats.produces.includes(unitType)) {
            return { success: false, message: 'Ce bâtiment ne peut pas produire cette unité' };
        }

        if (!GameData.canAfford(unitStats.cost, this.gameState.player.resources)) {
            return { success: false, message: GameData.MESSAGES.INSUFFICIENT_RESOURCES };
        }

        const occupiedPositions = this.getAllOccupiedPositions();
        const unitPosition = GameData.getFreePositionAround(building.x, building.y, occupiedPositions);

        if (!unitPosition) {
            return { success: false, message: 'Aucune position libre pour créer l\'unité' };
        }

        GameData.deductResources(unitStats.cost, this.gameState.player.resources);

        const newUnit = {
            id: GameData.generateId('unit'),
            type: unitType,
            x: unitPosition.x,
            y: unitPosition.y,
            health: unitStats.health,
            owner: 'player'
        };

        this.gameState.player.units.push(newUnit);
        this.saveGame();
        return { success: true, message: GameData.MESSAGES.UNIT_PRODUCED };
    }

    // Obtenir toutes les positions occupées
    getAllOccupiedPositions() {
        const positions = [];
        
        [...this.gameState.player.units, ...this.gameState.enemy.units].forEach(unit => {
            positions.push({ x: unit.x, y: unit.y });
        });
        
        [...this.gameState.player.buildings, ...this.gameState.enemy.buildings].forEach(building => {
            positions.push({ x: building.x, y: building.y });
        });

        return positions;
    }

    // Supprimer une entité
    removeEntity(entity) {
        if (!this.gameState) return;

        if (entity.owner === 'player') {
            this.gameState.player.units = this.gameState.player.units.filter(u => u.id !== entity.id);
            this.gameState.player.buildings = this.gameState.player.buildings.filter(b => b.id !== entity.id);
        } else {
            this.gameState.enemy.units = this.gameState.enemy.units.filter(u => u.id !== entity.id);
            this.gameState.enemy.buildings = this.gameState.enemy.buildings.filter(b => b.id !== entity.id);
        }
    }

    // Mettre à jour les ressources
    updateResources() {
        if (!this.gameState) return;

        const now = Date.now();
        if (now - this.resourceLastUpdate < GameData.GAME_CONFIG.resourceInterval) {
            return;
        }

        this.gameState.player.buildings.forEach(building => {
            const stats = GameData.getEntityStats(building.type, 'building');
            if (stats.generates) {
                Object.keys(stats.generates).forEach(resource => {
                    this.gameState.player.resources[resource] += stats.generates[resource];
                });
            }
        });

        this.resourceLastUpdate = now;
    }

    // IA - Logique de l'ennemi
    processAI() {
        if (!this.gameState || this.gameMode !== 'playing') return;

        const now = Date.now();
        if (now - this.aiLastMove < GameData.GAME_CONFIG.aiInterval) {
            return;
        }

        this.aiLastMove = now;

        // Stratégie IA simple
        this.aiMoveUnits();
        this.aiAttackNearbyEnemies();
        this.aiProduceUnits();
    }

    // IA - Déplacer les unités
    aiMoveUnits() {
        this.gameState.enemy.units.forEach(unit => {
            if (Math.random() < 0.3) { // 30% de chance de bouger
                const playerUnits = this.gameState.player.units;
                const playerBuildings = this.gameState.player.buildings;
                
                // Trouve la cible la plus proche
                let nearestTarget = null;
                let minDistance = Infinity;
                
                [...playerUnits, ...playerBuildings].forEach(target => {
                    const distance = GameData.getDistance(unit.x, unit.y, target.x, target.y);
                    if (distance < minDistance) {
                        minDistance = distance;
                        nearestTarget = target;
                    }
                });

                if (nearestTarget) {
                    // Déplace vers la cible
                    const deltaX = nearestTarget.x - unit.x;
                    const deltaY = nearestTarget.y - unit.y;
                    
                    let newX = unit.x;
                    let newY = unit.y;
                    
                    if (deltaX > 0) newX = Math.min(unit.x + 1, GameData.MAP_SIZE.width - 1);
                    else if (deltaX < 0) newX = Math.max(unit.x - 1, 0);
                    
                    if (deltaY > 0) newY = Math.min(unit.y + 1, GameData.MAP_SIZE.height - 1);
                    else if (deltaY < 0) newY = Math.max(unit.y - 1, 0);
                    
                    // Vérifie si la position est libre
                    if (!this.isPositionOccupied(newX, newY)) {
                        unit.x = newX;
                        unit.y = newY;
                    }
                }
            }
        });
    }

    // IA - Attaquer les ennemis proches
    aiAttackNearbyEnemies() {
        this.gameState.enemy.units.forEach(unit => {
            const playerUnits = this.gameState.player.units;
            const playerBuildings = this.gameState.player.buildings;
            
            [...playerUnits, ...playerBuildings].forEach(target => {
                const distance = GameData.getDistance(unit.x, unit.y, target.x, target.y);
                if (distance === 1) { // Adjacent
                    const unitStats = GameData.getEntityStats(unit.type, 'unit');
                    target.health -= unitStats.attack;
                    
                    if (target.health <= 0) {
                        this.removeEntity(target);
                    }
                }
            });
        });
    }

    // IA - Produire des unités
    aiProduceUnits() {
        if (Math.random() < 0.2) { // 20% de chance de produire
            const townHalls = this.gameState.enemy.buildings.filter(b => b.type === 'town_hall');
            const barracks = this.gameState.enemy.buildings.filter(b => b.type === 'barracks');
            
            [...townHalls, ...barracks].forEach(building => {
                const stats = GameData.getEntityStats(building.type, 'building');
                if (stats.produces.length > 0) {
                    const unitType = stats.produces[Math.floor(Math.random() * stats.produces.length)];
                    const unitStats = GameData.getEntityStats(unitType, 'unit');
                    
                    if (GameData.canAfford(unitStats.cost, this.gameState.enemy.resources)) {
                        const occupiedPositions = this.getAllOccupiedPositions();
                        const unitPosition = GameData.getFreePositionAround(building.x, building.y, occupiedPositions);
                        
                        if (unitPosition) {
                            GameData.deductResources(unitStats.cost, this.gameState.enemy.resources);
                            
                            const newUnit = {
                                id: GameData.generateId('enemy_unit'),
                                type: unitType,
                                x: unitPosition.x,
                                y: unitPosition.y,
                                health: unitStats.health,
                                owner: 'enemy'
                            };
                            
                            this.gameState.enemy.units.push(newUnit);
                        }
                    }
                }
            });
        }
    }

    // Vérifier les conditions de victoire
    checkVictoryConditions() {
        if (!this.gameState) return;

        const playerTownHalls = this.gameState.player.buildings.filter(b => b.type === 'town_hall');
        const enemyTownHalls = this.gameState.enemy.buildings.filter(b => b.type === 'town_hall');

        if (enemyTownHalls.length === 0) {
            this.gameMode = 'victory';
            return 'victory';
        }

        if (playerTownHalls.length === 0) {
            this.gameMode = 'defeat';
            return 'defeat';
        }

        return 'playing';
    }

    // Gérer les clics sur la carte
    handleMapClick(x, y) {
        if (!this.gameState || this.gameMode !== 'playing') return null;

        // Si on a une unité sélectionnée et qu'on clique sur une case vide
        if (this.selectedEntities.length > 0 && this.selectedEntities[0].owner === 'player') {
            const selectedEntity = this.selectedEntities[0];
            
            // Si c'est une unité
            if (this.gameState.player.units.includes(selectedEntity)) {
                // Vérifier s'il y a une cible ennemie
                const target = this.findEntityAt(x, y, 'unit') || this.findEntityAt(x, y, 'building');
                
                if (target && target.owner === 'enemy') {
                    // Attaquer
                    return this.attackTarget(selectedEntity, target);
                } else {
                    // Déplacer
                    return this.moveUnit(selectedEntity, x, y);
                }
            }
        }

        // Sinon, sélectionner l'entité à cette position
        const selection = this.selectEntity(x, y);
        return { success: true, selection: selection };
    }

    // Obtenir les entités sélectionnées
    getSelectedEntities() {
        return this.selectedEntities;
    }

    // Mettre le jeu en pause
    pauseGame() {
        this.gameMode = this.gameMode === 'playing' ? 'paused' : 'playing';
        return this.gameMode;
    }

    // Redémarrer le jeu
    restartGame(playerName) {
        localStorage.removeItem('rts_medieval_save');
        return this.initGame(playerName);
    }

    // Obtenir le mode de jeu actuel
    getGameMode() {
        return this.gameMode;
    }

    // Mise à jour principale du jeu
    update() {
        if (this.gameMode === 'playing') {
            this.updateResources();
            this.processAI();
            this.checkVictoryConditions();
        }
    }
}

// Instance globale du jeu
const gameLogic = new GameLogic();

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameLogic;
}