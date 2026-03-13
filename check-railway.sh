#!/bin/bash

# Railway 部署一键检查脚本

echo "🔍 Railway 部署检查"
echo "=================="
echo ""

# 1. 检查 Railway CLI
echo "📦 检查 Railway CLI..."
if command -v railway &> /dev/null; then
  RAILWAY_VERSION=$(railway --version)
  echo "✅ Railway CLI 已安装：$RAILWAY_VERSION"
else
  echo "❌ Railway CLI 未安装"
  echo "   安装命令：npm install -g @railway/cli"
  exit 1
fi

# 2. 检查登录状态
echo ""
echo "📦 检查登录状态..."
LOGIN_STATUS=$(railway whoami 2>&1)
if [[ $LOGIN_STATUS == *"Logged in"* ]]; then
  echo "✅ 已登录：$LOGIN_STATUS"
else
  echo "❌ 未登录"
  echo "   登录命令：railway login"
  exit 1
fi

# 3. 检查项目列表
echo ""
echo "📦 检查项目列表..."
railway list

# 4. 检查 GitHub 仓库
echo ""
echo "📦 检查 GitHub 仓库..."
if [ -d ".git" ]; then
  REMOTE_URL=$(git remote get-url origin 2>/dev/null)
  echo "✅ Git 仓库：$REMOTE_URL"
else
  echo "❌ 不是 Git 仓库"
fi

# 5. 检查必要文件
echo ""
echo "📦 检查部署文件..."
FILES=("server/server.js" "server/package.json" "server/Dockerfile" "server/railway.json")
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ $file (缺失)"
  fi
done

# 6. 检查环境变量
echo ""
echo "📦 检查环境变量配置..."
if [ -f "server/.env" ]; then
  echo "✅ .env 文件存在"
  echo "   注意：不要提交敏感信息到 Git"
else
  echo "⚠️  .env 文件不存在"
fi

echo ""
echo "=================="
echo "✅ 检查完成！"
echo ""
echo "🚀 下一步："
echo "   1. 访问 https://railway.app"
echo "   2. 删除旧项目（如果有）"
echo "   3. 创建新项目：Deploy from GitHub"
echo "   4. 选择 wechat-checkin-system"
echo "   5. 添加 MySQL 数据库"
echo "   6. 配置环境变量"
echo ""
