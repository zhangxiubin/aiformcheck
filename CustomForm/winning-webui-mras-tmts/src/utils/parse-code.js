/**
 * 解析用户输入
 */

import stripComments from 'strip-comments'
import { __FORM_DESIGN_SANDBOX__ } from '@/consts/global-vars'
import { genLogPrefix } from './logger'

// 沙盒中可访问全局对象的白名单
const WHITE_LIST = [
  'Infinity', 'undefined', 'NaN', 'isFinite', 'isNaN',
  'parseFloat', 'parseInt',
  'decodeURI', 'decodeURIComponent', 'encodeURI', 'encodeURIComponent',
  'Math', 'Number', 'Date', 'Array', 'Object', 'Boolean',
  'String', 'RegExp', 'Map', 'Set', 'JSON', 'Intl',
  'console'
]

/**
 * 将字符串解析为 js 值(基本类型/Object/Array)
 * @author wangkai 2022-03-10T09:17:37+0800
 * @param  {String} src     字符串代码, 如 '{ name: "Tom" }`
 *                          需要注意的是, src 必须是字面量
 * @param  {String} sandbox 沙箱名, 默认为 '__FORM_DESIGN_SANDBOX__',
 *                          将会创建全局一个全局 Proxy 实例
 *                          window.__FORM_DESIGN_SANDBOX__
 * @return {Object} res     res.result     标识是否解析成功, true(成功), false(失败)
 *                          res.value      解析成功的值, 可以是任意类型
 *                          res.errorMsg   解析失败的错误信息
 *                          res.errorStack 解析失败的错误栈信息
 */
const parseJsValue = (src, sandbox = __FORM_DESIGN_SANDBOX__) => {
  if (!window[sandbox]) {
    // 安全沙箱机制, 防止作用域链查找
    window[sandbox] = new Proxy({}, {
      has (target, key) {
        return true
      },
      get (target, key) {
        if (key === Symbol.unscopables) return undefined
        if (WHITE_LIST.includes(key)) return window[key]
        console.warn(`${genLogPrefix('warn')} 不在可访问的全局对象白名单中！`)
        return target[key]
      }
    })
  }

  // qiankun 子应用环境中
  if (window.proxy && !window.proxy[sandbox]) {
    // 安全沙箱机制, 防止作用域链查找
    window.proxy[sandbox] = new Proxy({}, {
      has (target, key) {
        return true
      },
      get (target, key) {
        if (key === Symbol.unscopables) return undefined
        if (WHITE_LIST.includes(key)) return window.proxy[key]
        console.warn(`${genLogPrefix('warn')} 不在可访问的全局对象白名单中！`)
        return target[key]
      }
    })
  }

  let result = false // 标识是否解析成功
  let value = null // 解析成功的值, 可以是任意类型
  let errorMsg = '' // 解析错误时的错误信息
  let errorStack = '' // 解析错误时的错误信息
  if (!['string', 'number'].includes(typeof src)) {
    src = ''
  }

  try {
    /* eslint-disable no-new-func */
    value = new Function(`
      with (${sandbox}) {
        return ${stripComments(src).trim()}
      }
    `)()
    result = true
  } catch (e) {
    // console.log(e)
    errorMsg = e.message
    errorStack = e.stack
  }

  // 如果直接读取失败, 则可能是在 qiankun 中
  // 此时需要提前挂载
  if (!result) {
    try {
      /* eslint-disable no-new-func */
      // 在 qiankun 中, 直接在 window 上读取会失败, 这里从 window.proxy 上读取
      value = new Function(`
        with (proxy.${sandbox}) {
          return ${stripComments(src).trim()}
        }
      `)()
      result = true
    } catch (e) {
      // console.log(e)
      errorMsg = e.message
      errorStack = e.stack
    }
  }

  return { result, value, errorMsg, errorStack }
}

export {
  WHITE_LIST,
  parseJsValue
}
