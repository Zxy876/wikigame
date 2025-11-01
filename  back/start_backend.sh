#!/bin/bash

# Wiki Racer 后端一键启动脚本
set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_DIR="/Users/zxydediannao/wiki-racer-backend"

log() { echo -e "${BLUE}🚀 $1${NC}"; }
success() { echo -e "${GREEN}✅ $1${NC}"; }
warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
error() { echo -e "${RED}❌ $1${NC}"; }

# 检查项目目录
cd "$PROJECT_DIR" || { error "项目目录不存在: $PROJECT_DIR"; exit 1; }
success "进入项目目录: $PROJECT_DIR"

# 激活虚拟环境
log "激活虚拟环境..."
source venv/bin/activate || { error "虚拟环境激活失败"; exit 1; }
success "虚拟环境已激活"

# 检查依赖
log "检查Python依赖..."
if ! python -c "import fastapi, uvicorn, redis" &>/dev/null; then
    warning "缺少依赖，正在安装..."
    pip install -r requirements.txt || { error "依赖安装失败"; exit 1; }
fi
success "依赖检查通过"

# 启动Redis
log "启动Redis服务..."
if ! redis-cli ping &>/dev/null; then
    if command -v brew &>/dev/null; then
        brew services start redis || redis-server --daemonize yes
    else
        redis-server --daemonize yes
    fi
    sleep 2
fi

if redis-cli ping &>/dev/null; then
    success "Redis启动成功"
else
    error "Redis启动失败"
    exit 1
fi

# 检查端口占用
log "检查端口占用..."
if lsof -Pi :8000 -sTCP:LISTEN -t &>/dev/null; then
    warning "端口8000被占用，终止进程..."
    kill -9 $(lsof -ti:8000) 2>/dev/null || true
    sleep 1
fi

# 启动FastAPI
log "启动FastAPI服务..."
success "服务将在 http://localhost:8000 启动"
success "API文档: http://localhost:8000/docs"
echo ""

python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
