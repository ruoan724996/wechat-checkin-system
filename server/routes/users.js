/**
 * 用户路由
 */
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// 所有用户路由都需要认证
router.use(auth);

// 获取用户信息
router.get('/info', async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在'
      });
    }

    res.json({
      code: 200,
      message: 'success',
      data: {
        id: user.id,
        openid: user.openid,
        nickname: user.nickname,
        avatar_url: user.avatar_url,
        gender: user.gender,
        phone: user.phone,
        role: user.role,
        created_at: user.created_at
      }
    });
  } catch (error) {
    next(error);
  }
});

// 更新用户信息
router.put('/info', async (req, res, next) => {
  try {
    const { nickname, phone, gender, avatar_url } = req.body;

    await User.update(req.user.id, {
      nickname,
      phone,
      gender,
      avatar_url
    });

    const user = await User.findById(req.user.id);

    res.json({
      code: 200,
      message: '更新成功',
      data: {
        id: user.id,
        nickname: user.nickname,
        avatar_url: user.avatar_url,
        gender: user.gender,
        phone: user.phone
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
