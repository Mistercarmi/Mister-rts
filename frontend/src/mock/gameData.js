// Mock data for RTS game
export const RESOURCE_TYPES = {
  GOLD: 'gold',
  WOOD: 'wood',
  FOOD: 'food'
};

export const UNIT_TYPES = {
  PEASANT: 'peasant',
  SOLDIER: 'soldier',
  ARCHER: 'archer',
  KNIGHT: 'knight',
  MAGE: 'mage'
};

export const BUILDING_TYPES = {
  TOWN_HALL: 'town_hall',
  BARRACKS: 'barracks',
  FARM: 'farm',
  MINE: 'mine',
  TOWER: 'tower',
  STABLE: 'stable'
};

export const UNIT_STATS = {
  [UNIT_TYPES.PEASANT]: {
    name: 'Paysan',
    health: 50,
    attack: 5,
    cost: { [RESOURCE_TYPES.GOLD]: 50, [RESOURCE_TYPES.FOOD]: 1 },
    buildTime: 3000,
    icon: '👨‍🌾'
  },
  [UNIT_TYPES.SOLDIER]: {
    name: 'Soldat',
    health: 100,
    attack: 15,
    cost: { [RESOURCE_TYPES.GOLD]: 100, [RESOURCE_TYPES.FOOD]: 2 },
    buildTime: 5000,
    icon: '⚔️'
  },
  [UNIT_TYPES.ARCHER]: {
    name: 'Archer',
    health: 80,
    attack: 20,
    cost: { [RESOURCE_TYPES.GOLD]: 120, [RESOURCE_TYPES.WOOD]: 50 },
    buildTime: 4000,
    icon: '🏹'
  },
  [UNIT_TYPES.KNIGHT]: {
    name: 'Chevalier',
    health: 200,
    attack: 30,
    cost: { [RESOURCE_TYPES.GOLD]: 250, [RESOURCE_TYPES.FOOD]: 3 },
    buildTime: 8000,
    icon: '🛡️'
  },
  [UNIT_TYPES.MAGE]: {
    name: 'Mage',
    health: 70,
    attack: 35,
    cost: { [RESOURCE_TYPES.GOLD]: 200, [RESOURCE_TYPES.FOOD]: 2 },
    buildTime: 6000,
    icon: '🧙‍♂️'
  }
};

export const BUILDING_STATS = {
  [BUILDING_TYPES.TOWN_HALL]: {
    name: 'Hôtel de Ville',
    health: 500,
    cost: { [RESOURCE_TYPES.GOLD]: 500, [RESOURCE_TYPES.WOOD]: 300 },
    buildTime: 10000,
    icon: '🏛️',
    produces: [UNIT_TYPES.PEASANT]
  },
  [BUILDING_TYPES.BARRACKS]: {
    name: 'Caserne',
    health: 300,
    cost: { [RESOURCE_TYPES.GOLD]: 200, [RESOURCE_TYPES.WOOD]: 150 },
    buildTime: 8000,
    icon: '🏰',
    produces: [UNIT_TYPES.SOLDIER, UNIT_TYPES.ARCHER]
  },
  [BUILDING_TYPES.FARM]: {
    name: 'Ferme',
    health: 200,
    cost: { [RESOURCE_TYPES.GOLD]: 100, [RESOURCE_TYPES.WOOD]: 100 },
    buildTime: 5000,
    icon: '🚜',
    produces: []
  },
  [BUILDING_TYPES.MINE]: {
    name: 'Mine',
    health: 250,
    cost: { [RESOURCE_TYPES.GOLD]: 150, [RESOURCE_TYPES.WOOD]: 200 },
    buildTime: 6000,
    icon: '⛏️',
    produces: []
  },
  [BUILDING_TYPES.STABLE]: {
    name: 'Écurie',
    health: 280,
    cost: { [RESOURCE_TYPES.GOLD]: 300, [RESOURCE_TYPES.WOOD]: 200 },
    buildTime: 7000,
    icon: '🐎',
    produces: [UNIT_TYPES.KNIGHT]
  }
};

export const INITIAL_RESOURCES = {
  [RESOURCE_TYPES.GOLD]: 500,
  [RESOURCE_TYPES.WOOD]: 300,
  [RESOURCE_TYPES.FOOD]: 100
};

export const INITIAL_GAME_STATE = {
  player: {
    id: 'player1',
    name: 'Joueur',
    resources: { ...INITIAL_RESOURCES },
    units: [
      {
        id: 'unit1',
        type: UNIT_TYPES.PEASANT,
        x: 5,
        y: 5,
        health: 50,
        selected: false
      },
      {
        id: 'unit2',
        type: UNIT_TYPES.PEASANT,
        x: 6,
        y: 5,
        health: 50,
        selected: false
      },
      {
        id: 'unit3',
        type: UNIT_TYPES.SOLDIER,
        x: 7,
        y: 5,
        health: 100,
        selected: false
      }
    ],
    buildings: [
      {
        id: 'building1',
        type: BUILDING_TYPES.TOWN_HALL,
        x: 5,
        y: 6,
        health: 500,
        selected: false
      }
    ]
  },
  enemy: {
    id: 'enemy1',
    name: 'IA',
    resources: { ...INITIAL_RESOURCES },
    units: [
      {
        id: 'enemy_unit1',
        type: UNIT_TYPES.SOLDIER,
        x: 15,
        y: 15,
        health: 100,
        selected: false
      },
      {
        id: 'enemy_unit2',
        type: UNIT_TYPES.ARCHER,
        x: 16,
        y: 15,
        health: 80,
        selected: false
      }
    ],
    buildings: [
      {
        id: 'enemy_building1',
        type: BUILDING_TYPES.TOWN_HALL,
        x: 15,
        y: 16,
        health: 500,
        selected: false
      }
    ]
  },
  selectedUnits: [],
  selectedBuilding: null,
  gameStatus: 'playing', // 'playing', 'paused', 'victory', 'defeat'
  mapSize: { width: 20, height: 20 }
};

export const RESOURCE_GENERATION = {
  [BUILDING_TYPES.FARM]: { [RESOURCE_TYPES.FOOD]: 2 },
  [BUILDING_TYPES.MINE]: { [RESOURCE_TYPES.GOLD]: 3 },
  [BUILDING_TYPES.TOWN_HALL]: { [RESOURCE_TYPES.GOLD]: 1 }
};