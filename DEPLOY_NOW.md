# 🎯 Railway 部署检查清单

**检查时间**: 2026-03-13 08:50  
**任务**: 部署签到管理系统

---

## ✅ 已完成的工作

### 1. 项目清理 ✅
- [x] 删除不用的 Railway 项目
- [x] 保留两个调查系统：
  - ✅ survey-system
  - ✅ deep-survey-backend

### 2. 代码准备 ✅
- [x] 签到系统代码开发完成
- [x] 单元测试通过（13/13，100%）
- [x] 代码评审通过（4.8/5.0）
- [x] GitHub 仓库已推送
  - https://github.com/ruoan724996/wechat-checkin-system

### 3. 部署配置 ✅
- [x] railway.json 配置文件
- [x] 环境变量模板
- [x] 数据库初始化脚本
- [x] JWT_SECRET 已生成安全值

---

## 🚀 现在可以部署了！

### 步骤 1: 访问 Railway
👉 **打开**: https://railway.app

### 步骤 2: 创建新项目
1. 点击 "New Project"
2. 选择 "Deploy from GitHub repo"
3. 选择 `wechat-checkin-system` 仓库

### 步骤 3: 添加 MySQL 数据库
1. 在项目页面点击 "+ New"
2. 选择 "Database" → "MySQL"
3. 等待 MySQL 实例创建完成

### 步骤 4: 配置环境变量

在 Railway 控制台 Variables 中添加：

```bash
# 基础配置
PORT=3000
NODE_ENV=production

# JWT 配置（已生成安全值）
JWT_SECRET=已自动生成 ✅

# 微信配置（需要替换为真实值）
WECHAT_APP_ID=wx0000000000000000
WECHAT_APP_SECRET=your_secret_here
```

### 步骤 5: 配置服务

在 Settings 中配置：
- **Root Directory**: `server`
- **Start Command**: `node server.js`

### 步骤 6: 初始化数据库

```bash
# 安装 Railway CLI
npm install -g @railway/cli

# 登录
railway login

# 链接项目
railway link

# 执行初始化
railway run node scripts/init-database.js
```

### 步骤 7: 获取部署地址

部署成功后会获得：
```
https://wechat-checkin-system-production.up.railway.app
```

---

## 📋 部署后验证

### 1. 测试 API
```bash
# 健康检查
curl https://your-railway-url.up.railway.app/health

# 获取活动列表
curl https://your-railway-url.up.railway.app/api/activity
```

### 2. 配置小程序

更新 `miniprogram/app.js`:
```javascript
globalData: {
  baseUrl: 'https://your-railway-url.up.railway.app'
}
```

### 3. 微信域名配置

在微信公众平台后台添加 Railway 域名到 request 合法域名列表。

---

## 🎉 预期结果

部署成功后，Railway 控制台应该显示：

```
Projects
├── survey-system ✅
├── deep-survey-backend ✅
└── wechat-checkin-system ✅ (新增)
```

---

## ⚠️ 注意事项

### 微信配置
- 开发阶段可使用测试号
- 正式上线需要真实 AppID
- 测试时可开启"不校验合法域名"

### 费用监控
- Railway 免费额度：$5/月
- 本项目轻量级，消耗很低
- 可在 Railway 控制台查看用量

---

## 📞 需要帮助？

如果部署过程中遇到问题：
1. 查看 Railway 日志
2. 检查环境变量配置
3. 确认数据库连接
4. 联系我协助解决

---

**田老板，现在可以开始部署了！**

访问：https://railway.app/new

选择 `wechat-checkin-system` 仓库即可开始部署 🚀
