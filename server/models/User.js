/**
 * 用户模型
 */
const db = require('../config/database');

class User {
  // 通过微信 openid 查找或创建用户
  static async findByOpenId(openId) {
    const sql = 'SELECT * FROM users WHERE open_id = ?';
    const [rows] = await db.query(sql, [openId]);
    return rows[0];
  }

  // 创建新用户
  static async create(data) {
    const sql = `
      INSERT INTO users (open_id, nick_name, avatar_url, gender, city, province, country)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(sql, [
      data.openId,
      data.nickName || '微信用户',
      data.avatarUrl || '',
      data.gender || 0,
      data.city || '',
      data.province || '',
      data.country || ''
    ]);
    return result.insertId;
  }

  // 更新用户信息
  static async update(id, data) {
    const sql = `
      UPDATE users SET 
        nick_name = ?, avatar_url = ?, gender = ?, city = ?, province = ?, country = ?,
        updated_at = NOW()
      WHERE id = ?
    `;
    await db.query(sql, [
      data.nickName,
      data.avatarUrl,
      data.gender,
      data.city,
      data.province,
      data.country,
      id
    ]);
  }
}

module.exports = User;
