import { isPlainObject } from 'lodash'
// import md5 from 'md5'
// import { Base64 } from 'js-base64'
import { Message } from 'element-ui'

// import { __SCENE_DESIGN_PENDING_REQUESTS__ } from '@/consts/global-vars'

/*
pending_requests

{
  fingerprint: {
    pending: true,
    signal: '',
  }
}
 */
let messageInstance = null
function showMessage (message) {
  if (messageInstance) {
    // 如果已经存在一个消息提示实例，则先关闭它
    Message.closeAll()
  }

  // 显示新的消息提示，并保存该实例
  messageInstance = Message({
    message: message,
    type: 'error',
    onClose: () => {
      messageInstance = null // 当消息提示关闭时，将实例置为null
    }
  })
}

/**
 * 请求拦截器
 * @author wangkai 2022-08-29T15:22:23+0800
 * @param  {[type]} instance [description]
 */
function addRequestInterceptor (instance) {
  if (!instance || instance.__REQUEST_INTERCEPTOR_ADDED) return

  instance.interceptors.request.use(function (config) {
    // Do something before request is sent

    // TODO: error 配置好后再添加
    // const fingerprint = calcRequestFingerprint(config)
    // const abortController = new AbortController()

    // window[__SCENE_DESIGN_PENDING_REQUESTS__].set(fingerprint, {
    //   timestamp: Date.now(),
    //   abortController
    // })

    // config.signal = abortController.signal

    return config
  }, function (error) {
    // Do something with request error
    return Promise.reject(error)
  })

  instance.__REQUEST_INTERCEPTOR_ADDED = true
}

/**
 * 响应拦截器
 * @author wangkai 2022-08-29T15:22:35+0800
 * @param  {[type]} instance [description]
 */
function addResponseInterceptor (instance) {
  if (!instance || instance.__RESPONSE_INTERCEPTOR_ADDED) return

  instance.interceptors.response.use(function (response) {
    // console.log(response)
    // TODO: error 配置好后再添加
    // const fingerprint = calcRequestFingerprint(response.config)
    // window[__SCENE_DESIGN_PENDING_REQUESTS__].delete(fingerprint)
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data

    let { data } = response || {}
    if (data?.success) return data

    if (isPlainObject(data)) {
      data.success = !!data.success
    } else {
      data = {
        success: false,
        data
      }
    }

    if (!data.success) {
      showMessage(data?.errorDetail?.message || data)
    }

    return data
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    // return Promise.reject(error)
    // 不走 reject, 省略业务代码中的 try...catch 写法
    return {
      success: false,
      __resError: true,
      error
    }
  })

  instance.__RESPONSE_INTERCEPTOR_ADDED = true
}

/**
 * 计算请求指纹
 * @author wangkai 2022-08-30T13:46:11+0800
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
// function calcRequestFingerprint (config) {
//   // console.log(config)
//   let { method, baseURL, url, data } = config

//   if (typeof data !== 'string') {
//     try {
//       // 如果 data 是 FormData, 则 json 序列化后是 "{}"
//       data = JSON.stringify(data)
//     } catch (e) {}
//   }

//   return md5([method, baseURL, url, data].join('@_@'))
// }

export {
  addRequestInterceptor,
  addResponseInterceptor
}
