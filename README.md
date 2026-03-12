# 微信小程序签到管理系统

一个基于微信小程序的签到管理系统，支持活动创建、每日签到、数据统计等功能。

## 项目结构

```
wechat-checkin-system/
├── miniprogram/          # 小程序前端
│   ├── pages/           # 页面
│   │   ├── index/       # 首页
│   │   ├── calendar/    # 签到日历
│   │   ├── activity/    # 活动列表
│   │   ├── create-activity/ # 创建活动
│   │   ├── stats/       # 个人统计
│   │   └── admin/       # 管理员视图
│   ├── components/      # 公共组件
│   ├── utils/           # 工具函数
│   └── images/          # 图片资源
├── server/              # 后端服务
│   ├── routes/          # 路由
│   ├── controllers/     # 控制器
│   ├── models/          # 数据模型
│   ├── middleware/      # 中间件
│   └── config/          # 配置
├── docs/                # 文档
└── README.md
```

## 核心功能

### 1. 用户登录
- 微信授权登录
- 用户信息管理
- 角色区分（普通用户/管理员）

### 2. 签到功能
- 每日签到
- 签到日历展示
- 连续签到统计
- 签到记录查询

### 3. 活动管理
- 创建签到活动
- 活动列表展示
- 活动详情查看
- 活动状态管理

### 4. 数据统计
- 个人签到统计
- 管理员视图（参与率）
- 数据导出

### 5. 消息提醒
- 签到提醒模板
- 订阅消息推送

## 技术栈

### 前端
- 微信小程序原生开发
- WXML/WXSS/JavaScript

### 后端
- Node.js + Express
- MySQL 数据库
- JWT 认证

### 部署
- Railway / 腾讯云

## 快速开始

### 环境要求
- Node.js >= 14.0.0
- MySQL >= 5.7
- 微信开发者工具

### 后端启动

```bash
cd server
npm install
cp .env.example .env
# 配置环境变量
npm start
```

### 前端启动

1. 打开微信开发者工具
2. 导入 `miniprogram` 目录
3. 配置 `project.config.json` 中的 AppID
4. 编译运行

## 数据库配置

详见 [docs/database.md](docs/database.md)

## API 文档

详见 [docs/api.md](docs/api.md)

## 部署说明

详见 [docs/deployment.md](docs/deployment.md)

## 许可证

MIT
