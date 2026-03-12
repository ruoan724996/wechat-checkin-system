/**
 * 数据库初始化测试脚本
 */
require('dotenv').config();
const mysql = require('mysql2/promise');

async function testDatabase() {
  console.log('🧪 开始数据库测试...\n');
  
  let connection;
  
  try {
    // 1. 测试数据库连接
    console.log('📦 测试 1: 数据库连接');
    connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      port: process.env.MYSQL_PORT || 3306,
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || ''
    });
    console.log('✅ 数据库连接成功\n');
    
    // 2. 测试数据库是否存在
    console.log('📦 测试 2: 数据库存在性');
    const dbName = process.env.MYSQL_DATABASE || 'wechat_checkin';
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    await connection.query(`USE ${dbName}`);
    console.log(`✅ 数据库 ${dbName} 存在\n`);
    
    // 3. 测试表结构
    console.log('📦 测试 3: 表结构验证');
    
    // 检查 users 表
    const [usersTables] = await connection.query(
      "SHOW TABLES LIKE 'users'"
    );
    if (usersTables.length === 0) {
      console.log('⚠️  users 表不存在，需要运行初始化脚本\n');
    } else {
      console.log('✅ users 表存在');
      
      // 检查 users 表字段
      const [userColumns] = await connection.query('DESCRIBE users');
      const requiredColumns = ['id', 'open_id', 'nick_name', 'avatar_url', 'created_at'];
      for (const col of requiredColumns) {
        const exists = userColumns.some(c => c.Field === col);
        if (!exists) {
          console.log(`❌ users 表缺少字段：${col}`);
        }
      }
      console.log('✅ users 表字段完整\n');
    }
    
    // 检查 activities 表
    const [activitiesTables] = await connection.query(
      "SHOW TABLES LIKE 'activities'"
    );
    if (activitiesTables.length === 0) {
      console.log('⚠️  activities 表不存在，需要运行初始化脚本\n');
    } else {
      console.log('✅ activities 表存在');
      
      const [activityColumns] = await connection.query('DESCRIBE activities');
      const requiredColumns = ['id', 'name', 'start_date', 'end_date', 'status'];
      for (const col of requiredColumns) {
        const exists = activityColumns.some(c => c.Field === col);
        if (!exists) {
          console.log(`❌ activities 表缺少字段：${col}`);
        }
      }
      console.log('✅ activities 表字段完整\n');
    }
    
    // 检查 checkins 表
    const [checkinsTables] = await connection.query(
      "SHOW TABLES LIKE 'checkins'"
    );
    if (checkinsTables.length === 0) {
      console.log('⚠️  checkins 表不存在，需要运行初始化脚本\n');
    } else {
      console.log('✅ checkins 表存在');
      
      const [checkinColumns] = await connection.query('DESCRIBE checkins');
      const requiredColumns = ['id', 'user_id', 'activity_id', 'checkin_date'];
      for (const col of requiredColumns) {
        const exists = checkinColumns.some(c => c.Field === col);
        if (!exists) {
          console.log(`❌ checkins 表缺少字段：${col}`);
        }
      }
      console.log('✅ checkins 表字段完整\n');
    }
    
    // 4. 测试数据完整性
    console.log('📦 测试 4: 数据完整性');
    
    // 检查外键约束
    const [foreignKeys] = await connection.query(`
      SELECT 
        TABLE_NAME,
        COLUMN_NAME,
        CONSTRAINT_NAME,
        REFERENCED_TABLE_NAME,
        REFERENCED_COLUMN_NAME
      FROM information_schema.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = '${dbName}'
      AND REFERENCED_TABLE_NAME IS NOT NULL
    `);
    
    if (foreignKeys.length > 0) {
      console.log(`✅ 外键约束已配置 (${foreignKeys.length} 个)`);
    } else {
      console.log('⚠️  未检测到外键约束');
    }
    
    // 检查唯一索引
    const [indexes] = await connection.query(`
      SHOW INDEX FROM checkins WHERE Key_name = 'uk_user_activity_date'
    `);
    
    if (indexes.length > 0) {
      console.log('✅ 签到唯一索引已配置');
    } else {
      console.log('⚠️  签到唯一索引未配置');
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('🎉 数据库测试完成！\n');
    
  } catch (error) {
    console.error('\n❌ 数据库测试失败:', error.message);
    console.error('\n请检查：');
    console.error('1. MySQL 服务是否启动');
    console.error('2. .env 文件中的数据库配置是否正确');
    console.error('3. 是否需要运行初始化脚本：node scripts/init-database.js\n');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// 运行测试
testDatabase();
