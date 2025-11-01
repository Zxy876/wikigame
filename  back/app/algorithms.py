from collections import deque, defaultdict
from typing import List, Dict, Tuple, Optional
from app.crawler import crawler

class BidirectionalBFS:
    def __init__(self):
        self.visited_from_start = defaultdict(str)  # 记录节点和它的前驱
        self.visited_from_end = defaultdict(str)
        
    def find_path(self, start: str, end: str, max_depth: int = 6) -> Optional[List[str]]:
        """使用双向BFS查找最短路径"""
        if start == end:
            return [start]
            
        # 初始化队列
        queue_start = deque([start])
        queue_end = deque([end])
        self.visited_from_start[start] = ""
        self.visited_from_end[end] = ""
        
        current_depth = 0
        
        while queue_start and queue_end and current_depth < max_depth:
            # 优先扩展较小的那一边
            if len(queue_start) <= len(queue_end):
                found = self._expand_level(queue_start, self.visited_from_start, self.visited_from_end)
                if found:
                    return self._reconstruct_path(found, self.visited_from_start, self.visited_from_end)
            else:
                found = self._expand_level(queue_end, self.visited_from_end, self.visited_from_start, from_end=True)
                if found:
                    return self._reconstruct_path(found, self.visited_from_start, self.visited_from_end)
            
            current_depth += 1
            
        return None  # 没有找到路径
    
    def _expand_level(self, queue, visited_this_side, visited_other_side, from_end=False):
        """扩展一层的节点"""
        level_size = len(queue)
        
        for _ in range(level_size):
            current = queue.popleft()
            links = crawler.get_links(current)
            
            for link in links:
                if link not in visited_this_side:
                    visited_this_side[link] = current
                    queue.append(link)
                    
                    # 检查是否相遇
                    if link in visited_other_side:
                        return link  # 返回相遇点
        return None
    
    def _reconstruct_path(self, meeting_point, visited_start, visited_end):
        """从相遇点重建完整路径"""
        # 从相遇点向前重建到起点
        path_to_start = []
        current = meeting_point
        while current:
            path_to_start.append(current)
            current = visited_start.get(current)
        path_to_start.reverse()
        
        # 从相遇点向后重建到终点（排除相遇点本身）
        path_to_end = []
        current = visited_end.get(meeting_point)
        while current:
            path_to_end.append(current)
            current = visited_end.get(current)
            
        return path_to_start + path_to_end