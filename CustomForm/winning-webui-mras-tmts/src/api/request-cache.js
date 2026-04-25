function initRequestCache () {
  if (!window.MRAS_REQUST_CACHE) {
    window.MRAS_REQUST_CACHE = new Map()
  }
}

export {
  initRequestCache
}
