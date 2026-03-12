/**
 * 应用配置
 */
require('dotenv').config();

module.exports = {
  // 服务器端口
  port: process.env.PORT || 3000,
  
  // 环境
  env: process.env.NODE_ENV || 'development',
  
  // JWT 配置
  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret_change_in_production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  
  // 日志配置
  log: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/app.log'
  },
  
  // API 版本
  apiVersion: 'v1',
  
  // 分页配置
  pagination: {
    defaultPage: 1,
    defaultPageSize: 10,
    maxPageSize: 100
  }
};
