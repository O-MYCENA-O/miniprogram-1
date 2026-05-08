import { readBgMusicEnabled } from './storage'

/** CDN 背景音乐路径；音频文件已上传到腾讯云 COS */
const BGM_TRACK_POOL = [
  'https://mnrt-1429431110.cos.ap-beijing.myqcloud.com/bgm1.MP3',
  'https://mnrt-1429431110.cos.ap-beijing.myqcloud.com/bgm2.MP3',
  'https://mnrt-1429431110.cos.ap-beijing.myqcloud.com/bgm3.MP3',
  'https://mnrt-1429431110.cos.ap-beijing.myqcloud.com/bgm4.MP3',
  'https://mnrt-1429431110.cos.ap-beijing.myqcloud.com/bgm5.MP3',
  'https://mnrt-1429431110.cos.ap-beijing.myqcloud.com/bgm6.MP3',
  'https://mnrt-1429431110.cos.ap-beijing.myqcloud.com/bgm7.MP3',
  'https://mnrt-1429431110.cos.ap-beijing.myqcloud.com/bgm8.MP3',
  'https://mnrt-1429431110.cos.ap-beijing.myqcloud.com/bgm9.MP3',
  'https://mnrt-1429431110.cos.ap-beijing.myqcloud.com/bgm10.MP3',
  'https://mnrt-1429431110.cos.ap-beijing.myqcloud.com/bgm11.MP3',
  'https://mnrt-1429431110.cos.ap-beijing.myqcloud.com/bgm12.MP3',
  'https://mnrt-1429431110.cos.ap-beijing.myqcloud.com/bgm13.MP3',
  'https://mnrt-1429431110.cos.ap-beijing.myqcloud.com/bgm14.MP3',
  'https://mnrt-1429431110.cos.ap-beijing.myqcloud.com/bgm15.MP3',
  'https://mnrt-1429431110.cos.ap-beijing.myqcloud.com/bgm16.MP3',
  'https://mnrt-1429431110.cos.ap-beijing.myqcloud.com/bgm17.MP3',
  'https://mnrt-1429431110.cos.ap-beijing.myqcloud.com/bgm18.MP3',
  'https://mnrt-1429431110.cos.ap-beijing.myqcloud.com/bgm19.MP3',
]

function pickRandomBgmSrc(exclude?: string): string {
  const pool = BGM_TRACK_POOL
  if (pool.length === 0) return 'https://mnrt-1429431110.cos.ap-beijing.myqcloud.com/bgm1.MP3'
  if (pool.length === 1) return pool[0]!
  let pick = pool[Math.floor(Math.random() * pool.length)]!
  let tries = 0
  while (exclude && pick === exclude && tries < 12) {
    pick = pool[Math.floor(Math.random() * pool.length)]!
    tries += 1
  }
  return pick
}

function applyBgmMeta(m: WechatMiniprogram.BackgroundAudioManager) {
  m.title = '早安 Jazz'
  m.epname = '随机 Playlist'
  m.singer = '背景音乐'
}

let listenersInstalled = false

function ensureBgmListeners() {
  if (listenersInstalled) return
  listenersInstalled = true
  const m = wx.getBackgroundAudioManager()
  m.onEnded(() => {
    if (!readBgMusicEnabled()) return
    applyBgmMeta(m)
    const prev = (m.src || '').trim()
    m.src = pickRandomBgmSrc(prev || undefined)
  })
  m.onError((err) => {
    console.warn('[bgm] BackgroundAudioManager error', err)
  })
}

/** 按本地开关同步播放状态：关则停止，开则加载并播放（无 src 时会随机选曲）。 */
export function syncBgMusicPlayback() {
  const m = wx.getBackgroundAudioManager()
  if (!readBgMusicEnabled()) {
    try {
      m.stop()
    } catch {
      // ignore
    }
    return
  }

  ensureBgmListeners()
  applyBgmMeta(m)

  try {
    const cur = (m.src || '').trim()
    if (!cur) {
      m.src = pickRandomBgmSrc()
      return
    }
    m.play()
  } catch (e) {
    console.warn('[bgm] play failed', e)
  }
}
