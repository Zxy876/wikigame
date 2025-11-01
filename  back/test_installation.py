#!/usr/bin/env python3
"""
验证环境安装的测试脚本
"""
import sys

def test_imports():
    """测试所有必要的包是否能正常导入"""
    packages = [
        "fastapi",
        "uvicorn", 
        "requests",
        "bs4",
        "redis",
        "celery",
        "pydantic",
        "pytest"
    ]
    
    print("🔍 测试包导入...")
    for package in packages:
        try:
            __import__(package)
            print(f"✅ {package} - 导入成功")
        except ImportError as e:
            print(f"❌ {package} - 导入失败: {e}")
            return False
    return True

def test_redis():
    """测试Redis连接"""
    print("\n🔍 测试Redis连接...")
    try:
        import redis
        r = redis.Redis(host='localhost', port=6379, decode_responses=True)
        r.ping()
        print("✅ Redis - 连接成功")
        return True
    except Exception as e:
        print(f"❌ Redis - 连接失败: {e}")
        print("💡 请确保Redis服务正在运行")
        return False

def test_fastapi():
    """测试FastAPI基础功能"""
    print("\n🔍 测试FastAPI...")
    try:
        from fastapi import FastAPI
        app = FastAPI()
        
        @app.get("/")
        def read_root():
            return {"Hello": "World"}
            
        print("✅ FastAPI - 初始化成功")
        return True
    except Exception as e:
        print(f"❌ FastAPI - 测试失败: {e}")
        return False

if __name__ == "__main__":
    print("🚀 开始环境验证...\n")
    
    success = True
    success &= test_imports()
    success &= test_redis() 
    success &= test_fastapi()
    
    if success:
        print("\n🎉 所有环境验证通过！可以开始开发了。")
        sys.exit(0)
    else:
        print("\n❌ 部分环境验证失败，请检查上述错误。")
        sys.exit(1)
