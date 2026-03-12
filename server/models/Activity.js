/**
 * 活动模型
 */
const db = require('../config/database');

class Activity {
  // 获取所有活动
  static async findAll() {
    const sql = `
      SELECT a.*, u.nick_name as creator_name,
        (SELECT COUNT(*) FROM checkins WHERE activity_id = a.id) as total_checkins
      FROM activities a
      LEFT JOIN users u ON a.creator_id = u.id
      WHERE a.status = 'active'
      ORDER BY a.created_at DESC
    `;
    const [rows] = await db.query(sql);
    return rows;
  }

  // 根据 ID 获取活动
  static async findById(id) {
    const sql = `
      SELECT a.*, u.nick_name as creator_name,
        (SELECT COUNT(*) FROM checkins WHERE activity_id = a.id) as total_checkins
      FROM activities a
      LEFT JOIN users u ON a.creator_id = u.id
      WHERE a.id = ?
    `;
    const [rows] = await db.query(sql, [id]);
    return rows[0];
  }

  // 创建活动
  static async create(data) {
    const sql = `
      INSERT INTO activities (name, description, start_date, end_date, creator_id, status)
      VALUES (?, ?, ?, ?, ?, 'active')
    `;
    const [result] = await db.query(sql, [
      data.name,
      data.description || '',
      data.startDate,
      data.endDate,
      data.creatorId
    ]);
    return result.insertId;
  }

  // 更新活动
  static async update(id, data) {
    const sql = `
      UPDATE activities SET 
        name = ?, description = ?, start_date = ?, end_date = ?, status = ?,
        updated_at = NOW()
      WHERE id = ?
    `;
    await db.query(sql, [
      data.name,
      data.description,
      data.startDate,
      data.endDate,
      data.status,
      id
    ]);
  }

  // 删除活动
  static async delete(id) {
    const sql = 'DELETE FROM activities WHERE id = ?';
    await db.query(sql, [id]);
  }

  // 获取用户创建的活动
  static async findByCreator(creatorId) {
    const sql = `
      SELECT a.*, 
        (SELECT COUNT(*) FROM checkins WHERE activity_id = a.id) as total_checkins
      FROM activities a
      WHERE a.creator_id = ?
      ORDER BY a.created_at DESC
    `;
    const [rows] = await db.query(sql, [creatorId]);
    return rows;
  }
}

module.exports = Activity;
