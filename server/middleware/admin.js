/**
 * 管理员权限中间件
 */
module.exports = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      code: 401,
      message: '请先登录'
    });
  }

  if (req.user.role !== 2) {
    return res.status(403).json({
      code: 403,
      message: '权限不足，需要管理员权限'
    });
  }

  next();
};
