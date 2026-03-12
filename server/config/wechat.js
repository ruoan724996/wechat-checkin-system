/**
 * 微信配置
 */
require('dotenv').config();

module.exports = {
  // 微信小程序 AppID
  appId: process.env.WECHAT_APP_ID || '',
  
  // 微信小程序 AppSecret
  appSecret: process.env.WECHAT_APP_SECRET || '',
  
  // 微信登录接口
  loginUrl: 'https://api.weixin.qq.com/sns/jscode2session',
  
  // 获取 AccessToken 接口
  accessTokenUrl: 'https://api.weixin.qq.com/cgi-bin/token',
  
  // 发送订阅消息接口
  sendSubscribeUrl: 'https://api.weixin.qq.com/cgi-bin/message/subscribe/send'
};
