export const formatDuration = (totalSeconds: number): string => {
  const sec = Math.max(0, Math.floor(Number.isFinite(totalSeconds) ? totalSeconds : 0))
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}