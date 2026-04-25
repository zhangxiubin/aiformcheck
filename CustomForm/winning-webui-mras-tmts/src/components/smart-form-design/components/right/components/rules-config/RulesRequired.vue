<template>
  <el-form :model="formData" label-width="70px" size="small">
    <el-form-item label="必填">
      <el-switch v-model="formData.required" @change="onChange" />
    </el-form-item>
    <el-form-item label="提示信息">
      <el-input v-model="formData.message"
        :disabled="!formData.required"
        @input="onInput"
      />
    </el-form-item>
  </el-form>
</template>

<script>
import { cloneDeep, debounce } from 'lodash'

export default {
  name: 'RulesRequired',

  data () {
    return {
      formData: {
        required: false,
        message: '必填'
        // 'input', 'inputNumber' 为 blur
        // 'radio', 'checkbox', 'select', 'switch', 'timePicker', 'datePicker' 为 change
        // trigger: 'blur'
      }
    }
  },

  created () {
    this.__unreactive_onInput = debounce(function () {
      this.$emit('change', cloneDeep(this.formData))
    }, 200)
  },

  methods: {
    setData (data) {
      Object.assign(this.formData, data)
      this.onChange()
    },

    onInput () {
      this.__unreactive_onInput()
    },

    onChange () {
      this.$emit('change', cloneDeep(this.formData))
    }
  } // end of methods
}
</script>
