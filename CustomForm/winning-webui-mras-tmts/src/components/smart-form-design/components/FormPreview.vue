<template>
  <el-dialog
    v-loading.fullscreen="loading"
    custom-class=""
    title="预览"
    :width="previewDialogWidth"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible="visible"
    :before-close="emitClose"
    @open="onOpen">
    <div style="max-height:65vh; overflow: auto">

    <SmartForm ref="smartForm"
      v-if="!openLoading"
      :api-params="apiParams"
      :value-map="{
        ...valueMap,
        isNewApply: true
        }"
    />
</div>
    <template #footer>
      <el-button size="small" type="primary" @click="onSave">
       查看提交数据
      </el-button>
      <el-button size="small" @click="emitClose">关 闭</el-button>
      <el-button size="small" type="primary" @click="onCapture">
        保存截图
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
import SmartForm from '@/components/smart-form'

export default {
  name: 'FormPreview',
  components: {
    SmartForm
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    formConfig: Object,
    apiParams: Object,
    valueMap: Object,
    previewDialogWidth: {
      type: String,
      default: '960px'
    }
  },
  data () {
    return {
      loading: false,
      openLoading: true,
      timer: null
    }
  },
  methods: {
    emitClose () {
      clearTimeout(this.timer)
      this.$emit('update:visible', false)
    },
    onOpen () {
      this.openLoading = true

      this.$nextTick(() => {
        this.openLoading = false
        this.setConfigToForm()
      })
    },
    async onCapture () {
      this.loading = true
      try {
        await this.$refs.smartForm.saveAsImage()
      } catch (e) {

      } finally {
        this.loading = false
      }
    },
    onSave () {
      const data = this.$refs.smartForm.getFormData()
      console.log('提交数据', data)
      this.$alert(JSON.stringify(data), '提交数据', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定'

      })
    },
    setConfigToForm () {
      clearTimeout(this.timer)

      const { smartForm } = this.$refs
      if (!smartForm) {
        this.timer = setTimeout(() => {
          this.setConfigToForm()
        }, 200)
        return
      }

      smartForm.setConfig(this.formConfig)
    }
  }
}
</script>
