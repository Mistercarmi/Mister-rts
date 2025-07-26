import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { BUILDING_STATS, BUILDING_TYPES } from '../mock/gameData';

const BuildMenu = ({ isVisible, onBuildBuilding, playerResources, onClose }) => {
  if (!isVisible) return null;

  const canAfford = (cost) => {
    return Object.entries(cost).every(([resource, amount]) => 
      playerResources[resource] >= amount
    );
  };

  const formatCost = (cost) => {
    return Object.entries(cost).map(([resource, amount]) => {
      const icons = { gold: '💰', wood: '🪵', food: '🍞' };
      return `${icons[resource]} ${amount}`;
    }).join(', ');
  };

  const buildableBuildings = [
    BUILDING_TYPES.FARM,
    BUILDING_TYPES.MINE,
    BUILDING_TYPES.BARRACKS,
    BUILDING_TYPES.STABLE
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="p-6 bg-white max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Construire un bâtiment</h2>
          <Button 
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 text-sm"
          >
            ✕
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {buildableBuildings.map(buildingType => {
            const buildingStats = BUILDING_STATS[buildingType];
            const affordable = canAfford(buildingStats.cost);
            
            return (
              <Button
                key={buildingType}
                onClick={() => {
                  onBuildBuilding(buildingType);
                  onClose();
                }}
                disabled={!affordable}
                className={`flex items-center justify-between p-4 ${
                  affordable 
                    ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                } transition-colors duration-200`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{buildingStats.icon}</span>
                  <div className="text-left">
                    <div className="font-medium">{buildingStats.name}</div>
                    <div className="text-sm opacity-75">❤️ {buildingStats.health}</div>
                  </div>
                </div>
                <span className="text-sm">{formatCost(buildingStats.cost)}</span>
              </Button>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default BuildMenu;