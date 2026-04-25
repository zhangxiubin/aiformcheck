<template>
  <el-dialog custom-class="" width="800px"
    title="选择数据元"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible="visible"
    :before-close="emitClose"
    >

      <slot name="select-data-element-slot" ></slot>
    <template #footer>
      <el-button size="small" @click="emitClose">取 消</el-button>
      <el-button size="small" type="primary" @click="onSubmit">
        确 定
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
import { get, cloneDeep } from 'lodash'

export default {
  name: 'SelectDataElement',
  inject: ['getItemDataElement', 'setItemDataElement'], // 获取选中数据元 设置选中数据元
  props: {
    visible: Boolean,
    element: Object

  },

  data () {
    return {
      loading: false
    }
  },
  created () {
    // 设置选中数据元
    console.log('设置选中数据元', this.element)
    this.setItemDataElement(this.element)
  },
  methods: {
    emitClose () { this.$emit('update:visible', false) },
    onSubmit () {
      this.$emit('submit', cloneDeep(this.getItemDataElement()))
      this.emitClose()
    },

    get
  } // end of methods
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

::v-deep .el-table__row.active {
  // font-weight: bold;
  color: #409EFF;
}
</style>
