---
name: performance-optimizer
description: "Analyzes and fixes performance issues including setData optimization and list virtualization. Use when the user mentions or works on: slow, laggy, performance, optimize, freeze, 卡顿, 优化."
---

# Performance Optimizer - 性能优化器

## 触发条件
**关键词:** slow, lag, freeze, performance, optimize, 卡顿, 慢, 优化

## 常见问题与解决方案

### 1. setData 频繁调用

#### ❌ 问题
```javascript
for (let i = 0; i < 100; i++) {
  this.setData({[`items[${i}]`]: data[i]});
}
```

#### ✅ 解决
```javascript
const updates = {};
for (let i = 0; i < 100; i++) {
  updates[`items[${i}]`] = data[i];
}
this.setData(updates);
```

### 2. setData 数据量过大

#### ❌ 问题
```javascript
this.setData({items: this.data.items});
```

#### ✅ 解决
```javascript
// 使用精确路径
this.setData({'items[5].liked': true});
```

### 3. 长列表未虚拟滚动

#### ✅ 解决
```xml
<scroll-view 
  scroll-y 
  type="list"
  enable-flex
  enhanced>
  <view wx:for="{{items}}" wx:key="id">{{item.title}}</view>
</scroll-view>
```

### 4. 图片未优化

#### ✅ 解决
```xml
<image 
  src="{{url}}" 
  lazy-load 
  webp 
  mode="aspectFill">
</image>
```

### 5. 防抖节流

```javascript
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
```

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
- [ ] 是否开启分页加载