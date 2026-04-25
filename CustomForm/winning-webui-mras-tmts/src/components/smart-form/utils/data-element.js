const SEPARATOR = '__'

const stringifyDataElement = data => {
  return [
    data.mrasEleDataId,
    data.rtaClassNo,
    data.rtaClassName,
    data.rtaNodeNo,
    data.rtaNodeName
  ].join(SEPARATOR)
}

const parseDataElementStr = str => {
  if (!str) return null

  const [
    mrasEleDataId,
    rtaClassNo,
    rtaClassName,
    rtaNodeNo,
    rtaNodeName
  ] = str.split(SEPARATOR)

  return {
    mrasEleDataId,
    rtaClassNo,
    rtaClassName,
    rtaNodeNo,
    rtaNodeName
  }
}

export {
  stringifyDataElement,
  parseDataElementStr
}
