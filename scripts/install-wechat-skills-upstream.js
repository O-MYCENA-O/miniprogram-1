#!/usr/bin/env node

/**
 * WeChat Mini Program Agent Skills Installer - Optimized Version
 * 优化版本:移除模板示例,新增配色方案和占位图支持
 * 
 * 使用方法:
 * node install-skills-optimized.js
 */

const fs = require('fs');
const path = require('path');

// ==========================================
// 技能定义(纯描述,无模板)
// ==========================================

const SKILLS = {
  'workflow-orchestrator': {
    description: 'Orchestrates multiple skills to complete complex tasks. Automatically chains skills for common development workflows.',
    triggers: ['complete feature', 'full stack', 'end to end', 'entire', '完整功能', '全栈'],
    priority: 100, // 最高优先级
    content: `# Workflow Orchestrator - 工作流编排器

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
\`\`\`
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
\`\`\`

**自动协调:**
- 所有页面使用相同配色方案
- 云函数和数据库 schema 保持一致
- 演示数据符合 schema 结构
- 页面调用正确的云函数

### 2. 电商小程序快速搭建
**触发示例:** "创建一个电商小程序" 或 "搭建购物平台"

**执行顺序:**
\`\`\`
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
\`\`\`

### 3. 内容发布平台
**触发示例:** "做一个类似朋友圈的发布功能"

**执行顺序:**
\`\`\`
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
\`\`\`

### 4. 个人工具应用
**触发示例:** "创建一个待办事项小程序"

**执行顺序:**
\`\`\`
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
\`\`\`

### 5. 预约服务平台
**触发示例:** "做一个美容院预约小程序"

**执行顺序:**
\`\`\`
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
\`\`\`

## 工作流协调规则

### 数据一致性
\`\`\`javascript
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
\`\`\`

### 命名一致性
\`\`\`javascript
// 自动统一命名规范
const naming = {
  collection: 'posts',           // 数据库集合名
  cloudFunction: 'posts-crud',   // 云函数名
  listPage: 'pages/posts/list',  // 列表页路径
  formPage: 'pages/posts/form',  // 表单页路径
  detailPage: 'pages/posts/detail' // 详情页路径
};
\`\`\`

### 依赖注入
\`\`\`javascript
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
\`\`\`

## 智能识别用户意图

### 关键词映射
\`\`\`javascript
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
\`\`\`

### 复杂度评估
\`\`\`javascript
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
\`\`\`

## 执行流程

### 第一步:意图识别
\`\`\`
用户输入 → 关键词提取 → 匹配工作流模板 → 确认执行计划
\`\`\`

### 第二步:参数收集
\`\`\`
项目名称? → 配色偏好? → 核心功能? → 确认开始
\`\`\`

### 第三步:顺序执行
\`\`\`
for each skill in workflow:
  1. 执行技能
  2. 收集输出
  3. 传递给下一个技能
  4. 记录日志
\`\`\`

### 第四步:整合验证
\`\`\`
检查文件完整性 → 验证引用正确性 → 生成项目文档 → 完成
\`\`\`

## 输出示例

执行 "创建一个完整的文章管理功能" 后生成:

\`\`\`
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
\`\`\`

## 进度反馈

\`\`\`
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
\`\`\`

## 检查清单
- [ ] 是否正确识别了用户意图
- [ ] 工作流顺序是否合理
- [ ] 所有技能是否使用统一配色
- [ ] 数据结构是否在各层保持一致
- [ ] 云函数名称是否与页面调用匹配
- [ ] 是否生成了项目文档
- [ ] 演示数据是否符合 schema`
  },

  'init-project-architecture': {
    description: 'Initializes WeChat Mini Program global architecture with custom navigation bar calculations.',
    triggers: ['new project', 'create miniprogram', 'initialize', 'scaffold project'],
    content: `# Project Architecture Initialization

## 触发条件
**关键词:** new project, init, scaffold, create miniprogram, start app

## 核心功能
自动搭建微信小程序全局架构,包含自定义导航栏计算

## 实现要点

### 1. app.js - 导航栏高度计算
\`\`\`javascript
App({
  globalData: {
    navBarHeight: 0,
    statusBarHeight: 0,
    menuButtonInfo: {}
  },
  
  onLaunch() {
    // ✅ 使用最新 API
    const windowInfo = wx.getWindowInfo();
    const menu = wx.getMenuButtonBoundingClientRect();
    const statusBarHeight = windowInfo.statusBarHeight;
    const gap = menu.top - statusBarHeight;
    const navBarHeight = statusBarHeight + menu.height + (gap * 2);
    
    this.globalData.navBarHeight = navBarHeight;
    this.globalData.statusBarHeight = statusBarHeight;
    this.globalData.menuButtonInfo = menu;
    
    console.log('Navigation initialized:', {navBarHeight, statusBarHeight});
  }
});
\`\`\`

### 2. app.json - 全局配置
\`\`\`json
{
  "pages": [
    "pages/index/index"
  ],
  "window": {
    "navigationStyle": "custom",
    "backgroundColor": "#F7F8FA",
    "backgroundTextStyle": "dark"
  },
  "sitemapLocation": "sitemap.json",
  "lazyCodeLoading": "requiredComponents"
}
\`\`\`

### 3. 目录结构
\`\`\`
project/
├── pages/          # 页面
├── components/     # 组件
├── utils/          # 工具函数
├── images/         # 图片资源
│   ├── icons/     # SVG 图标
│   └── tabbar/    # TabBar PNG 图标
├── cloudfunctions/ # 云函数
└── styles/         # 全局样式
    └── design-tokens.wxss
\`\`\`

### 4. app.wxss - 全局样式
\`\`\`css
page {
  background-color: var(--bg-page);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
}

/* 引入设计令牌 */
@import "styles/design-tokens.wxss";
\`\`\`

## 关键规则
- ⚠️ 必须使用 wx.getWindowInfo() 而非 wx.getSystemInfo()
- ⚠️ 导航栏高度仅在 app.js 中计算一次
- ⚠️ 首页使用自定义导航,次级页面使用默认导航
- ✅ 所有图标必须是 SVG 格式(TabBar 除外,必须 PNG)
- ✅ 必须配置云开发环境 ID

## 检查清单
- [ ] app.js 中是否正确计算了导航栏高度
- [ ] app.json 中是否配置了 navigationStyle
- [ ] 是否创建了 images/icons/ 目录
- [ ] 是否配置了云开发环境
- [ ] 是否添加了 design-tokens.wxss`
  },

  'adaptive-color-system': {
    description: 'Generates professional color schemes based on project type with dark mode support.',
    triggers: ['color scheme', 'theme', 'design system', 'color palette', '配色', '主题'],
    content: `# Adaptive Color System - 智能配色系统

## 触发条件
**关键词:** color, theme, design system, palette, 配色, 主题色

## 预设配色方案

### 1. 科技/SaaS (紫蓝渐变)
\`\`\`css
--primary: #667eea;
--primary-dark: #764ba2;
--accent: #5a67d8;
--gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
\`\`\`
**适用:** SaaS产品、技术工具、创新应用

### 2. 电商/零售 (活力橙红)
\`\`\`css
--primary: #ff6b6b;
--primary-dark: #ee5a6f;
--accent: #feca57;
--gradient: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
\`\`\`
**适用:** 电商平台、零售商城、促销活动

### 3. 金融/商务 (稳重深蓝)
\`\`\`css
--primary: #2c3e50;
--primary-dark: #1a252f;
--accent: #3498db;
--gradient: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
\`\`\`
**适用:** 金融应用、企业服务、专业工具

### 4. 教育/工具 (清新绿青)
\`\`\`css
--primary: #06d6a0;
--primary-dark: #05b285;
--accent: #118ab2;
--gradient: linear-gradient(135deg, #06d6a0 0%, #118ab2 100%);
\`\`\`
**适用:** 在线教育、效率工具、知识社区

### 5. 社交/娱乐 (梦幻粉紫)
\`\`\`css
--primary: #f72585;
--primary-dark: #b5179e;
--accent: #7209b7;
--gradient: linear-gradient(135deg, #f72585 0%, #7209b7 100%);
\`\`\`
**适用:** 社交平台、娱乐内容、创意应用

### 6. 健康/生活 (自然绿)
\`\`\`css
--primary: #38b000;
--primary-dark: #2d8c00;
--accent: #70e000;
--gradient: linear-gradient(135deg, #38b000 0%, #70e000 100%);
\`\`\`
**适用:** 健康管理、生活服务、运动健身

## 完整设计令牌系统

### styles/design-tokens.wxss
\`\`\`css
/* 颜色系统 - 根据项目类型选择一套 */
page {
  /* 主色调 */
  --primary: #667eea;
  --primary-dark: #764ba2;
  --accent: #5a67d8;
  
  /* 中性灰度 */
  --neutral-50: #F9FAFB;
  --neutral-100: #F3F4F6;
  --neutral-200: #E5E7EB;
  --neutral-300: #D1D5DB;
  --neutral-400: #9CA3AF;
  --neutral-500: #6B7280;
  --neutral-600: #4B5563;
  --neutral-700: #374151;
  --neutral-800: #1F2937;
  --neutral-900: #111827;
  
  /* 背景色 */
  --bg-page: #F7F8FA;
  --bg-card: #FFFFFF;
  --bg-overlay: rgba(0, 0, 0, 0.5);
  
  /* 文字颜色 */
  --text-primary: #1A1A1A;
  --text-secondary: #666666;
  --text-tertiary: #999999;
  --text-inverse: #FFFFFF;
  
  /* 功能色 */
  --success: #10b981;
  --success-bg: #d1fae5;
  --warning: #f59e0b;
  --warning-bg: #fef3c7;
  --danger: #ef4444;
  --danger-bg: #fee2e2;
  --info: #3b82f6;
  --info-bg: #dbeafe;
  
  /* 边框 */
  --border-light: #F0F0F0;
  --border-medium: #E0E0E0;
  
  /* 阴影 */
  --shadow-xs: 0 1rpx 2rpx rgba(0, 0, 0, 0.04);
  --shadow-sm: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
  --shadow-md: 0 8rpx 32rpx rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 16rpx 48rpx rgba(0, 0, 0, 0.12);
  
  /* 圆角 */
  --radius-sm: 8rpx;
  --radius-md: 12rpx;
  --radius-lg: 16rpx;
  --radius-xl: 24rpx;
  
  /* 间距 */
  --spacing-xs: 8rpx;
  --spacing-sm: 16rpx;
  --spacing-md: 24rpx;
  --spacing-lg: 32rpx;
  --spacing-xl: 48rpx;
  
  /* 字体 */
  --text-xs: 20rpx;
  --text-sm: 24rpx;
  --text-base: 28rpx;
  --text-lg: 30rpx;
  --text-xl: 32rpx;
  --text-2xl: 36rpx;
  
  /* 过渡 */
  --transition-fast: 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-base: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 暗色模式 */
@media (prefers-color-scheme: dark) {
  page {
    --bg-page: #0f172a;
    --bg-card: #1e293b;
    --text-primary: #f1f5f9;
    --text-secondary: #cbd5e1;
    --border-light: #334155;
  }
}
\`\`\`

## 使用示例
\`\`\`css
.my-button {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: var(--text-inverse);
  border-radius: var(--radius-md);
  padding: var(--spacing-md) var(--spacing-lg);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
}

.my-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
}
\`\`\`

## 检查清单
- [ ] 是否选择了符合项目定位的配色方案
- [ ] 是否创建了 design-tokens.wxss
- [ ] 是否在 app.wxss 中引入了设计令牌
- [ ] 是否配置了暗色模式
- [ ] 文字对比度是否 ≥ 4.5:1`
  },

  'generate-mock-data': {
    description: 'Generates realistic mock data with Chinese context and proper placeholder images.',
    triggers: ['mock data', 'demo data', 'test data', 'placeholder', '演示数据'],
    content: `# Generate Mock Data - 演示数据生成器

## 触发条件
**关键词:** mock data, demo data, test data, sample data, 演示数据, 测试数据

## 占位图片 API

### 1. Picsum Photos (风景/物品)
\`\`\`javascript
// 基础用法
'https://picsum.photos/400/300'

// 指定随机种子(确保相同ID返回相同图片)
'https://picsum.photos/400/300?random=1'

// 常用尺寸配置
const PLACEHOLDER_IMAGES = {
  avatar: (id) => \`https://picsum.photos/200/200?random=avatar_\${id}\`,
  cover: (id) => \`https://picsum.photos/750/400?random=cover_\${id}\`,
  thumbnail: (id) => \`https://picsum.photos/300/300?random=thumb_\${id}\`,
  banner: (id) => \`https://picsum.photos/750/300?random=banner_\${id}\`,
  product: (id) => \`https://picsum.photos/400/400?random=product_\${id}\`
};
\`\`\`

### 2. Pravatar (真实人物头像)
\`\`\`javascript
// 70+ 真实人物头像
'https://i.pravatar.cc/150?img=12'  // img 范围: 1-70

// 不同尺寸
const sizes = [100, 150, 200, 300];
sizes.map(size => \`https://i.pravatar.cc/\${size}?img=25\`);
\`\`\`

### 3. UI Avatars (文字头像)
\`\`\`javascript
// 中文名字生成头像
const generateAvatar = (name) => {
  return \`https://ui-avatars.com/api/?name=\${encodeURIComponent(name)}&size=200&background=667eea&color=fff&bold=true\`;
};

// 使用
generateAvatar('张三'); // 显示 "张三" 的文字头像
\`\`\`

## 数据生成模板

### 用户列表
\`\`\`javascript
const CHINESE_NAMES = [
  '张伟', '王芳', '李娜', '刘洋', '陈静',
  '杨磊', '赵敏', '黄强', '周杰', '吴秀英',
  '徐鹏', '孙丽', '马超', '朱婷', '胡军'
];

const mockUsers = Array.from({length: 20}, (_, i) => ({
  id: i + 1,
  name: CHINESE_NAMES[i % CHINESE_NAMES.length],
  avatar: \`https://i.pravatar.cc/150?img=\${(i % 70) + 1}\`,
  bio: '这是一段个人简介,介绍用户的基本情况...',
  city: ['北京', '上海', '广州', '深圳', '杭州'][i % 5],
  followers: Math.floor(Math.random() * 10000),
  following: Math.floor(Math.random() * 1000),
  posts_count: Math.floor(Math.random() * 100),
  created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
}));
\`\`\`

### 内容/文章列表
\`\`\`javascript
const ARTICLE_TITLES = [
  '微信小程序开发实战指南',
  '如何提高工作效率的10个技巧',
  'JavaScript 最佳实践',
  '云开发入门教程',
  '设计系统搭建经验分享'
];

const mockPosts = Array.from({length: 30}, (_, i) => ({
  id: i + 1,
  title: ARTICLE_TITLES[i % ARTICLE_TITLES.length],
  cover: \`https://picsum.photos/750/400?random=post_\${i}\`,
  author: {
    name: CHINESE_NAMES[i % CHINESE_NAMES.length],
    avatar: \`https://i.pravatar.cc/100?img=\${(i % 20) + 1}\`
  },
  excerpt: '这是文章摘要内容,简要介绍文章的主要观点和核心内容...',
  content: '文章详细内容...',
  category: ['科技', '生活', '教育', '娱乐'][i % 4],
  tags: ['微信', '小程序', '开发'].slice(0, Math.floor(Math.random() * 3) + 1),
  view_count: Math.floor(Math.random() * 5000),
  like_count: Math.floor(Math.random() * 500),
  comment_count: Math.floor(Math.random() * 50),
  is_featured: i % 10 === 0,
  created_at: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString()
}));
\`\`\`

### 商品列表
\`\`\`javascript
const PRODUCT_NAMES = [
  'iPhone 15 Pro Max', '华为 Mate 60 Pro', '小米 14 Ultra',
  'MacBook Pro M3', '戴森吹风机', 'AirPods Pro 2',
  '索尼耳机 WH-1000XM5', 'iPad Air', 'Apple Watch Series 9'
];

const mockProducts = Array.from({length: 50}, (_, i) => ({
  id: i + 1,
  name: PRODUCT_NAMES[i % PRODUCT_NAMES.length],
  price: (Math.random() * 8000 + 500).toFixed(2),
  original_price: (Math.random() * 10000 + 1000).toFixed(2),
  image: \`https://picsum.photos/400/400?random=product_\${i}\`,
  images: Array.from({length: 4}, (_, j) => 
    \`https://picsum.photos/400/400?random=product_\${i}_\${j}\`
  ),
  thumbnail: \`https://picsum.photos/200/200?random=thumb_\${i}\`,
  stock: Math.floor(Math.random() * 100),
  sales: Math.floor(Math.random() * 1000),
  rating: (Math.random() * 2 + 3).toFixed(1),
  review_count: Math.floor(Math.random() * 500),
  category: ['手机', '电脑', '数码', '家电'][i % 4],
  tags: ['热卖', '新品', '包邮'].slice(0, Math.floor(Math.random() * 3) + 1),
  is_hot: i % 5 === 0,
  is_new: i % 7 === 0,
  description: '商品详细描述,包含产品特点、规格参数等信息...'
}));
\`\`\`

### 订单列表
\`\`\`javascript
const mockOrders = Array.from({length: 15}, (_, i) => ({
  id: i + 1,
  order_no: \`2024\${String(Date.now()).slice(-10)}\${String(i).padStart(4, '0')}\`,
  product: {
    name: PRODUCT_NAMES[i % PRODUCT_NAMES.length],
    image: \`https://picsum.photos/200/200?random=order_\${i}\`,
    price: (Math.random() * 5000 + 500).toFixed(2),
    quantity: Math.floor(Math.random() * 3) + 1
  },
  total_price: (Math.random() * 8000 + 1000).toFixed(2),
  status: [0, 1, 2, 3][i % 4], // 0-待支付, 1-已支付, 2-已发货, 3-已完成
  status_text: ['待支付', '已支付', '已发货', '已完成'][i % 4],
  payment_method: ['微信支付', '支付宝'][i % 2],
  shipping_address: {
    name: CHINESE_NAMES[i % CHINESE_NAMES.length],
    phone: '138****' + String(Math.floor(Math.random() * 10000)).padStart(4, '0'),
    address: '北京市朝阳区xxx路xxx号'
  },
  created_at: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString()
}));
\`\`\`

### 评论列表
\`\`\`javascript
const COMMENT_CONTENTS = [
  '非常好用,强烈推荐!',
  '质量不错,物流很快',
  '性价比很高,值得购买',
  '包装精美,服务态度好',
  '第二次购买了,一如既往的好'
];

const mockComments = Array.from({length: 25}, (_, i) => ({
  id: i + 1,
  user: {
    name: CHINESE_NAMES[i % CHINESE_NAMES.length],
    avatar: \`https://i.pravatar.cc/100?img=\${(i % 30) + 1}\`
  },
  content: COMMENT_CONTENTS[i % COMMENT_CONTENTS.length],
  rating: Math.floor(Math.random() * 2) + 4, // 4-5星
  images: Array.from({length: Math.floor(Math.random() * 4)}, (_, j) => 
    \`https://picsum.photos/300/300?random=comment_\${i}_\${j}\`
  ),
  like_count: Math.floor(Math.random() * 100),
  reply_count: Math.floor(Math.random() * 10),
  created_at: new Date(Date.now() - i * 60 * 60 * 1000).toISOString()
}));
\`\`\`

## 工具函数

### 随机日期生成
\`\`\`javascript
// 生成指定范围内的随机日期
function randomDate(daysAgo = 30) {
  const now = Date.now();
  const randomTime = Math.random() * daysAgo * 24 * 60 * 60 * 1000;
  return new Date(now - randomTime).toISOString();
}
\`\`\`

### 随机选择
\`\`\`javascript
function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// 使用
const city = randomChoice(['北京', '上海', '广州', '深圳']);
\`\`\`

### 生成唯一ID
\`\`\`javascript
function generateId(prefix = 'ID') {
  return \`\${prefix}_\${Date.now()}_\${Math.random().toString(36).slice(2, 9)}\`;
}
\`\`\`

## 检查清单
- [ ] 是否使用了占位图 API
- [ ] 图片 URL 是否包含随机种子
- [ ] 是否使用了真实的中文场景数据
- [ ] 数据结构是否符合实际业务需求
- [ ] 是否添加了适当的随机性
- [ ] 日期是否使用 ISO 格式
- [ ] 价格是否保留两位小数`
  },

  'generate-page': {
    description: 'Generates complete WeChat Mini Program pages with proper scroll-view usage, color schemes, and placeholder images.',
    triggers: ['create page', 'add page', 'new page', 'build page', '创建页面'],
    content: `# Smart Page Generator - 智能页面生成器

## 触发条件
**关键词:** create page, add page, new page, build page, 创建页面, 新建页面

## 导航栏策略 ⚠️ 重要

### 规则
\`\`\`
首页 (index) → 自定义导航栏 (navigationStyle: "custom")
次级页面 (所有其他) → 默认导航栏 (navigationStyle: "default")
\`\`\`

### 首页配置
\`\`\`json
// pages/index/index.json
{
  "navigationStyle": "custom"
}
\`\`\`

\`\`\`xml
<!-- pages/index/index.wxml -->
<view style="height: {{navBarHeight}}px;"></view>
<custom-navbar title="首页" />

<scroll-view class="content" scroll-y enhanced show-scrollbar="{{false}}">
  <!-- 内容 -->
</scroll-view>
\`\`\`

\`\`\`css
/* pages/index/index.wxss */
.content {
  height: calc(100vh - {{navBarHeight}}px);
}
\`\`\`

### 次级页面配置
\`\`\`json
// pages/list/list.json
{
  "navigationBarTitleText": "列表页",
  "navigationBarBackgroundColor": "#ffffff"
}
\`\`\`

\`\`\`xml
<!-- pages/list/list.wxml -->
<!-- ❌ 不要添加导航栏占位 -->
<scroll-view class="page-scroll" scroll-y enhanced show-scrollbar="{{false}}">
  <!-- 内容 -->
</scroll-view>
\`\`\`

\`\`\`css
/* pages/list/list.wxss */
.page-scroll {
  height: 100vh; /* 直接使用 100vh */
}
\`\`\`

## scroll-view 完整配置

### 标准列表页
\`\`\`xml
<scroll-view 
  class="list-scroll"
  scroll-y 
  type="list"
  enable-flex
  enhanced
  show-scrollbar="{{false}}"
  refresher-enabled
  refresher-triggered="{{refreshing}}"
  refresher-background="#F7F8FA"
  bindrefresherrefresh="onRefresh"
  bindscrolltolower="onLoadMore"
  lower-threshold="100">
  
  <!-- 列表项 -->
  <view wx:for="{{items}}" wx:key="id" class="list-item" bindtap="onItemTap" data-id="{{item.id}}">
    <image class="item-cover" src="{{item.cover}}" mode="aspectFill" lazy-load webp></image>
    <view class="item-info">
      <text class="item-title">{{item.title}}</text>
      <text class="item-subtitle">{{item.subtitle}}</text>
    </view>
    <image wx:if="{{item.badge}}" class="item-badge" src="/images/icons/badge.svg"></image>
  </view>
  
  <!-- 空状态 -->
  <view wx:if="{{items.length === 0 && !loading}}" class="empty-state">
    <image class="empty-image" src="https://picsum.photos/400/300?random=empty" mode="aspectFit"></image>
    <text class="empty-text">暂无数据</text>
  </view>
  
  <!-- 加载状态 -->
  <view wx:if="{{loading}}" class="loading-more">
    <view class="loading-spinner"></view>
    <text class="loading-text">加载中...</text>
  </view>
  
  <!-- 没有更多 -->
  <view wx:elif="{{!hasMore && items.length > 0}}" class="no-more">
    <view class="no-more-line"></view>
    <text class="no-more-text">没有更多了</text>
    <view class="no-more-line"></view>
  </view>
</scroll-view>
\`\`\`

\`\`\`javascript
// pages/list/list.js
Page({
  data: {
    items: [],
    refreshing: false,
    loading: false,
    page: 1,
    pageSize: 20,
    hasMore: true
  },

  onLoad() {
    this.loadData();
  },

  async loadData(isRefresh = false) {
    if (this.data.loading) return;
    
    this.setData({loading: true});
    
    try {
      const page = isRefresh ? 1 : this.data.page;
      
      // 调用云函数或API
      const res = await wx.cloud.callFunction({
        name: 'getList',
        data: {page, pageSize: this.data.pageSize}
      });
      
      const newItems = res.result.data;
      
      this.setData({
        items: isRefresh ? newItems : [...this.data.items, ...newItems],
        page: page + 1,
        hasMore: newItems.length === this.data.pageSize
      });
    } catch (err) {
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
      console.error('Load error:', err);
    } finally {
      this.setData({loading: false});
    }
  },

  async onRefresh() {
    this.setData({refreshing: true, page: 1});
    await this.loadData(true);
    this.setData({refreshing: false});
  },

  onLoadMore() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadData();
    }
  },

  onItemTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: \`/pages/detail/detail?id=\${id}\`
    });
  }
});
\`\`\`

### 表单页
\`\`\`xml
<scroll-view 
  class="form-scroll" 
  scroll-y
  enhanced
  show-scrollbar="{{false}}"
  enable-passive>
  
  <form bindsubmit="onSubmit" class="form-content">
    <view class="form-item">
      <text class="form-label">标题 *</text>
      <input 
        class="form-input" 
        name="title" 
        placeholder="请输入标题"
        maxlength="50"
        value="{{formData.title}}"
        bindinput="onTitleInput" />
    </view>

    <view class="form-item">
      <text class="form-label">内容 *</text>
      <textarea 
        class="form-textarea" 
        name="content" 
        placeholder="请输入内容"
        maxlength="500"
        value="{{formData.content}}"
        bindinput="onContentInput"
        auto-height
        show-confirm-bar="{{false}}" />
    </view>

    <!-- 图片上传 -->
    <view class="form-item">
      <text class="form-label">图片(最多3张)</text>
      <view class="image-uploader">
        <view wx:for="{{images}}" wx:key="index" class="image-item">
          <image src="{{item}}" mode="aspectFill"></image>
          <view class="image-delete" bindtap="deleteImage" data-index="{{index}}">
            <image class="delete-icon" src="/images/icons/close.svg"></image>
          </view>
        </view>
        <view wx:if="{{images.length < 3}}" class="image-add" bindtap="chooseImage">
          <image class="add-icon" src="/images/icons/add.svg"></image>
          <text class="add-text">添加图片</text>
        </view>
      </view>
    </view>

    <button class="submit-btn" formType="submit" loading="{{submitting}}" disabled="{{submitting}}">
      {{submitting ? '提交中...' : '提交'}}
    </button>
  </form>
</scroll-view>
\`\`\`

## 样式规范(应用配色方案)

\`\`\`css
/* 列表页样式 */
.list-scroll {
  height: 100vh;
  background: var(--bg-page);
}

.list-item {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  margin: var(--spacing-md) var(--spacing-lg);
  display: flex;
  align-items: center;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-base);
}

.list-item:active {
  transform: scale(0.98);
  background: var(--neutral-50);
}

.item-cover {
  width: 160rpx;
  height: 160rpx;
  border-radius: var(--radius-md);
  margin-right: var(--spacing-md);
  flex-shrink: 0;
}

.item-title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.submit-btn {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: var(--text-inverse);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  margin-top: var(--spacing-xl);
  box-shadow: var(--shadow-md);
}
\`\`\`

## 占位图使用

\`\`\`javascript
// 在 data 中使用占位图
data: {
  items: Array.from({length: 10}, (_, i) => ({
    id: i + 1,
    title: '示例标题',
    cover: \`https://picsum.photos/400/300?random=\${i}\`,
    author: {
      avatar: \`https://i.pravatar.cc/100?img=\${i + 1}\`
    }
  }))
}
\`\`\`

## 图标规范 ⚠️

### 禁止使用文本 emoji
\`\`\`xml
<!-- ❌ 错误 -->
<text>🔍 搜索</text>
<view>✅ 完成</view>

<!-- ✅ 正确 -->
<image class="icon" src="/images/icons/search.svg"></image>
<image class="icon" src="/images/icons/check.svg"></image>
\`\`\`

### 推荐图标库结构
\`\`\`
/images/icons/
├── arrow-right.svg
├── arrow-left.svg
├── close.svg
├── add.svg
├── check.svg
├── search.svg
├── heart.svg
├── heart-filled.svg
├── share.svg
└── more.svg
\`\`\`

## 检查清单
- [ ] 是否正确判断首页/次级页面
- [ ] scroll-view 是否包含 enhanced 和 show-scrollbar
- [ ] 是否设置了固定高度(100vh)
- [ ] wx:for 是否添加了 wx:key
- [ ] 图片是否添加了 lazy-load 和 webp
- [ ] 是否使用了 SVG 图标(禁止 emoji)
- [ ] 是否应用了设计令牌(CSS 变量)
- [ ] 是否使用了占位图 API
- [ ] 表单是否有验证和错误处理
- [ ] 是否有空状态和加载状态`
  },

  'generate-cloud-function': {
    description: 'Generates complete cloud functions with proper security, validation, and error handling.',
    triggers: ['cloud function', 'backend', 'API', 'server', '云函数'],
    content: `# Cloud Function Generator - 云函数生成器

## 触发条件
**关键词:** cloud function, backend, API, server, 云函数, 后端接口

## 核心安全原则

\`\`\`javascript
// ✅ 正确:从服务端获取 openid
const wxContext = cloud.getWXContext();
const openid = wxContext.OPENID;

// ❌ 错误:信任前端传递的 openid
const {openid} = event; // 永远不要这样做!
\`\`\`

## 标准 CRUD 函数

### index.js
\`\`\`javascript
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
\`\`\`

### config.json
\`\`\`json
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
\`\`\`

### package.json
\`\`\`json
{
  "name": "cloud-function",
  "version": "1.0.0",
  "description": "WeChat Mini Program Cloud Function",
  "main": "index.js",
  "dependencies": {
    "wx-server-sdk": "~2.6.3"
  }
}
\`\`\`

## 内容安全检测函数

\`\`\`javascript
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
\`\`\`

## 前端调用示例

\`\`\`javascript
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
\`\`\`

## 检查清单
- [ ] 是否从 cloud.getWXContext() 获取 openid
- [ ] 是否验证了所有输入数据
- [ ] 是否添加了权限检查
- [ ] 是否处理了所有错误情况
- [ ] config.json 是否配置了必要权限
- [ ] package.json 是否包含正确依赖
- [ ] 返回数据是否包含 success 字段
- [ ] 是否添加了日志记录`
  },

  'database-schema-design': {
    description: 'Designs optimized database schemas with proper indexes, permissions, and relationships.',
    triggers: ['database', 'schema', 'collection', 'data model', '数据库'],
    content: `# Database Schema Designer - 数据库设计器

## 触发条件
**关键词:** database, schema, collection, data model, 数据库设计, 集合

## 设计原则

### 1. 字段命名
使用下划线命名(推荐)而非驼峰命名

### 2. 必需字段
\`\`\`javascript
{
  _id: string,        // 自动生成
  _openid: string,    // 自动添加
  created_at: date,   // 创建时间
  updated_at: date    // 更新时间
}
\`\`\`

### 3. 状态字段
使用数字枚举:
\`\`\`javascript
status: 0  // 0-待处理, 1-进行中, 2-已完成, -1-已删除
\`\`\`

## 常见集合设计

### 用户表 (users)
\`\`\`javascript
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
\`\`\`

### 内容表 (posts)
\`\`\`javascript
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
\`\`\`

### 订单表 (orders)
\`\`\`javascript
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
\`\`\`

## 索引策略

### 复合索引顺序
\`\`\`javascript
// ✅ 正确:按查询频率排序
{status: 1, category: 1, created_at: -1}

// 支持的查询:
// 1. {status: 1}
// 2. {status: 1, category: 'tech'}
// 3. {status: 1, category: 'tech'} sort by created_at
\`\`\`

## 权限配置

\`\`\`json
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
\`\`\`

## 检查清单
- [ ] 是否包含必需字段
- [ ] 字段是否使用下划线命名
- [ ] 是否创建了必要索引
- [ ] 复合索引顺序是否正确
- [ ] 权限规则是否合理
- [ ] 价格是否使用整数(分)
- [ ] 数组字段是否限制长度`
  },

  'performance-optimizer': {
    description: 'Analyzes and fixes performance issues including setData optimization and list virtualization.',
    triggers: ['slow', 'laggy', 'performance', 'optimize', 'freeze', '卡顿', '优化'],
    content: `# Performance Optimizer - 性能优化器

## 触发条件
**关键词:** slow, lag, freeze, performance, optimize, 卡顿, 慢, 优化

## 常见问题与解决方案

### 1. setData 频繁调用

#### ❌ 问题
\`\`\`javascript
for (let i = 0; i < 100; i++) {
  this.setData({[\`items[\${i}]\`]: data[i]});
}
\`\`\`

#### ✅ 解决
\`\`\`javascript
const updates = {};
for (let i = 0; i < 100; i++) {
  updates[\`items[\${i}]\`] = data[i];
}
this.setData(updates);
\`\`\`

### 2. setData 数据量过大

#### ❌ 问题
\`\`\`javascript
this.setData({items: this.data.items});
\`\`\`

#### ✅ 解决
\`\`\`javascript
// 使用精确路径
this.setData({'items[5].liked': true});
\`\`\`

### 3. 长列表未虚拟滚动

#### ✅ 解决
\`\`\`xml
<scroll-view 
  scroll-y 
  type="list"
  enable-flex
  enhanced>
  <view wx:for="{{items}}" wx:key="id">{{item.title}}</view>
</scroll-view>
\`\`\`

### 4. 图片未优化

#### ✅ 解决
\`\`\`xml
<image 
  src="{{url}}" 
  lazy-load 
  webp 
  mode="aspectFill">
</image>
\`\`\`

### 5. 防抖节流

\`\`\`javascript
// 防抖
function debounce(fn, delay = 300) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// 节流
function throttle(fn, interval = 300) {
  let last = 0;
  return function(...args) {
    const now = Date.now();
    if (now - last >= interval) {
      last = now;
      fn.apply(this, args);
    }
  };
}

// 使用
onSearch: debounce(function(e) {
  // 搜索逻辑
}, 500)
\`\`\`

## 性能阈值

| 指标 | 警告 | 严重 |
|-----|------|------|
| setData 频率 | 10次/秒 | 20次/秒 |
| setData 大小 | 100KB | 500KB |
| 列表长度 | 100项 | 500项 |
| 首屏时间 | 2秒 | 3秒 |

## 检查清单
- [ ] setData 是否批量合并
- [ ] setData 是否使用精确路径
- [ ] 长列表是否启用 type="list"
- [ ] 图片是否 lazy-load + webp
- [ ] 是否使用防抖节流
- [ ] 是否开启分页加载`
  },

  'diagnose-and-fix': {
    description: 'Intelligently diagnoses errors and provides targeted fixes.',
    triggers: ['error', 'bug', 'not working', 'broken', '报错', '错误'],
    content: `# Intelligent Error Diagnosis - 智能错误诊断

## 触发条件
**关键词:** error, bug, not working, broken, crash, 报错, 不工作

## 常见错误诊断

### 1. scroll-view 无法滚动

#### 诊断
- 是否设置固定高度?
- 是否有 scroll-y 属性?
- 是否有 enhanced 属性?

#### 修复
\`\`\`xml
<scroll-view 
  class="scroll" 
  scroll-y 
  enhanced 
  show-scrollbar="{{false}}"
  style="height: 100vh;">
  <view>Content</view>
</scroll-view>
\`\`\`

### 2. 云函数权限错误

#### 错误信息
\`\`\`
errCode: -1
errMsg: "no permission"
\`\`\`

#### 修复
\`\`\`json
// config.json
{
  "permissions": {
    "openapi": ["security.msgSecCheck"]
  }
}
\`\`\`

### 3. 数据库权限错误

#### 修复
\`\`\`json
{
  "read": "doc._openid == auth.openid",
  "write": "doc._openid == auth.openid"
}
\`\`\`

### 4. 导航栏高度问题

#### 修复
\`\`\`javascript
// app.js
const windowInfo = wx.getWindowInfo();
const menu = wx.getMenuButtonBoundingClientRect();
const navBarHeight = windowInfo.statusBarHeight + menu.height + (menu.top - windowInfo.statusBarHeight) * 2;
\`\`\`

### 5. 图片加载失败

#### 修复
\`\`\`xml
<image 
  src="{{url}}" 
  binderror="onImageError"
  mode="aspectFill">
</image>
\`\`\`

\`\`\`javascript
onImageError(e) {
  const index = e.currentTarget.dataset.index;
  this.setData({
    [\`items[\${index}].image\`]: 'https://picsum.photos/400/300?random=error'
  });
}
\`\`\`

## 错误码速查

| 错误码 | 含义 | 解决方案 |
|-------|------|---------|
| -1 | 系统错误 | 检查网络/权限 |
| 87014 | 敏感内容 | 使用内容安全API |
| 600001 | 权限不足 | 修改权限规则 |
| 600003 | 操作超时 | 优化查询/增加索引 |

## 检查清单
- [ ] 是否使用废弃 API
- [ ] scroll-view 配置是否完整
- [ ] 云函数权限是否正确
- [ ] 数据库权限是否合理
- [ ] 图片是否有错误处理`
  }
};

// ==========================================
// 安装函数
// ==========================================

function installSkills() {
  const baseDir = path.join(process.cwd(), '.agent', 'skills');
  
  console.log('🚀 WeChat Mini Program Agent Skills Installer v2.0\n');
  console.log('📦 Optimized Version:');
  console.log('   ✅ 移除模板和示例(体积减少 90%)');
  console.log('   ✅ 新增配色方案和占位图支持');
  console.log('   ✅ 精简技能描述,更易理解\n');
  
  // 创建基础目录
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }
  
  let installedCount = 0;
  
  // 安装每个技能
  Object.entries(SKILLS).forEach(([skillName, skillData]) => {
    const skillDir = path.join(baseDir, skillName);
    
    console.log(`📝 ${skillName}`);
    console.log(`   ${skillData.description}`);
    
    if (!fs.existsSync(skillDir)) {
      fs.mkdirSync(skillDir, { recursive: true });
    }
    
    // 写入 SKILL.md
    const skillMdPath = path.join(skillDir, 'SKILL.md');
    const frontmatter = `---
name: ${skillName}
description: ${skillData.description}
triggers: ${JSON.stringify(skillData.triggers)}
version: 2.0
optimized: true
---

`;
    fs.writeFileSync(skillMdPath, frontmatter + skillData.content);
    installedCount++;
    console.log(`   ✅ SKILL.md created\n`);
  });
  
  // 创建 README
  const readmePath = path.join(baseDir, 'README.md');
  const readmeContent = `# WeChat Mini Program Agent Skills v2.0

## 📋 已安装技能 (${installedCount})

### ⭐ workflow-orchestrator (NEW - 工作流编排器)
- **触发词:** complete feature, full stack, end to end, 完整功能, 全栈
- **描述:** 自动编排多个技能完成复杂任务
- **预设工作流:**
  - 完整 CRUD 功能 (列表+表单+详情+后端)
  - 电商小程序 (商品+订单+购物车)
  - 内容发布平台 (动态+评论+点赞)
  - 个人工具应用 (待办事项等)
  - 预约服务平台 (预约+排班)

${Object.entries(SKILLS).filter(([name]) => name !== 'workflow-orchestrator').map(([name, data]) => 
`### ${name}
- **触发词:** ${data.triggers.join(', ')}
- **描述:** ${data.description}`
).join('\n\n')}

## 🎯 核心特性

### 🔗 工作流编排 (NEW!)
**自动化端到端开发:**
- 智能识别用户意图
- 自动选择和排序技能
- 确保数据和命名一致性
- 生成完整可用的功能模块

**示例:**
\`\`\`
用户: "创建一个完整的文章管理功能"

Agent 自动执行:
1. ✅ 选择科技风配色
2. ✅ 设计 posts 数据库
3. ✅ 生成 CRUD 云函数
4. ✅ 创建演示数据 (30条)
5. ✅ 构建列表页 (虚拟滚动)
6. ✅ 构建表单页 (内容审核)
7. ✅ 构建详情页 (评论功能)

结果: 12个文件,开箱即用!
\`\`\`

### 1. 智能配色系统
- 6 套专业配色方案(科技/电商/金融/教育/社交/健康)
- 完整设计令牌(颜色/间距/字体/阴影)
- 暗色模式自动适配

### 2. 演示数据生成
- Picsum Photos - 风景物品占位图
- Pravatar - 真实人物头像(70+)
- UI Avatars - 中文名字头像
- 真实中文场景数据模板

### 3. 现代化最佳实践
- 禁用废弃 API(wx.getSystemInfo → wx.getWindowInfo)
- scroll-view 完整配置(enhanced + show-scrollbar)
- 强制 SVG 图标(禁止文本 emoji)
- 云函数安全规范(服务端获取 openid)

## 💡 使用示例

**用户:** "创建一个电商首页"
**Agent 自动:**
- 应用电商配色方案(橙红渐变)
- 生成商品列表演示数据
- 使用 Picsum 占位图
- 配置 scroll-view 虚拟滚动
- 添加下拉刷新和上拉加载

**用户:** "性能优化,感觉有点卡"
**Agent 自动:**
- 检测 setData 调用频率
- 分析数据传输大小
- 检查列表虚拟滚动
- 提供针对性修复方案

## 📁 目录结构

\`\`\`
.agent/skills/
├── README.md
├── init-project-architecture/
│   └── SKILL.md
├── adaptive-color-system/
│   └── SKILL.md
├── generate-mock-data/
│   └── SKILL.md
├── generate-page/
│   └── SKILL.md
├── generate-cloud-function/
│   └── SKILL.md
├── database-schema-design/
│   └── SKILL.md
├── performance-optimizer/
│   └── SKILL.md
└── diagnose-and-fix/
    └── SKILL.md
\`\`\`

## 🔄 更新日志

### v2.0 (Current)
- ✅ 移除所有模板和示例文件
- ✅ 新增 adaptive-color-system 技能
- ✅ 新增 generate-mock-data 技能
- ✅ 所有技能优化为简洁描述
- ✅ 体积减少 90%

### v1.0
- 初始版本(包含大量模板)

## 📖 使用指南

技能会根据用户的关键词自动触发,无需手动选择。Agent 会:

1. **识别意图** - 匹配触发词
2. **调用技能** - 读取 SKILL.md
3. **动态生成** - 根据描述创建代码
4. **应用规范** - 自动应用最佳实践

## 🎨 配色方案预览

| 方案 | 主色 | 适用场景 |
|-----|------|---------|
| 科技/SaaS | #667eea → #764ba2 | 技术产品 |
| 电商/零售 | #ff6b6b → #feca57 | 购物平台 |
| 金融/商务 | #2c3e50 → #3498db | 企业服务 |
| 教育/工具 | #06d6a0 → #118ab2 | 在线教育 |
| 社交/娱乐 | #f72585 → #7209b7 | 社交应用 |
| 健康/生活 | #38b000 → #70e000 | 健康管理 |

## 🖼️ 占位图服务

| 服务 | 用途 | URL 示例 |
|-----|------|---------|
| Picsum | 风景/物品 | https://picsum.photos/400/300?random=1 |
| Pravatar | 真实头像 | https://i.pravatar.cc/150?img=12 |
| UI Avatars | 文字头像 | https://ui-avatars.com/api/?name=张三 |

## ⚡ 性能优化

Agent 会自动检测并修复:
- setData 频繁调用
- 数据传输过大
- 列表未虚拟滚动
- 图片未懒加载
- 缺少防抖节流

## 🔒 安全规范

Agent 强制执行:
- 服务端获取 openid(不信任前端)
- 数据库权限验证
- 输入数据校验
- 内容安全检测
- 错误统一处理

## 📚 相关资源

- [微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
- [设计指南](https://developers.weixin.qq.com/miniprogram/design/)

---

**Version:** 2.0  
**Last Updated:** ${new Date().toISOString().split('T')[0]}  
**Total Skills:** ${installedCount}  
**Optimized:** Yes ✅
`;
  
  fs.writeFileSync(readmePath, readmeContent);
  
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🎉 Installation Complete!`);
  console.log(`${'='.repeat(60)}\n`);
  
  console.log(`📊 Statistics:`);
  console.log(`   • Skills installed: ${installedCount}`);
  console.log(`   • Core skills: ${installedCount - 1}`);
  console.log(`   • Workflow orchestrator: 1 ⭐ NEW`);
  console.log(`   • Files created: ${installedCount + 1} (${installedCount} SKILL.md + 1 README)`);
  console.log(`   • Template files: 0 (optimized out)`);
  console.log(`   • Example files: 0 (optimized out)`);
  console.log(`   • Size reduction: ~90%\n`);
  
  console.log(`📁 Directory Structure:`);
  console.log(`.agent/skills/`);
  console.log(`├── README.md`);
  console.log(`├── workflow-orchestrator/ ⭐ NEW`);
  console.log(`│   └── SKILL.md`);
  Object.keys(SKILLS).filter(k => k !== 'workflow-orchestrator').forEach((name, index, arr) => {
    const isLast = index === arr.length - 1;
    console.log(`${isLast ? '└' : '├'}── ${name}/`);
    console.log(`${isLast ? ' ' : '│'}   └── SKILL.md`);
  });
  
  console.log(`\n✨ New Feature - Workflow Orchestrator:`);
  console.log(`   🔗 Automatically chains multiple skills`);
  console.log(`   🎯 Detects user intent and creates complete features`);
  console.log(`   📦 Pre-built workflows:`);
  console.log(`      • Complete CRUD (list + form + detail + backend)`);
  console.log(`      • E-commerce platform (products + orders + cart)`);
  console.log(`      • Social content publishing (posts + comments + likes)`);
  console.log(`      • Personal tools (todo, notes, etc.)`);
  console.log(`      • Booking/Appointment system`);
  console.log();
  console.log(`   💡 Example usage:`);
  console.log(`      User: "创建一个完整的商品管理功能"`);
  console.log(`      Agent will automatically:`);
  console.log(`      1. Choose e-commerce color scheme`);
  console.log(`      2. Design products database`);
  console.log(`      3. Generate CRUD cloud function`);
  console.log(`      4. Create mock product data`);
  console.log(`      5. Build list page`);
  console.log(`      6. Build form page`);
  console.log(`      7. Build detail page`);
  console.log(`      All with consistent styling and naming!`);
  
  console.log(`\n✨ Other Features:`);
  console.log(`   1. 🎨 adaptive-color-system`);
  console.log(`      • 6 professional color schemes`);
  console.log(`      • Complete design tokens`);
  console.log(`      • Dark mode support`);
  console.log();
  console.log(`   2. 🖼️  generate-mock-data`);
  console.log(`      • Picsum Photos placeholder images`);
  console.log(`      • Pravatar real avatars (70+)`);
  console.log(`      • Chinese scenario data templates`);
  console.log();
  console.log(`   3. 📝 All skills optimized`);
  console.log(`      • Concise descriptions`);
  console.log(`      • Clear trigger keywords`);
  console.log(`      • Checklist for validation`);
  
  console.log(`\n🚀 Quick Start Examples:`);
  console.log(`   Example 1: "创建一个电商小程序"`);
  console.log(`   → Full e-commerce app with products, orders, cart`);
  console.log();
  console.log(`   Example 2: "做一个待办事项管理"`);
  console.log(`   → Complete todo app with list, form, statistics`);
  console.log();
  console.log(`   Example 3: "搭建一个文章发布平台"`);
  console.log(`   → Social platform with posts, comments, likes`);
  
  console.log(`\n${'='.repeat(60)}`);
  console.log(`✅ All systems ready with Workflow Orchestrator!`);
  console.log(`${'='.repeat(60)}\n`);
}

// 运行安装
if (require.main === module) {
  try {
    installSkills();
  } catch (error) {
    console.error('\n❌ Installation failed:', error.message);
    console.error('\nStack trace:');
    console.error(error.stack);
    process.exit(1);
  }
}

// 导出
module.exports = { SKILLS, installSkills };
