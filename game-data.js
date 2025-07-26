// Données de jeu - RTS Medieval
const GameData = {
    // Types de ressources
    RESOURCES: {
        GOLD: 'gold',
        WOOD: 'wood',
        FOOD: 'food'
    },

    // Types d'unités
    UNITS: {
        PEASANT: 'peasant',
        SOLDIER: 'soldier',
        ARCHER: 'archer',
        KNIGHT: 'knight',
        MAGE: 'mage'
    },

    // Types de bâtiments
    BUILDINGS: {
        TOWN_HALL: 'town_hall',
        BARRACKS: 'barracks',
        FARM: 'farm',
        MINE: 'mine',
        STABLE: 'stable'
    },

    // Statistiques des unités
    UNIT_STATS: {
        peasant: {
            name: 'Paysan',
            icon: '👨‍🌾',
            health: 50,
            maxHealth: 50,
            attack: 5,
            cost: { gold: 50, food: 1 },
            buildTime: 3000
        },
        soldier: {
            name: 'Soldat',
            icon: '⚔️',
            health: 100,
            maxHealth: 100,
            attack: 15,
            cost: { gold: 100, food: 2 },
            buildTime: 5000
        },
        archer: {
            name: 'Archer',
            icon: '🏹',
            health: 80,
            maxHealth: 80,
            attack: 20,
            cost: { gold: 120, wood: 50 },
            buildTime: 4000
        },
        knight: {
            name: 'Chevalier',
            icon: '🛡️',
            health: 200,
            maxHealth: 200,
            attack: 30,
            cost: { gold: 250, food: 3 },
            buildTime: 8000
        },
        mage: {
            name: 'Mage',
            icon: '🧙‍♂️',
            health: 70,
            maxHealth: 70,
            attack: 35,
            cost: { gold: 200, food: 2 },
            buildTime: 6000
        }
    },

    // Statistiques des bâtiments
    BUILDING_STATS: {
        town_hall: {
            name: 'Hôtel de Ville',
            icon: '🏛️',
            health: 500,
            maxHealth: 500,
            cost: { gold: 500, wood: 300 },
            buildTime: 10000,
            produces: ['peasant'],
            generates: { gold: 1 }
        },
        barracks: {
            name: 'Caserne',
            icon: '🏰',
            health: 300,
            maxHealth: 300,
            cost: { gold: 200, wood: 150 },
            buildTime: 8000,
            produces: ['soldier', 'archer'],
            generates: {}
        },
        farm: {
            name: 'Ferme',
            icon: '🚜',
            health: 200,
            maxHealth: 200,
            cost: { gold: 100, wood: 100 },
            buildTime: 5000,
            produces: [],
            generates: { food: 2 }
        },
        mine: {
            name: 'Mine',
            icon: '⛏️',
            health: 250,
            maxHealth: 250,
            cost: { gold: 150, wood: 200 },
            buildTime: 6000,
            produces: [],
            generates: { gold: 3 }
        },
        stable: {
            name: 'Écurie',
            icon: '🐎',
            health: 280,
            maxHealth: 280,
            cost: { gold: 300, wood: 200 },
            buildTime: 7000,
            produces: ['knight'],
            generates: {}
        }
    },

    // Ressources initiales
    INITIAL_RESOURCES: {
        gold: 500,
        wood: 300,
        food: 100
    },

    // Taille de la carte
    MAP_SIZE: {
        width: 20,
        height: 20
    },

    // Configuration du jeu
    GAME_CONFIG: {
        resourceInterval: 2000, // Génération de ressources toutes les 2 secondes
        aiInterval: 5000, // IA joue toutes les 5 secondes
        saveInterval: 30000, // Sauvegarde toutes les 30 secondes
        maxUnits: 50,
        maxBuildings: 20
    },

    // État initial du jeu
    getInitialGameState: function(playerName) {
        return {
            player: {
                name: playerName || 'Joueur',
                resources: { ...this.INITIAL_RESOURCES },
                units: [
                    { id: 'unit1', type: 'peasant', x: 5, y: 5, health: 50, owner: 'player' },
                    { id: 'unit2', type: 'peasant', x: 6, y: 5, health: 50, owner: 'player' },
                    { id: 'unit3', type: 'soldier', x: 7, y: 5, health: 100, owner: 'player' }
                ],
                buildings: [
                    { id: 'building1', type: 'town_hall', x: 5, y: 6, health: 500, owner: 'player' }
                ]
            },
            enemy: {
                name: 'IA',
                resources: { ...this.INITIAL_RESOURCES },
                units: [
                    { id: 'enemy_unit1', type: 'soldier', x: 15, y: 15, health: 100, owner: 'enemy' },
                    { id: 'enemy_unit2', type: 'archer', x: 16, y: 15, health: 80, owner: 'enemy' }
                ],
                buildings: [
                    { id: 'enemy_building1', type: 'town_hall', x: 15, y: 16, health: 500, owner: 'enemy' }
                ]
            },
            selectedUnits: [],
            selectedBuilding: null,
            gameStatus: 'playing', // 'playing', 'paused', 'victory', 'defeat'
            turnCount: 0,
            startTime: Date.now(),
            lastSave: Date.now()
        };
    },

    // Actions possibles
    ACTIONS: {
        MOVE: 'move',
        ATTACK: 'attack',
        BUILD: 'build',
        PRODUCE: 'produce',
        GATHER: 'gather'
    },

    // Messages du jeu
    MESSAGES: {
        WELCOME: 'Bienvenue dans RTS Medieval !',
        UNIT_MOVED: 'Unité déplacée',
        UNIT_ATTACKED: 'Attaque lancée !',
        BUILDING_BUILT: 'Bâtiment construit',
        UNIT_PRODUCED: 'Nouvelle unité produite',
        INSUFFICIENT_RESOURCES: 'Ressources insuffisantes',
        POSITION_OCCUPIED: 'Position occupée',
        INVALID_ACTION: 'Action invalide',
        VICTORY: 'Victoire ! Vous avez vaincu l\'ennemi !',
        DEFEAT: 'Défaite ! L\'ennemi a détruit votre base !',
        GAME_SAVED: 'Partie sauvegardée',
        GAME_LOADED: 'Partie chargée'
    },

    // Couleurs du jeu
    COLORS: {
        PLAYER: '#2196F3',
        ENEMY: '#F44336',
        NEUTRAL: '#4CAF50',
        SELECTED: '#FF9800',
        HOVER: '#FFC107'
    },

    // Stratégies IA
    AI_STRATEGIES: {
        DEFENSIVE: 'defensive',
        AGGRESSIVE: 'aggressive',
        BALANCED: 'balanced',
        ECONOMIC: 'economic'
    },

    // Fonction utilitaire pour obtenir les stats d'une entité
    getEntityStats: function(type, category) {
        if (category === 'unit') {
            return this.UNIT_STATS[type];
        } else if (category === 'building') {
            return this.BUILDING_STATS[type];
        }
        return null;
    },

    // Fonction pour vérifier si une action est possible
    canAfford: function(cost, resources) {
        for (const resource in cost) {
            if (resources[resource] < cost[resource]) {
                return false;
            }
        }
        return true;
    },

    // Fonction pour déduire les ressources
    deductResources: function(cost, resources) {
        for (const resource in cost) {
            resources[resource] -= cost[resource];
        }
    },

    // Fonction pour générer un ID unique
    generateId: function(prefix = 'entity') {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },

    // Fonction pour calculer la distance entre deux points
    getDistance: function(x1, y1, x2, y2) {
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    },

    // Fonction pour vérifier si une position est valide
    isValidPosition: function(x, y) {
        return x >= 0 && x < this.MAP_SIZE.width && y >= 0 && y < this.MAP_SIZE.height;
    },

    // Fonction pour obtenir une position libre autour d'un point
    getFreePositionAround: function(centerX, centerY, occupiedPositions) {
        const directions = [
            { x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 },
            { x: 1, y: -1 }, { x: 1, y: 1 }, { x: -1, y: 1 }, { x: -1, y: -1 }
        ];

        for (const dir of directions) {
            const newX = centerX + dir.x;
            const newY = centerY + dir.y;
            
            if (this.isValidPosition(newX, newY)) {
                const isOccupied = occupiedPositions.some(pos => pos.x === newX && pos.y === newY);
                if (!isOccupied) {
                    return { x: newX, y: newY };
                }
            }
        }
        
        return null;
    }
};

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameData;
}