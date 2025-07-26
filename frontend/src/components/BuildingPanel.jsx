import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { BUILDING_STATS, UNIT_STATS } from '../mock/gameData';

const BuildingPanel = ({ selectedBuilding, onBuildUnit, playerResources }) => {
  if (!selectedBuilding) {
    return (
      <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
        <p className="text-center text-gray-600">Sélectionnez un bâtiment pour voir ses options</p>
      </Card>
    );
  }

  const buildingStats = BUILDING_STATS[selectedBuilding.type];

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

  return (
    <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
      <div className="flex items-center space-x-3 mb-4">
        <span className="text-3xl">{buildingStats.icon}</span>
        <div>
          <h3 className="text-lg font-bold text-gray-800">{buildingStats.name}</h3>
          <div className="text-sm text-gray-600">
            <span>❤️ {selectedBuilding.health}/{buildingStats.health}</span>
          </div>
        </div>
      </div>

      {buildingStats.produces.length > 0 && (
        <div>
          <h4 className="text-md font-semibold text-gray-700 mb-2">Produire des unités:</h4>
          <div className="grid grid-cols-1 gap-2">
            {buildingStats.produces.map(unitType => {
              const unitStats = UNIT_STATS[unitType];
              const affordable = canAfford(unitStats.cost);
              
              return (
                <Button
                  key={unitType}
                  onClick={() => onBuildUnit(unitType, selectedBuilding.id)}
                  disabled={!affordable}
                  className={`flex items-center justify-between p-3 ${
                    affordable 
                      ? 'bg-green-500 hover:bg-green-600 text-white' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  } transition-colors duration-200`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{unitStats.icon}</span>
                    <span className="font-medium">{unitStats.name}</span>
                  </div>
                  <span className="text-sm">{formatCost(unitStats.cost)}</span>
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
};

export default BuildingPanel;