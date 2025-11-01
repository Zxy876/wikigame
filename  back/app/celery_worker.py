from celery import Celery
import os

# 创建 Celery 实例
celery_app = Celery(
    'wiki_racer',
    broker=os.getenv('REDIS_URL', 'redis://localhost:6379/0'),
    backend=os.getenv('REDIS_URL', 'redis://localhost:6379/0'),
    include=['app.tasks']  # 包含任务模块
)

# 配置
celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
    task_track_started=True,
    task_time_limit=300,  # 5分钟超时
)

if __name__ == '__main__':
    celery_app.start()