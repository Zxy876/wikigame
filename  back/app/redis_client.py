import redis
import json
from typing import List, Optional

class RedisClient:
    def __init__(self):
        self.redis_client = redis.Redis(
            host='localhost',
            port=6379,
            decode_responses=True
        )
    
    def get_links(self, page_title: str) -> Optional[List[str]]:
        """从缓存获取链接"""
        cached = self.redis_client.get(f"wiki:{page_title}")
        if cached:
            return json.loads(cached)
        return None
    
    def set_links(self, page_title: str, links: List[str], expire_hours: int = 24):
        """缓存链接"""
        self.redis_client.setex(
            f"wiki:{page_title}",
            expire_hours * 3600,
            json.dumps(links)
        )
    
    def cache_stats(self):
        """缓存统计"""
        keys = self.redis_client.keys("wiki:*")
        return {
            "cached_pages": len(keys),
            "memory_usage": self.redis_client.info('memory')['used_memory_human']
        }

redis_client = RedisClient()