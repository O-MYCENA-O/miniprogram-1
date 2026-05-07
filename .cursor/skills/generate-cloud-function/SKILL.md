---
name: generate-cloud-function
description: "Generates complete cloud functions with proper security, validation, and error handling. Use when the user mentions or works on: cloud function, backend, API, server, 云函数."
---

# Cloud Function Generator - 云函数生成器

## 触发条件
**关键词:** cloud function, backend, API, server, 云函数, 后端接口

## 核心安全原则

```javascript
// ✅ 正确:从服务端获取 openid
const wxContext = cloud.getWXContext();
const openid = wxContext.OPENID;

// ❌ 错误:信任前端传递的 openid
const {openid} = event; // 永远不要这样做!
```

## 标准 CRUD 函数

### index.js
```javascript
const cloud = require('wx-server-sdk');
cloud.init({env: cloud.DYNAMIC_CURRENT_ENV});
const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  
  const {action, data, id, query = {}} = event;
  
  try {
    switch (action) {
      case 'create':
        return await createRecord(openid, data);
      case 'read':
        return await readRecord(openid, id);
      case 'list':
        return await listRecords(openid, query);
      case 'update':
        return await updateRecord(openid, id, data);
      case 'delete':
        return await deleteRecord(openid, id);
      default:
        return {success: false, error: 'invalid_action'};
    }
  } catch (err) {
    console.error('Function error:', err);
    return {
      success: false,
      error: {
        code: err.errCode || 'UNKNOWN',
        message: err.message
      }
    };
  }
};

// 创建记录
async function createRecord(openid, data) {
  // 数据验证
  if (!data.title || !data.content) {
    throw new Error('缺少必填字段');
  }
  
  const record = {
    ...data,
    _openid: openid,
    created_at: db.serverDate(),
    updated_at: db.serverDate()
  };
  
  const result = await db.collection('posts').add({data: record});
  return {success: true, id: result._id};
}

// 读取单条记录
async function readRecord(openid, id) {
  const result = await db.collection('posts').doc(id).get();
  
  if (!result.data) {
    return {success: false, error: 'not_found'};
  }
  
  return {success: true, data: result.data};
}

// 列表查询(带分页)
async function listRecords(openid, query) {
  const {page = 1, pageSize = 20, status, keyword} = query;
  const skip = (page - 1) * pageSize;
  
  let queryBuilder = db.collection('posts').where({_openid: openid});
  
  if (status !== undefined) {
    queryBuilder = queryBuilder.where({status});
  }
  
  if (keyword) {
    queryBuilder = queryBuilder.where({
      title: db.RegExp({
        regexp: keyword,
        options: 'i'
      })
    });
  }
  
  const countResult = await queryBuilder.count();
  const dataResult = await queryBuilder
    .skip(skip)
    .limit(pageSize)
    .orderBy('created_at', 'desc')
    .get();
  
  return {
    success: true,
    data: dataResult.data,
    pagination: {
      total: countResult.total,
      page,
      pageSize,
      totalPages: Math.ceil(countResult.total / pageSize)
    }
  };
}

// 更新记录
async function updateRecord(openid, id, data) {
  const updateData = {
    ...data,
    updated_at: db.serverDate()
  };
  
  const result = await db.collection('posts')
    .where({_id: id, _openid: openid})
    .update({data: updateData});
  
  if (result.stats.updated === 0) {
    return {success: false, error: 'not_found_or_no_permission'};
  }
  
  return {success: true};
}

// 删除记录
async function deleteRecord(openid, id) {
  const result = await db.collection('posts')
    .where({_id: id, _openid: openid})
    .remove();
  
  if (result.stats.removed === 0) {
    return {success: false, error: 'not_found_or_no_permission'};
  }
  
  return {success: true};
}
```

### config.json
```json
{
  "permissions": {
    "openapi": [
      "security.msgSecCheck",
      "security.imgSecCheck"
    ]
  },
  "timeout": 15,
  "envVariables": {},
  "triggers": []
}
```

### package.json
```json
{
  "name": "cloud-function",
  "version": "1.0.0",
  "description": "WeChat Mini Program Cloud Function",
  "main": "index.js",
  "dependencies": {
    "wx-server-sdk": "~2.6.3"
  }
}
```

## 内容安全检测函数

```javascript
// cloudfunctions/contentCheck/index.js
const cloud = require('wx-server-sdk');
cloud.init({env: cloud.DYNAMIC_CURRENT_ENV});

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const {content, image} = event;
  
  try {
    // 文本检测
    if (content) {
      const textResult = await cloud.openapi.security.msgSecCheck({
        content,
        version: 2,
        scene: 2,
        openid: wxContext.OPENID
      });
      
      if (textResult.result?.suggest === 'risky') {
        return {
          success: false,
          error: 'content_risky',
          message: '内容包含敏感信息'
        };
      }
    }
    
    // 图片检测
    if (image) {
      const imageResult = await cloud.openapi.security.imgSecCheck({
        media: {
          contentType: 'image/png',
          value: Buffer.from(image, 'base64')
        }
      });
      
      if (imageResult.errCode !== 0) {
        return {success: false, error: 'image_risky'};
      }
    }
    
    return {success: true};
  } catch (err) {
    return {
      success: false,
      error: err.errCode,
      message: err.errMsg
    };
  }
};
```

## 前端调用示例

```javascript
// 创建
const createRes = await wx.cloud.callFunction({
  name: 'crud',
  data: {
    action: 'create',
    data: {
      title: '标题',
      content: '内容'
    }
  }
});

if (createRes.result.success) {
  console.log('创建成功:', createRes.result.id);
}

// 列表查询
const listRes = await wx.cloud.callFunction({
  name: 'crud',
  data: {
    action: 'list',
    query: {
      page: 1,
      pageSize: 20,
      status: 1
    }
  }
});

// 内容检测
const checkRes = await wx.cloud.callFunction({
  name: 'contentCheck',
  data: {
    content: '待检测的内容'
  }
});
```

## 检查清单
- [ ] 是否从 cloud.getWXContext() 获取 openid
- [ ] 是否验证了所有输入数据
- [ ] 是否添加了权限检查
- [ ] 是否处理了所有错误情况
- [ ] config.json 是否配置了必要权限
- [ ] package.json 是否包含正确依赖
- [ ] 返回数据是否包含 success 字段
- [ ] 是否添加了日志记录