import React from 'react';
import { Card } from './ui/card';
import { RESOURCE_TYPES } from '../mock/gameData';

const ResourcePanel = ({ resources }) => {
  const resourceIcons = {
    [RESOURCE_TYPES.GOLD]: '💰',
    [RESOURCE_TYPES.WOOD]: '🪵',
    [RESOURCE_TYPES.FOOD]: '🍞'
  };

  const resourceNames = {
    [RESOURCE_TYPES.GOLD]: 'Or',
    [RESOURCE_TYPES.WOOD]: 'Bois',
    [RESOURCE_TYPES.FOOD]: 'Nourriture'
  };

  return (
    <Card className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200">
      <div className="flex justify-between items-center space-x-6">
        {Object.entries(resources).map(([type, amount]) => (
          <div key={type} className="flex items-center space-x-2">
            <span className="text-2xl">{resourceIcons[type]}</span>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-600">{resourceNames[type]}</span>
              <span className="text-lg font-bold text-gray-800">{amount}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ResourcePanel;