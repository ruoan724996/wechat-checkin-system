/**
 * 活动路由
 */
const express = require('express');
const router = express.Router();
const ActivityController = require('../controllers/ActivityController');
const auth = require('../middleware/auth');

// 所有活动路由都需要认证
router.use(auth);

// 创建活动
router.post('/', ActivityController.create);

// 获取活动列表
router.get('/', ActivityController.getList);

// 获取活动详情
router.get('/:id', ActivityController.getDetail);

// 更新活动
router.put('/:id', ActivityController.update);

// 删除活动
router.delete('/:id', ActivityController.delete);

// 加入活动
router.post('/:id/join', ActivityController.join);

// 退出活动
router.post('/:id/leave', ActivityController.leave);

// 获取活动成员
router.get('/:id/members', ActivityController.getMembers);

module.exports = router;
