// import html2canvas from 'html2canvas'
import domtoimage from 'dom-to-image'
import { saveAs } from 'file-saver'
import { genLogPrefix } from '@/utils/logger'

// window.html2canvas = html2canvas
// window.domtoimage = domtoimage

export default {
  methods: {
    // capture (options = {}) {
    //   const defaultOptions = {
    //     allowTaint: true,
    //     foreignObjectRendering: false,
    //     useCORS: true,
    //     // scrollX: 0,
    //     // scrollY: 0,
    //     ignoreElements (element) {
    //       // 忽略右上角的操作菜单
    //       return element.classList.contains('sc-actions') || element.classList.contains('grid-bg')
    //     }
    //   }

    //   html2canvas(this.$el, {
    //     ...defaultOptions,
    //     ...options
    //   }).then(canvas => {
    //     document.body.prepend(canvas)

    //     // https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement/toDataURL
    //     const url = canvas.toDataURL('image/jpeg', 1)
    //     const img = new Image()
    //     img.src = url
    //     img.style.width = '1599px'
    //     document.body.prepend(img)
    //   })
    // },

    /**
     * 截图
     * @author wangkai 2022-10-10T15:09:37+0800
     * @param  {String}  format  截图格式: jpg(默认值, 同 jpeg)/jpeg/png/svg/blob/pixelData
     * @param  {Object}  options 截图选项 https://www.npmjs.com/package/dom-to-image#rendering-options
     * @return {Promise}         [description]
     */
    capture (format = 'jpg', options = {}) {
      const defaultOptions = {
        filter (el) {
          // 忽略右上角的操作菜单
          const { classList } = el
          if (classList) {
            return !classList.contains('sc-actions') && // 右上角操作图标
              !classList.contains('grid-bg') && // 背景栅格
              !classList.contains('vue-resizable-handle') // 右下角拉伸图标
          }
          return true
        },
        bgcolor: '#fff'
      }

      const formatMap = {
        jpg: 'toJpeg',
        jpeg: 'toJpeg',
        png: 'toPng',
        blob: 'toBlob',
        svg: 'toSvg',
        pixelData: 'toPixelData'
      }

      return domtoimage[formatMap[format || 'jpg']](this.$el, {
        ...defaultOptions,
        ...options
      })
      // .then(dataUrl => {
      //   const img = new Image()
      //   img.src = dataUrl
      //   img.style.width = '1599px'
      //   document.body.prepend(img)
      // })
    },

    /**
     * 保存图片
     * @author wangkai 2022-10-10T15:32:16+0800
     * @param  {String}  format   保存的图片格式: jpg/jpeg/png
     *                            svg 暂无使用场景, 所以未做支持, 后续有需求可以做支持
     * @param  {String}  filename 保存的文件名(不含扩展名)
     * @param  {Object}  options  截图选项 https://www.npmjs.com/package/dom-to-image#rendering-options
     * @return {Promise}
     */
    saveAsImage (format = 'jpg', filename, options = {}) {
      const validFormats = ['jpg', 'jpeg', 'png']
      if (!validFormats.includes(format)) {
        console.warn(`${genLogPrefix()} 保存图片格式只能是: ${validFormats.join('/')}`)
        return
      }

      const defaultOptions = {
        filter (el) {
          // 忽略右上角的操作菜单
          const { classList } = el
          if (classList) {
            return !classList.contains('sc-actions') && // 右上角操作图标
              !classList.contains('grid-bg') && // 背景栅格
              !classList.contains('vue-resizable-handle') // 右下角拉伸图标
          }
          return true
        },
        bgcolor: '#fff'
      }

      return domtoimage.toBlob(this.$el, {
        ...defaultOptions,
        ...options
      }).then(blob => {
        saveAs(blob, `${filename || Date.now()}.${format}`)
      })
    }
  }
}
