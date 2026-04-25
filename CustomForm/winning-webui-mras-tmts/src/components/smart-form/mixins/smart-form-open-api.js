// 应用在 \src\components\smart-form\index.vue 中, 用于暴露 api
import Vue from 'vue'
import { cloneDeep, get, set, omit, merge, has } from 'lodash'
import { genFormDataFromFormItems, genFormItem } from '../utils'
import { daysBetween } from '../utils/date'
import { parseJsValue } from '@/utils/parse-code'
const $formBus = new Vue()

export default {
  provide () {
    return {
      getFormData: this.getFormData,
      updateField: this.updateField,
      updateFormItemEntityProps: this.updateFormItemEntityProps,
      $formBus
    }
  },
  data () {
    return {
      // 注册的自定义组件名 [{ text, value, desc, custom: true }]
      customComps: []
    }
  },
  created () {
    $formBus.$on('change-field', this.$_onChangeField)
    $formBus.$on('fetch-remote-data-done', this.$_onFetchRemoteDataDone)
  },
  beforeDestroy () {
    $formBus.$off('change-field', this.$_onChangeField)
    $formBus.$off('fetch-remote-data-done', this.$_onFetchRemoteDataDone)
  },
  methods: {
    setFormData (formData) {
      this.formData = merge({}, this.formData, formData)
    },
    // 隐藏的组件不要落库 暂时全量处理 后缀可加个参数 隐藏元素是否落库
    // notBindToModel   不需要绑定到表单数据模型 如text empty divider
    // display  隐藏的组件元素
    // displaySaveData 隐藏组件但需要保存数据
    getFormData () {
      const formData = {}
      // 过滤无需保存数据的隐藏组件
      const showItems = this.config.items.filter(v => !v.notBindToModel && (v.display !== false || v.displaySaveData))

      showItems.forEach((v) => {
        let value = this.formData[v.field]
        // 处理表格组件：如果只有一行空数据，返回空数组
        if (v.type === 'table' && Array.isArray(value) && value.length === 1) {
          const tableComp = this.getComponent(v.field)
          if (tableComp && tableComp.isEmptyRow && tableComp.isEmptyRow(value[0])) {
            value = []
          }
        }
        formData[v.field] = value
        if (v.relatedField) {
          formData[v.relatedField] = this.formData[v.relatedField]
        }
      })
      return formData
    },

    getFormEventBus () {
      return $formBus
    },
    getFormBus () {
      return $formBus
    },
    getComponent (field) {
      const refs = this.$refs[`formItemEntity-${field}`]
      return (refs || [])[0]
    },
    getCustomComponent (field) {
      const refs = this.$refs[`custom-${field}`]
      return (refs || [])[0]
    },
    reRender () {
      this.canRender = false
      this.$nextTick(() => {
        this.canRender = true
      })
    },

    // 表单相关
    validate (callback) {
      const items = this.config.items
      const { wfNodeName } = this.valueMap

      // 同时校验表单基础字段和表格组件
      // 先校验表格（无论表单校验结果如何）
      const tableValidateResults = this.validateTables()

      // 校验表单基础字段
      this.$refs.form.validate((valid, invalidFields) => {
        // 处理表单校验结果
        const { filteredFields, filteredinvalidFields } = this.$_filterInvalidFields(invalidFields, items, wfNodeName)

        // 合并表单错误和表格错误
        const allErrors = { ...filteredinvalidFields }

        // 如果表格校验不通过，合并表格错误
        if (!tableValidateResults.valid) {
          const tableErrors = this.formatTableErrors(tableValidateResults.errors)
          Object.keys(tableErrors).forEach(field => {
            if (!allErrors[field]) {
              allErrors[field] = []
            }
            allErrors[field].push(...tableErrors[field])
          })
        }

        // 判断最终校验结果
        const formValid = filteredFields.length === 0
        const tableValid = tableValidateResults.valid
        const isValid = formValid && tableValid

        // 定位到对应位置（优先定位表单错误）
        if (filteredFields.length > 0) {
          const firstField = filteredFields[0]
          this.$refs[`formItemEntity-${firstField}`]?.[0]?.$el?.scrollIntoView()
        } else if (!tableValid) {
          // 如果只有表格错误，定位到第一个表格
          const firstTableError = tableValidateResults.errors[0]
          if (firstTableError) {
            // 使用 tableField 获取表格组件的 field
            const tableComp = this.getComponent(firstTableError.tableField)
            tableComp?.scrollIntoView?.()
          }
        }

        callback && callback(isValid, allErrors)
      })
    },

    // 校验所有表格组件的内部必填列
    validateTables () {
      const tableItems = this.config.items.filter(item => item.type === 'table')
      const allErrors = []

      tableItems.forEach(item => {
        const tableComp = this.getComponent(item.field)
        if (tableComp && tableComp.validate) {
          const result = tableComp.validate()
          if (!result.valid) {
            // 创建错误副本，添加表格 field 信息，不修改原始对象
            result.errors.forEach(err => {
              allErrors.push({
                ...err,
                tableField: item.field, // 表格组件的 field
                tableLabel: item.formItemProps?.label || '表格'
              })
            })
          }
        }
      })

      return {
        valid: allErrors.length === 0,
        errors: allErrors
      }
    },

    // 格式化表格错误为 invalidFields 格式
    formatTableErrors (errors) {
      const invalidFields = {}
      errors.forEach(err => {
        // 使用 tableField 作为 key，方便上层按表格分组
        const fieldKey = err.tableField
        if (!invalidFields[fieldKey]) {
          invalidFields[fieldKey] = []
        }
        invalidFields[fieldKey].push({
          field: fieldKey,
          label: err.tableLabel,
          message: err.message,
          columnLabel: err.columnLabel,
          rowIndex: err.rowIndex
        })
      })
      return invalidFields
    },
    // 提取出过滤无效字段的逻辑，提高可读性和复用性
    $_filterInvalidFields (invalidFields, items, wfNodeName) {
      // const filteredFields = Object.keys(invalidFields).filter(field => {
      //   const currentItem = items.find(v => v.field === field)
      //   if (
      //     currentItem.editWfNodeNames &&
      // (!wfNodeName || !currentItem.editWfNodeNames.split(',').includes(wfNodeName))
      //   ) {
      //     return false
      //   }

      //   return true
      // })
      // 不用过滤了
      const filteredFields = Object.keys(invalidFields)

      const filteredinvalidFields = {}
      Object.keys(invalidFields).forEach(field => {
        const currentItem = items.find(v => v.field === field)
        filteredinvalidFields[field] = invalidFields[field]
        filteredinvalidFields[field].forEach(v => {
          v.label = currentItem.formItemProps.label
        })
      })

      return { filteredFields, filteredinvalidFields }
    },
    validateField (props, callback) {
      return this.$refs.form.validateField(props, callback)
    },
    resetFields () {
      return this.$refs.form.resetFields()
    },
    clearValidate (props) {
      return this.$refs.form.clearValidate(props)
    },

    /**
     * 注册自定义组件
     * @author wangkai 2022-10-28T14:29:53+0800
     * @param  {Object} componentInfo {
     *                                  text: '自定义表格',
     *                                  value: 'CustomTable', // 组件名称
     *                                  desc: '自定义的表格'
     *                                }
     * @param  {Object} component     组件
     * @return {[type]}               [description]
     */
    registerComponent (componentInfo, component) {
      console.log(componentInfo, component)
      const compName = componentInfo.value
      if (this.$options.components[compName]) {
        console.warn(`${compName} 已注册！`)
      } else {
        if (component) {
          // 如果组件已经全局注册了, 则可以不传
          this.$options.components[compName] = component
        }
      }

      const info = cloneDeep(componentInfo)
      info.custom = true
      if (this.customComps.findIndex(v => v.value === info.value) === -1) {
        this.customComps.push(info)
      }

      return true
    },
    // 批量注册
    registerComponents (list) {
      const { customComps } = this

      const infos = []
      const components = {}
      let compName
      let info
      list.forEach(({ componentInfo, component }) => {
        compName = componentInfo.value
        if (this.$options.components[compName]) {
          console.warn(`${compName} 已注册！`)
        } else {
          if (component) {
            // 如果组件已经全局注册了, 则可以不传
            components[compName] = component
          }
        }

        info = cloneDeep(componentInfo)
        info.custom = true
        if (customComps.findIndex(v => v.value === info.value) === -1) {
          infos.push(info)
        }
      })

      this.customComps = this.customComps.concat(infos)
      Object.assign(this.$options.components, components)
      return true
    },
    // 更新指定表单项的值
    updateField (path, value) {
      const oldValue = get(this.formData, path)

      set(this.formData, path, value)
      console.log('updateField', this.formData, path, value)
      this.onChangeAction(path, value)
      try {
        this.$refs.form.validateField(path)
      } catch (e) {}
      $formBus.$emit('change-field', {
        field: path,
        value,
        oldValue
      })
    },
    // 更新指定表单项的 entityProps（设计态表格列变更时使用）
    updateFormItemEntityProps (field, entityProps) {
      const item = this.config.items.find(v => v.field === field)
      if (item) {
        item.formItemEntityProps = entityProps
        // 更新 formData 以触发重新渲染
        if (this.mode === 'design') {
          this.formData = genFormDataFromFormItems(this.config.items, this.valueMap, this.apiParams)
          // 通知 SmartFormDesign 更新右侧配置面板
          this.$emit('active-field-change', item)
        }
      }
    },
    // path 是field 要换成唯一id
    onChangeAction (path, value) {
      const currentItems = this.getItemConfig(path)
      const item = this.config.items.find(v => v.id === currentItems.id)
      if (item) { this.changeAction(item, value) } // 当前元素id有绑定联动

      // 查询其他元素id是否有 当前元素的条件 有则处理其他元素ID的关联逻辑
      this.config.items.forEach((v) => {
        if (!v.linkageProps || v.linkageProps.length === 0) return
        v.linkageProps.forEach(it => {
          const watchEvent = it.judgeList.filter(judge => judge.exportObjKey !== v.id && judge.exportObjKey === currentItems.id)
          if (watchEvent.length > 0) {
            // 只处理这一个关联逻辑
            const smallLinkProps = cloneDeep(v)
            smallLinkProps.linkageProps = [it]
            this.changeAction(smallLinkProps, value)
          }
        })
      })
    },

    changeAction (item, value) {
      if (!item.linkageProps || item.linkageProps.length === 0) return
      item.linkageProps.forEach((v) => {
        switch (v.event) {
          case 'onChange': // 值变化
            if (this.handleJudgeCondition(v.judgeList, value)) {
              this.toAction(v, value)
            }
            break
          case 'beHide': // 被隐藏
            this.toAction(v, value)
            break
          case 'beShow': // 被显示
            break
          case 'beDisabled': // 被禁用
            break
          case 'beEnabled': // 被启用
            break
        }
      }
      )
    },
    toAction (linkageProp) {
      const reg = /^\$valueMap\s{0,}:\s{0,}/i
      let dayNum = ''
      let total = 0
      linkageProp.targetList.forEach((it) => {
        if (!Array.isArray(it.target)) {
          const actionItem = this.getItemById(it.target)
          console.log('actionItem.toFixed', actionItem)
          console.log('it.toFixed', it)
          if (!actionItem) return
          switch (it.action) {
            case 'setValue': // 去设置值
              if (reg.test(it.toValue)) {
                const toValue = it.toValue.replace(reg, '')
                this.formData[actionItem.field] = get(this.providedProps.valueMap, toValue)
                if (actionItem.type === 'text') {
                  actionItem.defaultValue = get(this.providedProps.valueMap, toValue)
                }
              } else {
                this.formData[actionItem.field] = it.toValue
                if (actionItem.type === 'text') {
                  actionItem.defaultValue = it.toValue
                }
              }
              break
            case 'calculateDiffDay': // 日期差
              if (linkageProp.judgeList.length === 2) {
                const startField = this.getFieldById(linkageProp.judgeList[0].exportObjKey)
                const endField = this.getFieldById(linkageProp.judgeList[1].exportObjKey)
                const startDate = this.formData[startField]
                const endDate = this.formData[endField]
                dayNum = daysBetween(startDate, endDate)
                this.formData[actionItem.field] = dayNum
              }

              break
            case 'numberAdd': // 数值（加法）
              if (linkageProp.judgeList.length > 0) {
                linkageProp.judgeList.forEach(v => {
                  total += this.formData[this.getFieldById(v.exportObjKey)] || 0
                })

                this.formData[actionItem.field] = total
              }
              break
            case 'numberReduce': // 数值（减法）
              if (linkageProp.judgeList.length === 2) {
                const startField = this.getFieldById(linkageProp.judgeList[0].exportObjKey)
                const endField = this.getFieldById(linkageProp.judgeList[1].exportObjKey)
                const number1 = this.formData[startField]
                const number2 = this.formData[endField]
                const value = number2 - number1
                this.formData[actionItem.field] = value
              }
              break
          }
        } else {
          this.config.items.forEach((v, index) => {
            if (!it.target.includes(v.id)) return
            const actionItem = this.config.items[index]
            console.log('actionItem', actionItem)
            const formItemEntityProps = JSON.parse(actionItem.formItemEntityProps)
            if (index < 0) return
            switch (it.action) {
              case 'toShow': // 去显示
                actionItem.display = true
                break
              case 'toHide': // 去隐藏
                actionItem.display = false
                break
              case 'toRequired':// 去设置必填
                this.toSetRequired(actionItem, true)
                break
              case 'toNotRequired':// 去设置非必填
                this.toSetRequired(actionItem, false)
                break
              case 'toDisabled': // todo 去禁用
                formItemEntityProps.disabled = true
                actionItem.formItemEntityProps = JSON.stringify(formItemEntityProps)
                break
              case 'toEnabled': // todo 去启用
                formItemEntityProps.disabled = false
                actionItem.formItemEntityProps = JSON.stringify(formItemEntityProps)
                break
              case 'clearValue': // 去清空值
                this.formData[actionItem.field] = ''
                break
            }
          })
        }
      })
    },
    handleJudgeCondition (judgeList, currentValue) {
      let conditionFlag = false

      if (!judgeList || judgeList.length === 0) return

      judgeList.forEach((c, index) => {
        const currentItems = this.getItemConfigByID(c.exportObjKey)

        // if (index !== 0) condition = condition + c.relation
        let value = currentValue
        // 如果有不是当前对象
        if (currentItems && currentItems.field) {
          value = this.formData[currentItems.field]
        }
        switch (c.judge.value) {
          case '=': // 等于
            conditionFlag = value === c.value
            break
          case '!=': // 不等于
            conditionFlag = value !== c.value
            break
          case '>': // 大于
            conditionFlag = Number(value) > Number(c.value)

            break
          case '>=': // 大于等于
            conditionFlag = Number(value) >= Number(c.value)
            break
          case '<': // 小于
            conditionFlag = Number(value) < Number(c.value)
            break
          case '<=': // 小于等于
            conditionFlag = Number(value) <= Number(c.value)
            break
          case 'contain': // 包含
            conditionFlag = value && value.includes && value.includes(c.value)

            break
          case 'noContain': // 不包含  为空也在内
            conditionFlag = !value || (value && value.includes && !value.includes(c.value))

            break
          case 'empty': // 为空
            conditionFlag = !value || value == null || value === false || value.length === 0

            break
          case 'noEmpty': // 不为空
            conditionFlag = value || value !== null || value !== false || value.length === 0
            break
        }
      })
      return conditionFlag
    },

    // 去设置必填非必填
    toSetRequired (itemData, value) {
      const itemRule = {
        required: value,
        message: '必填',
        trigger: ['input', 'inputNumber'].includes(itemData.type) ? 'blur' : 'change'
      }
      // 需要同步到 formProps.rulesStr
      let formRules = {}
      const { formProps } = this.getConfig()
      try {
        formRules = parseJsValue(formProps?.rulesStr)?.value || {}
      } catch (e) {}

      if (Array.isArray(formRules[itemData.field])) {
        const index = formRules[itemData.field].findIndex(v => has(v, 'required'))
        if (index === -1) {
          formRules[itemData.field].push(itemRule)
        } else {
          formRules[itemData.field][0] = itemRule
        }
      } else {
        formRules[itemData.field] = [itemRule]
      }
      formProps.rulesStr = JSON.stringify(formRules)
      this.config.formProps = formProps

      // this.setConfig({
      //   formProps
      // }, {
      //   disableEmitToBus: true
      // })
    },
    // 根据ID查field
    getFieldById (id) {
      const configIndex = this.config.items.findIndex(v => v.id === id)
      if (configIndex < 0) return ''
      const actionItem = this.config.items[configIndex]
      return actionItem.field
    },
    // 根据ID查item
    getItemById (id) {
      const configIndex = this.config.items.findIndex(v => v.id === id)
      if (configIndex < 0) return ''
      return this.config.items[configIndex]
    },

    getConfig () {
      return cloneDeep(this.config)
    },
    setConfig (config, options) {
      const oldItems = cloneDeep(this.config.items)
      const newItems = cloneDeep(config.items)
      const newConfig = merge(
        {},
        omit(this.config, 'items'),
        omit(config, 'items')
      )
      if (Array.isArray(newItems)) {
        newConfig.items = newItems
      } else {
        newConfig.items = oldItems
      }
      this.formData = genFormDataFromFormItems(newConfig?.items || [], this.providedProps.valueMap, this.providedProps.apiParams)
      this.config = newConfig

      if (!options?.disableEmitToBus) {
        $formBus.$emit('config-changed', newConfig)
      }
    },
    updateFormItem (id, newItem) {
      const { items } = this.config
      const index = items.findIndex(v => v.id === id)
      if (index === -1) {
        console.warn(`没有找到指定的 item(${id})`)
        return
      }

      this.config.items.splice(
        index,
        1,
        // 不得修改 id, 所以需要 omit 掉
        newItem)

      if (this.mode === 'design') {
        this.formData = genFormDataFromFormItems(this.config.items, this.providedProps.valueMap, this.providedProps.apiParams)
      }
    },
    // 对指定表单项禁用
    disableFields (fields) {
      // TODO
    },

    getFieldFinalData (field) {
      return cloneDeep(this.getComponent(field)?.finalData)
    },

    setFieldFinalData (field, data) {
      const comp = this.getComponent(field)
      if (comp) {
        comp.finalData = data
        comp.toBeFinalData = data
        return true
      }
      return false
    },

    // 判断当前 field 是否已存在
    existField (field) {
      return (this.config.items || []).findIndex(v => v.field === field) !== -1
    },
    existId (id) {
      return (this.config.items || []).findIndex(v => v.id === id) !== -1
    },
    setActiveField (field) {
      this.activeFieldId = field
    },

    // 插入内置组件
    pushTypedItem (type, options) {
      const formItemConf = genFormItem(type, options)
      if (this.existField(formItemConf.field)) {
        this.$message.warning('生成的 field 重复，请重试！')
        return
      }
      if (this.existId(formItemConf.id)) {
        this.$message.warning('生成的 id 重复，请重试！')
        return
      }
      if (type === 'text') {
        formItemConf.defaultValue = formItemConf.formItemProps.label
      }
      this.config.items.push(formItemConf)
      console.log('formItemConf', formItemConf)
    },
    pushCustomItem (customCompName) {
      const formItemConf = genFormItem('', { customCompName })
      if (this.existField(formItemConf.field)) {
        this.$message.warning('生成的 field 重复，请重试！')
        return
      }
      if (this.existId(formItemConf.id)) {
        this.$message.warning('生成的 id 重复，请重试！')
        return
      }
      this.config.items.push(formItemConf)
    },
    removeItem (id) {
      if (!id) return

      const index = this.config.items.findIndex(v => v.id === id)
      if (index === -1) return

      this.config.items.splice(index, 1)
    },
    // TODO
    insertItem () {},
    clearItems () {
      this.config.items = []
    },

    getItemConfig (field) {
      return cloneDeep(this.config.items.find(v => v.field === field) || {})
    },
    getItemConfigByID (id) {
      return cloneDeep(this.config.items.find(v => v.id === id) || {})
    },

    // params: { field, value, oldValue }
    $_onChangeField (params) {
      this.$emit('change-field', params)
      console.log(params, '$_onChangeField')
    },
    $_onFetchRemoteDataDone () {
      this.$emit('fetch-remote-data-done')
    }
  }
}
