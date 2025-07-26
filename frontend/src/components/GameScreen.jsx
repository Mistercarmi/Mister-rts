import React, { useState, useEffect } from 'react';
import { toast } from '../hooks/use-toast';
import GameMap from './GameMap';
import ResourcePanel from './ResourcePanel';
import UnitPanel from './UnitPanel';
import BuildingPanel from './BuildingPanel';
import BuildMenu from './BuildMenu';
import GameUI from './GameUI';
import { INITIAL_GAME_STATE, UNIT_STATS, BUILDING_STATS, RESOURCE_GENERATION } from '../mock/gameData';

const GameScreen = () => {
  const [gameState, setGameState] = useState(INITIAL_GAME_STATE);
  const [showBuildMenu, setShowBuildMenu] = useState(false);
  const [buildingToBuild, setBuildingToBuild] = useState(null);
  const [unitProduction, setUnitProduction] = useState([]);

  // Resource generation every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (gameState.gameStatus === 'playing') {
        setGameState(prev => ({
          ...prev,
          player: {
            ...prev.player,
            resources: {
              ...prev.player.resources,
              gold: prev.player.resources.gold + calculateResourceGeneration(prev.player.buildings, 'gold'),
              wood: prev.player.resources.wood + calculateResourceGeneration(prev.player.buildings, 'wood'),
              food: prev.player.resources.food + calculateResourceGeneration(prev.player.buildings, 'food')
            }
          }
        }));
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [gameState.gameStatus]);

  const calculateResourceGeneration = (buildings, resourceType) => {
    return buildings.reduce((total, building) => {
      const generation = RESOURCE_GENERATION[building.type];
      return total + (generation?.[resourceType] || 0);
    }, 0);
  };

  const handleCellClick = (x, y) => {
    if (buildingToBuild) {
      handleBuildBuilding(buildingToBuild, x, y);
      setBuildingToBuild(null);
    } else {
      // Move selected units to clicked position
      if (gameState.selectedUnits.length > 0) {
        moveUnits(gameState.selectedUnits, x, y);
      }
    }
  };

  const handleUnitClick = (unit) => {
    if (unit.id.startsWith('enemy_')) {
      // Attack enemy unit if player units are selected
      if (gameState.selectedUnits.length > 0) {
        attackTarget(gameState.selectedUnits[0], unit);
      }
    } else {
      // Select/deselect player unit
      setGameState(prev => ({
        ...prev,
        selectedUnits: prev.selectedUnits.find(u => u.id === unit.id) 
          ? prev.selectedUnits.filter(u => u.id !== unit.id)
          : [...prev.selectedUnits, unit],
        selectedBuilding: null
      }));
    }
  };

  const handleBuildingClick = (building) => {
    if (building.id.startsWith('enemy_')) {
      // Attack enemy building if player units are selected
      if (gameState.selectedUnits.length > 0) {
        attackTarget(gameState.selectedUnits[0], building);
      }
    } else {
      // Select player building
      setGameState(prev => ({
        ...prev,
        selectedBuilding: building,
        selectedUnits: []
      }));
    }
  };

  const moveUnits = (units, targetX, targetY) => {
    setGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        units: prev.player.units.map(unit => 
          units.find(u => u.id === unit.id) 
            ? { ...unit, x: targetX, y: targetY }
            : unit
        )
      }
    }));
    
    toast({
      title: "Unité déplacée",
      description: `Unité déplacée vers (${targetX}, ${targetY})`,
    });
  };

  const attackTarget = (attacker, target) => {
    const attackerStats = UNIT_STATS[attacker.type];
    const damage = attackerStats.attack;
    
    setGameState(prev => {
      const newState = { ...prev };
      
      if (target.id.startsWith('enemy_unit')) {
        newState.enemy.units = newState.enemy.units.map(unit => 
          unit.id === target.id 
            ? { ...unit, health: Math.max(0, unit.health - damage) }
            : unit
        ).filter(unit => unit.health > 0);
      } else if (target.id.startsWith('enemy_building')) {
        newState.enemy.buildings = newState.enemy.buildings.map(building => 
          building.id === target.id 
            ? { ...building, health: Math.max(0, building.health - damage) }
            : building
        ).filter(building => building.health > 0);
      }
      
      return newState;
    });
    
    toast({
      title: "Attaque!",
      description: `${damage} dégâts infligés à la cible`,
    });
  };

  const handleUnitAction = (action, unitId) => {
    switch (action) {
      case 'move':
        toast({
          title: "Mode déplacement",
          description: "Cliquez sur une case pour déplacer l'unité",
        });
        break;
      case 'attack':
        toast({
          title: "Mode attaque",
          description: "Cliquez sur une cible ennemie pour l'attaquer",
        });
        break;
      case 'gather':
        toast({
          title: "Récolte",
          description: "Le paysan commence à récolter des ressources",
        });
        break;
      case 'build':
        setShowBuildMenu(true);
        break;
      default:
        break;
    }
  };

  const handleBuildUnit = (unitType, buildingId) => {
    const unitStats = UNIT_STATS[unitType];
    const canAfford = Object.entries(unitStats.cost).every(([resource, amount]) => 
      gameState.player.resources[resource] >= amount
    );

    if (!canAfford) {
      toast({
        title: "Ressources insuffisantes",
        description: "Vous n'avez pas assez de ressources pour cette unité",
      });
      return;
    }

    // Deduct resources
    setGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        resources: {
          ...prev.player.resources,
          ...Object.entries(unitStats.cost).reduce((acc, [resource, amount]) => ({
            ...acc,
            [resource]: prev.player.resources[resource] - amount
          }), {})
        }
      }
    }));

    // Start unit production
    const productionId = Date.now().toString();
    setUnitProduction(prev => [...prev, {
      id: productionId,
      unitType,
      buildingId,
      startTime: Date.now(),
      duration: unitStats.buildTime
    }]);

    toast({
      title: "Production démarrée",
      description: `${unitStats.name} en cours de production`,
    });

    // Complete production after build time
    setTimeout(() => {
      const building = gameState.player.buildings.find(b => b.id === buildingId);
      if (building) {
        const newUnit = {
          id: `unit_${Date.now()}`,
          type: unitType,
          x: building.x + 1,
          y: building.y,
          health: unitStats.health,
          selected: false
        };

        setGameState(prev => ({
          ...prev,
          player: {
            ...prev.player,
            units: [...prev.player.units, newUnit]
          }
        }));

        setUnitProduction(prev => prev.filter(p => p.id !== productionId));

        toast({
          title: "Unité prête",
          description: `${unitStats.name} a été produite`,
        });
      }
    }, unitStats.buildTime);
  };

  const handleBuildBuilding = (buildingType, x, y) => {
    const buildingStats = BUILDING_STATS[buildingType];
    const canAfford = Object.entries(buildingStats.cost).every(([resource, amount]) => 
      gameState.player.resources[resource] >= amount
    );

    if (!canAfford) {
      toast({
        title: "Ressources insuffisantes",
        description: "Vous n'avez pas assez de ressources pour ce bâtiment",
      });
      return;
    }

    // Check if position is free
    const positionOccupied = [
      ...gameState.player.units,
      ...gameState.player.buildings,
      ...gameState.enemy.units,
      ...gameState.enemy.buildings
    ].some(entity => entity.x === x && entity.y === y);

    if (positionOccupied) {
      toast({
        title: "Position occupée",
        description: "Cette position est déjà occupée",
      });
      return;
    }

    // Deduct resources and build
    setGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        resources: {
          ...prev.player.resources,
          ...Object.entries(buildingStats.cost).reduce((acc, [resource, amount]) => ({
            ...acc,
            [resource]: prev.player.resources[resource] - amount
          }), {})
        },
        buildings: [...prev.player.buildings, {
          id: `building_${Date.now()}`,
          type: buildingType,
          x,
          y,
          health: buildingStats.health,
          selected: false
        }]
      }
    }));

    toast({
      title: "Bâtiment construit",
      description: `${buildingStats.name} a été construit`,
    });
  };

  const handlePause = () => {
    setGameState(prev => ({
      ...prev,
      gameStatus: prev.gameStatus === 'playing' ? 'paused' : 'playing'
    }));
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <div className="p-4">
        <GameUI 
          gameState={gameState} 
          onPause={handlePause}
          onSettings={() => toast({ title: "Options", description: "Fonctionnalité à venir" })}
        />
      </div>
      
      <div className="p-4 pt-0">
        <ResourcePanel resources={gameState.player.resources} />
      </div>

      <div className="flex-1 flex">
        <GameMap 
          gameState={gameState}
          onCellClick={handleCellClick}
          onUnitClick={handleUnitClick}
          onBuildingClick={handleBuildingClick}
        />
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <UnitPanel 
          selectedUnits={gameState.selectedUnits}
          onUnitAction={handleUnitAction}
          playerResources={gameState.player.resources}
        />
        <BuildingPanel 
          selectedBuilding={gameState.selectedBuilding}
          onBuildUnit={handleBuildUnit}
          playerResources={gameState.player.resources}
        />
      </div>

      <BuildMenu 
        isVisible={showBuildMenu}
        onBuildBuilding={(buildingType) => {
          setBuildingToBuild(buildingType);
          setShowBuildMenu(false);
          toast({
            title: "Mode construction",
            description: "Cliquez sur une case libre pour construire",
          });
        }}
        playerResources={gameState.player.resources}
        onClose={() => setShowBuildMenu(false)}
      />
    </div>
  );
};

export default GameScreen;