import { applyTaskCompletion, flowTasksWithInitialStatuses, type FlowTask } from './flowModel'
import { DEFAULT_PAGE_TITLE, readConfigVibrate, readPageTitle, readSnapshot } from '../../utils/storage'
import { triggerVibrate } from '../../utils/vibrate'

type TimerHandle = ReturnType<typeof setInterval>

Page({
  data: {
    /** 首页主标题（与管理页「流程名称」同步） */
    pageTitle: DEFAULT_PAGE_TITLE,
    tasks: [] as FlowTask[],
    flowCompleted: false,
    /** 当前正在倒计时的任务 id；空字符串表示无 */
    timerTaskId: '',
    timerRemaining: 0,
    timerTicking: false,
    /** 与 storage.savedAt 对齐，用于检测管理页是否写入 */
    lastSyncedAt: -1,
    /** 与本地 config_vibrate 同步，仅作展示/一致性（实际震动以 triggerVibrate 内读缓存为准） */
    configVibrate: false,
  },

  _timerHandle: null as TimerHandle | null,

  onLoad() {
    this.syncPageTitleFromStorage()
    this.syncVibrateConfigFromStorage()
    this.syncTasksFromStorage()
  },

  syncVibrateConfigFromStorage() {
    const configVibrate = readConfigVibrate()
    if (configVibrate !== this.data.configVibrate) {
      this.setData({ configVibrate })
    }
  },

  onShow() {
    this.syncPageTitleFromStorage()
    this.syncVibrateConfigFromStorage()
    this.syncTasksFromStorage()
  },

  syncPageTitleFromStorage() {
    const pageTitle = readPageTitle()
    if (pageTitle !== this.data.pageTitle) {
      this.setData({ pageTitle })
    }
  },

  syncTasksFromStorage() {
    const snap = readSnapshot()
    if (snap.savedAt === this.data.lastSyncedAt) return

    this.clearCountdown()
    this.setData({
      tasks: flowTasksWithInitialStatuses(snap.tasks),
      flowCompleted: false,
      timerTaskId: '',
      timerRemaining: 0,
      timerTicking: false,
      lastSyncedAt: snap.savedAt,
    })
  },

  goManage() {
    triggerVibrate({ type: 'light' })
    wx.navigateTo({ url: '/pages/manage/manage' })
  },

  onUnload() {
    this.clearCountdown()
  },

  clearCountdown() {
    if (this._timerHandle !== null) {
      clearInterval(this._timerHandle)
      this._timerHandle = null
    }
  },

  /**
   * 完成指定任务：置为 finished，下一项 active；线性顺序由 flowModel 保证。
   */
  handleComplete(id: string) {
    const tasks = this.data.tasks
    const task = tasks.find((t) => t.id === id)
    if (!task || task.status !== 'active') return

    if (task.type === 'timer') {
      if (this.data.timerTaskId !== id) return
      if (this.data.timerTicking) return
      if (this.data.timerRemaining !== 0) return
    }

    const result = applyTaskCompletion(tasks, id)
    if (!result) return

    this.clearCountdown()
    triggerVibrate({ type: 'medium' })

    this.setData({
      tasks: result.tasks,
      flowCompleted: result.flowCompleted,
      timerTaskId: '',
      timerRemaining: 0,
      timerTicking: false,
    })
  },

  onDefaultComplete(e: WechatMiniprogram.TouchEvent) {
    const id = String(e.currentTarget.dataset.id || '')
    if (!id) return
    this.handleComplete(id)
  },

  /** timer：首次点击开始倒计时，按钮文案同步剩余秒数；结束后自动完成 */
  onTimerButtonTap(e: WechatMiniprogram.TouchEvent) {
    const id = String(e.currentTarget.dataset.id || '')
    if (!id) return

    const task = this.data.tasks.find((t) => t.id === id)
    if (!task || task.type !== 'timer' || task.status !== 'active') return

    if (this.data.timerTicking) return

    const total = Math.max(1, Math.floor(task.duration || 10))
    if (this.data.timerRemaining === 0) {
      this.startCountdown(id, total)
    }
  },

  startCountdown(id: string, seconds: number) {
    this.clearCountdown()
    triggerVibrate({ type: 'light' })

    this.setData({
      timerTaskId: id,
      timerRemaining: seconds,
      timerTicking: true,
    })

    this._timerHandle = setInterval(() => {
      const remain = this.data.timerRemaining - 1
      if (remain <= 0) {
        this.clearCountdown()
        this.setData(
          {
            timerRemaining: 0,
            timerTicking: false,
          },
          () => {
            triggerVibrate({ type: 'heavy' })
            this.handleComplete(id)
          },
        )
        return
      }
      this.setData({ timerRemaining: remain })
    }, 1000)
  },

  onLinkTap(e: WechatMiniprogram.TouchEvent) {
    const id = String(e.currentTarget.dataset.id || '')
    if (!id) return

    const task = this.data.tasks.find((t) => t.id === id)
    if (!task || task.type !== 'link' || task.status !== 'active') return

    const appId = task.linkAppId || 'wx0000000000000000'
    const path = task.linkPath || 'pages/index/index'

    wx.navigateToMiniProgram({
      appId,
      path,
      envVersion: 'release',
      fail: () => {
        wx.showToast({
          title: '跳转失败（请替换占位 AppId）',
          icon: 'none',
        })
      },
      success: () => {
        triggerVibrate({ type: 'light' })
        this.handleComplete(id)
      },
    })
  },

  resetFlow() {
    this.clearCountdown()
    triggerVibrate({ type: 'light' })
    const snap = readSnapshot()
    this.setData({
      tasks: flowTasksWithInitialStatuses(snap.tasks),
      flowCompleted: false,
      timerTaskId: '',
      timerRemaining: 0,
      timerTicking: false,
      lastSyncedAt: snap.savedAt,
    })
  },
})
