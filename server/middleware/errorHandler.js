/**
 * 错误处理中间件
 */
const config = require('../config');

module.exports = (err, req, res, next) => {
  // 记录错误日志
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method
  });

  // MySQL 错误
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(400).json({
      code: 400,
      message: '数据已存在'
    });
  }

  if (err.code === 'ER_NO_REFERENCED_ROW' || err.code === 'ER_ROW_IS_REFERENCED') {
    return res.status(400).json({
      code: 400,
      message: '数据关联错误'
    });
  }

  // 自定义错误
  if (err.message === '今日已签到') {
    return res.status(400).json({
      code: 400,
      message: '今日已签到'
    });
  }

  if (err.message === '活动不存在') {
    return res.status(404).json({
      code: 404,
      message: '活动不存在'
    });
  }

  // 默认错误
  res.status(err.status || 500).json({
    code: err.status || 500,
    message: config.env === 'development' ? err.message : '服务器内部错误',
    data: config.env === 'development' ? { stack: err.stack } : null
  });
};
