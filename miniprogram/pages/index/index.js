// pages/index/index.js
const app = getApp();

Page({
  data: {
    userInfo: null,
    currentActivity: null,
    stats: {
      continuousDays: 0,
      totalCount: 0
    },
    hasCheckedToday: false
  },

  onLoad() {
    this.checkLoginStatus();
  },

  onShow() {
    if (this.data.userInfo) {
      this.loadCurrentActivity();
    }
  },

  // 检查登录状态
  async checkLoginStatus() {
    const token = wx.getStorageSync('token');
    const userInfo = wx.getStorageSync('userInfo');

    if (token && userInfo) {
      this.setData({ userInfo });
      app.globalData.token = token;
      app.globalData.userInfo = userInfo;
    }
  },

  // 微信登录
  async handleLogin() {
    wx.showLoading({ title: '登录中...' });

    try {
      // 1. 获取微信登录 code
      const { code } = await wx.login();

      // 2. 获取用户信息
      const userInfo = await new Promise((resolve, reject) => {
        wx.getUserProfile({
          desc: '用于完善用户资料',
          success: resolve,
          fail: reject
        });
      });

      // 3. 调用后端登录接口
      const res = await wx.request({
        url: `${app.globalData.baseUrl}/api/auth/login`,
        method: 'POST',
        data: {
          code,
          userInfo: {
            nickName: userInfo.userInfo.nickName,
            avatarUrl: userInfo.userInfo.avatarUrl,
            gender: userInfo.userInfo.gender,
            city: userInfo.userInfo.city,
            province: userInfo.userInfo.province,
            country: userInfo.userInfo.country
          }
        }
      });

      if (res.data.success) {
        // 4. 保存 token 和用户信息
        wx.setStorageSync('token', res.data.token);
        wx.setStorageSync('userInfo', res.data.user);
        
        app.globalData.token = res.data.token;
        app.globalData.userInfo = res.data.user;

        this.setData({
          userInfo: res.data.user
        });

        wx.hideLoading();
        wx.showToast({ title: '登录成功', icon: 'success' });

        // 加载活动信息
        this.loadCurrentActivity();
      } else {
        throw new Error(res.data.error);
      }

    } catch (error) {
      console.error('登录失败:', error);
      wx.hideLoading();
      wx.showToast({ title: error.message || '登录失败', icon: 'none' });
    }
  },

  // 加载当前活动
  async loadCurrentActivity() {
    try {
      const res = await wx.request({
        url: `${app.globalData.baseUrl}/api/activity`,
        header: {
          Authorization: `Bearer ${app.globalData.token}`
        }
      });

      if (res.data.success && res.data.data.length > 0) {
        const activity = res.data.data[0];
        this.setData({ currentActivity: activity });
        
        // 加载统计信息
        this.loadStats(activity.id);
      }
    } catch (error) {
      console.error('加载活动失败:', error);
    }
  },

  // 加载统计数据
  async loadStats(activityId) {
    try {
      const [statsRes, recordsRes] = await Promise.all([
        wx.request({
          url: `${app.globalData.baseUrl}/api/checkin/stats?activityId=${activityId}`,
          header: { Authorization: `Bearer ${app.globalData.token}` }
        }),
        wx.request({
          url: `${app.globalData.baseUrl}/api/checkin/records?activityId=${activityId}&limit=1`,
          header: { Authorization: `Bearer ${app.globalData.token}` }
        })
      ]);

      if (statsRes.data.success) {
        const today = new Date().toISOString().split('T')[0];
        const hasChecked = recordsRes.data.data.length > 0 && 
                          recordsRes.data.data[0].checkin_date === today;

        this.setData({
          stats: statsRes.data.data,
          hasCheckedToday: hasChecked
        });
      }
    } catch (error) {
      console.error('加载统计失败:', error);
    }
  },

  // 执行签到
  async doCheckin() {
    if (this.data.hasCheckedToday) return;

    wx.showLoading({ title: '签到中...' });

    try {
      const res = await wx.request({
        url: `${app.globalData.baseUrl}/api/checkin`,
        method: 'POST',
        header: {
          Authorization: `Bearer ${app.globalData.token}`
        },
        data: {
          activityId: this.data.currentActivity.id
        }
      });

      if (res.data.success) {
        wx.hideLoading();
        wx.showToast({ title: '签到成功！', icon: 'success' });
        
        this.setData({
          hasCheckedToday: true,
          stats: {
            continuousDays: res.data.data.continuousDays,
            totalCount: res.data.data.totalCount
          }
        });
      } else {
        throw new Error(res.data.error);
      }
    } catch (error) {
      wx.hideLoading();
      wx.showToast({ title: error.message || '签到失败', icon: 'none' });
    }
  },

  // 页面跳转
  goToActivity() {
    wx.navigateTo({ url: '/pages/activity/activity' });
  },

  goToCalendar() {
    wx.navigateTo({ url: '/pages/calendar/calendar' });
  },

  goToStats() {
    wx.navigateTo({ url: '/pages/stats/stats' });
  },

  goToCheckin() {
    // 可以跳转到签到详情页
  }
});
