// 本地存储、会话存储 key 的命名空间
const KEY_PREFIX = 'mras.smartForm.'

// 缓存读写的默认选项
const DEFAULT_OPTIONS = {
  // 存储类型, 可选值: 'localStorage', 'sessionStorage'
  // 默认使用会话存储, 慎重使用本地存储
  driver: 'sessionStorage',

  // 写入缓存的 key 默认开启命名空间, 防止覆盖污染
  // ======== 默认开启, 除非十分确定, 否则不要关闭!!! ========
  namespaced: true,

  // 是否在读写时对缓存的值进行序列化与反序列化
  // 比如在缓存用户信息对象的时候, 可以开启
  serialize: false
}

/**
 * 写入缓存(一般情况下, 业务代码中不需要调用该方法, 请使用具体的业务方法)
 * @author wangkai 2021-11-26T11:08:10+0800
 * @param  {Strinig} key     缓存 key
 * @param  {Any}     val     缓存值
 * @param  {Object}  options 配置选项, 同 DEFAULT_OPTIONS
 * @return {Boolean}         标识缓存是否写入成功
 */
const setStorage = (key, val, options = {}) => {
  let result = false

  const { driver, namespaced, serialize } = {
    ...DEFAULT_OPTIONS,
    ...options
  }

  try {
    window[driver].setItem(
      namespaced ? (KEY_PREFIX + key) : key,
      serialize ? JSON.stringify(val) : val
    )
    result = true
  } catch (e) {
    console.log(e)
  }

  return result
}

/**
 * 读取缓存(一般情况下, 业务代码中不需要调用该方法, 请使用具体的业务方法)
 * @author wangkai 2021-11-26T11:11:25+0800
 * @param  {String} key     缓存 key
 * @param  {Object} options 配置选项, 同 DEFAULT_OPTIONS
 * @return {Any}            读取到的缓存值
 */
const getStorage = (key, options = {}) => {
  let result = null

  const { driver, namespaced, serialize } = {
    ...DEFAULT_OPTIONS,
    ...options
  }

  try {
    result = window[driver].getItem(
      namespaced ? (KEY_PREFIX + key) : key
    )
    if (serialize) {
      result = JSON.parse(result)
    }
  } catch (e) {
    console.log(e)
  }

  return result
}

/**
 * 删除缓存(一般情况下, 业务代码中不需要调用该方法, 请使用具体的业务方法)
 * @author wangkai 2021-11-26T11:16:55+0800
 * @param  {String}  key     缓存 key
 * @param  {Object}  options 配置选项
 *                           options.driver 同 DEFAULT_OPTIONS.driver
 *                           options.namespaced 同 DEFAULT_OPTIONS.namespaced
 * @return {Boolean}         删除是否成功
 */
const removeStorage = (key, options = {}) => {
  let result = false

  const { driver, namespaced } = {
    ...DEFAULT_OPTIONS,
    ...options
  }

  try {
    window[driver].removeItem(
      namespaced ? (KEY_PREFIX + key) : key
    )
    result = true
  } catch (e) {
    console.log(e)
  }

  return result
}

/**
 * 清空缓存
 * @author wangkai 2021-11-26T13:31:05+0800
 * @param  {Object} options 配置选项
 *                          options.driver 同 DEFAULT_OPTIONS.driver
 *                          options.namespaced 同 DEFAULT_OPTIONS.namespaced
 * @return {Boolean}        删除是否成功
 */
const clearStorage = (options = {}) => {
  let result = false

  const { driver, namespaced } = {
    ...DEFAULT_OPTIONS,
    ...options
  }

  try {
    if (namespaced) {
      // 只清空当前空间下的缓存数据
      Object.keys(window[driver]).forEach(key => {
        if (key.startsWith(KEY_PREFIX)) {
          window[driver].removeItem(key)
        }
      })
    } else {
      // 清空全部缓存数据
      // 比如退出登录的时候, 可能需要清空全部
      window[driver].clear()
    }
    result = true
  } catch (e) {
    console.log(e)
  }

  return result
}

const getStoragedUserInfo = () => {
  return getStorage('userInfo', {
    namespaced: false,
    serialize: true
  })
}

/**
 * 缓存表单设计时的表单配置项
 * @author wangkai 2022-10-26T15:14:54+0800
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
const storageFormConfig = (config) => {
  return setStorage('design.config', config, {
    driver: 'localStorage',
    serialize: true
  })
}

/**
 * 读取缓存的设计时表单配置项
 * @author wangkai 2022-10-26T15:15:30+0800
 * @return {[type]} [description]
 */
const getStoragedFormConfig = () => {
  return getStorage('design.config', {
    driver: 'localStorage',
    serialize: true
  })
}

export {

  // 在业务组件中不推荐直接使用以下 4 个函数
  setStorage,
  getStorage,
  removeStorage,
  clearStorage,

  // 在业务组件中使用的函数
  getStoragedUserInfo,

  // 设置菜单收藏条的显示状态
  storageFormConfig,
  getStoragedFormConfig
}
