<template>
  <div class="row-props">
    <el-divider>布局设置</el-divider>
    <el-form v-bind="FORM_PROPS" :model="formData">
      <!-- 这里不使用 gutter 属性(固定为 0), 改用其他设置 -->
      <!-- <el-form-item label="栅格间隔">
        <el-input-number v-model="formData.gutter" :step="1" :min="0" />
      </el-form-item> -->
    </el-form>
  </div>
</template>

<script>
import { debounce } from 'lodash'
import mixin from '../mixins'

export default {
  name: 'RowProps',
  inject: ['setConfig'],
  mixins: [mixin],
  data () {
    return {
      loading: false,
      formData: {
        gutter: 0
      }
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
  methods: {
    syncToForm: debounce(function () {
      this.setConfig({
        rowProps: this.formData
      })
    }, 200)
  }
}
</script>
