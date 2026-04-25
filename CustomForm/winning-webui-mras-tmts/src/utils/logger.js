const TEXT_PREFIX = 'FormDesign'

function genLogPrefix (logType = 'log') {
  return `[${TEXT_PREFIX} ${logType}]`
}

export {
  genLogPrefix
}
