// pages/activity/activity.js
const app = getApp();

Page({
  data: {
    activities: [],
    loading: false,
    isAdmin: false,
    searchKeyword: ''
  },

  onLoad() {
    this.loadActivities();
  },

  onShow() {
    // 检查是否为管理员（可后续实现）
    this.setData({ isAdmin: false });
  },

  // 加载活动列表
  async loadActivities() {
    this.setData({ loading: true });

    try {
      const res = await wx.request({
        url: `${app.globalData.baseUrl}/api/activity`,
        header: {
          Authorization: `Bearer ${app.globalData.token}`
        }
      });

      if (res.data.success) {
        this.setData({
          activities: res.data.data
        });
      }
    } catch (error) {
      console.error('加载活动失败:', error);
      wx.showToast({ title: '加载失败', icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },

  // 搜索
  onSearch(e) {
    this.setData({ searchKeyword: e.detail.value });
    // 可以实现本地过滤或调用后端搜索接口
  },

  // 参加活动
  async joinActivity(e) {
    const activityId = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '参加活动',
      content: '确定要参加这个活动吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            // 这里可以调用后端接口记录用户参加活动
            wx.showToast({ title: '参加成功', icon: 'success' });
            // 跳转到签到页面
            wx.navigateTo({
              url: `/pages/index/index?activityId=${activityId}`
            });
          } catch (error) {
            wx.showToast({ title: '操作失败', icon: 'none' });
          }
        }
      }
    });
  },

  // 查看详情
  goToDetail(e) {
    const activityId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/activity/detail?id=${activityId}`
    });
  },

  // 创建活动
  goToCreate() {
    wx.navigateTo({
      url: '/pages/create-activity/create-activity'
    });
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.loadActivities().then(() => {
      wx.stopPullDownRefresh();
    });
  }
});
