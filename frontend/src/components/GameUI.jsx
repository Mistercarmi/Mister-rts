import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

const GameUI = ({ gameState, onPause, onSettings, onEndTurn }) => {
  const { gameStatus, player } = gameState;

  return (
    <Card className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            🏰 RTS Medieval
          </h1>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Joueur:</span>
            <span className="font-medium text-blue-600">{player.name}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <span className="text-sm text-gray-600">Statut:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              gameStatus === 'playing' ? 'bg-green-100 text-green-800' :
              gameStatus === 'paused' ? 'bg-yellow-100 text-yellow-800' :
              gameStatus === 'victory' ? 'bg-blue-100 text-blue-800' :
              'bg-red-100 text-red-800'
            }`}>
              {gameStatus === 'playing' ? 'En cours' :
               gameStatus === 'paused' ? 'Pause' :
               gameStatus === 'victory' ? 'Victoire' :
               'Défaite'}
            </span>
          </div>

          <Separator orientation="vertical" className="h-6" />

          <div className="flex space-x-2">
            <Button 
              onClick={onPause}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 text-sm transition-colors duration-200"
            >
              {gameStatus === 'paused' ? '▶️ Reprendre' : '⏸️ Pause'}
            </Button>
            <Button 
              onClick={onSettings}
              className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 text-sm transition-colors duration-200"
            >
              ⚙️ Options
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GameUI;