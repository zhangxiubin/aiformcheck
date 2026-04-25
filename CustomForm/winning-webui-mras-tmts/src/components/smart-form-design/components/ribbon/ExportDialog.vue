<template>
  <el-dialog custom-class="smart-form-config-export-dialog" width="520px"
    title="导出"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible="visible"
    :before-close="emitClose"
    @open="onOpen">

    <p style="margin: 0 0 16px;">导出为：</p>
    <el-input v-model="filename" placeholder="导出文件名" size="small">
      <template #append>{{ extFilename }}</template>
    </el-input>

    <template #footer>
      <el-button size="small" @click="emitClose">取 消</el-button>
      <el-button size="small" type="primary" @click="onSubmit">
        确 定
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
import { saveAs } from 'file-saver'

export default {
  name: 'ExportDialog',
  inject: ['getFormRef'],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    formName: String
  },
  data () {
    return {
      filename: '',
      extFilename: '.mras-form'
    }
  },
  methods: {
    onOpen () {
      const { formName } = this
      if (formName) {
        this.filename = formName
      } else {
        this.filename = `医务表单模板-${Date.now()}`
      }
    },
    emitClose () { this.$emit('update:visible', false) },
    onSubmit () {
      const config = this.getFormRef().getConfig()
      console.log(config)
      const blob = new Blob([JSON.stringify(config)], {
        type: 'text/plain;charset=utf-8'
      })
      saveAs(blob, this.filename + this.extFilename)
      this.emitClose()
    }
  }
}
</script>
