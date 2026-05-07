---
name: generate-mock-data
description: "Generates realistic mock data with Chinese context and proper placeholder images. Use when the user mentions or works on: mock data, demo data, test data, placeholder, 演示数据."
---

# Generate Mock Data - 演示数据生成器

## 触发条件
**关键词:** mock data, demo data, test data, sample data, 演示数据, 测试数据

## 占位图片 API

### 1. Picsum Photos (风景/物品)
```javascript
// 基础用法
'https://picsum.photos/400/300'

// 指定随机种子(确保相同ID返回相同图片)
'https://picsum.photos/400/300?random=1'

// 常用尺寸配置
const PLACEHOLDER_IMAGES = {
  avatar: (id) => `https://picsum.photos/200/200?random=avatar_${id}`,
  cover: (id) => `https://picsum.photos/750/400?random=cover_${id}`,
  thumbnail: (id) => `https://picsum.photos/300/300?random=thumb_${id}`,
  banner: (id) => `https://picsum.photos/750/300?random=banner_${id}`,
  product: (id) => `https://picsum.photos/400/400?random=product_${id}`
};
```

### 2. Pravatar (真实人物头像)
```javascript
// 70+ 真实人物头像
'https://i.pravatar.cc/150?img=12'  // img 范围: 1-70

// 不同尺寸
const sizes = [100, 150, 200, 300];
sizes.map(size => `https://i.pravatar.cc/${size}?img=25`);
```

### 3. UI Avatars (文字头像)
```javascript
// 中文名字生成头像
const generateAvatar = (name) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=200&background=667eea&color=fff&bold=true`;
};

// 使用
generateAvatar('张三'); // 显示 "张三" 的文字头像
```

## 数据生成模板

### 用户列表
```javascript
const CHINESE_NAMES = [
  '张伟', '王芳', '李娜', '刘洋', '陈静',
  '杨磊', '赵敏', '黄强', '周杰', '吴秀英',
  '徐鹏', '孙丽', '马超', '朱婷', '胡军'
];

const mockUsers = Array.from({length: 20}, (_, i) => ({
  id: i + 1,
  name: CHINESE_NAMES[i % CHINESE_NAMES.length],
  avatar: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`,
  bio: '这是一段个人简介,介绍用户的基本情况...',
  city: ['北京', '上海', '广州', '深圳', '杭州'][i % 5],
  followers: Math.floor(Math.random() * 10000),
  following: Math.floor(Math.random() * 1000),
  posts_count: Math.floor(Math.random() * 100),
  created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
}));
```

### 内容/文章列表
```javascript
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
  cover: `https://picsum.photos/750/400?random=post_${i}`,
  author: {
    name: CHINESE_NAMES[i % CHINESE_NAMES.length],
    avatar: `https://i.pravatar.cc/100?img=${(i % 20) + 1}`
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
```

### 商品列表
```javascript
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
  image: `https://picsum.photos/400/400?random=product_${i}`,
  images: Array.from({length: 4}, (_, j) => 
    `https://picsum.photos/400/400?random=product_${i}_${j}`
  ),
  thumbnail: `https://picsum.photos/200/200?random=thumb_${i}`,
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
```

### 订单列表
```javascript
const mockOrders = Array.from({length: 15}, (_, i) => ({
  id: i + 1,
  order_no: `2024${String(Date.now()).slice(-10)}${String(i).padStart(4, '0')}`,
  product: {
    name: PRODUCT_NAMES[i % PRODUCT_NAMES.length],
    image: `https://picsum.photos/200/200?random=order_${i}`,
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
```

### 评论列表
```javascript
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
    avatar: `https://i.pravatar.cc/100?img=${(i % 30) + 1}`
  },
  content: COMMENT_CONTENTS[i % COMMENT_CONTENTS.length],
  rating: Math.floor(Math.random() * 2) + 4, // 4-5星
  images: Array.from({length: Math.floor(Math.random() * 4)}, (_, j) => 
    `https://picsum.photos/300/300?random=comment_${i}_${j}`
  ),
  like_count: Math.floor(Math.random() * 100),
  reply_count: Math.floor(Math.random() * 10),
  created_at: new Date(Date.now() - i * 60 * 60 * 1000).toISOString()
}));
```

## 工具函数

### 随机日期生成
```javascript
// 生成指定范围内的随机日期
function randomDate(daysAgo = 30) {
  const now = Date.now();
  const randomTime = Math.random() * daysAgo * 24 * 60 * 60 * 1000;
  return new Date(now - randomTime).toISOString();
}
```

### 随机选择
```javascript
function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// 使用
const city = randomChoice(['北京', '上海', '广州', '深圳']);
```

### 生成唯一ID
```javascript
function generateId(prefix = 'ID') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
```

## 检查清单
- [ ] 是否使用了占位图 API
- [ ] 图片 URL 是否包含随机种子
- [ ] 是否使用了真实的中文场景数据
- [ ] 数据结构是否符合实际业务需求
- [ ] 是否添加了适当的随机性
- [ ] 日期是否使用 ISO 格式
- [ ] 价格是否保留两位小数