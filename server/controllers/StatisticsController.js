/**
 * 统计控制器
 */
const CheckinRecord = require('../models/CheckinRecord');
const Activity = require('../models/Activity');
const ActivityMember = require('../models/ActivityMember');

class StatisticsController {
  /**
   * 个人统计
   */
  static async personal(req, res, next) {
    try {
      const { activity_id } = req.query;

      // 获取用户参与的所有活动
      const activities = await ActivityMember.getUserActivities(req.user.id);

      let totalActivities = activities.length;
      let totalCheckinDays = 0;
      let maxContinuousDays = 0;
      let currentContinuousDays = 0;

      if (activity_id) {
        // 指定活动的统计
        totalActivities = 1;
        totalCheckinDays = await CheckinRecord.getTotalDays(req.user.id, activity_id);
        currentContinuousDays = await CheckinRecord.getContinuousDays(req.user.id, activity_id);
        
        // 获取最大连续天数（需要查询所有记录计算）
        const stats = await this.getMaxContinuousDays(req.user.id, activity_id);
        maxContinuousDays = stats;
      } else {
        // 所有活动的统计
        for (const activity of activities) {
          const days = await CheckinRecord.getTotalDays(req.user.id, activity.id);
          totalCheckinDays += days;
          
          const continuous = await CheckinRecord.getContinuousDays(req.user.id, activity.id);
          if (continuous > currentContinuousDays) {
            currentContinuousDays = continuous;
          }
        }
      }

      res.json({
        code: 200,
        message: 'success',
        data: {
          total_activities: totalActivities,
          total_checkin_days: totalCheckinDays,
          max_continuous_days: maxContinuousDays,
          current_continuous_days: currentContinuousDays
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 活动统计（管理员）
   */
  static async activity(req, res, next) {
    try {
      const { id } = req.params;

      const activity = await Activity.findById(id);
      if (!activity) {
        return res.status(404).json({
          code: 404,
          message: '活动不存在'
        });
      }

      // 获取签到统计
      const stats = await CheckinRecord.getActivityStats(id);
      
      // 获取今日签到率
      const todayRate = await Activity.getCheckinRate(id);
      
      // 获取排行榜
      const topUsers = await CheckinRecord.getRanking(id, 10);

      res.json({
        code: 200,
        message: 'success',
        data: {
          activity_id: id,
          activity_name: activity.name,
          total_members: stats.total_users || 0,
          today_checkin: stats.today_checkin || 0,
          today_rate: parseFloat((todayRate * 100).toFixed(2)),
          total_checkin_records: stats.total_records || 0,
          average_checkin_days: parseFloat(stats.avg_checkin_days || 0),
          top_users: topUsers
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取最大连续签到天数
   */
  static async getMaxContinuousDays(userId, activityId) {
    const records = await CheckinRecord.getRecords(userId, activityId, 1, 1000);
    
    if (!records.list || records.list.length === 0) {
      return 0;
    }

    let maxContinuous = 1;
    let currentContinuous = 1;

    for (let i = 1; i < records.list.length; i++) {
      const currentDate = new Date(records.list[i].checkin_date);
      const previousDate = new Date(records.list[i - 1].checkin_date);
      
      const diff = Math.floor((previousDate - currentDate) / (1000 * 60 * 60 * 24));
      
      if (diff === 1) {
        currentContinuous++;
        maxContinuous = Math.max(maxContinuous, currentContinuous);
      } else {
        currentContinuous = 1;
      }
    }

    return maxContinuous;
  }

  /**
   * 导出统计数据
   */
  static async export(req, res, next) {
    try {
      const { activity_id, format = 'csv' } = req.query;

      if (!activity_id) {
        return res.status(400).json({
          code: 400,
          message: '缺少活动 ID'
        });
      }

      // 获取所有签到记录
      const records = await CheckinRecord.getRecords(null, activity_id, 1, 10000);

      // 生成 CSV
      if (format === 'csv') {
        let csv = '用户 ID，用户昵称，签到日期，签到时间，位置，备注\n';
        
        for (const record of records.list) {
          csv += `${record.user_id},"${record.nickname || ''}",${record.checkin_date},${record.checkin_time},"${record.location || ''}","${record.remark || ''}"\n`;
        }

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=checkin_${activity_id}.csv`);
        res.send(csv);
      } else {
        return res.status(400).json({
          code: 400,
          message: '不支持的导出格式'
        });
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = StatisticsController;
