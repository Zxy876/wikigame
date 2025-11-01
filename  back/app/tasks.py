from celery import current_app
from app.algorithms import BidirectionalBFS
from app.crawler import crawler

@current_app.task(bind=True, name='find_wiki_path')
def find_wiki_path(self, start: str, end: str):
    """异步查找维基百科路径的任务"""
    
    # 更新任务状态
    self.update_state(
        state='PROGRESS',
        meta={
            'current': 0,
            'total': 100,
            'status': f'Searching path from {start} to {end}'
        }
    )
    
    try:
        # 执行路径查找
        bfs = BidirectionalBFS()
        path = bfs.find_path(start, end, max_depth=6)
        
        return {
            'status': 'completed',
            'path': path,
            'start': start,
            'end': end
        }
        
    except Exception as e:
        return {
            'status': 'failed',
            'error': str(e),
            'start': start,
            'end': end
        }