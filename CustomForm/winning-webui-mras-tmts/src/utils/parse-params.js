import { get } from 'lodash'

// 从传给 <smart-form /> 组件的 apiParams prop 读取
// parseParamTemplate('$visitPath: age')
const REG_VISIT_PATH = /^\$visitPath\s{0,}:\s{0,}/i

// 从当前 SmartForm 组件实例绑定的数据模型获取
// parseParamTemplate('$formPath: age')
const REG_FORM_PATH = /^\$formPath\s{0,}:\s{0,}/i

// 从传给 <smart-form /> 组件的 valueMap prop 读取
// parseParamTemplate('$valueMap: age')
const REG_VALUE_MAP_PATH = /^\$valueMap\s{0,}:\s{0,}/i

/**
 * 解析参数字符串模板模板
 *   parseParamTemplate('$string:age') === 'age'
 *   parseParamTemplate('$string:1.2') === '1.2'
 *   parseParamTemplate('1.2') === '1.2' // 如果是字符串, 则可以省略
 *   parseParamTemplate('$number:1.2') === 1.2
 *   parseParamTemplate('$boolean:true') === true // 当且仅当是 $boolean:true 时才是 true
 *   parseParamTemplate('$boolean:false') === false
 *   parseParamTemplate('$boolean:0') === false
 *   parseParamTemplate('$boolean:1') === false
 *   parseParamTemplate(' $string:  1.2 ') === '1.2'
 *
 *   // TODO: 这里也可以使用事件驱动
 *   // 从 SmartForm 组件的 apiParams prop 获取
 *   parseParamTemplate('$visitPath: age') === smartForm.props.apiParams[age]
 *   // 从当前 SmartForm 组件实例绑定的数据模型获取
 *   parseParamTemplate('$formPath: age') === smartForm.formData[age]
 * @author wangkai 2022-01-07T16:17:14+0800
 * @param  {String} str 一定是字符串
 * @return {[type]}     [description]
 */
function parseParamTemplate (str = '', apiParamsProp, formModel, valueMap) {
  str = String(str).trim()
  if (!str) return str

  const REG_STRING = /^\$string\s{0,}:\s{0,}/i
  if (REG_STRING.test(str)) return str.replace(REG_STRING, '')

  const REG_NUMBER = /^\$number\s{0,}:\s{0,}/i
  if (REG_NUMBER.test(str)) return Number(str.replace(REG_NUMBER, ''))

  const REG_BOOLEAN = /^\$boolean\s{0,}:\s{0,}/i
  if (REG_BOOLEAN.test(str)) {
    str = str.replace(REG_BOOLEAN, '')
    str = str === 'true'
    return str
  }

  if (REG_VISIT_PATH.test(str)) {
    str = str.replace(REG_VISIT_PATH, '')
    return get(apiParamsProp, str)
  }

  if (REG_FORM_PATH.test(str)) {
    str = str.replace(REG_FORM_PATH, '')
    return get(formModel, str)
  }

  if (REG_VALUE_MAP_PATH.test(str)) {
    str = str.replace(REG_VALUE_MAP_PATH, '')
    return get(valueMap, str)
  }

  return str
}

/**
 * 解析参数 schema
 * @author wangkai 2022-01-07T16:06:37+0800
 * @param  {Object} schema {
 *                           flag: '$visitPath:flag',
 *                           params: {
 *                             hospitalSOID: '$number:256181',
 *                             startDateKey: '$visitPath:startDateKey',
 *                             endDateKey: '$visitPath:startDateKey',
 *                             filters: [
 *                               '$string:10', // 字符串字面量
 *                               '11', // 字符串字面量, 可省略开头的 '$string:'
 *                               '$boolean:true'
 *                             ]
 *                           },
 *                           pageSize: '$number:10',
 *                           pageNum: '$number:1'
 *                         }
 * @return {Object}        window[__PARAMS_NAMESPACE]: {
 *                           flag: 'OutpatientChart',
 *                           startDateKey: '2021-5-29 00:00:00',
 *                           endDateKey: '2021-11-29 23:59:59'
 *                         }
 *
 *                         返回结果: {
 *                           flag: 'OutpatientChart',
 *                           params: {
 *                             hospitalSOID: 256181,
 *                             startDateKey: '2021-5-29 00:00:00',
 *                             endDateKey: '2021-11-29 23:59:59',
 *                             filters: ['10', '11', true]
 *                           },
 *                           pageSize: 10,
 *                           pageNum: 1
 *                         }
 */
function parseParamsSchema (schema, apiParamsProp, formModel, valueMap) {
  if (!schema) return schema

  const isArray = Array.isArray(schema)
  // 注意: 这里只是简单实现, 没有考虑循环引用(因为业务场景用不到)
  let res = {}
  if (isArray) {
    res = []
  }

  let v
  if (isArray) {
    // TODO: 待优化
    schema.forEach((v, k) => {
      const type = typeof v
      if (type === 'string') {
        res[k] = parseParamTemplate(v, apiParamsProp, formModel, valueMap)
      } else if (type === 'undefined') {
        res[k] = undefined
      } else if (v == null) {
        res[k] = null
      } else if (['number', 'boolean'].includes(type)) {
        res[k] = v
      } else { // {}
        res[k] = parseParamsSchema(v, apiParamsProp, formModel, valueMap)
      }
    })
  } else {
    for (const k in schema) {
      v = schema[k]
      const type = typeof v
      if (type === 'string') {
        res[k] = parseParamTemplate(v, apiParamsProp, formModel, valueMap)
      } else if (type === 'undefined') {
        res[k] = undefined
      } else if (v == null) {
        res[k] = null
      } else if (['number', 'boolean', 'function'].includes(type)) {
        res[k] = v
      } else { // {}
        res[k] = parseParamsSchema(v, apiParamsProp, formModel, valueMap)
      }
    }
  }

  return res
}

export {
  REG_VISIT_PATH,
  REG_FORM_PATH,
  REG_VALUE_MAP_PATH,
  parseParamTemplate,
  parseParamsSchema
}
