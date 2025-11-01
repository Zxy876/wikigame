#!/bin/bash

BASE_URL="http://localhost:8000"
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${YELLOW}🎯 Wiki Racer 后端测试${NC}"
echo "================================"

# 检查依赖
if ! command -v jq &> /dev/null; then
    echo -e "${RED}错误: 请先安装 jq${NC}"
    exit 1
fi

# 检查服务
echo -e "${YELLOW}🔍 检查服务...${NC}"
if ! curl -s "$BASE_URL/health" > /dev/null; then
    echo -e "${RED}❌ 服务未运行${NC}"
    exit 1
fi
echo -e "${GREEN}✅ 服务正常${NC}"

# 基础测试
echo -e "\n${YELLOW}�� 基础测试${NC}"
curl -s "$BASE_URL/health" | jq -r '.status' | xargs -I {} echo -e "健康检查: ${GREEN}{}${NC}"
curl -s "$BASE_URL/system-status" | jq -r '.api' | xargs -I {} echo -e "API状态: ${GREEN}{}${NC}"

# 缓存测试
echo -e "\n${YELLOW}💾 缓存测试${NC}"
cache_stats=$(curl -s "$BASE_URL/cache-stats")
echo "缓存页面: $(echo $cache_stats | jq -r '.cached_pages')"

# 路径查找测试
echo -e "\n${YELLOW}🛣️  路径查找测试${NC}"

test_path() {
    local name=$1
    local start=$2
    local end=$3
    echo -e "${BLUE}测试: $name${NC}"
    
    response=$(curl -s -X POST "$BASE_URL/api/game" \
        -H "Content-Type: application/json" \
        -d "{\"start\": \"$start\", \"$end\": \"$end\"}")
    
    if echo "$response" | jq -e '.path' > /dev/null; then
        path_length=$(echo "$response" | jq -r '.path | length')
        path=$(echo "$response" | jq -r '.path | join(" → ")')
        echo -e "  ${GREEN}✅ 成功 (长度: $path_length)${NC}"
        echo "  路径: $path"
    else
        echo -e "  ${RED}❌ 失败${NC}"
    fi
}

test_path "Python → JavaScript" "Python_(programming_language)" "JavaScript"
test_path "猫 → 狗" "Cat" "Dog"
test_path "莎士比亚 → AI" "Shakespeare" "Artificial_intelligence"
test_path "披萨 → 量子力学" "Pizza" "Quantum_mechanics"

# 性能测试
echo -e "\n${YELLOW}⚡ 性能测试${NC}"
time curl -s -X POST "$BASE_URL/api/game" \
    -H "Content-Type: application/json" \
    -d '{"start": "Apple_Inc.", "end": "Microsoft"}' > /dev/null

echo -e "\n${GREEN}🎉 测试完成！后端准备就绪${NC}"
