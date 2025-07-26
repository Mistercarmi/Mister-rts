import React from 'react';
import { UNIT_STATS, BUILDING_STATS } from '../mock/gameData';

const GameMap = ({ gameState, onCellClick, onUnitClick, onBuildingClick }) => {
  const { player, enemy, mapSize } = gameState;

  const renderCell = (x, y) => {
    const playerUnit = player.units.find(unit => unit.x === x && unit.y === y);
    const enemyUnit = enemy.units.find(unit => unit.x === x && unit.y === y);
    const playerBuilding = player.buildings.find(building => building.x === x && building.y === y);
    const enemyBuilding = enemy.buildings.find(building => building.x === x && building.y === y);

    let cellContent = null;
    let cellClass = "w-8 h-8 border border-gray-600 bg-green-100 hover:bg-green-200 transition-colors duration-200 cursor-pointer flex items-center justify-center text-xs relative";

    if (playerUnit) {
      cellContent = (
        <div 
          className={`text-lg hover:scale-110 transition-transform duration-200 ${playerUnit.selected ? 'ring-2 ring-blue-400 rounded' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onUnitClick(playerUnit);
          }}
        >
          {UNIT_STATS[playerUnit.type].icon}
        </div>
      );
      cellClass += " bg-blue-100";
    } else if (enemyUnit) {
      cellContent = (
        <div 
          className="text-lg hover:scale-110 transition-transform duration-200"
          onClick={(e) => {
            e.stopPropagation();
            onUnitClick(enemyUnit);
          }}
        >
          {UNIT_STATS[enemyUnit.type].icon}
        </div>
      );
      cellClass += " bg-red-100";
    } else if (playerBuilding) {
      cellContent = (
        <div 
          className={`text-lg hover:scale-110 transition-transform duration-200 ${playerBuilding.selected ? 'ring-2 ring-blue-400 rounded' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onBuildingClick(playerBuilding);
          }}
        >
          {BUILDING_STATS[playerBuilding.type].icon}
        </div>
      );
      cellClass += " bg-blue-200";
    } else if (enemyBuilding) {
      cellContent = (
        <div 
          className="text-lg hover:scale-110 transition-transform duration-200"
          onClick={(e) => {
            e.stopPropagation();
            onBuildingClick(enemyBuilding);
          }}
        >
          {BUILDING_STATS[enemyBuilding.type].icon}
        </div>
      );
      cellClass += " bg-red-200";
    }

    return (
      <div
        key={`${x}-${y}`}
        className={cellClass}
        onClick={() => onCellClick(x, y)}
        style={{ 
          gridColumn: x + 1, 
          gridRow: y + 1,
          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)'
        }}
      >
        {cellContent}
      </div>
    );
  };

  const cells = [];
  for (let y = 0; y < mapSize.height; y++) {
    for (let x = 0; x < mapSize.width; x++) {
      cells.push(renderCell(x, y));
    }
  }

  return (
    <div className="flex-1 overflow-auto p-4 bg-gradient-to-br from-green-50 to-green-100">
      <div 
        className="grid gap-0 mx-auto"
        style={{
          gridTemplateColumns: `repeat(${mapSize.width}, 32px)`,
          gridTemplateRows: `repeat(${mapSize.height}, 32px)`,
          width: `${mapSize.width * 32}px`,
          height: `${mapSize.height * 32}px`
        }}
      >
        {cells}
      </div>
    </div>
  );
};

export default GameMap;