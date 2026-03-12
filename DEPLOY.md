# 🚀 Railway 一键部署脚本

## 自动部署步骤

### 第一步：登录 Railway

```bash
# 打开浏览器登录
railway login
```

### 第二步：初始化项目

```bash
cd /Users/tianfch/.openclaw/workspace/wechat-checkin-system

# 链接到 Railway 项目
railway link
```

### 第三步：添加 MySQL 数据库

```bash
# 在 Railway 控制台操作，或使用 CLI
# 访问 https://railway.app 创建 MySQL 插件
```

### 第四步：配置环境变量

在 Railway 控制台（https://railway.app）中配置以下变量：

```bash
# 基础配置
PORT=3000
NODE_ENV=production

# JWT 配置
JWT_SECRET=wechat_checkin_super_secret_key_2026_change_this_in_production

# 微信配置（需要替换为真实值）
WECHAT_APP_ID=wx0000000000000000
WECHAT_APP_SECRET=your_wechat_app_secret_here

# MySQL 配置（Railway 会自动注入）
# MYSQL_HOST - 自动生成
# MYSQL_PORT - 自动生成
# MYSQL_USER - 自动生成
# MYSQL_PASSWORD - 自动生成
# MYSQL_DATABASE - 自动生成
```

### 第五步：部署代码

```bash
cd /Users/tianfch/.openclaw/workspace/wechat-checkin-system/server

# 部署到 Railway
railway up
```

### 第六步：初始化数据库

```bash
# 执行数据库初始化脚本
railway run node scripts/init-database.js
```

### 第七步：获取部署地址

```bash
# 查看部署信息
railway open

# 或获取域名
railway domain
```

---

## 手动部署（通过 Railway 网页）

### 1. 访问 Railway
打开 https://railway.app 并登录

### 2. 创建新项目
- 点击 "New Project"
- 选择 "Deploy from GitHub repo"
- 授权 Railway 访问 GitHub
- 选择 `wechat-checkin-system` 仓库

### 3. 添加 MySQL 数据库
- 在项目页面点击 "+ New"
- 选择 "Database" → "Add MySQL"
- Railway 会自动创建并部署 MySQL 实例

### 4. 配置服务

点击 `wechat-checkin-system` 服务，在 Settings 中配置：

**Root Directory**: `server`

**Start Command**: `node server.js`

### 5. 配置环境变量

在 Variables 标签页添加：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `PORT` | `3000` | 服务端口 |
| `NODE_ENV` | `production` | 运行环境 |
| `JWT_SECRET` | `your_secret_key_here` | JWT 密钥 |
| `WECHAT_APP_ID` | `wx...` | 微信 AppID |
| `WECHAT_APP_SECRET` | `your_secret` | 微信密钥 |

Railway 会自动注入 MySQL 相关变量。

### 6. 查看部署日志

点击 "Deployments" 标签页查看实时日志。

### 7. 初始化数据库

部署成功后，在 Railway 控制台：
1. 点击 MySQL 插件
2. 点击 "Generate Domain" 获取连接信息
3. 使用 Railway CLI 执行初始化：
   ```bash
   railway run node scripts/init-database.js
   ```

### 8. 获取访问地址

部署完成后，Railway 会提供公共 URL：
```
https://wechat-checkin-system-production.up.railway.app
```

---

## 验证部署

### 测试 API 接口

```bash
# 健康检查
curl https://your-railway-url.up.railway.app/health

# 获取活动列表
curl https://your-railway-url.up.railway.app/api/activity
```

### 预期响应

```json
{
  "status": "ok",
  "timestamp": "2026-03-13T..."
}
```

---

## 配置小程序

### 1. 更新后端地址

编辑 `miniprogram/app.js`:

```javascript
App({
  onLaunch() {
    this.globalData = {
      // 生产环境
      baseUrl: 'https://your-railway-url.up.railway.app'
    }
  }
});
```

### 2. 配置微信 AppID

编辑 `miniprogram/project.config.json`:

```json
{
  "appid": "你的真实 AppID",
  "projectname": "wechat-checkin-system"
}
```

### 3. 配置服务器域名

在微信公众平台后台：
1. 登录 https://mp.weixin.qq.com
2. 开发 → 开发管理 → 开发设置
3. 服务器域名 → request 合法域名
4. 添加：`https://your-railway-url.up.railway.app`

---

## 故障排查

### 部署失败

```bash
# 查看日志
railway logs

# 重新部署
railway up --force
```

### 数据库连接失败

检查环境变量是否正确配置：
```bash
railway variables
```

### API 返回错误

查看应用日志：
```bash
railway logs --follow
```

---

## 后续优化

1. **自定义域名**: 在 Railway Settings 中配置
2. **自动备份**: Railway 自动备份数据库
3. **监控告警**: Railway 提供基础监控
4. **性能优化**: 根据使用情况调整资源配置

---

**部署检查清单**:
- [ ] Railway 账号已注册
- [ ] GitHub 仓库已推送
- [ ] MySQL 数据库已添加
- [ ] 环境变量已配置
- [ ] 数据库已初始化
- [ ] API 测试通过
- [ ] 小程序配置已更新
- [ ] 微信域名已配置

---

**创建时间**: 2026-03-13  
**部署平台**: Railway  
**状态**: 待完成
