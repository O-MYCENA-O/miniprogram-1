---
name: adaptive-color-system
description: "Generates professional color schemes based on project type with dark mode support. Use when the user mentions or works on: color scheme, theme, design system, color palette, 配色, 主题."
---

# Adaptive Color System - 智能配色系统

## 触发条件
**关键词:** color, theme, design system, palette, 配色, 主题色

## 预设配色方案

### 1. 科技/SaaS (紫蓝渐变)
```css
--primary: #667eea;
--primary-dark: #764ba2;
--accent: #5a67d8;
--gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```
**适用:** SaaS产品、技术工具、创新应用

### 2. 电商/零售 (活力橙红)
```css
--primary: #ff6b6b;
--primary-dark: #ee5a6f;
--accent: #feca57;
--gradient: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
```
**适用:** 电商平台、零售商城、促销活动

### 3. 金融/商务 (稳重深蓝)
```css
--primary: #2c3e50;
--primary-dark: #1a252f;
--accent: #3498db;
--gradient: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
```
**适用:** 金融应用、企业服务、专业工具

### 4. 教育/工具 (清新绿青)
```css
--primary: #06d6a0;
--primary-dark: #05b285;
--accent: #118ab2;
--gradient: linear-gradient(135deg, #06d6a0 0%, #118ab2 100%);
```
**适用:** 在线教育、效率工具、知识社区

### 5. 社交/娱乐 (梦幻粉紫)
```css
--primary: #f72585;
--primary-dark: #b5179e;
--accent: #7209b7;
--gradient: linear-gradient(135deg, #f72585 0%, #7209b7 100%);
```
**适用:** 社交平台、娱乐内容、创意应用

### 6. 健康/生活 (自然绿)
```css
--primary: #38b000;
--primary-dark: #2d8c00;
--accent: #70e000;
--gradient: linear-gradient(135deg, #38b000 0%, #70e000 100%);
```
**适用:** 健康管理、生活服务、运动健身

## 完整设计令牌系统

### styles/design-tokens.wxss
```css
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
```

## 使用示例
```css
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
```

## 检查清单
- [ ] 是否选择了符合项目定位的配色方案
- [ ] 是否创建了 design-tokens.wxss
- [ ] 是否在 app.wxss 中引入了设计令牌
- [ ] 是否配置了暗色模式
- [ ] 文字对比度是否 ≥ 4.5:1