function daysBetween (date1, date2) {
  const oneDay = 24 * 60 * 60 * 1000 // 每天的毫秒数
  const firstTime = new Date(date1).getTime() // 将日期转换为时间戳
  const secondTime = new Date(date2).getTime() // 同上

  return Math.round(Math.abs((firstTime - secondTime) / oneDay)) // 计算天数并四舍五入
}

export {
  daysBetween
}
