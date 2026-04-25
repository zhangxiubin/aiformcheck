function initRequestQueue () {
  if (!window.MRAS_PENDING_QUEUE) {
    window.MRAS_PENDING_QUEUE = new Map()
  }
}

export {
  initRequestQueue
}
