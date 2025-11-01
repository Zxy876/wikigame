#!/bin/bash

BASE_URL="http://localhost:8000"

echo "🎯 Wiki Racer 工作测试"
echo "======================"

# 测试基本端点
echo ""
echo "🔍 基本端点测试:"
echo "1. 根端点: $(curl -s "$BASE_URL/" | jq -r '.message')"
echo "2. 健康检查: $(curl -s "$BASE_URL/health" | jq -r '.status')"
echo "3. 系统状态: $(curl -s "$BASE_URL/system-status" | jq -r '.api')"

# 测试爬虫
echo ""
echo "🕷️  爬虫测试:"
curl -s "$BASE_URL/test-crawl/Python_(programming_language)" | jq '{page, links_found, sample_links: .sample_links | length}'

# 测试路径查找（使用正确的JSON格式）
echo ""
echo "🛣️  路径查找测试:"

test_path() {
    local name=$1
    local start=$2
    local end=$3
    
    echo "测试: $name ($start → $end)"
    
    # 使用临时文件确保JSON格式正确
    cat > /tmp/request.json << REQEOF
{"start": "$start", "end": "$end"}
REQEOF
    
    response=$(curl -s -X POST "$BASE_URL/api/game" \
        -H "Content-Type: application/json" \
        -d @/tmp/request.json)
    
    if echo "$response" | jq -e '.path' > /dev/null 2>&1; then
        path_length=$(echo "$response" | jq -r '.path | length')
        echo "  ✅ 成功 - 路径长度: $path_length"
        echo "  路径: $(echo "$response" | jq -r '.path | join(" → ")')"
    else
        echo "  ❌ 失败"
        echo "  响应: $response"
    fi
    echo ""
}

test_path "Python → JavaScript" "Python_(programming_language)" "JavaScript"
test_path "猫 → 狗" "Cat" "Dog"
test_path "莎士比亚 → AI" "Shakespeare" "Artificial_intelligence"

# 清理
rm -f /tmp/request.json

echo "✅ 测试完成"
