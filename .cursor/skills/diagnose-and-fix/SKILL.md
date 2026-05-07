---
name: diagnose-and-fix
description: "Intelligently diagnoses errors and provides targeted fixes. Use when the user mentions or works on: error, bug, not working, broken, 报错, 错误."
---

# Intelligent Error Diagnosis - 智能错误诊断

## 触发条件
**关键词:** error, bug, not working, broken, crash, 报错, 不工作

## 常见错误诊断

### 1. scroll-view 无法滚动

#### 诊断
- 是否设置固定高度?
- 是否有 scroll-y 属性?
- 是否有 enhanced 属性?

#### 修复
```xml
<scroll-view 
  class="scroll" 
  scroll-y 
  enhanced 
  show-scrollbar="{{false}}"
  style="height: 100vh;">
  <view>Content</view>
</scroll-view>
```

### 2. 云函数权限错误

#### 错误信息
```
errCode: -1
errMsg: "no permission"
```

#### 修复
```json
// config.json
{
  "permissions": {
    "openapi": ["security.msgSecCheck"]
  }
}
```

### 3. 数据库权限错误

#### 修复
```json
{
  "read": "doc._openid == auth.openid",
  "write": "doc._openid == auth.openid"
}
```

### 4. 导航栏高度问题

#### 修复
```javascript
// app.js
const windowInfo = wx.getWindowInfo();
const menu = wx.getMenuButtonBoundingClientRect();
const navBarHeight = windowInfo.statusBarHeight + menu.height + (menu.top - windowInfo.statusBarHeight) * 2;
```

### 5. 图片加载失败

#### 修复
```xml
<image 
  src="{{url}}" 
  binderror="onImageError"
  mode="aspectFill">
</image>
```

```javascript
onImageError(e) {
  const index = e.currentTarget.dataset.index;
  this.setData({
    [`items[${index}].image`]: 'https://picsum.photos/400/300?random=error'
  });
}
```

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
- [ ] 图片是否有错误处理