import requests
from bs4 import BeautifulSoup
from typing import List

class WikiCrawler:
    def __init__(self, redis_client=None):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'WikiRacer/1.0 (https://github.com/yourname/wikiracer)'
        })
        self.base_url = "https://en.wikipedia.org/wiki/"
        self.redis_client = redis_client

    def get_links(self, page_title: str) -> List[str]:
        """获取一个维基百科页面的所有有效链接"""
        # 首先检查缓存
        if self.redis_client:
            cached_links = self.redis_client.get_links(page_title)
            if cached_links is not None:
                print(f"从缓存获取链接: {page_title}")
                return cached_links
                
        try:
            print(f"爬取页面: {page_title}")
            url = f"{self.base_url}{page_title}"
            response = self.session.get(url)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            content_div = soup.find('div', {'id': 'mw-content-text'})
            
            if not content_div:
                return []
            
            # 只获取正文中的链接
            links = []
            for link in content_div.find_all('a', href=True):
                href = link['href']
                # 过滤出有效的维基百科内部文章链接
                if (href.startswith('/wiki/') and 
                    ':' not in href and  # 排除分类、文件等
                    not href.startswith('/wiki/Main_Page') and
                    not href.startswith('/wiki/Special:')):
                    # 从 /wiki/Page_Title 中提取 Page_Title
                    link_title = href[6:]  # 去掉 '/wiki/'
                    # 解码URL编码的字符
                    link_title = requests.utils.unquote(link_title)
                    links.append(link_title)
            
            links = list(set(links))  # 去重
            
            # 爬取成功后缓存结果
            if self.redis_client and links:
                print(f"缓存链接: {page_title} -> {len(links)} 个链接")
                self.redis_client.set_links(page_title, links)
            
            return links
            
        except requests.RequestException as e:
            print(f"爬取错误 {page_title}: {e}")
            return []

# 创建带 Redis 的爬虫实例
try:
    from app.redis_client import RedisClient
    redis_client = RedisClient()
    crawler = WikiCrawler(redis_client=redis_client)
    print("使用带 Redis 缓存的爬虫")
except ImportError as e:
    print(f"Redis 导入失败: {e}, 使用无缓存爬虫")
    crawler = WikiCrawler()
except Exception as e:
    print(f"Redis 连接失败: {e}, 使用无缓存爬虫")
    crawler = WikiCrawler()