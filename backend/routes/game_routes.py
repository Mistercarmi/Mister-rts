from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from typing import List
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorDatabase
from models.game import (
    GameState, GameAction, UnitProduction,
    CreateGameRequest, GameActionRequest, MoveUnitRequest, 
    AttackRequest, BuildBuildingRequest, ProduceUnitRequest
)
from services.game_service import GameService
import asyncio

router = APIRouter(prefix="/games", tags=["games"])

# Global db variable will be set in server.py
db = None

async def get_game_service() -> GameService:
    return GameService(db)

@router.post("/", response_model=GameState)
async def create_game(
    request: CreateGameRequest,
    game_service: GameService = Depends(get_game_service)
):
    """Create a new game session"""
    try:
        game_state = await game_service.create_game(request.player_name)
        return game_state
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=List[GameState])
async def list_games(
    game_service: GameService = Depends(get_game_service)
):
    """List all games"""
    try:
        games = await game_service.list_games()
        return games
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{game_id}", response_model=GameState)
async def get_game(
    game_id: str,
    game_service: GameService = Depends(get_game_service)
):
    """Get game state by ID"""
    try:
        game_state = await game_service.get_game(game_id)
        if not game_state:
            raise HTTPException(status_code=404, detail="Game not found")
        return game_state
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{game_id}/move", response_model=GameState)
async def move_units(
    game_id: str,
    request: MoveUnitRequest,
    game_service: GameService = Depends(get_game_service)
):
    """Move units to target position"""
    try:
        game_state = await game_service.move_units(
            game_id, request.unit_ids, request.target_x, request.target_y
        )
        return game_state
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{game_id}/attack", response_model=GameState)
async def attack_target(
    game_id: str,
    request: AttackRequest,
    game_service: GameService = Depends(get_game_service)
):
    """Attack a target unit or building"""
    try:
        game_state = await game_service.attack_target(
            game_id, request.attacker_id, request.target_id
        )
        return game_state
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{game_id}/build", response_model=GameState)
async def build_building(
    game_id: str,
    request: BuildBuildingRequest,
    game_service: GameService = Depends(get_game_service)
):
    """Build a new building"""
    try:
        game_state = await game_service.build_building(
            game_id, request.building_type, request.x, request.y
        )
        return game_state
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{game_id}/produce", response_model=UnitProduction)
async def produce_unit(
    game_id: str,
    request: ProduceUnitRequest,
    background_tasks: BackgroundTasks,
    game_service: GameService = Depends(get_game_service)
):
    """Start unit production"""
    try:
        production = await game_service.produce_unit(
            game_id, request.building_id, request.unit_type
        )
        
        # Schedule completion
        async def complete_production():
            await asyncio.sleep(production.end_time.timestamp() - datetime.utcnow().timestamp())
            try:
                await game_service.complete_unit_production(production.id)
            except Exception as e:
                print(f"Error completing production: {e}")
        
        background_tasks.add_task(complete_production)
        return production
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{game_id}/productions", response_model=List[UnitProduction])
async def get_pending_productions(
    game_id: str,
    game_service: GameService = Depends(get_game_service)
):
    """Get all pending unit productions"""
    try:
        productions = await game_service.get_pending_productions(game_id)
        return productions
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{game_id}/resources", response_model=GameState)
async def update_resources(
    game_id: str,
    game_service: GameService = Depends(get_game_service)
):
    """Update player resources based on buildings"""
    try:
        game_state = await game_service.update_resources(game_id)
        return game_state
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{game_id}/ai-turn", response_model=GameState)
async def ai_turn(
    game_id: str,
    game_service: GameService = Depends(get_game_service)
):
    """Execute AI turn"""
    try:
        game_state = await game_service.ai_turn(game_id)
        return game_state
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{game_id}/complete-production/{production_id}", response_model=GameState)
async def complete_production(
    game_id: str,
    production_id: str,
    game_service: GameService = Depends(get_game_service)
):
    """Manually complete unit production"""
    try:
        game_state = await game_service.complete_unit_production(production_id)
        return game_state
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))