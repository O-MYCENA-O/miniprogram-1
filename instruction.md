# instruction.md

1. 角色设定
    定位：经验丰富的高级 UI/UX 设计工程师 & 全栈小程序开发专家。

    风格哲学：极简主义 (Minimalism)。拒绝 Boilerplate 设计，强调间距（Whitespace）的节奏感、文字排版（Typography）的优先级以及交互的确定性。

    技术栈：微信小程序原生框架 (TS + Sass)。

2. 项目上下文
    你已置身于项目中，请直接根据逻辑修改或新增文件。

    不要生成项目目录结构，仅输出具体代码块。

    遵循小程序的性能最佳实践（减少 setData 频率，使用组件化思维）。

3. 页面需求：单页面任务流导航仪 (The Flow)
    我需要一个高度可定制的、线性逻辑的晨间流程页面。

    A. 视觉规范 (Visual Identity)
    色彩系统：基于 CSS 变量定义。采用柔和、低饱和度的温润色调，营造舒适、自然且无压迫感的清晨视觉体验：

    背景色：#F5F3E9（温暖的纸质感米白，模拟实体印刷书页）

    文本主色：#2C2A29（温和的深炭褐，替代刺眼的纯黑）

    动作强调色：#8A9A86（低饱和度的鼠尾草绿）或 #C87D55（温润的哑光陶土橙）

    排版：

    标题：使用巨大的非对称字号，字间距（letter-spacing）稍微收缩，营造印刷感。

    正文：字间距适中，行高（line-height）设为 1.6 以保证阅读舒适度。

    元素：无圆角（或极小圆角）、细线条（1rpx）、禁止使用任何形式的投影（Drop Shadow）。

    B. 核心功能逻辑
    线性状态机 (Linear State Machine)：

    页面通过一个 status 变量控制。

    任务必须按顺序完成，当前任务未达成前，下一个任务处于“隐藏”或“锁定”态。

    动态动作触发器 (Action Trigger)：

    每个步骤支持定义不同的交互：Link（跳转其他小程序）、Scan（扫码校验）、Timer（倒计时约束）、Check（普通确认）。

    配置驱动 UI (Data-Driven)：

    在 index.ts 中维护一个 tasks 数组对象。修改此数组即可改变流程，无需重构 UI 代码。

    C. 交互细节
    状态切换动画：使用 wx.createAnimation 或 CSS Transition 实现平滑的位移和透明度切换。

    振动反馈：关键动作触发时，调用 wx.vibrateShort 提供触感确认。

4. 任务清单 (Tasks for Cursor)
    Step 1: 在 styles/variables.scss 中定义上述温润、舒适的全局视觉变量。

    Step 2: 在 index.ts 中构建任务状态机逻辑，包含 nextStep() 和 resetFlow() 函数。

    Step 3: 编写 index.wxml，要求支持条件渲染（wx:if），根据当前 currentTask 展示对应的操作卡片。

    Step 4: 编写 index.scss，实现上述柔和印刷感视觉风格。
