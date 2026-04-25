export function dwonloadBlob (data, { filename }) {
  const link = document.createElement('a')
  const blob = new Blob([data], { type: data.type })
  // , {
  //   type: 'application/vnd.ms-excel' // application/octet-stream
  // }
  link.style.display = 'none'
  link.href = URL.createObjectURL(blob)

  link.download = filename || '' // 下载的文件名
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function dwonloadBlobZip (data, { filename }) {
  const link = document.createElement('a')
  const blob = new Blob([data], { type: 'application/zip' })
  link.style.display = 'none'
  link.href = URL.createObjectURL(blob)

  link.download = filename || '' // 下载的文件名
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
