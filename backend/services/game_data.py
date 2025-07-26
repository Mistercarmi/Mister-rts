# Game data constants
RESOURCE_TYPES = {
    "GOLD": "gold",
    "WOOD": "wood",
    "FOOD": "food"
}

UNIT_TYPES = {
    "PEASANT": "peasant",
    "SOLDIER": "soldier",
    "ARCHER": "archer",
    "KNIGHT": "knight",
    "MAGE": "mage"
}

BUILDING_TYPES = {
    "TOWN_HALL": "town_hall",
    "BARRACKS": "barracks",
    "FARM": "farm",
    "MINE": "mine",
    "TOWER": "tower",
    "STABLE": "stable"
}

UNIT_STATS = {
    "peasant": {
        "name": "Paysan",
        "health": 50,
        "attack": 5,
        "cost": {"gold": 50, "food": 1},
        "buildTime": 3000,
        "icon": "👨‍🌾"
    },
    "soldier": {
        "name": "Soldat",
        "health": 100,
        "attack": 15,
        "cost": {"gold": 100, "food": 2},
        "buildTime": 5000,
        "icon": "⚔️"
    },
    "archer": {
        "name": "Archer",
        "health": 80,
        "attack": 20,
        "cost": {"gold": 120, "wood": 50},
        "buildTime": 4000,
        "icon": "🏹"
    },
    "knight": {
        "name": "Chevalier",
        "health": 200,
        "attack": 30,
        "cost": {"gold": 250, "food": 3},
        "buildTime": 8000,
        "icon": "🛡️"
    },
    "mage": {
        "name": "Mage",
        "health": 70,
        "attack": 35,
        "cost": {"gold": 200, "food": 2},
        "buildTime": 6000,
        "icon": "🧙‍♂️"
    }
}

BUILDING_STATS = {
    "town_hall": {
        "name": "Hôtel de Ville",
        "health": 500,
        "cost": {"gold": 500, "wood": 300},
        "buildTime": 10000,
        "icon": "🏛️",
        "produces": ["peasant"]
    },
    "barracks": {
        "name": "Caserne",
        "health": 300,
        "cost": {"gold": 200, "wood": 150},
        "buildTime": 8000,
        "icon": "🏰",
        "produces": ["soldier", "archer"]
    },
    "farm": {
        "name": "Ferme",
        "health": 200,
        "cost": {"gold": 100, "wood": 100},
        "buildTime": 5000,
        "icon": "🚜",
        "produces": []
    },
    "mine": {
        "name": "Mine",
        "health": 250,
        "cost": {"gold": 150, "wood": 200},
        "buildTime": 6000,
        "icon": "⛏️",
        "produces": []
    },
    "stable": {
        "name": "Écurie",
        "health": 280,
        "cost": {"gold": 300, "wood": 200},
        "buildTime": 7000,
        "icon": "🐎",
        "produces": ["knight"]
    }
}

INITIAL_RESOURCES = {
    "gold": 500,
    "wood": 300,
    "food": 100
}

RESOURCE_GENERATION = {
    "farm": {"food": 2},
    "mine": {"gold": 3},
    "town_hall": {"gold": 1}
}