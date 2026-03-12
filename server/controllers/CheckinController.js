/**
 * 签到控制器
 */
const Checkin = require('../models/Checkin');
const Activity = require('../models/Activity');

// 签到
exports.doCheckin = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { activityId, location } = req.body;

    if (!activityId) {
      return res.status(400).json({ error: '缺少活动 ID' });
    }

    // 检查活动是否存在
    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ error: '活动不存在' });
    }

    // 检查今日是否已签到
    const hasChecked = await Checkin.hasCheckedToday(userId, activityId);
    if (hasChecked) {
      return res.status(400).json({ error: '今日已签到，明天再来哦~' });
    }

    // 创建签到记录
    const checkinId = await Checkin.create(userId, activityId, location);

    // 获取连续签到天数
    const continuousDays = await Checkin.getContinuousDays(userId, activityId);
    const totalCount = await Checkin.getTotalCount(userId, activityId);

    res.json({
      success: true,
      message: '签到成功！',
      data: {
        checkinId,
        continuousDays,
        totalCount,
        checkinDate: new Date().toISOString().split('T')[0]
      }
    });

  } catch (error) {
    console.error('签到错误:', error);
    res.status(500).json({ error: '签到失败，请稍后重试' });
  }
};

// 获取用户签到记录
exports.getCheckinRecords = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { activityId, limit = 30 } = req.query;

    const records = await Checkin.getUserCheckins(userId, activityId, parseInt(limit));

    res.json({
      success: true,
      data: records
    });

  } catch (error) {
    console.error('获取签到记录错误:', error);
    res.status(500).json({ error: '获取签到记录失败' });
  }
};

// 获取签到统计
exports.getStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { activityId } = req.query;

    const continuousDays = await Checkin.getContinuousDays(userId, activityId);
    const totalCount = await Checkin.getTotalCount(userId, activityId);

    res.json({
      success: true,
      data: {
        continuousDays,
        totalCount,
        lastCheckin: null // 可优化：获取最后一次签到时间
      }
    });

  } catch (error) {
    console.error('获取统计错误:', error);
    res.status(500).json({ error: '获取统计失败' });
  }
};
