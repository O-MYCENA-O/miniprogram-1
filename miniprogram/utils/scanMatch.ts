/** 与「扫码开启流程」一致的口令校验：未配置口令时任意非空扫码结果视为通过 */
export function scanResultMatches(expectedToken: string, rawResult: string): boolean {
  const r = (rawResult || '').trim()
  if (!r) return false
  const t = expectedToken.trim()
  if (!t) return true
  return r === t || r.includes(t)
}
