from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import uuid
import time
from datetime import datetime, timedelta
import json

from app.algorithms import BidirectionalBFS
from app.crawler import crawler
from app.tasks import find_wiki_path  # 导入Celery任务

app = FastAPI(title="Wiki Racer API")

# 允许前端跨域访问
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 存储游戏状态
games = {}
# 存储用户数据和排行榜
users = {}
leaderboard = []
achievements_db = {}

class GameRequest(BaseModel):
    start: str
    end: str
    user_id: Optional[str] = None  # 可选用户ID

class GameResponse(BaseModel):
    game_id: str
    status: str
    path: Optional[List[str]] = None
    message: Optional[str] = None
    score: Optional[int] = None
    achievements: Optional[List[str]] = None

class UserCreate(BaseModel):
    username: str

class UserStats(BaseModel):
    user_id: str
    username: str
    total_games: int
    completed_games: int
    total_score: int
    average_path_length: float
    achievements: List[str]
    join_date: str

class LeaderboardEntry(BaseModel):
    user_id: str
    username: str
    total_score: int
    rank: int

# 成就系统配置
ACHIEVEMENTS = {
    "first_win": {
        "name": "First Steps",
        "description": "Complete your first game",
        "points": 10
    },
    "speed_demon": {
        "name": "Speed Demon", 
        "description": "Complete a game in under 30 seconds",
        "points": 20
    },
    "long_journey": {
        "name": "Long Journey",
        "description": "Find a path with 10 or more links",
        "points": 25
    },
    "shortcut_master": {
        "name": "Shortcut Master",
        "description": "Find a path with only 2 links",
        "points": 30
    },
    "explorer": {
        "name": "Explorer",
        "description": "Complete 10 games",
        "points": 50
    },
    "veteran": {
        "name": "Veteran",
        "description": "Complete 50 games",
        "points": 100
    },
    "perfect_path": {
        "name": "Perfect Path",
        "description": "Find the shortest possible path",
        "points": 40
    }
}

def calculate_score(path_length: int, search_time: float, difficulty: float = 1.0) -> int:
    """计算游戏得分"""
    if not path_length:
        return 0
    
    # 基础分基于路径长度（越短越高）
    base_score = max(0, 1000 - (path_length * 50))
    
    # 时间奖励（越快越高）
    time_bonus = max(0, 500 - (search_time * 10))
    
    # 难度系数
    total_score = int((base_score + time_bonus) * difficulty)
    
    return max(100, total_score)  # 最低100分

def check_achievements(user_id: str, game_data: Dict[str, Any]) -> List[str]:
    """检查并授予成就"""
    user = users.get(user_id)
    if not user:
        return []
    
    new_achievements = []
    
    # 第一次完成游戏
    if user["stats"]["completed_games"] == 1 and "first_win" not in user["achievements"]:
        user["achievements"].append("first_win")
        user["stats"]["total_score"] += ACHIEVEMENTS["first_win"]["points"]
        new_achievements.append("first_win")
    
    # 快速完成
    if game_data.get("search_time", 0) < 30 and "speed_demon" not in user["achievements"]:
        user["achievements"].append("speed_demon")
        user["stats"]["total_score"] += ACHIEVEMENTS["speed_demon"]["points"]
        new_achievements.append("speed_demon")
    
    # 长路径
    path_length = len(game_data.get("path", []))
    if path_length >= 10 and "long_journey" not in user["achievements"]:
        user["achievements"].append("long_journey")
        user["stats"]["total_score"] += ACHIEVEMENTS["long_journey"]["points"]
        new_achievements.append("long_journey")
    
    # 短路径
    if path_length == 3 and "shortcut_master" not in user["achievements"]:  # 3 = start + end + 1 middle
        user["achievements"].append("shortcut_master")
        user["stats"]["total_score"] += ACHIEVEMENTS["shortcut_master"]["points"]
        new_achievements.append("shortcut_master")
    
    # 探索者
    completed_games = user["stats"]["completed_games"]
    if completed_games >= 10 and "explorer" not in user["achievements"]:
        user["achievements"].append("explorer")
        user["stats"]["total_score"] += ACHIEVEMENTS["explorer"]["points"]
        new_achievements.append("explorer")
    
    # 老手
    if completed_games >= 50 and "veteran" not in user["achievements"]:
        user["achievements"].append("veteran")
        user["stats"]["total_score"] += ACHIEVEMENTS["veteran"]["points"]
        new_achievements.append("veteran")
    
    return new_achievements

def update_leaderboard():
    """更新排行榜"""
    global leaderboard
    
    user_list = []
    for user_id, user_data in users.items():
        user_list.append({
            "user_id": user_id,
            "username": user_data["username"],
            "total_score": user_data["stats"]["total_score"]
        })
    
    # 按分数排序
    user_list.sort(key=lambda x: x["total_score"], reverse=True)
    
    # 添加排名
    leaderboard = []
    for rank, user in enumerate(user_list, 1):
        user["rank"] = rank
        leaderboard.append(user)

@app.get("/")
async def root():
    return {"message": "Wiki Racer API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# 用户管理端点
@app.post("/api/users")
async def create_user(user_data: UserCreate):
    """创建新用户"""
    user_id = str(uuid.uuid4())
    
    users[user_id] = {
        "username": user_data.username,
        "join_date": datetime.now().isoformat(),
        "achievements": [],
        "stats": {
            "total_games": 0,
            "completed_games": 0,
            "total_score": 0,
            "average_path_length": 0.0,
            "total_path_length": 0
        }
    }
    
    update_leaderboard()
    
    return {
        "user_id": user_id,
        "username": user_data.username,
        "message": "User created successfully"
    }

@app.get("/api/users/{user_id}")
async def get_user_stats(user_id: str):
    """获取用户统计信息"""
    user = users.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return UserStats(
        user_id=user_id,
        username=user["username"],
        total_games=user["stats"]["total_games"],
        completed_games=user["stats"]["completed_games"],
        total_score=user["stats"]["total_score"],
        average_path_length=user["stats"]["average_path_length"],
        achievements=[ACHIEVEMENTS[ach]["name"] for ach in user["achievements"]],
        join_date=user["join_date"]
    )

@app.get("/api/leaderboard")
async def get_leaderboard(limit: int = 10):
    """获取排行榜"""
    return {
        "leaderboard": leaderboard[:limit],
        "last_updated": datetime.now().isoformat()
    }

@app.get("/api/achievements")
async def get_achievements_list():
    """获取所有可用成就"""
    return ACHIEVEMENTS

# 修改现有的游戏端点以支持游戏化功能
@app.post("/api/game", response_model=GameResponse)
async def create_game(request: GameRequest):
    game_id = str(uuid.uuid4())
    start_time = time.time()
    
    # 立即开始搜索（同步方式）
    bfs = BidirectionalBFS()
    path = bfs.find_path(request.start, request.end)
    
    search_time = time.time() - start_time
    path_length = len(path) if path else 0
    score = calculate_score(path_length, search_time)
    
    # 更新用户统计（如果提供了用户ID）
    new_achievements = []
    if request.user_id and request.user_id in users:
        user = users[request.user_id]
        user["stats"]["total_games"] += 1
        
        if path:
            user["stats"]["completed_games"] += 1
            user["stats"]["total_score"] += score
            user["stats"]["total_path_length"] += path_length
            user["stats"]["average_path_length"] = (
                user["stats"]["total_path_length"] / user["stats"]["completed_games"]
            )
            
            # 检查成就
            game_data = {
                "path": path,
                "search_time": search_time,
                "path_length": path_length
            }
            new_achievements = check_achievements(request.user_id, game_data)
        
        update_leaderboard()
    
    games[game_id] = {
        "status": "completed",
        "path": path,
        "start": request.start,
        "end": request.end,
        "score": score,
        "search_time": search_time,
        "user_id": request.user_id
    }
    
    return GameResponse(
        game_id=game_id,
        status="completed",
        path=path,
        score=score,
        achievements=new_achievements
    )

@app.post("/api/game/async", response_model=GameResponse)
async def create_game_async(request: GameRequest):
    """创建异步游戏任务"""
    game_id = str(uuid.uuid4())
    
    # 初始状态
    games[game_id] = {
        "status": "pending",
        "path": None,
        "start": request.start,
        "end": request.end,
        "user_id": request.user_id,
        "score": 0,
        "search_time": 0,
        "task_id": None
    }
    
    # 发送Celery任务
    task = find_wiki_path.delay(request.start, request.end)
    games[game_id]["task_id"] = task.id
    
    return GameResponse(
        game_id=game_id,
        status="pending",
        message="Search started, check back later for results"
    )

@app.get("/api/game/{game_id}")
async def get_game_status(game_id: str):
    game = games.get(game_id)
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    
    # 如果是异步任务，检查状态
    if game["status"] == "pending" and game.get("task_id"):
        from app.tasks import find_wiki_path
        task_result = find_wiki_path.AsyncResult(game["task_id"])
        
        if task_result.state == 'SUCCESS':
            result = task_result.result
            game["status"] = result["status"]
            game["path"] = result.get("path")
            
            # 计算分数和成就（对于异步任务）
            if game["path"] and game.get("user_id"):
                path_length = len(game["path"])
                search_time = result.get("search_time", 0)
                score = calculate_score(path_length, search_time)
                game["score"] = score
                
                # 更新用户统计
                user_id = game["user_id"]
                if user_id in users:
                    user = users[user_id]
                    user["stats"]["total_games"] += 1
                    user["stats"]["completed_games"] += 1
                    user["stats"]["total_score"] += score
                    user["stats"]["total_path_length"] += path_length
                    user["stats"]["average_path_length"] = (
                        user["stats"]["total_path_length"] / user["stats"]["completed_games"]
                    )
                    
                    # 检查成就
                    game_data = {
                        "path": game["path"],
                        "search_time": search_time,
                        "path_length": path_length
                    }
                    check_achievements(user_id, game_data)
                    update_leaderboard()
                    
        elif task_result.state == 'FAILURE':
            game["status"] = "failed"
            game["message"] = "Path search failed"
            
            # 更新用户游戏计数（即使失败）
            if game.get("user_id") and game["user_id"] in users:
                users[game["user_id"]]["stats"]["total_games"] += 1
                update_leaderboard()
    
    return game

# 保留原有的测试和系统端点
@app.get("/test-crawl/{page_title}")
async def test_crawl(page_title: str):
    """测试页面爬取功能"""
    try:
        links = crawler.get_links(page_title)
        return {
            "page": page_title,
            "links_found": len(links),
            "sample_links": links[:10]  # 返回前10个链接作为样本
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Crawler error: {str(e)}")

@app.get("/test-path/{start}/{end}")
async def test_path(start: str, end: str):
    """测试路径查找功能"""
    try:
        bfs = BidirectionalBFS()
        path = bfs.find_path(start, end)
        return {
            "start": start,
            "end": end,
            "path": path,
            "path_length": len(path) if path else 0
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Path finding error: {str(e)}")

@app.get("/api/task/{task_id}")
async def get_task_status(task_id: str):
    """获取Celery任务状态"""
    from app.tasks import find_wiki_path
    task_result = find_wiki_path.AsyncResult(task_id)
    
    return {
        "task_id": task_id,
        "status": task_result.state,
        "result": task_result.result if task_result.state == 'SUCCESS' else None
    }

@app.get("/system-status")
async def get_system_status():
    """获取系统状态"""
    return {
        "api": "healthy", 
        "redis": "connected",
        "total_games": len(games),
        "total_users": len(users),
        "status": "running"
    }

@app.get("/cache-stats")
async def get_cache_stats():
    """获取缓存统计"""
    try:
        # 检查是否有 Redis 客户端
        if hasattr(crawler, 'redis_client') and crawler.redis_client:
            return crawler.redis_client.cache_stats()
        else:
            return {
                "cached_pages": 0,
                "memory_usage": "0B",
                "message": "Redis cache not enabled"
            }
    except Exception as e:
        return {
            "error": f"Cache stats error: {str(e)}",
            "cached_pages": 0
        }

@app.get("/api/stats") 
async def get_api_stats():
    """获取API统计"""
    total_score = sum(user["stats"]["total_score"] for user in users.values())
    total_completed = sum(user["stats"]["completed_games"] for user in users.values())
    
    return {
        "total_games_created": len(games),
        "total_users": len(users),
        "total_score_earned": total_score,
        "total_games_completed": total_completed,
        "system_status": "running"
    }