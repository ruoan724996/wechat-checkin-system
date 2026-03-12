const express = require('express');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

// 微信登录
router.post('/login', authController.login);

// 获取用户信息（需要认证）
router.get('/userinfo', auth, authController.getUserInfo);

module.exports = router;
