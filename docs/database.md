# 数据库设计

## 数据库表结构

### 1. 用户表 (users)

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  openid VARCHAR(64) UNIQUE NOT NULL COMMENT '微信 openid',
  unionid VARCHAR(64) COMMENT '微信 unionid',
  nickname VARCHAR(100) COMMENT '用户昵称',
  avatar_url VARCHAR(500) COMMENT '头像 URL',
  gender TINYINT DEFAULT 0 COMMENT '性别 0-未知 1-男 2-女',
  phone VARCHAR(20) COMMENT '手机号',
  role TINYINT DEFAULT 1 COMMENT '角色 1-普通用户 2-管理员',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_openid (openid),
  INDEX idx_unionid (unionid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';
```

### 2. 活动表 (activities)

```sql
CREATE TABLE activities (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(200) NOT NULL COMMENT '活动名称',
  description TEXT COMMENT '活动描述',
  creator_id INT NOT NULL COMMENT '创建者 ID',
  start_date DATE NOT NULL COMMENT '开始日期',
  end_date DATE NOT NULL COMMENT '结束日期',
  status TINYINT DEFAULT 1 COMMENT '状态 0-未开始 1-进行中 2-已结束',
  checkin_rule JSON COMMENT '签到规则配置',
  reminder_enabled TINYINT DEFAULT 0 COMMENT '是否开启提醒',
  reminder_time TIME COMMENT '提醒时间',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (creator_id) REFERENCES users(id),
  INDEX idx_creator (creator_id),
  INDEX idx_status (status),
  INDEX idx_date (start_date, end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='活动表';
```

### 3. 签到记录表 (checkin_records)

```sql
CREATE TABLE checkin_records (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL COMMENT '用户 ID',
  activity_id INT NOT NULL COMMENT '活动 ID',
  checkin_date DATE NOT NULL COMMENT '签到日期',
  checkin_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '签到时间',
  location VARCHAR(200) COMMENT '签到位置',
  remark VARCHAR(500) COMMENT '备注',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_user_activity_date (user_id, activity_id, checkin_date),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (activity_id) REFERENCES activities(id),
  INDEX idx_user (user_id),
  INDEX idx_activity (activity_id),
  INDEX idx_date (checkin_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='签到记录表';
```

### 4. 活动成员表 (activity_members)

```sql
CREATE TABLE activity_members (
  id INT PRIMARY KEY AUTO_INCREMENT,
  activity_id INT NOT NULL COMMENT '活动 ID',
  user_id INT NOT NULL COMMENT '用户 ID',
  role TINYINT DEFAULT 1 COMMENT '角色 1-成员 2-管理员',
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_activity_user (activity_id, user_id),
  FOREIGN KEY (activity_id) REFERENCES activities(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_activity (activity_id),
  INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='活动成员表';
```

### 5. 消息订阅表 (message_subscriptions)

```sql
CREATE TABLE message_subscriptions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL COMMENT '用户 ID',
  activity_id INT NOT NULL COMMENT '活动 ID',
  template_id VARCHAR(100) NOT NULL COMMENT '模板 ID',
  enabled TINYINT DEFAULT 1 COMMENT '是否启用',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_user_activity_template (user_id, activity_id, template_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (activity_id) REFERENCES activities(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='消息订阅表';
```

### 6. 签到统计表 (checkin_statistics)

```sql
CREATE TABLE checkin_statistics (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL COMMENT '用户 ID',
  activity_id INT NOT NULL COMMENT '活动 ID',
  total_checkin_days INT DEFAULT 0 COMMENT '总签到天数',
  continuous_checkin_days INT DEFAULT 0 COMMENT '连续签到天数',
  max_continuous_days INT DEFAULT 0 COMMENT '最大连续天数',
  last_checkin_date DATE COMMENT '最后签到日期',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_user_activity (user_id, activity_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (activity_id) REFERENCES activities(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='签到统计表';
```

## 初始化 SQL

```sql
-- 创建数据库
CREATE DATABASE IF NOT EXISTS wechat_checkin 
DEFAULT CHARACTER SET utf8mb4 
DEFAULT COLLATE utf8mb4_unicode_ci;

USE wechat_checkin;

-- 执行上述建表语句...

-- 插入默认管理员（需要后续通过微信登录更新）
INSERT INTO users (openid, nickname, role) 
VALUES ('admin_openid_placeholder', '系统管理员', 2);
```

## 索引优化建议

1. 用户表：openid 是唯一索引，用于快速查找用户
2. 活动表：创建者、状态、日期范围建立复合索引
3. 签到记录表：用户 + 活动 + 日期建立唯一索引，防止重复签到
4. 统计表：定期更新，减少实时计算压力

## 数据字典

### 用户角色 (role)
- 1: 普通用户
- 2: 管理员

### 活动状态 (status)
- 0: 未开始
- 1: 进行中
- 2: 已结束

### 性别 (gender)
- 0: 未知
- 1: 男
- 2: 女
