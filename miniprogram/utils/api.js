/**
 * API 工具函数
 */
const app = getApp();

const api = {
  /**
   * 微信登录
   */
  async login(code, encryptedData, iv) {
    return app.request({
      url: '/auth/login',
      method: 'POST',
      data: { code, encryptedData, iv }
    });
  },

  /**
   * 获取用户信息
   */
  async getUserInfo() {
    return app.request({
      url: '/user/info'
    });
  },

  /**
   * 更新用户信息
   */
  async updateUserInfo(data) {
    return app.request({
      url: '/user/info',
      method: 'PUT',
      data
    });
  },

  /**
   * 创建活动
   */
  async createActivity(data) {
    return app.request({
      url: '/activities',
      method: 'POST',
      data
    });
  },

  /**
   * 获取活动列表
   */
  async getActivityList(params = {}) {
    return app.request({
      url: '/activities',
      data: params
    });
  },

  /**
   * 获取活动详情
   */
  async getActivityDetail(id) {
    return app.request({
      url: `/activities/${id}`
    });
  },

  /**
   * 加入活动
   */
  async joinActivity(id) {
    return app.request({
      url: `/activities/${id}/join`,
      method: 'POST'
    });
  },

  /**
   * 退出活动
   */
  async leaveActivity(id) {
    return app.request({
      url: `/activities/${id}/leave`,
      method: 'POST'
    });
  },

  /**
   * 签到
   */
  async checkin(data) {
    return app.request({
      url: '/checkin',
      method: 'POST',
      data
    });
  },

  /**
   * 获取签到日历
   */
  async getCheckinCalendar(params) {
    return app.request({
      url: '/checkin/calendar',
      data: params
    });
  },

  /**
   * 获取签到记录
   */
  async getCheckinRecords(params) {
    return app.request({
      url: '/checkin/records',
      data: params
    });
  },

  /**
   * 获取今日签到状态
   */
  async getTodayStatus(activityId) {
    return app.request({
      url: '/checkin/today',
      data: { activity_id: activityId }
    });
  },

  /**
   * 获取个人统计
   */
  async getPersonalStats(activityId) {
    return app.request({
      url: '/statistics/personal',
      data: activityId ? { activity_id: activityId } : {}
    });
  },

  /**
   * 获取活动统计
   */
  async getActivityStats(id) {
    return app.request({
      url: `/statistics/activity/${id}`
    });
  }
};

module.exports = api;
