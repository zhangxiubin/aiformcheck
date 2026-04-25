<template>
  <div v-loading="loading" class=" pos-r" style="width:100%; height:100%">
    <el-table :data="TEST_DATA_ELS" border stripe  height="100%"
      @row-dblclick="onDbClick">
      <el-table-column
        v-for="col in cols"
        v-bind="col"
        :key="col.prop">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// import { genFormItem } from '@/components/smart-form/utils'
import { TEST_DATA_ELS, DATA_EL_FORM_ITEM_TYPE_MAP } from './consts'

export default {
  name: 'DataElement',
  inject: ['pushTypedItem'],
  data () {
    return {
      loading: false,
      TEST_DATA_ELS,
      cols: [
        { label: '概念名称', prop: 'mrasEleDataName' },
        { label: '概念标识', prop: 'conceptId' }
      ]
    }
  },
  methods: {
    onDbClick (row) {
      this.pushTypedItem(DATA_EL_FORM_ITEM_TYPE_MAP[row.dataValueType], {
        field: row.conceptId,
        formItemProps: {
          label: row.mrasEleDataName
        }
      })
    }
  }
}
</script>
