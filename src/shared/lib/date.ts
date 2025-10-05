export const toYMD = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`

export const parseSkillaDate = (s: string) => {
  const [d, t] = s.split(" ")
  const [y, m, day] = d.split("-").map(Number)
  const [hh, mm, ss] = t.split(":").map(Number)
  return new Date(y, m - 1, day, hh, mm, ss || 0, 0)
}