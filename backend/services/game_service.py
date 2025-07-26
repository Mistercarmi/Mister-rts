from typing import List, Optional, Dict
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorDatabase
from models.game import GameState, Player, Unit, Building, GameAction, UnitProduction
from services.game_data import UNIT_STATS, BUILDING_STATS, INITIAL_RESOURCES, RESOURCE_GENERATION
import random

class GameService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
    
    async def create_game(self, player_name: str) -> GameState:
        """Create a new game session"""
        # Create initial player
        player = Player(
            id="player1",
            name=player_name,
            resources=INITIAL_RESOURCES.copy(),
            units=[
                Unit(id="unit1", type="peasant", x=5, y=5, health=50, owner="player"),
                Unit(id="unit2", type="peasant", x=6, y=5, health=50, owner="player"),
                Unit(id="unit3", type="soldier", x=7, y=5, health=100, owner="player")
            ],
            buildings=[
                Building(id="building1", type="town_hall", x=5, y=6, health=500, owner="player")
            ]
        )
        
        # Create initial enemy AI
        enemy = Player(
            id="enemy1",
            name="IA",
            resources=INITIAL_RESOURCES.copy(),
            units=[
                Unit(id="enemy_unit1", type="soldier", x=15, y=15, health=100, owner="enemy"),
                Unit(id="enemy_unit2", type="archer", x=16, y=15, health=80, owner="enemy")
            ],
            buildings=[
                Building(id="enemy_building1", type="town_hall", x=15, y=16, health=500, owner="enemy")
            ]
        )
        
        game_state = GameState(
            player=player,
            enemy=enemy
        )
        
        # Save to database
        await self.db.games.insert_one(game_state.dict())
        return game_state
    
    async def get_game(self, game_id: str) -> Optional[GameState]:
        """Get game state by ID"""
        game_doc = await self.db.games.find_one({"id": game_id})
        if game_doc:
            return GameState(**game_doc)
        return None
    
    async def update_game(self, game_state: GameState) -> GameState:
        """Update game state in database"""
        game_state.updated_at = datetime.utcnow()
        await self.db.games.replace_one(
            {"id": game_state.id}, 
            game_state.dict()
        )
        return game_state
    
    async def move_units(self, game_id: str, unit_ids: List[str], target_x: int, target_y: int) -> GameState:
        """Move units to target position"""
        game_state = await self.get_game(game_id)
        if not game_state:
            raise ValueError("Game not found")
        
        # Move units
        for unit in game_state.player.units:
            if unit.id in unit_ids:
                unit.x = target_x
                unit.y = target_y
        
        # Log action
        action = GameAction(
            game_id=game_id,
            action_type="move",
            unit_id=unit_ids[0] if unit_ids else None,
            target_x=target_x,
            target_y=target_y
        )
        await self.db.game_actions.insert_one(action.dict())
        
        return await self.update_game(game_state)
    
    async def attack_target(self, game_id: str, attacker_id: str, target_id: str) -> GameState:
        """Attack a target unit or building"""
        game_state = await self.get_game(game_id)
        if not game_state:
            raise ValueError("Game not found")
        
        # Find attacker
        attacker = None
        for unit in game_state.player.units:
            if unit.id == attacker_id:
                attacker = unit
                break
        
        if not attacker:
            raise ValueError("Attacker not found")
        
        # Calculate damage
        attacker_stats = UNIT_STATS[attacker.type]
        damage = attacker_stats["attack"]
        
        # Find and damage target
        target_found = False
        
        # Check enemy units
        for unit in game_state.enemy.units:
            if unit.id == target_id:
                unit.health = max(0, unit.health - damage)
                target_found = True
                break
        
        # Check enemy buildings
        if not target_found:
            for building in game_state.enemy.buildings:
                if building.id == target_id:
                    building.health = max(0, building.health - damage)
                    target_found = True
                    break
        
        if not target_found:
            raise ValueError("Target not found")
        
        # Remove destroyed units/buildings
        game_state.enemy.units = [u for u in game_state.enemy.units if u.health > 0]
        game_state.enemy.buildings = [b for b in game_state.enemy.buildings if b.health > 0]
        
        # Log action
        action = GameAction(
            game_id=game_id,
            action_type="attack",
            unit_id=attacker_id,
            target_id=target_id
        )
        await self.db.game_actions.insert_one(action.dict())
        
        return await self.update_game(game_state)
    
    async def build_building(self, game_id: str, building_type: str, x: int, y: int) -> GameState:
        """Build a new building"""
        game_state = await self.get_game(game_id)
        if not game_state:
            raise ValueError("Game not found")
        
        building_stats = BUILDING_STATS[building_type]
        
        # Check if player can afford
        for resource, cost in building_stats["cost"].items():
            if game_state.player.resources.get(resource, 0) < cost:
                raise ValueError(f"Insufficient {resource}")
        
        # Check if position is free
        occupied = any(
            (entity.x == x and entity.y == y)
            for entity in game_state.player.units + game_state.player.buildings + 
                         game_state.enemy.units + game_state.enemy.buildings
        )
        
        if occupied:
            raise ValueError("Position occupied")
        
        # Deduct resources
        for resource, cost in building_stats["cost"].items():
            game_state.player.resources[resource] -= cost
        
        # Create building
        new_building = Building(
            type=building_type,
            x=x,
            y=y,
            health=building_stats["health"],
            owner="player"
        )
        
        game_state.player.buildings.append(new_building)
        
        # Log action
        action = GameAction(
            game_id=game_id,
            action_type="build",
            build_type=building_type,
            target_x=x,
            target_y=y
        )
        await self.db.game_actions.insert_one(action.dict())
        
        return await self.update_game(game_state)
    
    async def produce_unit(self, game_id: str, building_id: str, unit_type: str) -> UnitProduction:
        """Start unit production"""
        game_state = await self.get_game(game_id)
        if not game_state:
            raise ValueError("Game not found")
        
        # Find building
        building = None
        for b in game_state.player.buildings:
            if b.id == building_id:
                building = b
                break
        
        if not building:
            raise ValueError("Building not found")
        
        # Check if building can produce this unit
        building_stats = BUILDING_STATS[building.type]
        if unit_type not in building_stats.get("produces", []):
            raise ValueError("Building cannot produce this unit")
        
        unit_stats = UNIT_STATS[unit_type]
        
        # Check if player can afford
        for resource, cost in unit_stats["cost"].items():
            if game_state.player.resources.get(resource, 0) < cost:
                raise ValueError(f"Insufficient {resource}")
        
        # Deduct resources
        for resource, cost in unit_stats["cost"].items():
            game_state.player.resources[resource] -= cost
        
        # Create production order
        production = UnitProduction(
            game_id=game_id,
            building_id=building_id,
            unit_type=unit_type,
            start_time=datetime.utcnow(),
            end_time=datetime.utcnow() + timedelta(milliseconds=unit_stats["buildTime"])
        )
        
        await self.db.unit_productions.insert_one(production.dict())
        await self.update_game(game_state)
        
        return production
    
    async def complete_unit_production(self, production_id: str) -> GameState:
        """Complete unit production and add unit to game"""
        production_doc = await self.db.unit_productions.find_one({"id": production_id})
        if not production_doc:
            raise ValueError("Production not found")
        
        production = UnitProduction(**production_doc)
        
        if production.completed:
            raise ValueError("Production already completed")
        
        game_state = await self.get_game(production.game_id)
        if not game_state:
            raise ValueError("Game not found")
        
        # Find building
        building = None
        for b in game_state.player.buildings:
            if b.id == production.building_id:
                building = b
                break
        
        if not building:
            raise ValueError("Building not found")
        
        # Create unit
        unit_stats = UNIT_STATS[production.unit_type]
        new_unit = Unit(
            type=production.unit_type,
            x=building.x + 1,
            y=building.y,
            health=unit_stats["health"],
            owner="player"
        )
        
        game_state.player.units.append(new_unit)
        
        # Mark production as completed
        production.completed = True
        await self.db.unit_productions.replace_one(
            {"id": production_id},
            production.dict()
        )
        
        return await self.update_game(game_state)
    
    async def update_resources(self, game_id: str) -> GameState:
        """Update player resources based on buildings"""
        game_state = await self.get_game(game_id)
        if not game_state:
            raise ValueError("Game not found")
        
        # Calculate resource generation
        for building in game_state.player.buildings:
            if building.type in RESOURCE_GENERATION:
                generation = RESOURCE_GENERATION[building.type]
                for resource, amount in generation.items():
                    game_state.player.resources[resource] += amount
        
        return await self.update_game(game_state)
    
    async def ai_turn(self, game_id: str) -> GameState:
        """Execute AI turn"""
        game_state = await self.get_game(game_id)
        if not game_state:
            raise ValueError("Game not found")
        
        # Simple AI: randomly move units towards player
        for unit in game_state.enemy.units:
            if random.random() < 0.3:  # 30% chance to move
                # Find nearest player unit
                nearest_target = None
                min_distance = float('inf')
                
                for player_unit in game_state.player.units:
                    distance = abs(unit.x - player_unit.x) + abs(unit.y - player_unit.y)
                    if distance < min_distance:
                        min_distance = distance
                        nearest_target = player_unit
                
                if nearest_target:
                    # Move towards target
                    if unit.x < nearest_target.x:
                        unit.x = min(unit.x + 1, 19)
                    elif unit.x > nearest_target.x:
                        unit.x = max(unit.x - 1, 0)
                    
                    if unit.y < nearest_target.y:
                        unit.y = min(unit.y + 1, 19)
                    elif unit.y > nearest_target.y:
                        unit.y = max(unit.y - 1, 0)
                    
                    # Attack if in range
                    if abs(unit.x - nearest_target.x) <= 1 and abs(unit.y - nearest_target.y) <= 1:
                        unit_stats = UNIT_STATS[unit.type]
                        damage = unit_stats["attack"]
                        nearest_target.health = max(0, nearest_target.health - damage)
        
        # Remove dead units
        game_state.player.units = [u for u in game_state.player.units if u.health > 0]
        
        return await self.update_game(game_state)
    
    async def get_pending_productions(self, game_id: str) -> List[UnitProduction]:
        """Get all pending unit productions for a game"""
        productions = await self.db.unit_productions.find({
            "game_id": game_id,
            "completed": False
        }).to_list(100)
        
        return [UnitProduction(**p) for p in productions]
    
    async def list_games(self) -> List[GameState]:
        """List all games"""
        games = await self.db.games.find().to_list(100)
        return [GameState(**g) for g in games]