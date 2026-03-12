/**
 * 签到记录模型
 */
const db = require('../config/database');

class Checkin {
  // 创建签到记录
  static async create(userId, activityId, location = null) {
    const sql = `
      INSERT INTO checkins (user_id, activity_id, location, checkin_date)
      VALUES (?, ?, ?, CURDATE())
    `;
    const [result] = await db.query(sql, [userId, activityId, location]);
    return result.insertId;
  }

  // 检查今日是否已签到
  static async hasCheckedToday(userId, activityId) {
    const sql = `
      SELECT id FROM checkins 
      WHERE user_id = ? AND activity_id = ? AND DATE(checkin_date) = CURDATE()
    `;
    const [rows] = await db.query(sql, [userId, activityId]);
    return rows.length > 0;
  }

  // 获取用户签到记录
  static async getUserCheckins(userId, activityId = null, limit = 30) {
    let sql = `
      SELECT c.*, a.name as activity_name 
      FROM checkins c
      JOIN activities a ON c.activity_id = a.id
      WHERE c.user_id = ?
    `;
    const params = [userId];

    if (activityId) {
      sql += ' AND c.activity_id = ?';
      params.push(activityId);
    }

    sql += ' ORDER BY c.checkin_date DESC LIMIT ?';
    params.push(limit);

    const [rows] = await db.query(sql, params);
    return rows;
  }

  // 获取用户连续签到天数
  static async getContinuousDays(userId, activityId) {
    const sql = `
      SELECT checkin_date FROM checkins 
      WHERE user_id = ? AND activity_id = ?
      ORDER BY checkin_date DESC
    `;
    const [rows] = await db.query(sql, [userId, activityId]);
    
    if (rows.length === 0) return 0;

    let continuous = 1;
    for (let i = 1; i < rows.length; i++) {
      const prev = new Date(rows[i - 1].checkin_date);
      const curr = new Date(rows[i].checkin_date);
      const diff = (prev - curr) / (1000 * 60 * 60 * 24);
      
      if (diff === 1) {
        continuous++;
      } else if (diff > 1) {
        break;
      }
    }
    
    return continuous;
  }

  // 获取用户总签到次数
  static async getTotalCount(userId, activityId = null) {
    let sql = 'SELECT COUNT(*) as total FROM checkins WHERE user_id = ?';
    const params = [userId];

    if (activityId) {
      sql += ' AND activity_id = ?';
      params.push(activityId);
    }

    const [rows] = await db.query(sql, params);
    return rows[0].total;
  }
}

module.exports = Checkin;
