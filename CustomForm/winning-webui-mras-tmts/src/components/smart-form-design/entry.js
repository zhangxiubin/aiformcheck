import SmartFormDesign from './index.vue'
import { version } from '../../../package.json'

const date = new Date()
SmartFormDesign.BUILD_TIMESTAMP = date.getTime()
SmartFormDesign.BUILD_TIME_ISO = date.toISOString()

SmartFormDesign.VERSION = version

/* istanbul ignore next */
SmartFormDesign.install = function (Vue) {
  Vue.component(SmartFormDesign.name, SmartFormDesign)
}

const install = function (Vue, options = {}) {
  Vue.component(SmartFormDesign.name, SmartFormDesign)
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default SmartFormDesign
