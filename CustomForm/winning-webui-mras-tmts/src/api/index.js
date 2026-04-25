import axios from 'axios'
import Cookies from 'js-cookie'
import { merge } from 'lodash'
// import { __SCENE_DESIGN_PENDING_REQUESTS__ } from '@/consts/global-vars'
import {
  addRequestInterceptor,
  addResponseInterceptor
} from './interceptors'

/**
 * 实例化 axios
 * @author wangkai 2022-08-29T14:59:45+0800
 * @param  {[type]} config [description]
 * @param  {[type]} option {
 *                           // TODO: 是否在请求失败后自动弹出错误信息
 *                           autoShowRequestError: false
 *                         }
 * @return {[type]}        [description]
 */
function createAxios (config, option) {
  const defaultConfig = {
    baseURL: '/', // 医务
    timeout: 30 * 1000
  }

  const instance = axios.create(merge(defaultConfig, config))
  initAxios(instance)

  return instance
}

/**
 * 初始化请求(token 等)
 * @author wangkai 2022-08-29T15:01:22+0800
 * @return {[type]} [description]
 */
function initAxios (instance) {
  // _initPendingRequests()
  // 设置请求头等
  _initInstance(instance || axios)
  // 添加拦截器
  addRequestInterceptor(instance || axios)
  addResponseInterceptor(instance || axios)
}

// function _initPendingRequests () {
//   if (window[__SCENE_DESIGN_PENDING_REQUESTS__]) return
//   // key: request fingerprint
//   // value: { abortController }
//   window[__SCENE_DESIGN_PENDING_REQUESTS__] = new Map()
// }

/**
 * 设置 token 等(采用 @winning-plugin/win-6.0-httpclient 的逻辑)
 * @author wangkai 2022-08-29T15:17:34+0800
 * @param  {[type]} instance [description]
 * @return {[type]}          [description]
 */
function _initInstance (instance) {
  try {
    const AUTH_TOKEN = window.sessionStorage.getItem('Authorization') ||
      Cookies.get('BEARER_TOKEN') || ''
    instance.defaults.headers.common.Authorization = AUTH_TOKEN
    const localData = sessionStorage.getItem('language') || 'zh_CN'
    Object.assign(instance.defaults.headers, {
      Authorization: AUTH_TOKEN,
      ip: Cookies.get('ip') || 'http://127.0.0.1',
      'W-SEQ': Cookies.get('W-SEQ') || '1569595974015_2',
      'W-FLOW': Cookies.get('W-FLOW') || 'default',
      'X-DEBUG': Cookies.get('X-DEBUG') || 'false',
      'X-LOGGER': Cookies.get('X-LOGGER'),
      'X-LOGGER-EVENT': Cookies.get('X-LOGGER-EVENT'),
      'x-locale': localData
    })

    // 为了保持与 60 一样的处理方法
    let temp = Cookies.get('X-LOGGER-EVENT')
    if (temp) {
      instance.defaults.headers['X-LOGGER-EVENT'] = temp
    }

    temp = Cookies.get('X-LOGGER')
    if (temp) {
      instance.defaults.headers['X-LOGGER'] = temp
    }
  } catch (e) {}
}

export {
  createAxios,
  initAxios
}
