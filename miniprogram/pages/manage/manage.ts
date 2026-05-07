import type { TaskPreset, TaskType } from '../index/flowModel'
import {
  createTaskId,
  readConfigVibrate,
  readPageTitle,
  readSnapshot,
  saveConfigVibrate,
  savePageTitle,
  saveTaskPresets,
} from '../../utils/storage'

type EditorKind = 'Standard' | 'Timer' | 'MiniProgram' | ''

function kindToTaskType(kind: EditorKind): TaskType {
  if (kind === 'Timer') return 'timer'
  if (kind === 'MiniProgram') return 'link'
  return 'default'
}

function taskTypeToKind(type: TaskType): EditorKind {
  if (type === 'timer') return 'Timer'
  if (type === 'link') return 'MiniProgram'
  return 'Standard'
}

Page({
  data: {
    /** 与管理页输入框绑定，保存前草稿 */
    flowPageTitle: '',
    /** 与本地 config_vibrate 同步，绑定 switch */
    configVibrate: false,
    taskList: [] as TaskPreset[],
    editorOpen: false,
    editorPhase: 1,
    editorKind: '' as EditorKind,
    formTitle: '',
    formDesc: '',
    formDuration: '60',
    formAppId: '',
    formPath: '',
    editingId: '',
  },

  onLoad() {
    this.reloadList()
    this.syncFlowTitleDraft()
    this.syncVibrateSwitch()
  },

  onShow() {
    this.syncFlowTitleDraft()
    this.syncVibrateSwitch()
  },

  syncVibrateSwitch() {
    this.setData({ configVibrate: readConfigVibrate() })
  },

  onVibrateSwitchChange(e: WechatMiniprogram.SwitchChange) {
    const enabled = !!e.detail.value
    saveConfigVibrate(enabled)
    this.setData({ configVibrate: enabled })
  },

  reloadList() {
    const snap = readSnapshot()
    this.setData({ taskList: snap.tasks })
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

  preventBubble() {
    // 阻止弹层内容点击冒泡到遮罩
  },

  /** 遮罩上阻止滚动穿透 */
  preventTouchMove() {},

  onAddTap() {
    this.setData({
      editorOpen: true,
      editorPhase: 1,
      editorKind: '',
      formTitle: '',
      formDesc: '',
      formDuration: '60',
      formAppId: '',
      formPath: '',
      editingId: '',
    })
  },

  onEditTap(e: WechatMiniprogram.TouchEvent) {
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
      editingId: task.id,
    })
  },

  onDeleteTap(e: WechatMiniprogram.TouchEvent) {
    const id = String(e.currentTarget.dataset.id || '')
    if (!id) return

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

  onTitleInput(e: WechatMiniprogram.Input) {
    this.setData({ formTitle: e.detail.value })
  },

  onDescInput(e: WechatMiniprogram.Input) {
    this.setData({ formDesc: e.detail.value })
  },

  onDurationInput(e: WechatMiniprogram.Input) {
    this.setData({ formDuration: e.detail.value })
  },

  onAppIdInput(e: WechatMiniprogram.Input) {
    this.setData({ formAppId: e.detail.value })
  },

  onPathInput(e: WechatMiniprogram.Input) {
    this.setData({ formPath: e.detail.value })
  },

  onMaskClose() {
    this.closeEditor()
  },

  onCancelEditor() {
    this.closeEditor()
  },

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
