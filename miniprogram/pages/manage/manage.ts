import type { TaskPreset, TaskType } from '../index/flowModel'
import { syncBgMusicPlayback } from '../../utils/bgm'
import {
  createTaskId,
  readBgMusicEnabled,
  readConfigVibrate,
  readFlowStartScanConfig,
  readPageTitle,
  readSnapshot,
  saveBgMusicEnabled,
  saveConfigVibrate,
  saveFlowStartScanConfig,
  savePageTitle,
  saveTaskPresets,
} from '../../utils/storage'

type EditorKind = 'Standard' | 'Timer' | 'MiniProgram' | 'Scan' | ''

function kindToTaskType(kind: EditorKind): TaskType {
  if (kind === 'Timer') return 'timer'
  if (kind === 'MiniProgram') return 'link'
  if (kind === 'Scan') return 'scan'
  return 'default'
}

function taskTypeToKind(type: TaskType): EditorKind {
  if (type === 'timer') return 'Timer'
  if (type === 'link') return 'MiniProgram'
  if (type === 'scan') return 'Scan'
  return 'Standard'
}

const LONG_PRESS_MS = 420
const MOVE_SLOP_PX = 14
const DRAG_FLOAT_THROTTLE_MS = 24

function formatTokenPreview(token: string, maxLen = 44): string {
  const t = (token || '').trim()
  if (!t) return '尚未录入：任意有效扫码均可开启第一项'
  return t.length > maxLen ? `已录入：${t.slice(0, maxLen)}…` : `已录入：${t}`
}

function pickDropIndex(
  x: number,
  y: number,
  rects: WechatMiniprogram.BoundingClientRectCallbackResult[],
): number {
  if (!rects.length) return -1
  for (let i = 0; i < rects.length; i++) {
    const r = rects[i]
    if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
      return i
    }
  }
  let best = 0
  let bestD = Infinity
  for (let i = 0; i < rects.length; i++) {
    const r = rects[i]
    const cx = (r.left + r.right) / 2
    const cy = (r.top + r.bottom) / 2
    const d = (x - cx) * (x - cx) + (y - cy) * (y - cy)
    if (d < bestD) {
      bestD = d
      best = i
    }
  }
  return best
}

Page({
  data: {
    /** 与管理页输入框绑定，保存前草稿 */
    flowPageTitle: '',
    /** 与本地 config_vibrate 同步，绑定 switch */
    configVibrate: false,
    configBgMusic: false,
    taskList: [] as TaskPreset[],
    editorOpen: false,
    editorPhase: 1,
    editorKind: '' as EditorKind,
    formTitle: '',
    formDesc: '',
    formDuration: '10',
    formAppId: '',
    formPath: '',
    formVerifyCode: '',
    editingId: '',
    flowScanEnabled: false,
    flowScanToken: '',
    /** 口令预览（截断），与 flowScanToken 同步 */
    flowScanTokenPreview: '',
    dragging: false,
    draggingId: '',
    dragFloatX: 0,
    dragFloatY: 0,
    draggingTitle: '',
    draggingType: 'default' as TaskType,
  },

  _dragTouch: null as { startX: number; startY: number; index: number; id: string } | null,
  _longPressTimer: null as ReturnType<typeof setTimeout> | null,
  _lastFloatTs: 0,

  onLoad() {
    this.reloadList()
    this.syncFlowTitleDraft()
    this.syncVibrateSwitch()
    this.syncBgMusicSwitch()
    this.syncScanDraft()
  },

  onShow() {
    this.syncFlowTitleDraft()
    this.syncVibrateSwitch()
    this.syncBgMusicSwitch()
    this.syncScanDraft()
  },

  syncScanDraft() {
    const c = readFlowStartScanConfig()
    const token = (c.token || '').trim()
    this.setData({
      flowScanEnabled: c.enabled,
      flowScanToken: token,
      flowScanTokenPreview: formatTokenPreview(token),
    })
  },

  onFlowScanSwitch(e: WechatMiniprogram.SwitchChange) {
    const enabled = !!e.detail.value
    saveFlowStartScanConfig({ enabled, token: this.data.flowScanToken.trim() })
    this.setData({ flowScanEnabled: enabled })
    wx.showToast({ title: enabled ? '已开启扫码验证' : '已改为按钮开启', icon: 'none', duration: 900 })
  },

  onScanTokenIn() {
    if (!this.data.flowScanEnabled) return
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['qrCode', 'barCode'],
      success: (res) => {
        const raw = typeof res.result === 'string' ? res.result.trim() : ''
        if (!raw) {
          wx.showToast({ title: '未识别到内容', icon: 'none' })
          return
        }
        saveFlowStartScanConfig({ enabled: true, token: raw })
        this.syncScanDraft()
        if (readConfigVibrate()) {
          wx.vibrateShort({ type: 'light' })
        }
        wx.showToast({ title: '口令已保存', icon: 'success', duration: 900 })
      },
      fail: (err) => {
        const msg = err && err.errMsg ? String(err.errMsg) : ''
        if (msg.indexOf('cancel') !== -1 || msg.indexOf('取消') !== -1) return
        wx.showToast({ title: '扫码失败', icon: 'none' })
      },
    })
  },

  onClearScanToken() {
    if (!this.data.flowScanToken) return
    saveFlowStartScanConfig({
      enabled: this.data.flowScanEnabled,
      token: '',
    })
    this.syncScanDraft()
    wx.showToast({ title: '已清除口令', icon: 'none', duration: 900 })
  },

  reloadList() {
    const snap = readSnapshot()

    this.setData({
      taskList: snap.tasks,
    })
  },

  clearLongPressTimer() {
    if (this._longPressTimer !== null) {
      clearTimeout(this._longPressTimer)
      this._longPressTimer = null
    }
  },

  resetDragUi() {
    this.clearLongPressTimer()
    this._dragTouch = null
    this._lastFloatTs = 0
    if (!this.data.dragging) return
    this.setData({
      dragging: false,
      draggingId: '',
      draggingTitle: '',
      draggingType: 'default',
    })
  },

  onTileTouchStart(e: WechatMiniprogram.TouchEvent) {
    if (this.data.editorOpen) return
    const t = e.touches[0]
    if (!t) return
    const index = Number(e.currentTarget.dataset.index)
    const id = String(e.currentTarget.dataset.id || '')
    if (!Number.isFinite(index) || !id) return
    if (index === 0) return

    this.clearLongPressTimer()
    this._dragTouch = { startX: t.clientX, startY: t.clientY, index, id }
    this._longPressTimer = setTimeout(() => {
      this._longPressTimer = null
      const ctx = this._dragTouch
      if (!ctx || this.data.editorOpen) return
      const item = this.data.taskList[ctx.index]
      if (!item || item.id !== ctx.id) return
      if (readConfigVibrate()) {
        wx.vibrateShort({ type: 'medium' })
      }
      this.setData({
        dragging: true,
        draggingId: item.id,
        draggingTitle: item.title,
        draggingType: item.type,
        dragFloatX: ctx.startX,
        dragFloatY: ctx.startY,
      })
    }, LONG_PRESS_MS)
  },

  onTileTouchMove(e: WechatMiniprogram.TouchEvent) {
    const t = e.touches[0]
    if (!t || !this._dragTouch) return

    if (this.data.dragging) {
      const now = Date.now()
      if (now - this._lastFloatTs < DRAG_FLOAT_THROTTLE_MS) return
      this._lastFloatTs = now
      this.setData({
        dragFloatX: t.clientX,
        dragFloatY: t.clientY,
      })
      return
    }

    const dx = t.clientX - this._dragTouch.startX
    const dy = t.clientY - this._dragTouch.startY
    if (dx * dx + dy * dy > MOVE_SLOP_PX * MOVE_SLOP_PX) {
      this.clearLongPressTimer()
    }
  },

  onTileTouchEnd(e: WechatMiniprogram.TouchEvent) {
    this.clearLongPressTimer()

    if (!this.data.dragging) {
      this._dragTouch = null
      return
    }

    const touch = e.changedTouches[0]
    const fromIndex = this._dragTouch != null ? this._dragTouch.index : -1
    this._dragTouch = null
    this._lastFloatTs = 0

    if (!touch || fromIndex < 0) {
      this.resetDragUi()
      return
    }

    wx.createSelectorQuery()
      .in(this)
      .selectAll('.manage-card')
      .boundingClientRect()
      .exec((res) => {
        const rects = res[0] as WechatMiniprogram.BoundingClientRectCallbackResult[] | undefined
        if (!rects || rects.length === 0) {
          this.resetDragUi()
          return
        }

        const toIndex = pickDropIndex(touch.clientX, touch.clientY, rects)
        if (toIndex < 0 || fromIndex === toIndex) {
          this.setData({
            dragging: false,
            draggingId: '',
            draggingTitle: '',
            draggingType: 'default',
          })
          return
        }

        if (fromIndex === 0 || toIndex === 0) {
          wx.showToast({ title: '首项固定为开启任务', icon: 'none', duration: 1400 })
          this.setData({
            dragging: false,
            draggingId: '',
            draggingTitle: '',
            draggingType: 'default',
          })
          return
        }

        const list = this.data.taskList
        if (fromIndex >= list.length || toIndex >= list.length) {
          this.resetDragUi()
          return
        }

        const next = [...list]
        const [row] = next.splice(fromIndex, 1)
        next.splice(toIndex, 0, row)
        saveTaskPresets(next)
        this.setData({
          taskList: next,
          dragging: false,
          draggingId: '',
          draggingTitle: '',
          draggingType: 'default',
        })
      })
  },

  syncVibrateSwitch() {
    this.setData({ configVibrate: readConfigVibrate() })
  },

  syncBgMusicSwitch() {
    this.setData({ configBgMusic: readBgMusicEnabled() })
  },

  onVibrateSwitchChange(e: WechatMiniprogram.SwitchChange) {
    const enabled = !!e.detail.value
    saveConfigVibrate(enabled)
    this.setData({ configVibrate: enabled })
  },

  onBgMusicSwitchChange(e: WechatMiniprogram.SwitchChange) {
    const enabled = !!e.detail.value
    saveBgMusicEnabled(enabled)
    this.setData({ configBgMusic: enabled })
    syncBgMusicPlayback()
    wx.showToast({ title: enabled ? '已开始播放' : '已停止背景音乐', icon: 'none', duration: 900 })
  },

  syncFlowTitleDraft() {
    this.setData({ flowPageTitle: readPageTitle() })
  },

  onFlowTitleInput(e: WechatMiniprogram.Input) {
    this.setData({ flowPageTitle: e.detail.value })
  },

  onSaveFlowTitle() {
    const title = this.data.flowPageTitle.trim()
    if (!title) {
      wx.showToast({ title: '请填写流程名称', icon: 'none' })
      return
    }
    savePageTitle(title)
    wx.showToast({ title: '标题已保存', icon: 'success', duration: 900 })
  },

  onFormInput(e: WechatMiniprogram.Input) {
    const field = e.currentTarget.dataset.field
    if (!field) return
    this.setData({ [field]: e.detail.value } as any)
  },

  onAddTap() {
    this.resetDragUi()
    this.setData({
      editorOpen: true,
      editorPhase: 1,
      editorKind: '',
      formTitle: '',
      formDesc: '',
      formDuration: '10',
      formAppId: '',
      formPath: '',
      formVerifyCode: '',
      editingId: '',
    })
  },

  onEditTap(e: WechatMiniprogram.TouchEvent) {
    this.resetDragUi()
    const id = String(e.currentTarget.dataset.id || '')
    if (!id) return
    const task = this.data.taskList.find((t) => t.id === id)
    if (!task) return

    this.setData({
      editorOpen: true,
      editorPhase: 2,
      editorKind: taskTypeToKind(task.type),
      formTitle: task.title,
      formDesc: task.desc,
      formDuration: String(Math.max(1, task.duration || 10)),
      formAppId: task.linkAppId || '',
      formPath: task.linkPath || '',
      formVerifyCode: task.verifyCode || '',
      editingId: task.id,
    })
  },

  onDeleteTap(e: WechatMiniprogram.TouchEvent) {
    this.resetDragUi()
    const id = String(e.currentTarget.dataset.id || '')
    if (!id) return

    const idx = this.data.taskList.findIndex((t) => t.id === id)
    if (idx === 0) {
      wx.showToast({ title: '开启任务不可删除', icon: 'none', duration: 1200 })
      return
    }

    wx.showModal({
      title: '删除任务',
      content: '确定从流程中移除此任务？',
      confirmColor: '#869D96',
      success: (res) => {
        if (!res.confirm) return
        const next = this.data.taskList.filter((t) => t.id !== id)
        saveTaskPresets(next)
        this.reloadList()
      },
    })
  },

  onPickKind(e: WechatMiniprogram.TouchEvent) {
    const kind = e.currentTarget.dataset.kind as EditorKind
    if (!kind) return
    this.setData({ editorKind: kind, editorPhase: 2 })
  },

  onRepickKind() {
    this.setData({ editorPhase: 1, editorKind: '' })
  },

  /** 遮罩 catchtouchmove / 面板 catchtap：占位以阻断穿透，无需逻辑 */
  catchTouchMove() {},
  catchTap() {},

  closeEditor() {
    this.setData({
      editorOpen: false,
      editorPhase: 1,
      editorKind: '',
      editingId: '',
    })
  },

  onSaveEditor() {
    const title = this.data.formTitle.trim()
    if (!title) {
      wx.showToast({ title: '请填写标题', icon: 'none' })
      return
    }

    const kind = this.data.editorKind
    if (!kind) {
      wx.showToast({ title: '请先选择类型', icon: 'none' })
      return
    }

    const type = kindToTaskType(kind)
    const id = this.data.editingId || createTaskId()
    const desc = this.data.formDesc.trim()

    let duration = 0
    if (type === 'timer') {
      const parsed = parseInt(this.data.formDuration, 10)
      duration = Number.isFinite(parsed) && parsed > 0 ? parsed : 10
    }

    const preset: TaskPreset = {
      id,
      title,
      desc,
      type,
      duration,
    }

    if (type === 'link') {
      const appId = this.data.formAppId.trim()
      const path = this.data.formPath.trim()
      preset.linkAppId = appId || 'wx0000000000000000'
      preset.linkPath = path || 'pages/index/index'
    }

    if (type === 'scan') {
      preset.verifyCode = this.data.formVerifyCode.trim()
    }

    let nextList: TaskPreset[]
    if (this.data.editingId) {
      nextList = this.data.taskList.map((t) => (t.id === id ? preset : t))
    } else {
      nextList = [...this.data.taskList, preset]
    }

    saveTaskPresets(nextList)
    this.reloadList()
    wx.showToast({ title: '已保存', icon: 'success', duration: 900 })
    this.closeEditor()
  },
})
