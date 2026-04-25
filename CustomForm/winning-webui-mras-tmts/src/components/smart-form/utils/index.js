import { nanoid } from 'nanoid'
import { set, merge, has, isPlainObject } from 'lodash'
import {
  REG_VISIT_PATH,
  // REG_FORM_PATH,
  REG_VALUE_MAP_PATH,
  parseParamTemplate
} from '@/utils/parse-params'
import { mockStaticData } from './mock'

function genItemId () {
  return nanoid(7)
}

function genItemField () {
  return nanoid(7)
}

// https://element.eleme.cn/#/zh-CN/component/form#form-attributes
function genDefaultFormProps () {
  return {
    border: false, // 是否有边框(这不是 element ui 的 form 属性)
    // right(默认)/left/top
    labelPosition: 'right',
    labelWidth: 'auto',
    // default / medium / small / mini
    size: 'mini',
    showMessage: true,
    // 是否固定表单项的高
    // 某些情况下，表单项固定为统一高度对排版和视觉更友好，请按需开启。
    // 开启固定高度后，如果默认的表单项高度不适用于某个表单项（比如文本域），
    // 可以在【表单项设置 - 风格样式】中设置自定义高度。
    fixItemHeight: false,
    // 同 element-ui 表单组件的 rules 选项
    // https://element.eleme.cn/#/zh-CN/component/form
    rulesStr: '{}',
    approvalShowFormMode: 'app' // 审批中显示模式
  }
}

function genDefaultFormItem (type) {
  const needAllCols = ['text', 'empty', 'divider'].includes(type) || !type
  return {
    // 在一个 form 中唯一, 不可修改, 主要用于系统操作
    id: genItemId(),
    // 在一个 form 中唯一, 可修改, 主要用于表单绑定值得 key, 支持 . 操作符
    field: genItemField(),
    styles: '',

    // 内置的组件用 type
    type: 'input',
    // 自定义组件用组件名
    // 需要先注册
    customCompName: '',
    customCompConfig: '',

    // 是否不绑定到表单数据模型
    // 比如文本展示组件就无需绑定
    notBindToModel: false,

    // 表单项的默认值, 如果是文本组件(即 type 为 'text'), 则用于显示文本
    // 如果是以 $valueMap: 开头, 则从 valueMap prop 中取值
    defaultValue: '',
    // 值类型: array / object / number / string / boolean
    valueType: 'string',

    // <el-col /> props
    // https://element.eleme.cn/#/zh-CN/component/layout#col-attributes
    colProps: {
      span: needAllCols ? 24 : 12
    },

    // <el-form-item /> props
    // https://element.eleme.cn/#/zh-CN/component/form#form-item-attributes
    formItemProps: {
      label: '标签名'
    },

    // 具体的表单组件(如: <el-input />, <el-checkbox-group /> 等)的 props
    formItemEntityProps: '{}',
    // 具体的表单组件的子组件的 props(并不是所有的具体的表单组件都有子组件)
    // 比如复选框组:
    // <el-checkbox-group v-bind="formItemEntityProps">
    //   <el-checkbox v-bind="formItemEntityChildProps" />
    // </el-checkbox-group>
    // <el-select v-bind="formItemEntityProps">
    //   <el-option v-bind="formItemEntityChildProps" />
    // </el-select>
    formItemEntityChildProps: '{}',

    // static(静态数据源, 即自行配置的), dataElement(数据元方式), api(后台接口获取), term(术语)
    dataOrigin: 'static',

    // 当且仅当 dataOrigin 为 dataElement 时有效
    dataElement: null,

    // 当且仅当 dataOrigin 为 term 时有效
    termParams: {
      conceptDomainId: '', // 概念域, 概念域下可能有多个编码体系
      codeSystemId: '' // 编码体系
    },

    // 用户自行配置的静态数据, 当 dataOrigin 为 static 时有效
    staticData: JSON.stringify(mockStaticData(2)),
    // api 数据, 当 dataOrigin 为 api 时有效
    apiData: null,
    apiConf: {
      url: '',
      method: 'post',
      params: '{}', // 请求参数
      headers: '{}',
      dataProcessor: '',
      dictTypeCode: ''
    },
    /*
     * 文本元素的星号配置(仅用于文本元素)
     */
    textAsterisk: `{
      // 'left' / 'right', 其他值不显示
      position: 'left',
      // 'visible': 可见
      // 'hidden': 不可见, 一般用于与显示了星号的文本元素的对齐操作
      visibility: 'hidden'
    }`,
    remarks: '', // 备注内容
    hideLabel: false, // 隐藏label
    display: true,
    displaySaveData: false, // 隐藏组件但保存数据
    linkageProps: [], // 联动设置
    // 表单项规则: 必填
    validateRulesRequired: JSON.stringify({
      required: false,
      message: '不能为空'
    }),
    // 表单校验规则: 自定义输入
    validateRulesCustom: ''
  }
} // end of genDefaultFormItem

function isValidFormItemSchcma (item) {
  return has(item, 'id') &&
    has(item, 'field') &&
    has(item, 'colProps.span') &&
    has(item, 'formItemProps.label')
}

/**
 * 生成表单组件的配置
 * @author wangkai 2022-10-25T09:31:06+0800
 * @param  {String} type    radio/checkbox 等
 *                          参见 @/components/smart-form/consts/form-items
 * @param  {Object} options [description]
 * @return {Object}
 */
function genFormItem (type, options = {}) {
  const valueTypeMap = {
    input: 'string',
    radio: 'string',
    checkbox: 'string',
    select: 'string', // 如果可以多选, 则为 a
    switch: 'boolean',
    inputNumber: 'number',
    table: 'array'
  }
  const mergeData = merge(genDefaultFormItem(type), {
    notBindToModel: ['text', 'empty', 'divider'].includes(type),
    valueType: valueTypeMap[type] || 'string'
  }, options, { type })
  if (type === 'inputNumber') {
    mergeData.defaultValue = undefined
  }
  if (type === 'table') {
    mergeData.defaultValue = '[]' // 表格默认值为空数组
    mergeData.colProps.span = 24
    mergeData.formItemProps.label = ''
    mergeData.formItemProps.labelWidth = '0px'
    mergeData.formItemEntityProps = JSON.stringify({
      showSeq: true,
      seqLabel: '序号',
      showOperation: true,
      operationWidth: 90,
      showBottomAdd: true,
      columns: []
    })
  }
  return mergeData
}

function validateFormItems (items) {
  // 校验是否存在 field 为空的情况
  // 校验是否存在重复的 field
  let result = true
  let message = ''

  let item
  let field
  const fields = []
  for (let i = items.length - 1; i >= 0; i--) {
    item = items[i]
    field = item.field
    if (!field) {
      result = false
      message = '存在 field 为空的'
      break
    }

    if (fields.includes(field)) {
      result = false
      message = `存在 field(${field}) 重复的`
      break
    }

    fields.push(field)
  }

  return {
    result,
    message
  }
}

/**
 * 根据 form items 生成 formData
 * @author mathink12 2022-10-22T15:52:50+0800
 * @return {[type]} [description]
 */
function genFormDataFromFormItems (items, valueMap, apiParams) {
  if (!items || !Array.isArray(items)) return {}
  console.log('items', items)
  const formData = {}
  const res = validateFormItems(items)
  if (!res.result) {
    console.error(res.message)
    return formData
  }
  items.forEach(v => {
    if (!v.notBindToModel) {
      set(
        formData,
        v.field,
        // v.defaultValue || (['checkbox'].includes(v.type) ? [] : '')
        formatTypeValue(v.defaultValue, v.valueType, v.type, valueMap, apiParams)
      )
      // 关联配置字段 也有一套自己的默认数据
      if (v.relatedField) {
        set(
          formData,
          v.relatedField,
          formatTypeValue(v.relatedDefaultValue, v.relatedValueType, v.type, valueMap, apiParams)
        )
      }
    }
  })
  return formData
}

// 根据值类型, 格式化值(value 一定是 string 类型)
function formatTypeValue (value, type, component, valueMap, apiParams) {
  if (REG_VISIT_PATH.test(value) || REG_VALUE_MAP_PATH.test(value)) {
    return parseParamTemplate(value, apiParams, null, valueMap)
  }

  let finalValue = value
  function getNumberVal (value, component) {
    // 处理inputNumber默认值为空
    if (component === 'inputNumber' && value === undefined) {
      return undefined
    }
    return Number(value)
  }

  switch (type) {
    case 'string':
      break
    case 'number':
      finalValue = getNumberVal(value, component)
      break
    case 'boolean':
      finalValue = Boolean(value)
      break
    case 'array':
      try {
        finalValue = JSON.parse(value)
      } catch (e) {}
      if (!Array.isArray(finalValue)) {
        finalValue = []
      }
      break
    case 'object':
      try {
        finalValue = JSON.parse(value)
      } catch (e) {}
      if (!isPlainObject(finalValue)) {
        finalValue = {}
      }
      break
  }
  return finalValue
}

export {
  genItemId,
  genItemField,
  genDefaultFormProps,
  genFormItem,
  genFormDataFromFormItems,
  isValidFormItemSchcma
}
