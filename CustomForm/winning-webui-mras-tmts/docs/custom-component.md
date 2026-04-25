```html
<template>
  <div>
    自定义组件
  </div>
</template>

<script>
export default {
  name: 'xxx',
  // 由 SmartForm 注入的方法
  inject: [
    // { mode, apiParams, valueMap }
    'providedProps',

    // 解析自定义组件的自定义配置
    'parseCustomCompConfig',

    // 表单的事件总线
    '$formBus',

    // 获取当前表单数据模型
    'getFormData'
  ],

  props: {
    // 对应 SmartForm 的 mode
    // 'design'(设计模式), 'app'(应用模式, 可以交互), 'view'(浏览模式, 禁用表单交互)
    mode: {
      type: String,
      default: 'app'
    },

    valueMap: {
      type: Object,
      // 注意: hospitalSOID 和 employeeId 都应该是申请医师的, 不是当前登录人的
      // { hospitalSOID, employeeId, disableAgreeAction, disableFetchRemoteData }
      default: () => ({})
    }
    
  },

  data () {
    return {
      loading: false
    }
  },
  created () {
    // 监听表单字段的变化
    this.$formBus.$on('change-field', this.$_onChangeField)
  },

  beforeDestroy () {
    this.$formBus.$on('change-field', this.$_onChangeField)
  },

  methods: {
    $_onChangeField (params) {
      console.log(params)
    }
  }
}
</script>

```
