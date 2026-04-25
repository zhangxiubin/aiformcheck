import Vue from 'vue'
// import VueDraggable from 'vuedraggable'
import { cloneDeep, get, set, omit } from 'lodash'
import { config } from './config'
import { genFormDataFromFormItems } from './utils'

const $formBus = new Vue()

export default {
  name: 'SmartForm',
  components: {
    // VueDraggable,
    ItemRadio: () => import('./components/ItemRadio'),
    ItemInput: () => import('./components/ItemInput'),
    ItemCheckbox: () => import('./components/ItemCheckbox'),
    ItemSelect: () => import('./components/ItemSelect')
  },
  data () {
    return {
      config,
      // form item 交互的变化都会通过 this.updateField() 同步 formData 的值
      formData: genFormDataFromFormItems(config.items)
    }
  },
  provide () {
    return {
      updateField: this.updateField,
      $formBus
    }
  },
  watch: {
    'config.items' (items) {
      this.formData = genFormDataFromFormItems(items)
    }
  },
  render (h) {
    const { config } = this
    return h(
      'el-form',
      {
        class: 'smart-form',
        ref: 'form',
        props: config.formProps
      },
      [
        h(
          'el-row',
          { props: config.rowProps },
          this.$_renderItems(config.items, h)
        )
      ]
    )
  },
  methods: {
    registerComponent (componentName, component) {
      this.$options.components[componentName] = component
    },
    updateField (path, value) {
      const oldValue = get(this.formData, path)

      set(this.formData, path, value)

      $formBus.$emit('change-field', {
        field: path,
        value,
        oldValue
      })
    },
    getConfig () {
      return cloneDeep(this.config)
    },
    setConfig (config) {
      this.config = config
    },

    // TODO
    pushItem () {},
    // TODO
    removeItem () {},
    // TODO
    insertItem () {},

    getItemConfig (field) {
      return cloneDeep(this.config.items.find(v => v.field === field) || {})
    },
    $_renderItems (items, h) {
      // const { $_onColClick } = this
      return items.map(item => {
        return h('el-col',
          {
            key: item.field,
            props: item.colProps,
            nativeOn: {
              click: () => {
                this.$_onColClick(item.field)
              }
            }
          },
          [
            h(
              'el-form-item',
              { props: item.formItemProps },
              [
                h(item.type, {
                  props: {
                    ...omit(item, ['colProps', 'formItemProps']),
                    value: this.formData[item.field]
                  }
                })
              ]
            )
          ]
        )
      })
    },
    $_onColClick (field) {
      console.log(field)
      console.log(this.getItemConfig(field))
    }
  }
}
