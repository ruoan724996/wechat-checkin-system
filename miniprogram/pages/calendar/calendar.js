// pages/calendar/calendar.js
const app = getApp();

Page({
  data: {
    currentMonth: '',
    days: [],
    checkinRecords: []
  },

  onLoad() {
    this.initCalendar();
    this.loadCheckinRecords();
  },

  // 初始化日历
  initCalendar() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    this.setData({
      currentMonth: `${year}年${month + 1}月`
    });

    // 生成日历数据
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startWeekday = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const days = [];
    
    // 添加空白占位
    for (let i = 0; i < startWeekday; i++) {
      days.push({ day: '', date: '', hasCheckin: false, class: '' });
    }

    // 添加日期
    const today = new Date().toISOString().split('T')[0];
    for (let day = 1; day <= totalDays; day++) {
      const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isToday = date === today;
      
      days.push({
        day,
        date,
        hasCheckin: false,
        class: isToday ? 'today' : ''
      });
    }

    this.setData({ days });
  },

  // 加载签到记录
  async loadCheckinRecords() {
    try {
      const res = await wx.request({
        url: `${app.globalData.baseUrl}/api/checkin/records?limit=100`,
        header: {
          Authorization: `Bearer ${app.globalData.token}`
        }
      });

      if (res.data.success) {
        const checkinDates = res.data.data.map(r => r.checkin_date);
        const days = this.data.days.map(day => ({
          ...day,
          hasCheckin: checkinDates.includes(day.date)
        }));
        
        this.setData({ 
          days,
          checkinRecords: res.data.data
        });
      }
    } catch (error) {
      console.error('加载签到记录失败:', error);
    }
  }
});
