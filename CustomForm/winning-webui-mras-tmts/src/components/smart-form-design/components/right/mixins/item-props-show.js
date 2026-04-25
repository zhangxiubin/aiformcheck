// 表单项目类型
const STANDARD_FORM_ITEM_TYPES = [
  'radio',
  'checkbox',
  'input',
  'inputNumber',
  'select',
  'switch',
  'timePicker',
  'datePicker',
  'table'
]
// 非填充项类型
const NO_FILLED_ITEM_TYPES = [
  'text',
  'empty',
  'divider'
]

export default {
  computed: {
    // 显示【标签文本】设置
    showFormItemPropsLabel () {
      const { type } = this.itemData
      return STANDARD_FORM_ITEM_TYPES.includes(type)
    },
    // 显示【默认值】设置
    showDefaultValue () {
      const { type, customCompName } = this.itemData
      return type && (type !== 'empty' && type !== 'divider' && type !== 'table') && !customCompName
    },
    // 显示【元素属性】设置
    showFormItemEntityProps () {
      const { type } = this.itemData
      return STANDARD_FORM_ITEM_TYPES.includes(type)
    },
    // 显示【子元素属性】设置
    showFormItemEntityChildProps () {
      const { type } = this.itemData
      return ['radio', 'checkbox', 'select'].includes(type)
    },
    // 显示【数据源】设置
    showDataOrigin () {
      const { type } = this.itemData
      return ['radio', 'checkbox', 'select'].includes(type)
    },
    // 显示【自定义配置】
    showCustomCompConfig () {
      return !!this.itemData?.customCompName
    },
    showRemarks () {
      const { type } = this.itemData
      return STANDARD_FORM_ITEM_TYPES.includes(type)
    },
    showHiddenLabel () {
      const { type } = this.itemData
      return STANDARD_FORM_ITEM_TYPES.includes(type)
    },

    showItemRuleConfig () {
      const { type } = this.itemData
      return STANDARD_FORM_ITEM_TYPES.includes(type)
    },
    // 是否不是填充项
    isNoFilledItem () {
      const { type } = this.itemData
      return NO_FILLED_ITEM_TYPES.includes(type)
    }

  } // end of computed
}
