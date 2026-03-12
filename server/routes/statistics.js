/**
 * 统计路由
 */
const express = require('express');
const router = express.Router();
const StatisticsController = require('../controllers/StatisticsController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// 所有统计路由都需要认证
router.use(auth);

// 个人统计
router.get('/personal', StatisticsController.personal);

// 活动统计（管理员）
router.get('/activity/:id', StatisticsController.activity);

// 导出数据
router.get('/export', StatisticsController.export);

module.exports = router;
