const express = require('express');
const activityController = require('../controllers/activityController');
const auth = require('../middleware/auth');

const router = express.Router();

// 获取活动列表（公开）
router.get('/', activityController.getActivityList);

// 获取活动详情（公开）
router.get('/:id', activityController.getActivityDetail);

// 以下接口需要认证
router.use(auth);

// 创建活动
router.post('/', activityController.createActivity);

// 更新活动
router.put('/:id', activityController.updateActivity);

// 删除活动
router.delete('/:id', activityController.deleteActivity);

module.exports = router;
