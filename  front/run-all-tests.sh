
#!/bin/bash
echo "🚀 开始完整的导入测试流程..."
echo "=== 步骤1: 修复导入问题 ==="
./fix-imports.sh
echo ""
echo "=== 步骤2: 创建测试文件 ==="
./create-import-test.sh
echo ""  
echo "=== 步骤3: 验证修复结果 ==="
./verify-imports.sh
echo ""
echo "=== 步骤4: 启动开发服务器 ==="
echo "📢 请手动运行: npm run dev"
echo "📢 然后在浏览器控制台查看测试结果"
