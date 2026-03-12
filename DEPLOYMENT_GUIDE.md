# 🚀 Railway 部署指南

## 方式一：一键部署（推荐）

### 1. 准备 GitHub 仓库

```bash
# 推送到 GitHub
cd /Users/tianfch/.openclaw/workspace/wechat-checkin-system

# 创建 GitHub 仓库（已创建）
# 访问 https://github.com/new 创建仓库

# 推送代码
git remote add origin https://github.com/tianfch/wechat-checkin-system.git
git push -u origin main
```

### 2. Railway 部署步骤

1. **访问 Railway**
   - 打开 https://railway.app
   - 使用 GitHub 账号登录

2. **创建新项目**
   - 点击 "New Project"
   - 选择 "Deploy from GitHub repo"
   - 选择 `wechat-checkin-system` 仓库

3. **添加 MySQL 数据库**
   - 在项目页面点击 "+ New"
   - 选择 "Database" → "Add MySQL"
   - Railway 会自动创建 MySQL 实例

4. **配置环境变量**
   
   在 Railway 控制台 Variables 中添加：
   ```
   PORT=3000
   NODE_ENV=production
   JWT_SECRET=wechat_checkin_super_secret_2026_change_this
   MYSQL_HOST=${{MYSQL_HOST}}
   MYSQL_PORT=${{MYSQL_PORT}}
   MYSQL_USER=${{MYSQL_USER}}
   MYSQL_PASSWORD=${{MYSQL_PASSWORD}}
   MYSQL_DATABASE=${{MYSQL_DATABASE}}
   WECHAT_APP_ID=wx0000000000000000
   WECHAT_APP_SECRET=your_app_secret_here
   ```

5. **初始化数据库**
   
   在 Railway 控制台点击 MySQL 插件 → "Generate Domain"
   然后使用 Railway 的 CLI 或 Web 控制台执行初始化：
   ```bash
   # 安装 Railway CLI
   npm install -g @railway/cli
   
   # 登录
   railway login
   
   # 连接项目
   railway link
   
   # 执行初始化脚本
   railway run node scripts/init-database.js
   ```

6. **获取部署地址**
   
   部署完成后，Railway 会提供类似这样的地址：
   ```
   https://wechat-checkin-system-production.up.railway.app
   ```

---

## 方式二：手动部署

### 1. 单独部署后端

```bash
cd server

# 初始化 Git
git init
git add .
git commit -m "Initial commit"

# Railway 部署
railway login
railway init
railway up
```

### 2. 配置环境变量

```bash
railway variables set \
  PORT=3000 \
  NODE_ENV=production \
  JWT_SECRET=your_secret_key \
  WECHAT_APP_ID=wx0000000000000000 \
  WECHAT_APP_SECRET=your_secret
```

Railway 会自动注入 MySQL 相关变量。

---

## 配置小程序

### 1. 更新后端地址

编辑 `miniprogram/app.js`:

```javascript
globalData: {
  // 开发环境
  // baseUrl: 'http://localhost:3000',
  
  // 生产环境（替换为你的 Railway 地址）
  baseUrl: 'https://wechat-checkin-system-production.up.railway.app'
}
```

### 2. 配置微信 AppID

编辑 `miniprogram/project.config.json`:

```json
{
  "appid": "你的微信小程序 AppID",
  "projectname": "wechat-checkin-system"
}
```

### 3. 配置合法域名

在微信公众平台后台：
1. 登录 https://mp.weixin.qq.com
2. 开发 → 开发管理 → 开发设置
3. 服务器域名 → request 合法域名
4. 添加：`https://wechat-checkin-system-production.up.railway.app`

---

## 测试验证

### 1. 测试后端接口

```bash
# 健康检查
curl https://your-railway-url.up.railway.app/health

# 获取活动列表
curl https://your-railway-url.up.railway.app/api/activity
```

### 2. 小程序测试

1. 微信开发者工具 → 编译
2. 点击"微信一键登录"
3. 查看活动列表
4. 进行签到测试

---

## 常见问题

### Q: Railway 部署失败？
A: 检查 logs，确保 `server.js` 路径正确

### Q: 数据库连接失败？
A: 确认 Railway MySQL 插件已添加，环境变量已配置

### Q: 小程序请求失败？
A: 
- 检查是否配置 HTTPS
- 检查域名是否在微信公众平台备案
- 开发阶段可开启"不校验合法域名"

---

## 后续优化

1. **自定义域名**: 在 Railway 配置自定义域名
2. **自动备份**: Railway 自动备份数据库
3. **监控告警**: Railway 提供基础监控
4. **性能优化**: 根据使用情况调整资源配置

---

**部署时间**: 2026-03-13  
**部署平台**: Railway  
**状态**: 待部署
