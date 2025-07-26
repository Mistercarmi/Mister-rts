import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api/games/`;

class GameService {
  constructor() {
    this.currentGameId = null;
  }

  async createGame(playerName) {
    try {
      const response = await axios.post(API, {
        player_name: playerName
      });
      this.currentGameId = response.data.id;
      return response.data;
    } catch (error) {
      console.error('Error creating game:', error);
      throw error;
    }
  }

  async getGame(gameId) {
    try {
      const response = await axios.get(`${API}/${gameId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting game:', error);
      throw error;
    }
  }

  async moveUnits(gameId, unitIds, targetX, targetY) {
    try {
      const response = await axios.post(`${API}${gameId}/move`, {
        unit_ids: unitIds,
        target_x: targetX,
        target_y: targetY
      });
      return response.data;
    } catch (error) {
      console.error('Error moving units:', error);
      throw error;
    }
  }

  async attackTarget(gameId, attackerId, targetId) {
    try {
      const response = await axios.post(`${API}${gameId}/attack`, {
        attacker_id: attackerId,
        target_id: targetId
      });
      return response.data;
    } catch (error) {
      console.error('Error attacking target:', error);
      throw error;
    }
  }

  async buildBuilding(gameId, buildingType, x, y) {
    try {
      const response = await axios.post(`${API}${gameId}/build`, {
        building_type: buildingType,
        x: x,
        y: y
      });
      return response.data;
    } catch (error) {
      console.error('Error building:', error);
      throw error;
    }
  }

  async produceUnit(gameId, buildingId, unitType) {
    try {
      const response = await axios.post(`${API}${gameId}/produce`, {
        building_id: buildingId,
        unit_type: unitType
      });
      return response.data;
    } catch (error) {
      console.error('Error producing unit:', error);
      throw error;
    }
  }

  async getPendingProductions(gameId) {
    try {
      const response = await axios.get(`${API}${gameId}/productions`);
      return response.data;
    } catch (error) {
      console.error('Error getting productions:', error);
      throw error;
    }
  }

  async updateResources(gameId) {
    try {
      const response = await axios.post(`${API}${gameId}/resources`);
      return response.data;
    } catch (error) {
      console.error('Error updating resources:', error);
      throw error;
    }
  }

  async aiTurn(gameId) {
    try {
      const response = await axios.post(`${API}${gameId}/ai-turn`);
      return response.data;
    } catch (error) {
      console.error('Error executing AI turn:', error);
      throw error;
    }
  }

  async listGames() {
    try {
      const response = await axios.get(API);
      return response.data;
    } catch (error) {
      console.error('Error listing games:', error);
      throw error;
    }
  }

  getCurrentGameId() {
    return this.currentGameId;
  }

  setCurrentGameId(gameId) {
    this.currentGameId = gameId;
  }
}

export default new GameService();