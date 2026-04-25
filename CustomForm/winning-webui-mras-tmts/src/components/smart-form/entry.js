import SmartForm from './index.vue'
import { version } from '../../../package.json'

const date = new Date()
SmartForm.BUILD_TIMESTAMP = date.getTime()
SmartForm.BUILD_TIME_ISO = date.toISOString()

SmartForm.VERSION = version

/* istanbul ignore next */
SmartForm.install = function (Vue) {
  Vue.component(SmartForm.name, SmartForm)
}

const install = function (Vue, options = {}) {
  Vue.component(SmartForm.name, SmartForm)
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default SmartForm
