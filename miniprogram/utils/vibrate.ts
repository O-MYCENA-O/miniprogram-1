/**
 * 受控震动：仅在用户于管理页开启「震动反馈」时调用 wx.vibrateShort。
 * 每次调用前读取本地 config_vibrate，从管理页返回首页后立即生效。
 */

import { readConfigVibrate } from './storage'

export function triggerVibrate(options?: WechatMiniprogram.VibrateShortOption): void {
  if (!readConfigVibrate()) return
  wx.vibrateShort(options ?? { type: 'medium' })
}
