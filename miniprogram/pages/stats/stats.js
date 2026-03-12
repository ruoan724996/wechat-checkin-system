// pages/stats/stats.js
const app = getApp();

Page({
  data: {
    stats: {
      totalCount: 0,
      continuousDays: 0,
      activityCount: 0
    },
    records: []
  },

  onLoad() {
    this.loadStats();
    this.loadRecords();
  },

  onShow() {
    // 刷新数据
    this.loadStats();
    this.loadRecords();
  },

  // 加载统计数据
  async loadStats() {
    try {
      const res = await wx.request({
        url: `${app.globalData.baseUrl}/api/checkin/stats`,
        header: {
          Authorization: `Bearer ${app.globalData.token}`
        }
      });

      if (res.data.success) {
        this.setData({
          stats: {
            ...res.data.data,
            activityCount: 1 // 可优化：从活动列表获取
          }
        });
      }
    } catch (error) {
      console.error('加载统计失败:', error);
    }
  },

  // 加载签到记录
  async loadRecords() {
    try {
      const res = await wx.request({
        url: `${app.globalData.baseUrl}/api/checkin/records?limit=10`,
        header: {
          Authorization: `Bearer ${app.globalData.token}`
        }
      });

      if (res.data.success) {
        this.setData({ records: res.data.data });
      }
    } catch (error) {
      console.error('加载记录失败:', error);
    }
  }
});
