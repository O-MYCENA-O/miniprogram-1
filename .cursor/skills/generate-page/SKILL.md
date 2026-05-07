---
name: generate-page
description: "Generates complete WeChat Mini Program pages with proper scroll-view usage, color schemes, and placeholder images. Use when the user mentions or works on: create page, add page, new page, build page, 创建页面."
---

# Smart Page Generator - 智能页面生成器

## 触发条件
**关键词:** create page, add page, new page, build page, 创建页面, 新建页面

## 导航栏策略 ⚠️ 重要

### 规则
```
首页 (index) → 自定义导航栏 (navigationStyle: "custom")
次级页面 (所有其他) → 默认导航栏 (navigationStyle: "default")
```

### 首页配置
```json
// pages/index/index.json
{
  "navigationStyle": "custom"
}
```

```xml
<!-- pages/index/index.wxml -->
<view style="height: {{navBarHeight}}px;"></view>
<custom-navbar title="首页" />

<scroll-view class="content" scroll-y enhanced show-scrollbar="{{false}}">
  <!-- 内容 -->
</scroll-view>
```

```css
/* pages/index/index.wxss */
.content {
  height: calc(100vh - {{navBarHeight}}px);
}
```

### 次级页面配置
```json
// pages/list/list.json
{
  "navigationBarTitleText": "列表页",
  "navigationBarBackgroundColor": "#ffffff"
}
```

```xml
<!-- pages/list/list.wxml -->
<!-- ❌ 不要添加导航栏占位 -->
<scroll-view class="page-scroll" scroll-y enhanced show-scrollbar="{{false}}">
  <!-- 内容 -->
</scroll-view>
```

```css
/* pages/list/list.wxss */
.page-scroll {
  height: 100vh; /* 直接使用 100vh */
}
```

## scroll-view 完整配置

### 标准列表页
```xml
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
```

```javascript
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
      url: `/pages/detail/detail?id=${id}`
    });
  }
});
```

### 表单页
```xml
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
```

## 样式规范(应用配色方案)

```css
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
```

## 占位图使用

```javascript
// 在 data 中使用占位图
data: {
  items: Array.from({length: 10}, (_, i) => ({
    id: i + 1,
    title: '示例标题',
    cover: `https://picsum.photos/400/300?random=${i}`,
    author: {
      avatar: `https://i.pravatar.cc/100?img=${i + 1}`
    }
  }))
}
```

## 图标规范 ⚠️

### 禁止使用文本 emoji
```xml
<!-- ❌ 错误 -->
<text>🔍 搜索</text>
<view>✅ 完成</view>

<!-- ✅ 正确 -->
<image class="icon" src="/images/icons/search.svg"></image>
<image class="icon" src="/images/icons/check.svg"></image>
```

### 推荐图标库结构
```
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
```

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
- [ ] 是否有空状态和加载状态