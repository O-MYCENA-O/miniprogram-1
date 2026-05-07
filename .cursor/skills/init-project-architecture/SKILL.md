---
name: init-project-architecture
description: "Initializes WeChat Mini Program global architecture with custom navigation bar calculations. Use when the user mentions or works on: new project, create miniprogram, initialize, scaffold project."
---

# Project Architecture Initialization

## 触发条件
**关键词:** new project, init, scaffold, create miniprogram, start app

## 核心功能
自动搭建微信小程序全局架构,包含自定义导航栏计算

## 实现要点

### 1. app.js - 导航栏高度计算
```javascript
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
```

### 2. app.json - 全局配置
```json
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
```

### 3. 目录结构
```
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
```

### 4. app.wxss - 全局样式
```css
page {
  background-color: var(--bg-page);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
}

/* 引入设计令牌 */
@import "styles/design-tokens.wxss";
```

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
- [ ] 是否添加了 design-tokens.wxss