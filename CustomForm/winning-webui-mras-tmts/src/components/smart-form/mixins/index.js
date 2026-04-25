import { cloneDeep, isEqual } from 'lodash'
import { parseJsValue } from '@/utils/parse-code'
import { parseParamsSchema } from '@/utils/parse-params'

export default {
  inject: ['providedProps', 'updateField', 'updateFormItemEntityProps', '$formBus'],
  props: [
    'value',
    'field',
    'valueMap',
    // 具体的表单组件(如: <el-input />, <el-checkbox-group /> 等)的 props
    'formItemEntityProps',

    // 具体的表单组件的子组件的 props(并不是所有的具体的表单组件都有子组件)
    // 比如复选框组:
    // <el-checkbox-group v-bind="formItemEntityProps">
    //   <el-checkbox v-bind="formItemEntityChildProps" />
    // </el-checkbox-group>
    // <el-select v-bind="formItemEntityProps">
    //   <el-option v-bind="formItemEntityChildProps" />
    // </el-select>
    'formItemEntityChildProps',
    'formProps',
    'relatedField', // 关联字段
    'editWfNodeNames' // 可编辑审批节点
  ],
  data () {
    return {
      loading: false,
      localValue: this.value
    }
  },
  computed: {

    parsedFormItemEntityProps () {
      let data = {}
      try {
        data = parseJsValue(this.formItemEntityProps)?.value || {}

        // 暂时只支持 valueMap
        data = parseParamsSchema(data, null, null, this.valueMap)
      } catch (e) {}
      const { wfNodeName, executedStatus } = this.valueMap // wfNodeName 当前节点名称   executedStatus：当前人对这个单子的状态： todo 审批操作
      const { mode } = this.providedProps
      // 是否可编辑
      if (mode === 'view') { // 浏览模式
        if (executedStatus !== 'todo') {
          data.disabled = true
        } else {
          if (this.editWfNodeNames && this.editWfNodeNames.split(',').includes(wfNodeName)) {
            data.disabled = false
          } else {
            data.disabled = true
          }
        }
      } else if (mode === 'app') {
        // 当有节点权限时，可编辑  valueMap.wfNodeName 为空或者不等于当前节点名称时，不可编辑
        if (this.editWfNodeNames && (!wfNodeName || !this.editWfNodeNames.split(',').includes(wfNodeName))) {
          data.disabled = true
        } else {
          data.disabled = data.disabled || false
        }
      }
      if (data.remote) { // 远程搜索
        data.remoteMethod = this.onRemoteMethod
      }
      return data
    },
    parsedFormItemEntityChildProps () {
      let data = {}
      try {
        data = parseJsValue(this.formItemEntityChildProps)?.value || {}
      } catch (e) {}
      const { mode } = this.providedProps
      if (mode === 'view') { // 浏览模式
        if (this.editWfNodeNames && this.editWfNodeNames.split(',').includes(this.valueMap.wfNodeName)) {
          data.disabled = false
        } else {
          data.disabled = true
        }
      }
      return data
    }
  },
  watch: {
    value (val) {
      const oldVal = cloneDeep(this.localValue)
      const newVal = cloneDeep(val)
      this.localValue = newVal

      if (!isEqual(oldVal, newVal)) {
        this.$formBus.$emit('change-field', {
          field: this.field,
          value: newVal,
          oldValue: oldVal
        })
      }
    }
  },
  created () {
    this.$formBus.$on('change-field', this.$_onChangeField)
  },
  beforeDestroy () {
    this.$formBus.$off('change-field', this.$_onChangeField)
  },
  methods: {
    $_onChangeField (val) {
      // console.log('\n')
      // console.log(`handled in ${this.$options.name}`)
      // console.log(val)
      // console.log('\n')
    },
    updateRelatedField (val, multiple) {
      const selectTexts = []
      this.finalData.forEach(v => {
        if (val === v.value || val.includes(v.value)) {
          selectTexts.push(v.text)
        }
      })
      let localText = ''
      const { symbol } = this.parsedFormItemEntityProps
      if (multiple) {
        localText = selectTexts.join(symbol || ',')
      } else {
        localText = selectTexts.toString()
      }
      this.updateField(this.relatedField, localText)
    }

  }
}
