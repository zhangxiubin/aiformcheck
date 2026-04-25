<template>
  <div class="form-props">
    <!-- <el-divider>表单设置</el-divider> -->
    <el-form v-bind="FORM_PROPS" :model="formData" label-width="64px">
      <el-form-item label="表单大小">
        <el-radio-group v-model="formData.size">
          <el-radio-button v-for="item in sizes"
            :key="item.value"
            :label="item.value">
            {{ item.text }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="标签位置">
        <el-radio-group v-model="formData.labelPosition">
          <el-radio-button v-for="item in labelPositions"
            :key="item.value"
            :label="item.value">
            {{ item.text }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="标签宽度">
        <el-input v-model.trim="formData.labelWidth"
          :disabled="!['left', 'right'].includes(formData.labelPosition)"
          title="当且仅当标签位置是[左对齐]或[右对齐]时有效"
        />
        <p class="form-tip">
          当且仅当标签位置是【左对齐】或【右对齐】时有效, auto为自动
        </p>
      </el-form-item>

      <el-form-item label="错误信息">
        <el-radio-group v-model="formData.showMessage">
          <el-radio-button :label="true">显示</el-radio-button>
          <el-radio-button :label="false">不显示</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="表单校验">
        <el-input v-model.trim="formData.rulesStr"
          type="textarea" :autosize="autosize"

        />
      </el-form-item>

      <el-form-item label="表单边框">
        <el-radio-group v-model="formData.border">
          <el-radio-button :label="true">显示</el-radio-button>
          <el-radio-button :label="false">不显示</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="固定高度">
        <el-switch v-model="formData.fixItemHeight" />
        <p class="form-tip">
          某些情况下，表单项固定为统一高度对排版和视觉更友好，请按需开启。
          开启固定高度后，如果默认的表单项高度不适用于某个表单项（比如文本域），
          可以在【表单项设置 - 风格样式】中设置自定义高度。
        </p>
      </el-form-item>
      <el-form-item label="审批显示">
       <el-select v-model="formData.approvalShowFormMode">
        <el-option label="应用模式" value="app"></el-option>
        <el-option label="浏览模式 " value="view"></el-option>
       </el-select>
      </el-form-item>

        <slot name="form-config-slot"></slot>

    </el-form>
  </div>
</template>

<script>
import { debounce, merge } from 'lodash'
import { genDefaultFormProps } from '@/components/smart-form/utils'
import mixin from '../mixins'

export default {
  name: 'FormProps',
  inject: ['setConfig', 'getFormBus'],
  mixins: [mixin],
  data () {
    return {
      loading: false,
      labelPositions: [
        { text: '左对齐', value: 'left' },
        { text: '上方', value: 'top' },
        { text: '右对齐', value: 'right' }
      ],
      sizes: [
        { text: '默认', value: 'default' },
        { text: '中', value: 'medium' },
        { text: '小', value: 'small' },
        { text: '极小', value: 'mini' }
      ],
      autosize: {
        minRows: 5,
        maxRows: 10
      },
      formData: genDefaultFormProps(),

      // 标识是否需要同步到表单配置
      freezeSyncToForm: false
    }
  },
  watch: {
    formData: {
      deep: true,
      handler () {
        this.syncToForm()
      }
    }
  },

  created () {
    this.getFormBus().$on('config-changed', this.$_onConfigChanged)
  },

  beforeDestroy () {
    this.getFormBus().$off('config-changed', this.$_onConfigChanged)
  },

  methods: {
    syncToForm: debounce(function () {
      console.log(this.freezeSyncToForm)
      if (this.freezeSyncToForm) return

      this.setConfig({
        formProps: this.formData
      }, {
        disableEmitToBus: true
      })
    }, 200),

    $_onConfigChanged (config) {
      console.log(' $_onConfigChanged ', config)
      this.freezeSyncToForm = true
      merge(this.formData, config?.formProps)
      this.$nextTick(() => {
        this.freezeSyncToForm = false
      })
    }
  }
}
</script>
<style >
.form-props .el-radio-button--mini .el-radio-button__inner {
  padding: 7px 12px;
 }
</style>
