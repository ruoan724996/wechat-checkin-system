#!/bin/bash

# 微信小程序签到管理系统 - 快速修复脚本
# 用途：修复代码评审中发现的高优先级问题

echo "🔧 开始修复代码问题..."
echo ""

# 1. 生成新的 JWT_SECRET
echo "📦 1. 生成新的 JWT_SECRET"
NEW_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
echo "✅ 已生成新的 JWT_SECRET"
echo ""

# 2. 更新 .env 文件
echo "📦 2. 更新 .env 文件"
cd server

# 备份原文件
cp .env .env.backup 2>/dev/null || true

# 更新 JWT_SECRET
if grep -q "JWT_SECRET=" .env; then
  sed -i.bak "s/JWT_SECRET=.*/JWT_SECRET=${NEW_SECRET}/" .env
  echo "✅ 已更新 JWT_SECRET"
else
  echo "JWT_SECRET=${NEW_SECRET}" >> .env
  echo "✅ 已添加 JWT_SECRET"
fi

echo ""

# 3. 检查微信配置
echo "📦 3. 检查微信配置"
if grep -q "WECHAT_APP_ID=wx0000000000000000" .env; then
  echo "⚠️  警告：WECHAT_APP_ID 使用默认值，请手动更新"
  echo "   编辑 .env 文件，填入真实的微信 AppID"
else
  echo "✅ WECHAT_APP_ID 已配置"
fi

if grep -q "WECHAT_APP_SECRET=your_wechat_app_secret" .env; then
  echo "⚠️  警告：WECHAT_APP_SECRET 使用默认值，请手动更新"
  echo "   编辑 .env 文件，填入真实的微信 AppSecret"
else
  echo "✅ WECHAT_APP_SECRET 已配置"
fi

echo ""

# 4. 更新小程序配置提示
echo "📦 4. 小程序配置提示"
echo "⚠️  请手动更新 miniprogram/app.js 中的 baseUrl:"
echo "   baseUrl: 'https://your-railway-url.up.railway.app'"
echo ""

# 5. 提交更改
echo "📦 5. 提交更改到 Git"
cd ..
git add server/.env
git commit -m "fix: 更新 JWT_SECRET 为安全值" 2>/dev/null || echo "⚠️  Git 提交失败（可能是空提交）"

echo ""
echo "✅ 修复完成！"
echo ""
echo "📋 下一步操作:"
echo "   1. 编辑 server/.env 文件，填入真实的微信 AppID 和 AppSecret"
echo "   2. 更新 miniprogram/app.js 中的 baseUrl 为 Railway 地址"
echo "   3. 推送代码到 GitHub"
echo "   4. 在 Railway 部署并初始化数据库"
echo ""
