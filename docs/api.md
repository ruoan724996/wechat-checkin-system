# API 文档

## 基础信息

- **基础 URL**: `/api/v1`
- **认证方式**: JWT Token
- **数据格式**: JSON

## 认证接口

### 1. 微信登录

**POST** `/auth/login`

获取微信登录凭证并登录。

**请求参数**:
```json
{
  "code": "微信登录 code",
  "encryptedData": "加密的用户数据",
  "iv": "加密向量"
}
```

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "token": "JWT token",
    "user": {
      "id": 1,
      "openid": "xxx",
      "nickname": "用户昵称",
      "avatar_url": "头像 URL",
      "role": 1
    }
  }
}
```

### 2. 刷新 Token

**POST** `/auth/refresh`

**请求头**:
```
Authorization: Bearer <token>
```

**响应**:
```json
{
  "code": 200,
  "data": {
    "token": "新的 JWT token"
  }
}
```

---

## 用户接口

### 1. 获取用户信息

**GET** `/user/info`

**响应**:
```json
{
  "code": 200,
  "data": {
    "id": 1,
    "openid": "xxx",
    "nickname": "用户昵称",
    "avatar_url": "头像 URL",
    "gender": 1,
    "phone": "138****1234",
    "role": 1
  }
}
```

### 2. 更新用户信息

**PUT** `/user/info`

**请求参数**:
```json
{
  "nickname": "新昵称",
  "phone": "13800138000"
}
```

---

## 活动接口

### 1. 创建活动

**POST** `/activities`

**请求参数**:
```json
{
  "name": "活动名称",
  "description": "活动描述",
  "start_date": "2026-03-13",
  "end_date": "2026-04-13",
  "checkin_rule": {
    "allow_late": false,
    "location_required": false
  },
  "reminder_enabled": true,
  "reminder_time": "09:00:00"
}
```

**响应**:
```json
{
  "code": 200,
  "data": {
    "id": 1,
    "name": "活动名称",
    "creator_id": 1,
    "status": 1
  }
}
```

### 2. 活动列表

**GET** `/activities`

**查询参数**:
- `page`: 页码 (默认 1)
- `page_size`: 每页数量 (默认 10)
- `status`: 活动状态筛选

**响应**:
```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": 1,
        "name": "活动名称",
        "description": "活动描述",
        "start_date": "2026-03-13",
        "end_date": "2026-04-13",
        "status": 1,
        "member_count": 50,
        "checkin_rate": 0.85
      }
    ],
    "total": 100,
    "page": 1,
    "page_size": 10
  }
}
```

### 3. 活动详情

**GET** `/activities/:id`

**响应**:
```json
{
  "code": 200,
  "data": {
    "id": 1,
    "name": "活动名称",
    "description": "活动描述",
    "creator": {
      "id": 1,
      "nickname": "创建者"
    },
    "start_date": "2026-03-13",
    "end_date": "2026-04-13",
    "status": 1,
    "checkin_rule": {},
    "reminder_enabled": true,
    "reminder_time": "09:00:00",
    "member_count": 50,
    "is_member": true
  }
}
```

### 4. 加入活动

**POST** `/activities/:id/join`

**响应**:
```json
{
  "code": 200,
  "message": "加入成功"
}
```

### 5. 退出活动

**POST** `/activities/:id/leave`

### 6. 更新活动

**PUT** `/activities/:id`

### 7. 删除活动

**DELETE** `/activities/:id`

---

## 签到接口

### 1. 每日签到

**POST** `/checkin`

**请求参数**:
```json
{
  "activity_id": 1,
  "location": "济南市",
  "remark": "今天天气不错"
}
```

**响应**:
```json
{
  "code": 200,
  "message": "签到成功",
  "data": {
    "checkin_date": "2026-03-13",
    "continuous_days": 5,
    "total_days": 20
  }
}
```

### 2. 签到日历

**GET** `/checkin/calendar`

**查询参数**:
- `activity_id`: 活动 ID
- `year`: 年份
- `month`: 月份

**响应**:
```json
{
  "code": 200,
  "data": {
    "year": 2026,
    "month": 3,
    "checkin_days": [1, 2, 3, 5, 8, 13],
    "total_days": 6,
    "continuous_days": 3
  }
}
```

### 3. 签到记录

**GET** `/checkin/records`

**查询参数**:
- `activity_id`: 活动 ID
- `page`: 页码
- `page_size`: 每页数量

**响应**:
```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": 1,
        "checkin_date": "2026-03-13",
        "checkin_time": "2026-03-13 09:30:00",
        "location": "济南市",
        "remark": "备注"
      }
    ],
    "total": 20
  }
}
```

---

## 统计接口

### 1. 个人统计

**GET** `/statistics/personal`

**查询参数**:
- `activity_id`: 活动 ID（可选，不传则统计所有活动）

**响应**:
```json
{
  "code": 200,
  "data": {
    "total_activities": 5,
    "total_checkin_days": 100,
    "max_continuous_days": 30,
    "current_continuous_days": 15,
    "rank": 10,
    "total_members": 100
  }
}
```

### 2. 活动统计（管理员）

**GET** `/statistics/activity/:id`

**响应**:
```json
{
  "code": 200,
  "data": {
    "activity_id": 1,
    "total_members": 50,
    "today_checkin": 40,
    "today_rate": 0.8,
    "total_checkin_records": 800,
    "average_checkin_days": 16,
    "top_users": [
      {
        "user_id": 1,
        "nickname": "用户 A",
        "checkin_days": 30
      }
    ]
  }
}
```

### 3. 导出统计数据

**GET** `/statistics/export`

**查询参数**:
- `activity_id`: 活动 ID
- `format`: 导出格式 (csv/xlsx)

---

## 消息接口

### 1. 订阅消息

**POST** `/message/subscribe`

**请求参数**:
```json
{
  "activity_id": 1,
  "template_id": "签到提醒模板 ID"
}
```

### 2. 取消订阅

**DELETE** `/message/subscribe/:activity_id`

### 3. 发送提醒（定时任务调用）

**POST** `/message/send-reminder`

**请求参数**:
```json
{
  "activity_id": 1,
  "template_id": "模板 ID",
  "user_ids": [1, 2, 3]
}
```

---

## 错误码

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权/Token 无效 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

## 响应格式

所有接口统一响应格式：

```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

错误响应：

```json
{
  "code": 400,
  "message": "参数错误：activity_id 不能为空",
  "data": null
}
```
