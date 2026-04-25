/**
 * 表单组件共用配置常量
 */

// 日期格式选项（用于日期时间组件和表格日期列）
const DATE_FORMAT_OPTIONS = [
  { text: 'yyyy-MM-dd', value: 'yyyy-MM-dd', type: 'date' },
  { text: 'yyyy/MM/dd', value: 'yyyy/MM/dd', type: 'date' },
  { text: 'yyyy年MM月dd日', value: 'yyyy年MM月dd日', type: 'date' },
  { text: 'yyyy-MM-dd HH:mm', value: 'yyyy-MM-dd HH:mm', type: 'datetime' },
  { text: 'yyyy/MM/dd HH:mm', value: 'yyyy/MM/dd HH:mm', type: 'datetime' },
  { text: 'yyyy年MM月dd日 HH时mm分', value: 'yyyy年MM月dd日 HH时mm分', type: 'datetime' },
  { text: 'yyyy-MM-dd HH:mm:ss', value: 'yyyy-MM-dd HH:mm:ss', type: 'datetime' },
  { text: 'yyyy-MM', value: 'yyyy-MM', type: 'month' },
  { text: 'yyyy年MM月', value: 'yyyy年MM月', type: 'month' },
  { text: 'yyyy年', value: 'yyyy', type: 'year' }
]

// 日期值格式选项
const DATE_VALUE_FORMAT_OPTIONS = [
  { text: 'yyyy-MM-dd', value: 'yyyy-MM-dd' },
  { text: 'yyyy/MM/dd', value: 'yyyy/MM/dd' },
  { text: 'yyyy-MM-dd HH:mm:ss', value: 'yyyy-MM-dd HH:mm:ss' },
  { text: 'yyyy/MM/dd HH:mm:ss', value: 'yyyy/MM/dd HH:mm:ss' },
  { text: 'yyyy-MM', value: 'yyyy-MM' },
  { text: 'yyyy', value: 'yyyy' }
]

// 表格列类型选项
const TABLE_COLUMN_TYPES = [
  { text: '文本输入', value: 'input' },
  { text: '数字输入', value: 'inputNumber' },
  { text: '日期选择', value: 'date' },
  { text: '下拉选择', value: 'select' },
  { text: '单选', value: 'radio' },
  { text: '复选', value: 'checkbox' },
  { text: '文本展示', value: 'text' }
]

export {
  DATE_FORMAT_OPTIONS,
  DATE_VALUE_FORMAT_OPTIONS,
  TABLE_COLUMN_TYPES
}
