import { genDefaultFormProps } from './utils'

/*
 * <el-form v-bind="formProps">
 *   <el-row v-bind="rowProps">
 *     <el-col
 *       v-for="item in items"
 *       v-bind="item.colProps">
 *       <el-form-item v-bind="item.formItemProps">
 *         <具体表单组件 />
 *       </el-form-item>
 *     </el-col>
 *   </el-row>
 * </el-form>
 */
// import { genFormItem } from './utils'

const config = {
  name: '', // 模板的名称
  // <el-form /> props
  // https://element.eleme.cn/#/zh-CN/component/form#form-attributes
  formProps: genDefaultFormProps(),
  // <el-row /> props
  // https://element.eleme.cn/#/zh-CN/component/layout#row-attributes
  rowProps: {
    gutter: 0
  },
  // formItems
  items: [
    // genFormItem('input', {
    //   field: 'name',
    //   formItemProps: {
    //     label: '姓名'
    //   },
    //   defaultValue: '张三'
    // })

    // genFormItem('radio', {
    //   field: 'gender',
    //   formItemProps: {
    //     label: '性别'
    //   },
    //   staticData: [
    //     { text: '男', value: 1 },
    //     { text: '女', value: 2 },
    //     { text: '未知', value: 3 }
    //   ],
    //   defaultValue: 3
    // }),
    // genFormItem('checkbox', {
    //   field: 'cities',
    //   formItemProps: {
    //     label: '城市'
    //   },
    //   staticData: [
    //     { text: '合肥', value: 1 },
    //     { text: '芜湖', value: 2 },
    //     { text: '其他', value: 3 }
    //   ],
    //   defaultValue: [1]
    // }),
    // genFormItem('select', {
    //   field: 'food',
    //   formItemProps: {
    //     label: '食物'
    //   },
    //   staticData: [
    //     { text: '黄金糕', value: 'huang-jin-gao' },
    //     { text: '双皮奶', value: 'shuang-pi-nai' },
    //     { text: '龙须面', value: 'long-xu-mian' }
    //   ],
    //   defaultValue: ['long-xu-mian']
    // })
  ]
}

// const TYPE_MAP = {
//   radio: ''
//   input: 'ElInput',

// }

export {
  config
}
