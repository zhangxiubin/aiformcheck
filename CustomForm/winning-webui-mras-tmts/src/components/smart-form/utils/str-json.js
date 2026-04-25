/**
 * 判断是否为json字符串
 */
const isJson = str => {
  if (typeof str === 'string') {
    try {
      const obj = JSON.parse(str)
      // 等于这个条件说明就是JSON字符串 会返回true

      if (typeof obj === 'object' && obj) {
        return true
      } else {
        // 不是就返回false
        return false
      }
    } catch (e) {
      return false
    }
  }
  return false
}

export {
  isJson
}
