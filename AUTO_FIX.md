# 🚀 Railway 部署一键修复脚本

**执行时间**: 2026-03-13 09:45  
**状态**: 已准备好

---

## 📋 当前状态检查

### ✅ 已完成
- [x] Railway CLI 已安装 (v4.31.0)
- [x] Railway 已登录 (ruoan724996@gmail.com)
- [x] GitHub 仓库已推送
- [x] Dockerfile 已创建
- [x] railway.json 已配置

### ⏳ 待完成
- [ ] 项目未正确链接
- [ ] 需要重新创建部署

---

## 🔧 自动修复步骤

### 步骤 1: 打开 Railway 控制台

**点击打开**: https://railway.app

### 步骤 2: 删除旧项目（如果有）

如果看到 `wechat-checkin-system` 项目但部署失败：

1. 点击进入项目
2. 点击右上角 **Settings** ⚙️
3. 滚动到底部 **Danger Zone**
4. 点击 **Delete Project**
5. 输入项目名确认删除

### 步骤 3: 创建新项目

1. 点击 **New Project**
2. 选择 **Deploy from GitHub repo**
3. 找到并点击 **`wechat-checkin-system`**
4. Railway 会自动开始部署

### 步骤 4: 添加 MySQL 数据库

部署开始后：

1. 点击 **+ New**
2. 选择 **Database**
3. 选择 **Add MySQL**
4. 等待 MySQL 创建完成（约 1-2 分钟）

### 步骤 5: 配置环境变量

点击项目 → **Variables** 标签，添加以下变量：

```
PORT=3000
NODE_ENV=production
JWT_SECRET=wechat_checkin_super_secret_2026_production_key
WECHAT_APP_ID=wx0000000000000000
WECHAT_APP_SECRET=your_wechat_app_secret
```

### 步骤 6: 等待部署完成

- 点击 **Deployments** 标签
- 查看最新部署状态
- 绿色 ✅ = 成功
- 红色 ❌ = 失败，点击查看详情

### 步骤 7: 初始化数据库

部署成功后，在终端执行：

```bash
cd /Users/tianfch/.openclaw/workspace/wechat-checkin-system
railway link  # 选择刚创建的项目
railway run node server/scripts/init-database.js
```

---

## 🎯 快速操作链接

| 操作 | 链接 |
|------|------|
| Railway 控制台 | https://railway.app |
| 创建新项目 | https://railway.app/new |
| 项目列表 | https://railway.app/dashboard |

---

## ⚠️ 常见问题

### Q: 看不到 Root Directory 选项？
A: Railway 界面更新了，使用 railway.json 配置即可（已配置好）

### Q: 部署还是失败？
A: 查看 Deployments 标签页的日志，截图发给我

### Q: MySQL 怎么添加？
A: 在项目页面点击 "+ New" → "Database" → "MySQL"

---

## 📞 需要帮助？

**如果遇到问题：**
1. 截图部署错误日志
2. 告诉我当前卡在哪个步骤
3. 我会立即帮你解决

---

**田老板，现在打开 https://railway.app 开始操作吧！**

按照上面步骤，5 分钟完成部署！🚀
