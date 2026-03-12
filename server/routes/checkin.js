const express = require('express');
const checkinController = require('../controllers/checkinController');
const auth = require('../middleware/auth');

const router = express.Router();

// 所有签到相关接口都需要认证
router.use(auth);

// 签到
router.post('/', checkinController.doCheckin);

// 获取签到记录
router.get('/records', checkinController.getCheckinRecords);

// 获取签到统计
router.get('/stats', checkinController.getStats);

module.exports = router;
