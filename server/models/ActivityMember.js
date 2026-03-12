/**
 * 活动成员模型
 */
const db = require('../config/database');

class ActivityMember {
  /**
   * 加入活动
   */
  static async join(activityId, userId, role = 1) {
    try {
      await db.execute(
        'INSERT INTO activity_members (activity_id, user_id, role) VALUES (?, ?, ?)',
        [activityId, userId, role]
      );
      return true;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return false; // 已是成员
      }
      throw error;
    }
  }

  /**
   * 退出活动
   */
  static async leave(activityId, userId) {
    await db.execute(
      'DELETE FROM activity_members WHERE activity_id = ? AND user_id = ?',
      [activityId, userId]
    );
  }

  /**
   * 获取活动成员列表
   */
  static async getMembers(activityId, page = 1, pageSize = 10) {
    const offset = (page - 1) * pageSize;
    
    const [rows] = await db.execute(
      `SELECT u.id, u.nickname, u.avatar_url, am.role, am.joined_at
       FROM activity_members am
       JOIN users u ON am.user_id = u.id
       WHERE am.activity_id = ?
       ORDER BY am.joined_at DESC
       LIMIT ? OFFSET ?`,
      [activityId, pageSize, offset]
    );
    
    const [countResult] = await db.execute(
      'SELECT COUNT(*) as total FROM activity_members WHERE activity_id = ?',
      [activityId]
    );
    
    return {
      list: rows,
      total: countResult[0].total,
      page,
      pageSize
    };
  }

  /**
   * 检查是否是成员
   */
  static async isMember(activityId, userId) {
    const [rows] = await db.execute(
      'SELECT id FROM activity_members WHERE activity_id = ? AND user_id = ?',
      [activityId, userId]
    );
    return rows.length > 0;
  }

  /**
   * 获取成员角色
   */
  static async getMemberRole(activityId, userId) {
    const [rows] = await db.execute(
      'SELECT role FROM activity_members WHERE activity_id = ? AND user_id = ?',
      [activityId, userId]
    );
    return rows[0] ? rows[0].role : null;
  }

  /**
   * 更新成员角色
   */
  static async updateRole(activityId, userId, role) {
    await db.execute(
      'UPDATE activity_members SET role = ? WHERE activity_id = ? AND user_id = ?',
      [role, activityId, userId]
    );
  }

  /**
   * 获取用户参与的所有活动
   */
  static async getUserActivities(userId) {
    const [rows] = await db.execute(
      `SELECT a.*, am.role as member_role
       FROM activity_members am
       JOIN activities a ON am.activity_id = a.id
       WHERE am.user_id = ?
       ORDER BY a.created_at DESC`,
      [userId]
    );
    return rows;
  }
}

module.exports = ActivityMember;
