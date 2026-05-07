---
name: workflow-orchestrator
description: "Orchestrates multiple skills to complete complex tasks. Automatically chains skills for common development workflows. Use when the user mentions or works on: complete feature, full stack, end to end, entire, 完整功能, 全栈."
---

# Workflow Orchestrator - 工作流编排器

## 触发条件
**关键词:** complete feature, full stack, end to end, entire module, 完整功能, 全栈开发

**识别模式:** 当用户需求涉及多个层面时自动触发
- 例如: "创建一个带后端的商品列表页"
- 例如: "做一个完整的用户发布功能"
- 例如: "搭建一个电商小程序"

## 核心功能

自动识别用户需求并编排技能执行顺序,确保:
1. 技能按正确顺序执行
2. 后续技能可使用前置技能的输出
3. 统一的配色和数据风格
4. 完整的错误处理

## 预设工作流

### 1. 完整 CRUD 功能 (列表 + 表单 + 详情 + 后端)
**触发示例:** "创建一个完整的文章管理功能"

**执行顺序:**
```
1. adaptive-color-system (选择配色)
   ↓
2. database-schema-design (设计 posts 集合)
   ↓
3. generate-cloud-function (创建 CRUD 云函数)
   ↓
4. generate-mock-data (生成演示数据)
   ↓
5. generate-page (列表页)
   ↓
6. generate-page (表单页)
   ↓
7. generate-page (详情页)
```

**自动协调:**
- 所有页面使用相同配色方案
- 云函数和数据库 schema 保持一致
- 演示数据符合 schema 结构
- 页面调用正确的云函数

### 2. 电商小程序快速搭建
**触发示例:** "创建一个电商小程序" 或 "搭建购物平台"

**执行顺序:**
```
1. init-project-architecture (项目初始化)
   ↓
2. adaptive-color-system (电商配色:橙红渐变)
   ↓
3. database-schema-design (products + orders + users)
   ↓
4. generate-cloud-function (商品列表/详情/下单)
   ↓
5. generate-mock-data (商品演示数据)
   ↓
6. generate-page (首页 - 商品列表)
   ↓
7. generate-page (商品详情页)
   ↓
8. generate-page (购物车页)
   ↓
9. generate-page (订单页)
```

### 3. 内容发布平台
**触发示例:** "做一个类似朋友圈的发布功能"

**执行顺序:**
```
1. adaptive-color-system (社交配色:粉紫渐变)
   ↓
2. database-schema-design (posts + comments + likes)
   ↓
3. generate-cloud-function (发布/点赞/评论/内容审核)
   ↓
4. generate-mock-data (帖子和用户数据)
   ↓
5. generate-page (动态列表页)
   ↓
6. generate-page (发布页 - 表单)
   ↓
7. generate-page (详情页 + 评论)
```

### 4. 个人工具应用
**触发示例:** "创建一个待办事项小程序"

**执行顺序:**
```
1. init-project-architecture
   ↓
2. adaptive-color-system (教育/工具配色:绿青渐变)
   ↓
3. database-schema-design (todos + categories)
   ↓
4. generate-cloud-function (CRUD + 统计)
   ↓
5. generate-page (任务列表)
   ↓
6. generate-page (添加任务表单)
   ↓
7. generate-page (统计页)
```

### 5. 预约服务平台
**触发示例:** "做一个美容院预约小程序"

**执行顺序:**
```
1. adaptive-color-system (健康/生活配色:自然绿)
   ↓
2. database-schema-design (services + appointments + staff)
   ↓
3. generate-cloud-function (预约/取消/查询)
   ↓
4. generate-mock-data (服务和技师数据)
   ↓
5. generate-page (服务列表)
   ↓
6. generate-page (预约表单 - 含日历选择)
   ↓
7. generate-page (我的预约)
```

## 工作流协调规则

### 数据一致性
```javascript
// 1. 配色方案全局共享
const colorScheme = workflow.getResult('adaptive-color-system');
// 所有后续页面自动应用此配色

// 2. 数据库 schema 驱动
const schema = workflow.getResult('database-schema-design');
// 云函数自动使用此 schema
// 演示数据自动符合此 schema
// 表单字段自动对应此 schema

// 3. 占位图保持一致
const imageConfig = {
  seed: projectName, // 使用项目名作为随机种子
  service: 'picsum'  // 全项目统一占位图服务
};
```

### 命名一致性
```javascript
// 自动统一命名规范
const naming = {
  collection: 'posts',           // 数据库集合名
  cloudFunction: 'posts-crud',   // 云函数名
  listPage: 'pages/posts/list',  // 列表页路径
  formPage: 'pages/posts/form',  // 表单页路径
  detailPage: 'pages/posts/detail' // 详情页路径
};
```

### 依赖注入
```javascript
// 页面自动获取云函数名
Page({
  data: {
    cloudFunction: workflow.getCloudFunctionName('posts')
  },
  
  async loadData() {
    const res = await wx.cloud.callFunction({
      name: this.data.cloudFunction,
      data: {action: 'list'}
    });
  }
});
```

## 智能识别用户意图

### 关键词映射
```javascript
const intentMapping = {
  // 电商类
  ['电商', '购物', '商城', 'ecommerce', 'shop']: 'ecommerce-workflow',
  
  // 社交类
  ['社交', '朋友圈', '动态', 'social', 'feed']: 'social-workflow',
  
  // 工具类
  ['待办', '笔记', '工具', 'todo', 'note']: 'tool-workflow',
  
  // 预约类
  ['预约', '预订', '排班', 'booking', 'appointment']: 'booking-workflow',
  
  // CRUD
  ['管理', '增删改查', 'CRUD', 'admin']: 'crud-workflow'
};
```

### 复杂度评估
```javascript
// 根据需求自动评估并调整工作流
function assessComplexity(userInput) {
  const features = {
    hasPayment: /支付|付款/.test(userInput),
    hasAuth: /登录|注册|权限/.test(userInput),
    hasMedia: /图片|视频|上传/.test(userInput),
    hasNotification: /通知|消息|推送/.test(userInput)
  };
  
  // 动态添加技能
  if (features.hasPayment) {
    workflow.addSkill('generate-payment-function');
  }
  if (features.hasAuth) {
    workflow.addSkill('generate-auth-system');
  }
}
```

## 执行流程

### 第一步:意图识别
```
用户输入 → 关键词提取 → 匹配工作流模板 → 确认执行计划
```

### 第二步:参数收集
```
项目名称? → 配色偏好? → 核心功能? → 确认开始
```

### 第三步:顺序执行
```
for each skill in workflow:
  1. 执行技能
  2. 收集输出
  3. 传递给下一个技能
  4. 记录日志
```

### 第四步:整合验证
```
检查文件完整性 → 验证引用正确性 → 生成项目文档 → 完成
```

## 输出示例

执行 "创建一个完整的文章管理功能" 后生成:

```
project/
├── pages/
│   ├── posts/
│   │   ├── list/       (列表页 - 带下拉刷新)
│   │   ├── form/       (表单页 - 含图片上传)
│   │   └── detail/     (详情页 - 含评论)
├── cloudfunctions/
│   └── posts-crud/     (完整 CRUD + 内容审核)
├── database/
│   └── posts.schema.json (数据库 schema + 索引)
├── styles/
│   └── design-tokens.wxss (统一配色方案)
└── README.md (项目说明文档)
```

## 进度反馈

```
🚀 开始创建文章管理功能...

✅ [1/7] 应用科技风配色方案
✅ [2/7] 设计 posts 数据库集合
✅ [3/7] 生成 CRUD 云函数
✅ [4/7] 生成演示数据 (30条文章)
✅ [5/7] 创建列表页 (含虚拟滚动)
✅ [6/7] 创建表单页 (含内容审核)
✅ [7/7] 创建详情页 (含评论功能)

🎉 完成! 已创建 12 个文件
📝 查看 README.md 了解使用方法
```

## 检查清单
- [ ] 是否正确识别了用户意图
- [ ] 工作流顺序是否合理
- [ ] 所有技能是否使用统一配色
- [ ] 数据结构是否在各层保持一致
- [ ] 云函数名称是否与页面调用匹配
- [ ] 是否生成了项目文档
- [ ] 演示数据是否符合 schema