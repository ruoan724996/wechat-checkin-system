/**
 * 微信登录控制器
 */
const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 微信登录接口
exports.login = async (req, res) => {
  try {
    const { code, userInfo } = req.body;

    if (!code) {
      return res.status(400).json({ error: '缺少微信登录 code' });
    }

    // 1. 用 code 换取 openid
    const wxResponse = await axios.get('https://api.weixin.qq.com/sns/jscode2session', {
      params: {
        appid: process.env.WECHAT_APP_ID,
        secret: process.env.WECHAT_APP_SECRET,
        js_code: code,
        grant_type: 'authorization_code'
      }
    });

    const { openid, session_key, errcode, errmsg } = wxResponse.data;

    if (errcode) {
      return res.status(400).json({ error: `微信登录失败：${errmsg}` });
    }

    // 2. 查找或创建用户
    let user = await User.findByOpenId(openid);
    
    if (!user) {
      const userId = await User.create({
        openId: openid,
        nickName: userInfo?.nickName || '微信用户',
        avatarUrl: userInfo?.avatarUrl || '',
        gender: userInfo?.gender || 0,
        city: userInfo?.city || '',
        province: userInfo?.province || '',
        country: userInfo?.country || ''
      });
      user = await User.findByOpenId(openid);
    } else if (userInfo) {
      // 更新用户信息
      await User.update(user.id, userInfo);
    }

    // 3. 生成 JWT token
    const token = jwt.sign(
      { userId: user.id, openId: openid },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        nickName: user.nick_name,
        avatarUrl: user.avatar_url,
        gender: user.gender
      }
    });

  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ error: '登录失败，请稍后重试' });
  }
};

// 获取用户信息
exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findByOpenId(req.user.openId);
    
    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        nickName: user.nick_name,
        avatarUrl: user.avatar_url,
        gender: user.gender,
        city: user.city,
        province: user.province,
        country: user.country,
        createdAt: user.created_at
      }
    });

  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({ error: '获取用户信息失败' });
  }
};
