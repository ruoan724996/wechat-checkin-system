/**
 * 数据库初始化脚本
 */
require('dotenv').config();
const mysql = require('mysql2/promise');

async function initDatabase() {
  let connection;
  
  try {
    // 1. 连接到 MySQL 服务器（不指定数据库）
    connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      port: process.env.MYSQL_PORT || 3306,
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || ''
    });

    console.log('✅ 已连接到 MySQL 服务器');

    // 2. 创建数据库
    const dbName = process.env.MYSQL_DATABASE || 'wechat_checkin';
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`✅ 数据库 ${dbName} 创建成功`);

    // 3. 使用该数据库
    await connection.query(`USE ${dbName}`);

    // 4. 创建用户表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        open_id VARCHAR(64) UNIQUE NOT NULL,
        nick_name VARCHAR(100),
        avatar_url VARCHAR(500),
        gender TINYINT DEFAULT 0,
        city VARCHAR(50),
        province VARCHAR(50),
        country VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_open_id (open_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ 用户表 (users) 创建成功');

    // 5. 创建活动表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS activities (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(200) NOT NULL,
        description TEXT,
        start_date DATE NOT NULL,
        end_date DATE,
        creator_id INT,
        status ENUM('active', 'inactive', 'deleted') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_status (status),
        INDEX idx_dates (start_date, end_date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ 活动表 (activities) 创建成功');

    // 6. 创建签到记录表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS checkins (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        activity_id INT NOT NULL,
        location VARCHAR(500),
        checkin_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
        UNIQUE KEY uk_user_activity_date (user_id, activity_id, checkin_date),
        INDEX idx_checkin_date (checkin_date),
        INDEX idx_user_activity (user_id, activity_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ 签到记录表 (checkins) 创建成功');

    // 7. 插入测试数据
    await connection.query(`INSERT IGNORE INTO users (open_id, nick_name) VALUES ('test_openid_123', '测试用户')`);
    
    const [users] = await connection.query('SELECT id FROM users WHERE open_id = ?', ['test_openid_123']);
    if (users.length > 0) {
      await connection.query(`
        INSERT IGNORE INTO activities (name, description, start_date, end_date, creator_id, status) 
        VALUES ('每日签到挑战', '坚持每天签到，养成好习惯！', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 30 DAY), ?, 'active')
      `, [users[0].id]);
      console.log('✅ 测试数据插入成功');
    }

    console.log('\n🎉 数据库初始化完成！\n');

  } catch (error) {
    console.error('❌ 数据库初始化失败:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// 运行初始化
initDatabase();
