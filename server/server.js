/**
 * 微信小程序签到管理系统 - 后端服务
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const db = require('./config/database');
const authRouter = require('./routes/auth');
const checkinRouter = require('./routes/checkin');
const activityRouter = require('./routes/activity');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(helmet()); // 安全头
app.use(cors()); // 跨域
app.use(morgan('dev')); // 日志
app.use(express.json()); // JSON 解析
app.use(express.urlencoded({ extended: true }));

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API 路由
app.use('/api/auth', authRouter);
app.use('/api/checkin', checkinRouter);
app.use('/api/activity', activityRouter);

// 404 处理
app.use((req, res) => {
  res.status(404).json({ error: '接口不存在' });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({ error: '服务器内部错误' });
});

// 启动服务器
async function startServer() {
  // 测试数据库连接
  const dbConnected = await db.testConnection();
  
  if (!dbConnected) {
    console.warn('⚠️  数据库连接失败，服务器仍可启动但部分功能不可用');
  }

  app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════╗
║   微信小程序签到管理系统 - 后端服务            ║
╠═══════════════════════════════════════════════╣
║   服务地址：http://localhost:${PORT}             ║
║   环境：${process.env.NODE_ENV || 'development'}                          ║
║   时间：${new Date().toLocaleString('zh-CN')}       ║
╚═══════════════════════════════════════════════╝
    `);
  });
}

startServer();
