print("=== 基础Python测试 ===")
print(f"Python版本: {__import__('sys').version}")

print("\n=== 测试核心包 ===")
packages = ['fastapi', 'uvicorn', 'requests', 'bs4', 'redis', 'celery', 'pydantic']

for pkg in packages:
    try:
        __import__(pkg)
        print(f"✅ {pkg} - 成功")
    except ImportError as e:
        print(f"❌ {pkg} - 失败: {e}")

print("\n=== 测试完成 ===")
