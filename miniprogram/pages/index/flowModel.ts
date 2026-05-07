/**
 * 线性流程任务模型与纯函数 —— 与页面/UI 解耦，便于扩展任务项。
 */

export type TaskType = 'default' | 'timer' | 'link'

export type TaskStatus = 'locked' | 'active' | 'finished'

export interface FlowTask {
  id: string
  title: string
  desc: string
  type: TaskType
  status: TaskStatus
  /** 秒；仅 type === 'timer' 时生效，其余为 0 */
  duration: number
  /** link：目标小程序 AppId（占位，需替换为真实 ID） */
  linkAppId?: string
  /** link：打开路径 */
  linkPath?: string
}

/** 持久化 / 配置形态（不含运行时 status） */
export type TaskPreset = Omit<FlowTask, 'status'>

/** 配置层：不含运行时 status，修改此数组即可增删改任务流程 */
export const FLOW_TASK_PRESETS: ReadonlyArray<TaskPreset> = [
  {
    id: 'start',
    title: '开始',
    desc: '确认进入今日流程',
    type: 'default',
    duration: 0,
  },
  {
    id: 'hydrate',
    title: '补水',
    desc: '喝一杯水',
    type: 'default',
    duration: 0,
  },
  {
    id: 'breathe',
    title: '深呼吸',
    desc: '点击开始后跟随倒计时放松',
    type: 'timer',
    duration: 10,
  },
  {
    id: 'reading',
    title: '晨读',
    desc: '跳转至资料小程序（参数占位）',
    type: 'link',
    duration: 0,
    linkAppId: 'wx0000000000000000',
    linkPath: 'pages/index/index',
  },
  {
    id: 'plan',
    title: '今日一事',
    desc: '确认已想好当天最重要的一件事',
    type: 'default',
    duration: 0,
  },
]

export function flowTasksWithInitialStatuses(presets: ReadonlyArray<TaskPreset>): FlowTask[] {
  return presets.map((preset, index) => ({
    ...preset,
    status: index === 0 ? 'active' : 'locked',
  }))
}

/** 全流程已完成时的展示形态（全部 finished） */
export function flowTasksAllFinished(presets: ReadonlyArray<TaskPreset>): FlowTask[] {
  return presets.map((preset) => ({
    ...preset,
    status: 'finished' as TaskStatus,
  }))
}

export function initialTasksFromPresets(): FlowTask[] {
  return flowTasksWithInitialStatuses(FLOW_TASK_PRESETS)
}

export interface ApplyCompletionResult {
  tasks: FlowTask[]
  /** 刚完成的是否为最后一个任务 */
  flowCompleted: boolean
}

/**
 * 将指定 id 的 active 任务标为 finished，并将下一项设为 active。
 * 条件不满足（未找到、非 active）时返回 null。
 */
export function applyTaskCompletion(tasks: FlowTask[], id: string): ApplyCompletionResult | null {
  const index = tasks.findIndex((t) => t.id === id)
  if (index === -1) return null
  if (tasks[index].status !== 'active') return null

  const nextTasks = tasks.map((t, i) => {
    if (i === index) {
      return { ...t, status: 'finished' as TaskStatus }
    }
    if (i === index + 1) {
      return { ...t, status: 'active' as TaskStatus }
    }
    return { ...t }
  })

  const flowCompleted = index === tasks.length - 1
  return { tasks: nextTasks, flowCompleted }
}
