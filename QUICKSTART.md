# 快速开始指南

## 环境要求

- Node.js >= 14.0.0
- MySQL >= 5.7
- 微信开发者工具

## 一、后端服务配置

### 1. 安装依赖

```bash
cd server
npm install
```

### 2. 配置环境变量

编辑 `server/.env` 文件：

```env
# MySQL 配置
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=你的密码
MYSQL_DATABASE=wechat_checkin

# 微信配置（开发阶段可用测试值）
WECHAT_APP_ID=wx0000000000000000
WECHAT_APP_SECRET=your_secret
```

### 3. 初始化数据库

```bash
cd server
node scripts/init-database.js
```

### 4. 启动后端服务

```bash
npm start
# 或开发模式
npm run dev
```

服务将运行在 `http://localhost:3000`

## 二、小程序前端配置

### 1. 打开微信开发者工具

### 2. 导入项目

- 选择目录：`miniprogram/`
- 填入你的 AppID（或使用测试号）

### 3. 配置服务器地址

编辑 `miniprogram/app.js`：

```javascript
globalData: {
  baseUrl: 'http://localhost:3000',  // 本地开发
  // baseUrl: 'https://your-domain.com',  // 生产环境
}
```

### 4. 编译运行

点击编译按钮即可预览

## 三、测试流程

### 1. 后端测试

```bash
# 健康检查
curl http://localhost:3000/health

# 获取活动列表
curl http://localhost:3000/api/activity
```

### 2. 小程序测试

1. 点击"微信一键登录"
2. 授权用户信息
3. 查看活动列表
4. 进行签到
5. 查看统计

## 四、部署上线

详见 [docs/deployment.md](docs/deployment.md)

## 常见问题

### Q: 微信登录失败？
A: 确保配置了正确的 `WECHAT_APP_ID` 和 `WECHAT_APP_SECRET`

### Q: 数据库连接失败？
A: 检查 MySQL 服务是否启动，用户名密码是否正确

### Q: 小程序请求失败？
A: 检查 `baseUrl` 配置，确保后端服务已启动

## 下一步

- [ ] 配置真实的微信小程序 AppID
- [ ] 部署后端服务到 Railway/腾讯云
- [ ] 提交小程序审核
- [ ] 邀请用户测试

---

**开发团队**: 田福成  
**创建时间**: 2026-03-13
