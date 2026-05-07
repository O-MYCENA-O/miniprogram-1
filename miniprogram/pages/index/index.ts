import {
  applyTaskCompletion,
  flowTasksAllFinished,
  flowTasksWithInitialStatuses,
  type FlowTask,
} from './flowModel'
import {
  DEFAULT_PAGE_TITLE,
  clearFirstStepScanOk,
  clearFlowCompletedPeriod,
  readBgMusicEnabled,
  readFirstStepScanOk,
  readFlowCompletedPeriod,
  readFlowStartScanConfig,
  readPageTitle,
  readSnapshot,
  saveFirstStepScanOk,
  saveFlowCompletedPeriod,
} from '../../utils/storage'
import { triggerVibrate } from '../../utils/vibrate'

type TimerHandle = ReturnType<typeof setInterval>
type ClockHandle = ReturnType<typeof setInterval>
type ConfettiTimerHandle = ReturnType<typeof setTimeout>

interface ConfettiPiece {
  id: number
  left: number
  delay: number
  duration: number
  color: string
}

function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`
}

function formatClock(now: Date): { clockTime: string; clockDate: string } {
  const weeks = ['日', '一', '二', '三', '四', '五', '六']
  const y = now.getFullYear()
  const mo = now.getMonth() + 1
  const d = now.getDate()
  const clockDate = `${y}年${mo}月${d}日 · 周${weeks[now.getDay()]}`
  const clockTime = `${pad2(now.getHours())}:${pad2(now.getMinutes())}:${pad2(now.getSeconds())}`
  return { clockTime, clockDate }
}

function getLast5AM(timestamp: number): number {
  const date = new Date(timestamp)
  const today5 = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 5, 0, 0, 0).getTime()
  return timestamp >= today5 ? today5 : today5 - 24 * 60 * 60 * 1000
}

/** 包内背景音乐候选（随机播放）；按需放入 miniprogram/audio/ 目录 */
const BGM_TRACK_POOL = [
  '/audio/bgm1.mp3',
  '/audio/bgm2.mp3',
  '/audio/bgm3.mp3',
  '/audio/bgm4.mp3',
  '/audio/bgm5.mp3',
  '/audio/bgm6.mp3',
  '/audio/bgm7.mp3',
  '/audio/bgm8.mp3',
  '/audio/bgm9.mp3',
  '/audio/bgm10.mp3',
  '/audio/bgm11.mp3',
  '/audio/bgm12.mp3',
  '/audio/bgm13.mp3',
  '/audio/bgm14.mp3',
  '/audio/bgm15.mp3',
  '/audio/bgm16.mp3',
  '/audio/bgm17.mp3',
  '/audio/bgm18.mp3',
  '/audio/bgm19.mp3',
]

function pickRandomBgmSrc(exclude?: string): string {
  const pool = BGM_TRACK_POOL
  if (pool.length === 0) return '/audio/bgm1.mp3'
  if (pool.length === 1) return pool[0]!
  let pick = pool[Math.floor(Math.random() * pool.length)]!
  let tries = 0
  while (exclude && pick === exclude && tries < 12) {
    pick = pool[Math.floor(Math.random() * pool.length)]!
    tries += 1
  }
  return pick
}

function scanResultMatches(expectedToken: string, rawResult: string): boolean {
  const r = (rawResult || '').trim()
  if (!r) return false
  const t = expectedToken.trim()
  if (!t) return true
  return r === t || r.includes(t)
}

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
    clockTime: '--:--:--',
    clockDate: '',
    showConfetti: false,
    confettiPieces: [] as ConfettiPiece[],
    /** 管理页开启「扫码启动」且当前在第一项 */
    startScanEnabled: false,
    /** 已通过扫码或与第一项无关时为 true */
    firstStepScanUnlocked: true,
  },

  _timerHandle: null as TimerHandle | null,
  _clockHandle: null as ClockHandle | null,
  _confettiTimer: null as ConfettiTimerHandle | null,
  _bgm: null as WechatMiniprogram.InnerAudioContext | null,

  onLoad() {
    this.tickClock()
    this.syncPageTitleFromStorage()
    this.syncTasksFromStorage()
    this.startClock()
    this.ensureBgmContext()
  },

  onShow() {
    this.tickClock()
    this.syncPageTitleFromStorage()
    this.syncTasksFromStorage()
    this.startClock()
    this.syncBgMusicPlayback()
  },

  onHide() {
    this.stopClock()
    this.pauseBgMusic()
  },

  ensureBgmContext() {
    if (this._bgm) return
    const ctx = wx.createInnerAudioContext()
    ctx.loop = false
    ctx.volume = 0.35
    ctx.obeyMuteSwitch = true
    ctx.onEnded(() => {
      if (!readBgMusicEnabled() || !this._bgm) return
      const prev = this._bgm.src || ''
      const next = pickRandomBgmSrc(prev)
      this._bgm.src = next
      try {
        this._bgm.play()
      } catch (e) {
        console.warn('[bgm] next track play failed', e)
      }
    })
    ctx.onError((err) => {
      console.warn('[bgm] play error', err)
    })
    this._bgm = ctx
  },

  syncBgMusicPlayback() {
    if (!readBgMusicEnabled()) {
      this.pauseBgMusic()
      return
    }
    this.ensureBgmContext()
    const ctx = this._bgm
    if (!ctx) return
    try {
      if (!ctx.src) {
        ctx.src = pickRandomBgmSrc()
      }
      ctx.play()
    } catch (e) {
      console.warn('[bgm] play failed', e)
    }
  },

  pauseBgMusic() {
    if (this._bgm) {
      try {
        this._bgm.pause()
      } catch {
        // ignore
      }
    }
  },

  tickClock() {
    const { clockTime, clockDate } = formatClock(new Date())
    if (clockTime === this.data.clockTime && clockDate === this.data.clockDate) return
    this.setData({ clockTime, clockDate })
  },

  startClock() {
    if (this._clockHandle !== null) return
    this._clockHandle = setInterval(() => {
      this.tickClock()
    }, 1000)
  },

  stopClock() {
    if (this._clockHandle !== null) {
      clearInterval(this._clockHandle)
      this._clockHandle = null
    }
  },

  syncPageTitleFromStorage() {
    const pageTitle = readPageTitle()
    if (pageTitle !== this.data.pageTitle) {
      this.setData({ pageTitle })
    }
  },

  recomputeScanGate() {
    const cfg = readFlowStartScanConfig()
    const { tasks, flowCompleted } = this.data
    const ai = tasks.findIndex((t) => t.status === 'active')
    const needGate = cfg.enabled && ai === 0 && !flowCompleted
    const unlocked = !needGate || readFirstStepScanOk()
    this.setData({
      startScanEnabled: cfg.enabled,
      firstStepScanUnlocked: unlocked,
    })
  },

  syncTasksFromStorage() {
    const now = Date.now()
    const lastResetTime = Number(wx.getStorageSync('last_reset_time')) || 0
    const resetBoundary = getLast5AM(now)
    const snap = readSnapshot()
    const completedPeriod = readFlowCompletedPeriod()

    if (lastResetTime < resetBoundary) {
      try {
        wx.setStorageSync('last_reset_time', resetBoundary)
      } catch {
        // ignore storage failure
      }
      clearFlowCompletedPeriod()
      clearFirstStepScanOk()
      this.clearCountdown()
      this.setData(
        {
          tasks: flowTasksWithInitialStatuses(snap.tasks),
          flowCompleted: false,
          timerTaskId: '',
          timerRemaining: 0,
          timerTicking: false,
          lastSyncedAt: snap.savedAt,
        },
        () => this.recomputeScanGate(),
      )
      return
    }

    if (completedPeriod === resetBoundary) {
      if (snap.savedAt === this.data.lastSyncedAt && this.data.flowCompleted) {
        this.recomputeScanGate()
        return
      }
      this.clearCountdown()
      this.setData(
        {
          tasks: flowTasksAllFinished(snap.tasks),
          flowCompleted: true,
          timerTaskId: '',
          timerRemaining: 0,
          timerTicking: false,
          lastSyncedAt: snap.savedAt,
        },
        () => this.recomputeScanGate(),
      )
      return
    }

    if (snap.savedAt === this.data.lastSyncedAt) {
      this.recomputeScanGate()
      return
    }

    this.clearCountdown()
    this.setData(
      {
        tasks: flowTasksWithInitialStatuses(snap.tasks),
        flowCompleted: false,
        timerTaskId: '',
        timerRemaining: 0,
        timerTicking: false,
        lastSyncedAt: snap.savedAt,
      },
      () => this.recomputeScanGate(),
    )
  },

  goManage() {
    wx.navigateTo({ url: '/pages/manage/manage' })
  },

  onUnload() {
    this.clearCountdown()
    this.stopClock()
    if (this._confettiTimer !== null) {
      clearTimeout(this._confettiTimer)
      this._confettiTimer = null
    }
    if (this._bgm) {
      try {
        this._bgm.stop()
        this._bgm.destroy()
      } catch {
        // ignore
      }
      this._bgm = null
    }
  },

  catchTouchMove() {},

  playConfetti() {
    if (this._confettiTimer !== null) {
      clearTimeout(this._confettiTimer)
      this._confettiTimer = null
    }
    const colors = ['#869d96', '#a3b8b1', '#c87d55', '#7d948c', '#d4a582', '#9aa89f']
    const pieces: ConfettiPiece[] = Array.from({ length: 42 }, (_, id) => ({
      id,
      left: Math.round(Math.random() * 92 + 4),
      delay: Math.round(Math.random() * 450) / 1000,
      duration: Math.round(4200 + Math.random() * 1600) / 1000,
      color: colors[id % colors.length]!,
    }))
    this.setData({ showConfetti: true, confettiPieces: pieces })
    this._confettiTimer = setTimeout(() => {
      this._confettiTimer = null
      this.setData({ showConfetti: false, confettiPieces: [] })
    }, 6600)
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
    const ai0 = tasks.findIndex((t) => t.status === 'active')
    if (
      ai0 === 0 &&
      this.data.startScanEnabled &&
      !this.data.flowCompleted &&
      !this.data.firstStepScanUnlocked
    ) {
      return
    }

    const task = tasks.find((t) => t.id === id)
    if (!task || task.status !== 'active') return

    if (task.type === 'timer') {
      if (this.data.timerTaskId !== id) return
      if (this.data.timerTicking) return
      if (this.data.timerRemaining !== 0) return
    }

    const fromIdx = tasks.findIndex((t) => t.id === id)
    const result = applyTaskCompletion(tasks, id)
    if (!result) return

    if (fromIdx === 0) {
      clearFirstStepScanOk()
    }

    this.clearCountdown()
    triggerVibrate({ type: 'medium' })

    if (result.flowCompleted) {
      saveFlowCompletedPeriod(getLast5AM(Date.now()))
    }

    this.setData(
      {
        tasks: result.tasks,
        flowCompleted: result.flowCompleted,
        timerTaskId: '',
        timerRemaining: 0,
        timerTicking: false,
      },
      () => {
        this.recomputeScanGate()
        if (result.flowCompleted) {
          this.playConfetti()
        }
      },
    )
  },

  onScanUnlockFirstStep() {
    const cfg = readFlowStartScanConfig()
    if (!cfg.enabled) return
    const tasks = this.data.tasks
    const ai = tasks.findIndex((t) => t.status === 'active')
    if (ai !== 0 || this.data.flowCompleted) return

    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['qrCode', 'barCode'],
      success: (res) => {
        const raw = typeof res.result === 'string' ? res.result : ''
        if (!scanResultMatches(cfg.token, raw)) {
          wx.showToast({ title: '与校验码不一致', icon: 'none', duration: 1600 })
          return
        }
        saveFirstStepScanOk()
        triggerVibrate({ type: 'medium' })
        wx.showToast({ title: '已开启流程', icon: 'success', duration: 900 })
        this.setData({ firstStepScanUnlocked: true })
      },
      fail: (err) => {
        const msg = err && err.errMsg ? String(err.errMsg) : ''
        if (msg.indexOf('cancel') !== -1 || msg.indexOf('取消') !== -1) return
        wx.showToast({ title: '扫码失败', icon: 'none' })
      },
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

    const ai = this.data.tasks.findIndex((t) => t.status === 'active')
    if (
      this.data.startScanEnabled &&
      ai === 0 &&
      !this.data.flowCompleted &&
      !this.data.firstStepScanUnlocked
    ) {
      return
    }

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

    const ai = this.data.tasks.findIndex((t) => t.status === 'active')
    if (
      this.data.startScanEnabled &&
      ai === 0 &&
      !this.data.flowCompleted &&
      !this.data.firstStepScanUnlocked
    ) {
      return
    }

    const appId = task.linkAppId || 'wx0000000000000000'
    const path = task.linkPath || 'pages/index/index'

    wx.navigateToMiniProgram({
      appId,
      path,
      envVersion: 'release',
      success: () => {
        triggerVibrate({ type: 'light' })
        this.handleComplete(id)
      },
      fail: () => {
        // 用户取消跳转或跳转失败时也完成任务
        triggerVibrate({ type: 'light' })
        this.handleComplete(id)
        wx.showToast({
          title: '任务已完成',
          icon: 'success',
          duration: 900,
        })
      },
    })
  },

  onResetFlowTap() {
    wx.showModal({
      title: '重新开始',
      content: '确定要从第一项重新执行流程吗？当前进度将被清空。',
      confirmText: '重新开始',
      cancelText: '取消',
      confirmColor: '#869D96',
      success: (res) => {
        if (!res.confirm) return
        this.performResetFlow()
      },
    })
  },

  performResetFlow() {
    this.clearCountdown()
    clearFlowCompletedPeriod()
    clearFirstStepScanOk()
    triggerVibrate({ type: 'light' })
    const snap = readSnapshot()
    this.setData(
      {
        tasks: flowTasksWithInitialStatuses(snap.tasks),
        flowCompleted: false,
        timerTaskId: '',
        timerRemaining: 0,
        timerTicking: false,
        lastSyncedAt: snap.savedAt,
      },
      () => this.recomputeScanGate(),
    )
  },
})
