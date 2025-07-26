import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { UNIT_STATS, UNIT_TYPES } from '../mock/gameData';

const UnitPanel = ({ selectedUnits, onUnitAction, playerResources }) => {
  if (selectedUnits.length === 0) {
    return (
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200">
        <p className="text-center text-gray-600">Sélectionnez une unité pour voir ses actions</p>
      </Card>
    );
  }

  const unit = selectedUnits[0];
  const unitStats = UNIT_STATS[unit.type];

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
    <Card className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200">
      <div className="flex items-center space-x-3 mb-4">
        <span className="text-3xl">{unitStats.icon}</span>
        <div>
          <h3 className="text-lg font-bold text-gray-800">{unitStats.name}</h3>
          <div className="flex space-x-4 text-sm text-gray-600">
            <span>❤️ {unit.health}/{unitStats.health}</span>
            <span>⚔️ {unitStats.attack}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button 
          onClick={() => onUnitAction('move', unit.id)}
          className="bg-green-500 hover:bg-green-600 text-white transition-colors duration-200"
        >
          🚶 Déplacer
        </Button>
        <Button 
          onClick={() => onUnitAction('attack', unit.id)}
          className="bg-red-500 hover:bg-red-600 text-white transition-colors duration-200"
        >
          ⚔️ Attaquer
        </Button>
        {unit.type === UNIT_TYPES.PEASANT && (
          <>
            <Button 
              onClick={() => onUnitAction('gather', unit.id)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white transition-colors duration-200"
            >
              ⛏️ Récolter
            </Button>
            <Button 
              onClick={() => onUnitAction('build', unit.id)}
              className="bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200"
            >
              🏗️ Construire
            </Button>
          </>
        )}
      </div>
    </Card>
  );
};

export default UnitPanel;