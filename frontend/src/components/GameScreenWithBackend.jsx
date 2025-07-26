import React, { useState, useEffect } from 'react';
import { toast } from '../hooks/use-toast';
import GameMap from './GameMap';
import ResourcePanel from './ResourcePanel';
import UnitPanel from './UnitPanel';
import BuildingPanel from './BuildingPanel';
import BuildMenu from './BuildMenu';
import GameUI from './GameUI';
import GameService from '../services/gameService';
import { UNIT_STATS, BUILDING_STATS } from '../mock/gameData';
import { Button } from './ui/button';
import { Card } from './ui/card';

const GameScreenWithBackend = () => {
  const [gameState, setGameState] = useState(null);
  const [showBuildMenu, setShowBuildMenu] = useState(false);
  const [buildingToBuild, setBuildingToBuild] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gameCreated, setGameCreated] = useState(false);
  const [playerName, setPlayerName] = useState('');

  // Resource generation and AI turn every 3 seconds
  useEffect(() => {
    if (!gameState || gameState.game_status !== 'playing') return;

    const interval = setInterval(async () => {
      try {
        // Update resources
        const updatedGame = await GameService.updateResources(gameState.id);
        
        // Execute AI turn
        const gameWithAI = await GameService.aiTurn(updatedGame.id);
        
        setGameState(gameWithAI);
      } catch (error) {
        console.error('Error in game loop:', error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [gameState]);

  // Check for completed productions
  useEffect(() => {
    if (!gameState) return;

    const checkProductions = async () => {
      try {
        const productions = await GameService.getPendingProductions(gameState.id);
        const completedProductions = productions.filter(p => 
          new Date(p.end_time) <= new Date()
        );

        if (completedProductions.length > 0) {
          // Refresh game state to get new units
          const refreshedGame = await GameService.getGame(gameState.id);
          setGameState(refreshedGame);
        }
      } catch (error) {
        console.error('Error checking productions:', error);
      }
    };

    const interval = setInterval(checkProductions, 1000);
    return () => clearInterval(interval);
  }, [gameState]);

  const createGame = async () => {
    if (!playerName.trim()) {
      toast({
        title: "Nom requis",
        description: "Veuillez entrer votre nom pour commencer",
      });
      return;
    }

    setLoading(true);
    try {
      const newGame = await GameService.createGame(playerName);
      setGameState(newGame);
      setGameCreated(true);
      toast({
        title: "Partie créée",
        description: `Bienvenue ${playerName}! Votre bataille commence!`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la partie",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCellClick = async (x, y) => {
    if (!gameState) return;

    if (buildingToBuild) {
      await handleBuildBuilding(buildingToBuild, x, y);
      setBuildingToBuild(null);
    } else {
      // Move selected units to clicked position
      if (gameState.selected_units && gameState.selected_units.length > 0) {
        await moveUnits(gameState.selected_units, x, y);
      }
    }
  };

  const handleUnitClick = async (unit) => {
    if (!gameState) return;

    if (unit.id.startsWith('enemy_')) {
      // Attack enemy unit if player units are selected
      if (gameState.selected_units && gameState.selected_units.length > 0) {
        const attackerUnit = gameState.player.units.find(u => u.id === gameState.selected_units[0]);
        if (attackerUnit) {
          await attackTarget(attackerUnit.id, unit.id);
        }
      }
    } else {
      // Select/deselect player unit
      const newSelectedUnits = gameState.selected_units.includes(unit.id)
        ? gameState.selected_units.filter(id => id !== unit.id)
        : [...gameState.selected_units, unit.id];

      setGameState(prev => ({
        ...prev,
        selected_units: newSelectedUnits,
        selected_building: null
      }));
    }
  };

  const handleBuildingClick = async (building) => {
    if (!gameState) return;

    if (building.id.startsWith('enemy_')) {
      // Attack enemy building if player units are selected
      if (gameState.selected_units && gameState.selected_units.length > 0) {
        const attackerUnit = gameState.player.units.find(u => u.id === gameState.selected_units[0]);
        if (attackerUnit) {
          await attackTarget(attackerUnit.id, building.id);
        }
      }
    } else {
      // Select player building
      setGameState(prev => ({
        ...prev,
        selected_building: building.id,
        selected_units: []
      }));
    }
  };

  const moveUnits = async (unitIds, targetX, targetY) => {
    if (!gameState) return;

    try {
      const updatedGame = await GameService.moveUnits(gameState.id, unitIds, targetX, targetY);
      setGameState(updatedGame);
      
      toast({
        title: "Unité déplacée",
        description: `Unité déplacée vers (${targetX}, ${targetY})`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de déplacer l'unité",
      });
    }
  };

  const attackTarget = async (attackerId, targetId) => {
    if (!gameState) return;

    try {
      const updatedGame = await GameService.attackTarget(gameState.id, attackerId, targetId);
      setGameState(updatedGame);
      
      toast({
        title: "Attaque!",
        description: "Dégâts infligés à la cible",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'attaquer la cible",
      });
    }
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

  const handleBuildUnit = async (unitType, buildingId) => {
    if (!gameState) return;

    try {
      const production = await GameService.produceUnit(gameState.id, buildingId, unitType);
      
      // Update game state to reflect resource changes
      const updatedGame = await GameService.getGame(gameState.id);
      setGameState(updatedGame);

      const unitStats = UNIT_STATS[unitType];
      toast({
        title: "Production démarrée",
        description: `${unitStats.name} en cours de production`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: error.response?.data?.detail || "Impossible de produire l'unité",
      });
    }
  };

  const handleBuildBuilding = async (buildingType, x, y) => {
    if (!gameState) return;

    try {
      const updatedGame = await GameService.buildBuilding(gameState.id, buildingType, x, y);
      setGameState(updatedGame);

      const buildingStats = BUILDING_STATS[buildingType];
      toast({
        title: "Bâtiment construit",
        description: `${buildingStats.name} a été construit`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: error.response?.data?.detail || "Impossible de construire le bâtiment",
      });
    }
  };

  const handlePause = () => {
    if (!gameState) return;

    setGameState(prev => ({
      ...prev,
      game_status: prev.game_status === 'playing' ? 'paused' : 'playing'
    }));
  };

  // Convert backend data format to frontend format
  const getSelectedUnits = () => {
    if (!gameState || !gameState.selected_units) return [];
    return gameState.player.units.filter(unit => 
      gameState.selected_units.includes(unit.id)
    );
  };

  const getSelectedBuilding = () => {
    if (!gameState || !gameState.selected_building) return null;
    return gameState.player.buildings.find(building => 
      building.id === gameState.selected_building
    );
  };

  if (!gameCreated) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <Card className="p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center">
              🏰 RTS Medieval
            </h1>
            <p className="text-gray-600 mb-6">Entrez votre nom pour commencer la bataille</p>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Votre nom"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && createGame()}
              />
              
              <Button
                onClick={createGame}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold transition-colors duration-200"
              >
                {loading ? '⏳ Création...' : '⚔️ Commencer la bataille'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!gameState) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Chargement de la partie...</p>
        </div>
      </div>
    );
  }

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
          selectedUnits={getSelectedUnits()}
          onUnitAction={handleUnitAction}
          playerResources={gameState.player.resources}
        />
        <BuildingPanel 
          selectedBuilding={getSelectedBuilding()}
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

export default GameScreenWithBackend;