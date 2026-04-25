<template>
  <div class="rules-config">
    <RulesRequired ref="rulesRequired"
      @change="onRulesRequiredChange"
      @input="onRulesRequiredChange"
    />
    <RulesPattern
    ref="rulesPattern"
     @change="onRulesPatternChange"
    @input="onRulesPatternChange"></RulesPattern>

    <!-- <el-input v-model.trim="formData.rulesStr"
      type="textarea" :autosize="autosize"
      placeholder="补充自定义校验规则，应该是一个可解析的 JSON 对象数组，如：[{ required: true, message: '请输入名称', trigger: 'blur' }]"
    /> -->
  </div>
</template>

<script>
import { has } from 'lodash'
import { parseJsValue } from '@/utils/parse-code'
import RulesRequired from './RulesRequired'
import RulesPattern from './RulesPattern'

export default {
  name: 'RulesConfig',

  inject: ['setConfig'],

  props: {
    itemData: {
      type: Object,
      default: () => ({})
    },
    formConfig: {
      type: Object,
      default: () => ({})
    }
  },

  components: {
    RulesRequired, RulesPattern
  },

  data () {
    return {
      autosize: {
        minRows: 5,
        maxRows: 10
      },
      formData: {
        rulesStr: ''
      },
      showElseRule: false
    }
  }, // end of data

  watch: {
    itemData: 'syncRulesRequired'
  },

  mounted () {
    this.$nextTick(() => {
      this.syncRulesRequired()
      this.validateRulesPattern()
    })
  },

  methods: {
    syncRulesRequired () {
      // 图快 写了两套逻辑
      const { validateRulesRequired, validateRulesPattern } = this.itemData
      if (validateRulesRequired) {
        // 根据数据元属性“是否必填”，动态设置
        this.$refs.rulesRequired && this.$refs.rulesRequired.setData(JSON.parse(validateRulesRequired))
      } else {
        const formRules = parseJsValue(this.formConfig.formProps?.rulesStr)?.value || {}
        const index = formRules[this.itemData.field].findIndex(v => has(v, 'required'))
        this.$refs.rulesRequired && this.$refs.rulesRequired.setData(
          formRules[this.itemData.field] ? formRules[this.itemData.field][index] : { required: false }
        )
      }
      if (validateRulesPattern) {
        const patternObj = JSON.parse(validateRulesPattern)
        // 根据数据元属性“是否有正则校验”，动态设置
        this.$refs.rulesPattern && this.$refs.rulesPattern.setData({
          isPattern: true,
          ...patternObj
        })
      } else {
        const formRules = parseJsValue(this.formConfig.formProps?.rulesStr)?.value || {}
        if (formRules) {
          const index = formRules[this.itemData.field].findIndex(v => has(v, 'pattern'))
          if (index > -1) {
            const patternObj = formRules[this.itemData.field][index]
            this.$refs.rulesPattern && this.$refs.rulesPattern.setData({
              isPattern: true,
              ...patternObj
            })
          } else {
            this.$refs.rulesPattern && this.$refs.rulesPattern.setData(
              { isPattern: false }
            )
          }
        } else {
          this.$refs.rulesPattern && this.$refs.rulesPattern.setData(
            { isPattern: false }
          )
        }
      }
    },
    validateRulesPattern () {
      const { validateRulesPattern } = this.itemData
      if (validateRulesPattern) {
        // 根据数据元属性“正则校验”，动态设置
        this.$refs.rulesPattern && this.$refs.rulesPattern.setData(JSON.parse(validateRulesPattern))
      } else {
        const formRules = parseJsValue(this.formConfig.formProps?.rulesStr)?.value || {}

        if (formRules[this.itemData.field]) {
          const index = formRules[this.itemData.field].findIndex(v => has(v, 'pattern'))
          this.$refs.rulesPattern && this.$refs.rulesPattern.setData(
            formRules[this.itemData.field][index]
          )
        } else {
          this.$refs.rulesPattern && this.$refs.rulesPattern.setData(
            { isPattern: false }
          )
        }
      }
    },

    onRulesRequiredChange (v) {
      const itemRule = {
        ...v,
        // 'input', 'inputNumber' 为 blur
        // 'radio', 'checkbox', 'select', 'switch', 'timePicker', 'datePicker' 为 change
        trigger: ['input', 'inputNumber'].includes(this.itemData.type) ? 'blur' : 'change'
      }

      // 需要同步到 formProps.rulesStr
      let formRules = {}
      const { formProps } = this.formConfig || {}
      try {
        formRules = parseJsValue(formProps?.rulesStr)?.value || {}
      } catch (e) {}

      if (Array.isArray(formRules[this.itemData.field])) {
        const index = formRules[this.itemData.field].findIndex(v => has(v, 'required'))
        if (index === -1) {
          formRules[this.itemData.field].push(itemRule)
        } else {
          formRules[this.itemData.field][index] = itemRule
        }
      } else {
        formRules[this.itemData.field] = [itemRule]
      }

      formProps.rulesStr = JSON.stringify(formRules)
      this.formData.validateRulesRequired = JSON.stringify(itemRule)
      this.setConfig({
        formProps
      }, {
        disableEmitToBus: true
      })

      Object.assign(this.itemData, {
        validateRulesRequired: JSON.stringify(itemRule),
        validateRulesCustom: this.formData.rulesStr
      })
    },
    onRulesPatternChange (v) {
      const itemRule = {
        pattern: v.pattern,
        message: v.message,
        trigger: ['input', 'inputNumber'].includes(this.itemData.type) ? 'blur' : 'change'
      }
      console.log('pattern', itemRule)

      // 需要同步到 formProps.rulesStr
      let formRules = {}
      const { formProps } = this.formConfig || {}
      try {
        formRules = parseJsValue(formProps?.rulesStr)?.value || {}
      } catch (e) {}
      if (v.isPattern) { // 开启正则
        if (Array.isArray(formRules[this.itemData.field])) {
          const index = formRules[this.itemData.field].findIndex(v => has(v, 'pattern'))
          if (index === -1) {
            formRules[this.itemData.field].push(itemRule)
          } else {
            formRules[this.itemData.field][index] = itemRule
          }
        } else {
          formRules[this.itemData.field] = [itemRule]
        }
        formProps.rulesStr = JSON.stringify(formRules)
        this.formData.validateRulesPattern = JSON.stringify(itemRule)
        Object.assign(this.itemData, {
          validateRulesPattern: JSON.stringify(itemRule),
          validateRulesCustom: this.formData.rulesStr
        })
      } else { // 关闭
        if (Array.isArray(formRules[this.itemData.field])) {
          const index = formRules[this.itemData.field].findIndex(v => has(v, 'pattern'))
          if (index >= 0) {
            formRules[this.itemData.field].splice(index, 1)
            console.log('formRules', formRules[this.itemData.field])
          }
        }
        formProps.rulesStr = JSON.stringify(formRules)
        this.formData.validateRulesPattern = JSON.stringify(itemRule)
        Object.assign(this.itemData, {
          validateRulesPattern: null
        })
      }
      this.setConfig({
        formProps
      }, {
        disableEmitToBus: true
      })
    }
  } // end of methods
}
</script>
