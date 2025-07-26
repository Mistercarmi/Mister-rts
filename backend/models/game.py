from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from datetime import datetime
import uuid

class Unit(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    type: str
    x: int
    y: int
    health: int
    selected: bool = False
    owner: str  # 'player' or 'enemy'

class Building(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    type: str
    x: int
    y: int
    health: int
    selected: bool = False
    owner: str  # 'player' or 'enemy'

class Player(BaseModel):
    id: str
    name: str
    resources: Dict[str, int]
    units: List[Unit]
    buildings: List[Building]

class GameState(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    player: Player
    enemy: Player
    selected_units: List[str] = []
    selected_building: Optional[str] = None
    game_status: str = "playing"  # 'playing', 'paused', 'victory', 'defeat'
    map_size: Dict[str, int] = {"width": 20, "height": 20}
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class GameAction(BaseModel):
    game_id: str
    action_type: str  # 'move', 'attack', 'build', 'produce'
    unit_id: Optional[str] = None
    building_id: Optional[str] = None
    target_x: Optional[int] = None
    target_y: Optional[int] = None
    target_id: Optional[str] = None
    build_type: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class UnitProduction(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    game_id: str
    building_id: str
    unit_type: str
    start_time: datetime
    end_time: datetime
    completed: bool = False

# Request/Response Models
class CreateGameRequest(BaseModel):
    player_name: str

class GameActionRequest(BaseModel):
    action_type: str
    unit_id: Optional[str] = None
    building_id: Optional[str] = None
    target_x: Optional[int] = None
    target_y: Optional[int] = None
    target_id: Optional[str] = None
    build_type: Optional[str] = None

class MoveUnitRequest(BaseModel):
    unit_ids: List[str]
    target_x: int
    target_y: int

class AttackRequest(BaseModel):
    attacker_id: str
    target_id: str

class BuildBuildingRequest(BaseModel):
    building_type: str
    x: int
    y: int

class ProduceUnitRequest(BaseModel):
    building_id: str
    unit_type: str