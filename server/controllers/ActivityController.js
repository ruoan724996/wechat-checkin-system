/**
 * 活动控制器
 */
const Activity = require('../models/Activity');

// 获取活动列表
exports.getActivityList = async (req, res) => {
  try {
    const activities = await Activity.findAll();

    res.json({
      success: true,
      data: activities
    });

  } catch (error) {
    console.error('获取活动列表错误:', error);
    res.status(500).json({ error: '获取活动列表失败' });
  }
};

// 获取活动详情
exports.getActivityDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await Activity.findById(id);

    if (!activity) {
      return res.status(404).json({ error: '活动不存在' });
    }

    res.json({
      success: true,
      data: activity
    });

  } catch (error) {
    console.error('获取活动详情错误:', error);
    res.status(500).json({ error: '获取活动详情失败' });
  }
};

// 创建活动
exports.createActivity = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, description, startDate, endDate } = req.body;

    if (!name || !startDate) {
      return res.status(400).json({ error: '缺少必要参数' });
    }

    const activityId = await Activity.create({
      name,
      description,
      startDate,
      endDate: endDate || startDate,
      creatorId: userId
    });

    res.json({
      success: true,
      message: '活动创建成功',
      data: { activityId }
    });

  } catch (error) {
    console.error('创建活动错误:', error);
    res.status(500).json({ error: '创建活动失败' });
  }
};

// 更新活动
exports.updateActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    await Activity.update(id, data);

    res.json({
      success: true,
      message: '活动更新成功'
    });

  } catch (error) {
    console.error('更新活动错误:', error);
    res.status(500).json({ error: '更新活动失败' });
  }
};

// 删除活动
exports.deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;
    await Activity.delete(id);

    res.json({
      success: true,
      message: '活动删除成功'
    });

  } catch (error) {
    console.error('删除活动错误:', error);
    res.status(500).json({ error: '删除活动失败' });
  }
};
