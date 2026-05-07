/**
 * 本地任务配置存储：与 UI 解耦，负责读写与新旧格式合并。
 */

import { FLOW_TASK_PRESETS, type TaskPreset, type TaskType } from '../pages/index/flowModel'

const STORAGE_KEY = 'morning_routine_flow_tasks_v1'

/** 首页大标题：与任务列表分 Key 存储 */
export const PAGE_TITLE_STORAGE_KEY = 'morning_routine_page_title_v1'

export const DEFAULT_PAGE_TITLE = '线性任务流'

export interface TaskStorageSnapshot {
  tasks: TaskPreset[]
  /** 用于首页 onShow 判断是否需要刷新 */
  savedAt: number
}

function clonePresets(list: ReadonlyArray<TaskPreset>): TaskPreset[] {
  return list.map((item) => ({ ...item }))
}

function presetById(id: string): TaskPreset | undefined {
  return FLOW_TASK_PRESETS.find((p) => p.id === id)
}

function isTaskType(value: unknown): value is TaskType {
  return value === 'default' || value === 'timer' || value === 'link'
}

function coerceNumber(value: unknown, fallback: number): number {
  const n = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(n) ? n : fallback
}

/**
 * 将任意缓存条目规整为 TaskPreset，并与内置预设按 id 做字段合并（新旧数据融合）。
 */
export function normalizeTaskPreset(raw: unknown): TaskPreset | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  const id = typeof o.id === 'string' && o.id.trim() ? o.id.trim() : ''
  if (!id) return null

  const fallback = presetById(id)
  const titleIn = typeof o.title === 'string' ? o.title.trim() : ''
  const descIn = typeof o.desc === 'string' ? o.desc.trim() : ''
  const typeIn = isTaskType(o.type) ? o.type : undefined

  const baseType: TaskType = typeIn ?? fallback?.type ?? 'default'
  const baseDuration = coerceNumber(o.duration, fallback?.duration ?? 0)

  const merged: TaskPreset = {
    id,
    title: titleIn || fallback?.title || '未命名任务',
    desc: descIn || fallback?.desc || '',
    type: baseType,
    duration: baseType === 'timer' ? Math.max(1, Math.floor(baseDuration || 10)) : 0,
    linkAppId:
      typeof o.linkAppId === 'string' && o.linkAppId.trim()
        ? o.linkAppId.trim()
        : fallback?.linkAppId,
    linkPath:
      typeof o.linkPath === 'string' && o.linkPath.trim()
        ? o.linkPath.trim()
        : fallback?.linkPath,
  }

  if (merged.type !== 'link') {
    delete merged.linkAppId
    delete merged.linkPath
  }

  return merged
}

function normalizeTaskList(list: unknown): TaskPreset[] {
  if (!Array.isArray(list)) return []
  const mapped = list.map((item) => normalizeTaskPreset(item)).filter(Boolean) as TaskPreset[]
  const dedup = new Map<string, TaskPreset>()
  mapped.forEach((task) => {
    dedup.set(task.id, task)
  })
  return Array.from(dedup.values())
}

function readRawPayload(): unknown {
  try {
    const payload = wx.getStorageSync(STORAGE_KEY) as unknown
    if (payload != null && payload !== '') {
      return payload
    }
    return wx.getStorageSync('morning_tasks') as unknown
  } catch {
    return undefined
  }
}

/** 从未写入缓存时返回内置默认清单副本与 savedAt = 0 */
export function readSnapshot(): TaskStorageSnapshot {
  const raw = readRawPayload()

  if (raw == null || raw === '') {
    return { tasks: clonePresets(FLOW_TASK_PRESETS), savedAt: 0 }
  }

  // 旧版：纯数组
  if (Array.isArray(raw)) {
    const tasks = normalizeTaskList(raw)
    return {
      tasks: tasks.length > 0 ? tasks : clonePresets(FLOW_TASK_PRESETS),
      savedAt: 0,
    }
  }

  if (typeof raw === 'object') {
    const box = raw as Record<string, unknown>
    const tasksRaw = box.tasks
    const savedAt = coerceNumber(box.savedAt, 0)
    const tasks = normalizeTaskList(tasksRaw)
    return {
      tasks: tasks.length > 0 ? tasks : clonePresets(FLOW_TASK_PRESETS),
      savedAt,
    }
  }

  return { tasks: clonePresets(FLOW_TASK_PRESETS), savedAt: 0 }
}

/** 覆盖写入任务列表并更新时间戳（管理页保存时调用） */
export function saveTaskPresets(tasks: TaskPreset[]): void {
  const normalized = normalizeTaskList(tasks)
  const payload: TaskStorageSnapshot = {
    tasks: normalized.length > 0 ? normalized : clonePresets(FLOW_TASK_PRESETS),
    savedAt: Date.now(),
  }
  try {
    wx.setStorageSync(STORAGE_KEY, payload)
    clearFirstStepScanOk()
  } catch (e) {
    console.error('saveTaskPresets failed', e)
    wx.showToast({ title: '保存失败', icon: 'none' })
  }
}

/** 首页第一项：须扫码验证后方可操作（管理页配置） */
export const FLOW_START_SCAN_KEY = 'morning_routine_flow_start_scan_v1'

/** 当日/本轮已通过第一项扫码验证（任务列表或扫码设置变更时清除） */
export const FIRST_STEP_SCAN_OK_KEY = 'morning_routine_first_step_scan_ok_v1'

export interface FlowStartScanConfig {
  enabled: boolean
  token: string
}

export function readFlowStartScanConfig(): FlowStartScanConfig {
  try {
    const v = wx.getStorageSync(FLOW_START_SCAN_KEY) as unknown
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      const o = v as Record<string, unknown>
      return {
        enabled: o.enabled === true,
        token: typeof o.token === 'string' ? o.token.trim() : '',
      }
    }
  } catch {
    // ignore
  }
  return { enabled: false, token: '' }
}

export function saveFlowStartScanConfig(cfg: FlowStartScanConfig): void {
  const payload = {
    enabled: !!cfg.enabled,
    token: typeof cfg.token === 'string' ? cfg.token.trim() : '',
  }
  try {
    wx.setStorageSync(FLOW_START_SCAN_KEY, payload)
    clearFirstStepScanOk()
  } catch (e) {
    console.error('saveFlowStartScanConfig failed', e)
    wx.showToast({ title: '扫码设置保存失败', icon: 'none' })
  }
}

export function readFirstStepScanOk(): boolean {
  try {
    return wx.getStorageSync(FIRST_STEP_SCAN_OK_KEY) === true
  } catch {
    return false
  }
}

export function saveFirstStepScanOk(): void {
  try {
    wx.setStorageSync(FIRST_STEP_SCAN_OK_KEY, true)
  } catch (e) {
    console.error('saveFirstStepScanOk failed', e)
  }
}

export function clearFirstStepScanOk(): void {
  try {
    wx.removeStorageSync(FIRST_STEP_SCAN_OK_KEY)
  } catch {
    try {
      wx.setStorageSync(FIRST_STEP_SCAN_OK_KEY, false)
    } catch {
      // ignore
    }
  }
}

export function createTaskId(): string {
  return `task_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

/** 读取首页流程标题（未设置时返回默认文案） */
export function readPageTitle(): string {
  try {
    const raw = wx.getStorageSync(PAGE_TITLE_STORAGE_KEY) as unknown
    if (typeof raw === 'string' && raw.trim()) {
      return raw.trim()
    }
    if (raw && typeof raw === 'object') {
      const box = raw as Record<string, unknown>
      const t = box.title
      if (typeof t === 'string' && t.trim()) {
        return t.trim()
      }
    }
  } catch {
    // ignore
  }
  return DEFAULT_PAGE_TITLE
}

/** 持久化首页流程标题（独立存储，不影响任务列表 Key） */
export function savePageTitle(title: string): void {
  const value = title.trim() || DEFAULT_PAGE_TITLE
  try {
    wx.setStorageSync(PAGE_TITLE_STORAGE_KEY, value)
  } catch (e) {
    console.error('savePageTitle failed', e)
    wx.showToast({ title: '标题保存失败', icon: 'none' })
  }
}

/**
 * 当前「每日 5:00」周期内已完成全流程：值为该周期起始时间戳（与首页 getLast5AM 对齐）。
 * 直至下一周期 5:00 前保持完成态，除非用户手动重置。
 */
export const FLOW_COMPLETED_PERIOD_KEY = 'morning_routine_flow_completed_period_v1'

export function readFlowCompletedPeriod(): number {
  try {
    const v = wx.getStorageSync(FLOW_COMPLETED_PERIOD_KEY) as unknown
    const n = typeof v === 'number' ? v : Number(v)
    return Number.isFinite(n) && n > 0 ? n : 0
  } catch {
    return 0
  }
}

export function saveFlowCompletedPeriod(boundaryTimestamp: number): void {
  try {
    wx.setStorageSync(FLOW_COMPLETED_PERIOD_KEY, boundaryTimestamp)
  } catch (e) {
    console.error('saveFlowCompletedPeriod failed', e)
  }
}

export function clearFlowCompletedPeriod(): void {
  try {
    wx.removeStorageSync(FLOW_COMPLETED_PERIOD_KEY)
  } catch {
    try {
      wx.setStorageSync(FLOW_COMPLETED_PERIOD_KEY, 0)
    } catch {
      // ignore
    }
  }
}

/** 与震动开关对应的本地缓存字段（默认关闭） */
export const CONFIG_VIBRATE_KEY = 'config_vibrate'

export function readConfigVibrate(): boolean {
  try {
    const v = wx.getStorageSync(CONFIG_VIBRATE_KEY) as unknown
    if (v === true) return true
    if (v === false) return false
    if (v === 'true') return true
    if (v === 'false') return false
    if (typeof v === 'number') return v !== 0
  } catch {
    // ignore
  }
  return false
}

export function saveConfigVibrate(enabled: boolean): void {
  try {
    wx.setStorageSync(CONFIG_VIBRATE_KEY, !!enabled)
  } catch (e) {
    console.error('saveConfigVibrate failed', e)
    wx.showToast({ title: '设置保存失败', icon: 'none' })
  }
}
