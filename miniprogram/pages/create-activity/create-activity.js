// pages/create-activity/create-activity.js
const app = getApp();

Page({
  data: {
    startDate: '',
    endDate: ''
  },

  onStartDateChange(e) {
    this.setData({ startDate: e.detail.value });
  },

  onEndDateChange(e) {
    this.setData({ endDate: e.detail.value });
  },

  async onSubmit(e) {
    const { name, description } = e.detail.value;
    const { startDate, endDate } = this.data;

    if (!name || !startDate) {
      wx.showToast({ title: '请填写必填项', icon: 'none' });
      return;
    }

    try {
      const res = await wx.request({
        url: `${app.globalData.baseUrl}/api/activity`,
        method: 'POST',
        header: {
          Authorization: `Bearer ${app.globalData.token}`
        },
        data: {
          name,
          description,
          startDate,
          endDate: endDate || startDate
        }
      });

      if (res.data.success) {
        wx.showToast({ title: '创建成功', icon: 'success' });
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      } else {
        throw new Error(res.data.error);
      }
    } catch (error) {
      wx.showToast({ title: error.message || '创建失败', icon: 'none' });
    }
  }
});
