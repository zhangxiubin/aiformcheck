const FORM_ITEMS = [
  {
    text: '文本展示',
    value: 'text',
    desc: '文本展示',
    mapComponent: 'ItemText'
  },
  {
    text: '空白占位',
    value: 'empty',
    desc: '空白占位',
    mapComponent: 'ItemEmpty'
  },
  {
    text: '分割线',
    value: 'divider',
    desc: '分割线',
    mapComponent: 'ItemDivider'
  },
  {
    text: '表格',
    value: 'table',
    desc: '可扩展表格',
    mapComponent: 'ItemTable'
  },
  {
    text: '单选',
    value: 'radio',
    desc: '单选',
    mapComponent: 'ItemRadio'
  },
  {
    text: '复选',
    value: 'checkbox',
    desc: '复选',
    mapComponent: 'ItemCheckbox'
  },
  {
    text: '文本框',
    value: 'input',
    desc: '文本框',
    mapComponent: 'ItemInput'
  },
  {
    text: '数字框',
    value: 'inputNumber',
    desc: '数字框',
    mapComponent: 'ItemInputNumber'
  },
  {
    text: '下拉框',
    value: 'select',
    desc: '下拉框',
    mapComponent: 'ItemSelect'
  },
  {
    text: '开关',
    value: 'switch',
    desc: '开关',
    mapComponent: 'ItemSwitch'
  },
  {
    text: '时间',
    value: 'timePicker',
    desc: '时间',
    mapComponent: 'ItemTimePicker'
  },
  {
    text: '日期时间',
    value: 'datePicker',
    desc: '日期时间',
    mapComponent: 'ItemDatePicker'
  },
  // 开发中
  // {
  //   text: '上传文件',
  //   value: 'upload',
  //   desc: '上传下载',
  //   mapComponent: 'ItemUpload'
  // },
  {
    text: '插槽',
    value: 'slot',
    desc: '插槽',
    mapComponent: 'ItemSlot'
  }
  // {
  //   text: '分组',
  //   value: 'group',
  //   desc: '分组',
  //   mapComponent: 'ItemGroup'
  // }
]

const FORM_ITEMS_MAP = {
  text: 'ItemText',
  empty: 'ItemEmpty',
  divider: 'ItemDivider',
  table: 'ItemTable',
  checkbox: 'ItemCheckbox',
  input: 'ItemInput',
  inputNumber: 'ItemInputNumber',
  radio: 'ItemRadio',
  select: 'ItemSelect',
  switch: 'ItemSwitch',
  timePicker: 'ItemTimePicker',
  datePicker: 'ItemDatePicker',
  // upload: 'ItemUpload',
  slot: 'ItemSlot',
  group: 'ItemGroup'
}

export {
  FORM_ITEMS,
  FORM_ITEMS_MAP
}
