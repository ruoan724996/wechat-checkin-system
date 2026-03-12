# 部署说明

## 环境准备

### 1. 服务器要求

- **操作系统**: Linux (Ubuntu 18.04+) / macOS
- **Node.js**: >= 14.0.0
- **MySQL**: >= 5.7
- **PM2**: (可选，用于进程管理)

### 2. 域名和 HTTPS

- 微信小程序要求后端接口必须使用 HTTPS
- 可通过 Let's Encrypt 获取免费证书
- 或使用云服务商提供的 HTTPS 支持

---

## Railway 部署

### 1. 准备工作

1. 注册 [Railway](https://railway.app) 账号
2. 创建 MySQL 插件
3. 创建 Node.js 服务

### 2. 数据库配置

在 Railway 中创建 MySQL 插件后，获取连接信息：

```bash
# Railway 会自动提供以下环境变量
MYSQL_HOST
MYSQL_PORT
MYSQL_USER
MYSQL_PASSWORD
MYSQL_DATABASE
```

### 3. 后端部署

```bash
# 1. 初始化 Git 仓库
cd server
git init
git add .
git commit -m "Initial commit"

# 2. 连接 Railway
railway login
railway init
railway up

# 3. 设置环境变量
railway variables set \
  JWT_SECRET=your_secret_key \
  MYSQL_HOST=xxx \
  MYSQL_PORT=3306 \
  MYSQL_USER=xxx \
  MYSQL_PASSWORD=xxx \
  MYSQL_DATABASE=wechat_checkin \
  WECHAT_APP_ID=your_app_id \
  WECHAT_APP_SECRET=your_app_secret
```

### 4. 数据库初始化

```bash
# 连接 Railway MySQL
railway run mysql -h $MYSQL_HOST -u $MYSQL_USER -p$MYSQL_PASSWORD

# 执行初始化 SQL
source docs/database.sql
```

### 5. 配置域名

在 Railway 控制台配置自定义域名，并启用 HTTPS。

---

## 腾讯云部署

### 1. 购买云服务器

- 选择轻量应用服务器或 CVM
- 推荐配置：2 核 4G，50GB SSD

### 2. 安装环境

```bash
# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 MySQL
sudo apt-get install -y mysql-server

# 安装 PM2
sudo npm install -g pm2

# 安装 Nginx
sudo apt-get install -y nginx
```

### 3. 配置 MySQL

```bash
# 登录 MySQL
mysql -u root -p

# 创建数据库和用户
CREATE DATABASE wechat_checkin CHARACTER SET utf8mb4;
CREATE USER 'checkin'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON wechat_checkin.* TO 'checkin'@'localhost';
FLUSH PRIVILEGES;
```

### 4. 部署应用

```bash
# 上传代码
cd /var/www
git clone https://github.com/your-repo/wechat-checkin-system.git

# 安装依赖
cd wechat-checkin-system/server
npm install --production

# 配置环境变量
cp .env.example .env
vim .env  # 编辑配置

# 初始化数据库
mysql -u checkin -p wechat_checkin < docs/database.sql

# 启动服务
pm2 start server.js --name checkin-server
pm2 save
pm2 startup
```

### 5. 配置 Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        return 301 https://$server_name$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 6. 配置 HTTPS

```bash
# 安装 Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com
```

---

## 微信小程序配置

### 1. 配置合法域名

在微信公众平台后台配置：

1. 登录 [微信公众平台](https://mp.weixin.qq.com)
2. 开发 -> 开发管理 -> 开发设置
3. 服务器域名 -> request 合法域名
4. 添加：`https://your-domain.com`

### 2. 配置 AppID

在 `miniprogram/project.config.json` 中配置：

```json
{
  "appid": "your_wechat_appid",
  "projectname": "wechat-checkin-system"
}
```

### 3. 配置服务器地址

在 `miniprogram/utils/config.js` 中配置：

```javascript
module.exports = {
  API_BASE_URL: 'https://your-domain.com/api/v1',
  APP_ID: 'your_wechat_appid'
};
```

---

## 环境变量配置

### .env 示例

```env
# 服务器配置
PORT=3000
NODE_ENV=production

# JWT 配置
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=7d

# MySQL 配置
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=checkin
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=wechat_checkin

# 微信配置
WECHAT_APP_ID=wx1234567890abcdef
WECHAT_APP_SECRET=your_app_secret

# 日志配置
LOG_LEVEL=info
LOG_FILE=logs/app.log
```

---

## 监控和维护

### 1. 日志查看

```bash
# PM2 日志
pm2 logs checkin-server

# Nginx 日志
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### 2. 性能监控

- 使用 PM2 Monitor: `pm2 monit`
- 配置 New Relic 或 DataDog
- MySQL 慢查询日志

### 3. 备份策略

```bash
# 数据库备份脚本
#!/bin/bash
mysqldump -u checkin -p$PASSWORD wechat_checkin > backup_$(date +%Y%m%d).sql

# 添加到 crontab
0 2 * * * /path/to/backup.sh
```

### 4. 更新部署

```bash
# 拉取最新代码
git pull

# 安装依赖
npm install

# 重启服务
pm2 restart checkin-server
```

---

## 常见问题

### 1. 小程序请求失败

- 检查域名是否已配置 HTTPS
- 检查域名是否在微信公众平台配置
- 检查服务器防火墙设置

### 2. 数据库连接失败

- 检查 MySQL 服务是否启动
- 检查用户名密码是否正确
- 检查数据库权限

### 3. 微信登录失败

- 检查 AppID 和 AppSecret 是否正确
- 检查服务器 IP 是否在白名单
- 检查 code 是否已过期（5 分钟有效期）

---

## 安全建议

1. **定期更新依赖**: `npm audit` 和 `npm update`
2. **启用防火墙**: 只开放必要端口（80, 443, 22）
3. **定期备份**: 数据库和应用代码
4. **监控告警**: 配置服务异常告警
5. **HTTPS 强制**: 所有接口必须使用 HTTPS
6. **Token 安全**: 使用强密码生成 JWT_SECRET
