// app.js
App({
  onLaunch() {
    // 初始化全局数据
    this.globalData = {
      baseUrl: 'http://localhost:3000', // 开发环境
      // baseUrl: 'https://your-domain.railway.app', // 生产环境
      token: null,
      userInfo: null
    };

    // 从本地缓存恢复登录状态
    const token = wx.getStorageSync('token');
    const userInfo = wx.getStorageSync('userInfo');
    
    if (token && userInfo) {
      this.globalData.token = token;
      this.globalData.userInfo = userInfo;
    }
  },

  globalData: {
    baseUrl: 'http://localhost:3000',
    token: null,
    userInfo: null
  }
});
