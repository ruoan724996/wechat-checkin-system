/**
 * 签到记录模型
 */
const db = require('../config/database');

class CheckinRecord {
  /**
   * 创建签到记录
   */
  static async create(data) {
    const { user_id, activity_id, checkin_date, location, remark } = data;
    
    try {
      const [result] = await db.execute(
        `INSERT INTO checkin_records (user_id, activity_id, checkin_date, location, remark)
         VALUES (?, ?, ?, ?, ?)`,
        [user_id, activity_id, checkin_date, location, remark]
      );
      return result.insertId;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('今日已签到');
      }
      throw error;
    }
  }

  /**
   * 检查今日是否已签到
   */
  static async hasCheckinToday(userId, activityId) {
    const today = new Date().toISOString().split('T')[0];
    const [rows] = await db.execute(
      'SELECT id FROM checkin_records WHERE user_id = ? AND activity_id = ? AND checkin_date = ?',
      [userId, activityId, today]
    );
    return rows.length > 0;
  }

  /**
   * 获取用户签到日历
   */
  static async getCalendar(userId, activityId, year, month) {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month).padStart(2, '0')}-31`;
    
    const [rows] = await db.execute(
      `SELECT checkin_date FROM checkin_records 
       WHERE user_id = ? AND activity_id = ? 
       AND checkin_date BETWEEN ? AND ?`,
      [userId, activityId, startDate, endDate]
    );
    
    return rows.map(row => row.checkin_date);
  }

  /**
   * 获取用户签到记录
   */
  static async getRecords(userId, activityId, page = 1, pageSize = 10) {
    const offset = (page - 1) * pageSize;
    
    const whereClause = activityId 
      ? 'WHERE user_id = ? AND activity_id = ?'
      : 'WHERE user_id = ?';
    
    const params = activityId ? [userId, activityId] : [userId];
    
    const [rows] = await db.execute(
      `SELECT cr.*, a.name as activity_name
       FROM checkin_records cr
       LEFT JOIN activities a ON cr.activity_id = a.id
       ${whereClause}
       ORDER BY cr.checkin_date DESC, cr.checkin_time DESC
       LIMIT ? OFFSET ?`,
      [...params, pageSize, offset]
    );
    
    const [countResult] = await db.execute(
      `SELECT COUNT(*) as total FROM checkin_records ${whereClause}`,
      params
    );
    
    return {
      list: rows,
      total: countResult[0].total,
      page,
      pageSize
    };
  }

  /**
   * 获取连续签到天数
   */
  static async getContinuousDays(userId, activityId) {
    const [rows] = await db.execute(
      `SELECT checkin_date FROM checkin_records 
       WHERE user_id = ? AND activity_id = ?
       ORDER BY checkin_date DESC`,
      [userId, activityId]
    );
    
    if (rows.length === 0) return 0;
    
    let continuousDays = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastCheckin = new Date(rows[0].checkin_date);
    lastCheckin.setHours(0, 0, 0, 0);
    
    // 如果最后签到不是今天或昨天，连续天数为 0
    const diffDays = Math.floor((today - lastCheckin) / (1000 * 60 * 60 * 24));
    if (diffDays > 1) return 0;
    
    // 计算连续天数
    for (let i = 1; i < rows.length; i++) {
      const currentDate = new Date(rows[i].checkin_date);
      const previousDate = new Date(rows[i - 1].checkin_date);
      
      const diff = Math.floor((previousDate - currentDate) / (1000 * 60 * 60 * 24));
      if (diff === 1) {
        continuousDays++;
      } else {
        break;
      }
    }
    
    return continuousDays;
  }

  /**
   * 获取总签到天数
   */
  static async getTotalDays(userId, activityId) {
    const whereClause = activityId 
      ? 'WHERE user_id = ? AND activity_id = ?'
      : 'WHERE user_id = ?';
    
    const params = activityId ? [userId, activityId] : [userId];
    
    const [rows] = await db.execute(
      `SELECT COUNT(DISTINCT checkin_date) as total FROM checkin_records ${whereClause}`,
      params
    );
    
    return rows[0].total;
  }

  /**
   * 获取活动签到统计
   */
  static async getActivityStats(activityId) {
    const [rows] = await db.execute(
      `SELECT 
        COUNT(DISTINCT user_id) as total_users,
        COUNT(*) as total_records,
        COUNT(DISTINCT CASE WHEN checkin_date = CURDATE() THEN user_id END) as today_checkin,
        AVG(user_stats.total_days) as avg_checkin_days
       FROM checkin_records cr
       LEFT JOIN (
         SELECT user_id, COUNT(DISTINCT checkin_date) as total_days
         FROM checkin_records
         WHERE activity_id = ?
         GROUP BY user_id
       ) user_stats ON cr.user_id = user_stats.user_id
       WHERE cr.activity_id = ?`,
      [activityId, activityId]
    );
    
    return rows[0];
  }

  /**
   * 获取活动签到排行榜
   */
  static async getRanking(activityId, limit = 10) {
    const [rows] = await db.execute(
      `SELECT u.id, u.nickname, u.avatar_url, 
        COUNT(DISTINCT cr.checkin_date) as checkin_days
       FROM checkin_records cr
       JOIN users u ON cr.user_id = u.id
       WHERE cr.activity_id = ?
       GROUP BY u.id, u.nickname, u.avatar_url
       ORDER BY checkin_days DESC
       LIMIT ?`,
      [activityId, limit]
    );
    
    return rows;
  }
}

module.exports = CheckinRecord;
