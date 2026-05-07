---
name: database-schema-design
description: "Designs optimized database schemas with proper indexes, permissions, and relationships. Use when the user mentions or works on: database, schema, collection, data model, 数据库."
---

# Database Schema Designer - 数据库设计器

## 触发条件
**关键词:** database, schema, collection, data model, 数据库设计, 集合

## 设计原则

### 1. 字段命名
使用下划线命名(推荐)而非驼峰命名

### 2. 必需字段
```javascript
{
  _id: string,        // 自动生成
  _openid: string,    // 自动添加
  created_at: date,   // 创建时间
  updated_at: date    // 更新时间
}
```

### 3. 状态字段
使用数字枚举:
```javascript
status: 0  // 0-待处理, 1-进行中, 2-已完成, -1-已删除
```

## 常见集合设计

### 用户表 (users)
```javascript
{
  _id: string,
  _openid: string,
  nickname: string,
  avatar: string,
  phone: string,
  gender: number,      // 0-未知, 1-男, 2-女
  bio: string,
  status: number,      // 0-禁用, 1-正常
  vip_expire: date,
  created_at: date,
  updated_at: date
}

// 索引
{_openid: 1} unique
{phone: 1} sparse
{created_at: -1}
```

### 内容表 (posts)
```javascript
{
  _id: string,
  _openid: string,
  title: string,
  content: string,
  cover_image: string,
  images: string[],    // max: 9
  tags: string[],
  category: string,
  view_count: number,
  like_count: number,
  comment_count: number,
  status: number,      // 0-草稿, 1-已发布, -1-已删除
  is_top: boolean,
  published_at: date,
  created_at: date,
  updated_at: date
}

// 复合索引
{_openid: 1, status: 1}
{status: 1, published_at: -1}
{category: 1, is_top: -1}
```

### 订单表 (orders)
```javascript
{
  _id: string,
  _openid: string,
  order_no: string,    // 唯一
  product_id: string,
  product_snapshot: {  // 商品快照
    name: string,
    price: number,
    image: string
  },
  quantity: number,
  total_price: number, // 单位:分
  status: number,      // 0-待支付, 1-已支付, 2-已发货, 3-已完成
  payment_method: string,
  transaction_id: string,
  shipping_address: {
    name: string,
    phone: string,
    province: string,
    city: string,
    detail: string
  },
  created_at: date,
  paid_at: date,
  shipped_at: date
}

// 索引
{order_no: 1} unique
{_openid: 1, status: 1}
{created_at: -1}
```

## 索引策略

### 复合索引顺序
```javascript
// ✅ 正确:按查询频率排序
{status: 1, category: 1, created_at: -1}

// 支持的查询:
// 1. {status: 1}
// 2. {status: 1, category: 'tech'}
// 3. {status: 1, category: 'tech'} sort by created_at
```

## 权限配置

```json
// 仅读写自己的数据
{
  "read": "doc._openid == auth.openid",
  "write": "doc._openid == auth.openid"
}

// 已发布内容公开,自己的可读写
{
  "read": "doc._openid == auth.openid || doc.status == 1",
  "write": "doc._openid == auth.openid"
}
```

## 检查清单
- [ ] 是否包含必需字段
- [ ] 字段是否使用下划线命名
- [ ] 是否创建了必要索引
- [ ] 复合索引顺序是否正确
- [ ] 权限规则是否合理
- [ ] 价格是否使用整数(分)
- [ ] 数组字段是否限制长度