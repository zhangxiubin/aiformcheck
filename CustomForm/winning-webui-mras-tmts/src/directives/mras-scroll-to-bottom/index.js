import { kebabCase, throttle, isNil } from 'lodash'

const SCOPE = 'MrasScrollToBottom'
const attributes = {
  delay: {
    type: Number,
    default: 200
  },
  distance: {
    type: Number,
    default: 0
  },
  disabled: {
    type: Boolean,
    default: false
  },
  immediate: {
    type: Boolean,
    default: true
  },
  /*
   * 滚动容器的选择器, 如果传入的不是字符串类型, 将使用空字符串
   * 如果为空(默认情况), 会视绑定的元素为滚动容器, 但某些场景可能需要指定,
   * 比如 <el-select /> 组件中, 需要传入 `.el-select-dropdown__wrap`,
   * 因为此时实际的滚动容器并不是根元素, 而是 `div.el-select-dropdown__wrap`
   */
  selector: {
    type: String
  }
}

const _formatToBoolean = (v, defaultV) => {
  if (typeof v === 'boolean') return v
  if (v === 'false') return false
  if (v === 'true') return true
  return defaultV
}

const _getAttribute = el => {
  const map = {}
  const keys = Object.keys(attributes)
  keys.forEach(k => {
    const { type, default: defaultValue } = attributes[k]
    let value = el.getAttribute(kebabCase(`${SCOPE}-${k}`))
    switch (type) {
      case Number:
        value = isNil(value) ? defaultValue : Number(value)
        value = isNaN(value) ? defaultValue : value
        break
      case Boolean:
        value = _formatToBoolean(value, defaultValue)
        break
      case String:
        value = typeof value === 'string' ? value : ''
        break
      default:
        value = type(value)
    }
    map[k] = value
  })
  // console.log(map)
  return map
}

const _handleScroll = function (callback) {
  const { el, vm, scrollContainer } = this[SCOPE]

  const { distance, disabled } = _getAttribute(el)
  if (disabled) return

  // 距离底部的距离 = 内部元素高度之和 - 滚动容器的高度 - 滚动的距离
  const distanceToBottom = scrollContainer.scrollHeight - scrollContainer.getBoundingClientRect().height - scrollContainer.scrollTop

  if (scrollContainer.scrollHeight !== 0 && distanceToBottom - distance <= 0 && (typeof callback === 'function')) {
    callback.call(vm)
  }
}

export default {
  name: 'MrasScrollToBottom',

  inserted (el, binding, vnode) {
    console.log('mras-scroll-to-bottom inserted')
    const callback = binding.value
    const vm = vnode.context
    const { selector, delay, immediate } = _getAttribute(el)
    // 滚动监听函数
    const scrollListener = throttle(_handleScroll.bind(el, callback), delay)

    /*
     * 获取滚动监听容器: 可能是绑定的 el 本身, 也可能是 el 的后代元素
     */
    let scrollContainer = el // 滚动容器
    if (selector) {
      /*
       * TODO: 这里需要考虑此时后代元素是否已插入
       */
      scrollContainer = el.querySelector(selector)
      if (!scrollContainer) {
        console.warn('TODO: 这里需要考虑后代元素是否已插入')
      }
    }

    el[SCOPE] = {
      el, // 为了后续读取属性设置
      vm, // 为了在执行 callback 的时候保留作用域
      scrollContainer, // 滚动容器
      scrollListener // 滚动监听函数, 因为要在 unbind 中移除监听, 所以需要保留引用
    }

    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', scrollListener)

      if (immediate) {
        scrollListener()
      }
    }
  }, // end of inserted

  unbind (el) {
    const { scrollContainer, scrollListener } = el[SCOPE]
    if (scrollContainer) {
      scrollContainer.removeEventListener('scroll', scrollListener)
    }
  } // end of unbind
}
