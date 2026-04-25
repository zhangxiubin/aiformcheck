<template>
  <el-form :model="propModel" v-bind="formProps">
    <el-form-item label="是否可输入">
      <el-switch v-model="propModel.editable"> </el-switch>
    </el-form-item>
    <el-form-item label="开始时间">
      <el-input v-model="propModel.pickerOptions.start" />
    </el-form-item>
    <el-form-item label="结束时间">
      <el-input v-model="propModel.pickerOptions.end" />
    </el-form-item>
    <el-form-item label="间隔时间">
      <el-input v-model="propModel.pickerOptions.step" />
    </el-form-item>
    <el-form-item label="是否只读">
      <el-switch v-model="propModel.disabled"> </el-switch>
    </el-form-item>
  </el-form>
</template>

<script>
// import { get } from 'lodash'
import { parseJsValue } from '@/utils/parse-code'

export default {
  name: 'ItemTimePickerProps',
  props: {
    itemEntityProps: {
      type: String,
      default: ''
    },
    formProps: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    const defaultProp = {
      editable: true,
      pickerOptions: {
        start: '09:00',
        end: '18:00',
        step: '00:30'
      },
      disabled: false
    }
    return {
      defaultProp,
      propModel: {}
    }
  },
  watch: {
    itemEntityProps: {
      handler (val) {
        this.propModel = this.parseProps(val)
      }
    },
    propModel: {
      deep: true,
      handler () {
        this.updateProps()
      }
    }
  },
  mounted () {
    this.propModel = this.parseProps(this.itemEntityProps)
  },
  methods: {
    parseProps (propStr) {
      let data = {}
      try {
        data = parseJsValue(propStr)?.value || {}
        data = { ...this.defaultProp, ...data }
      } catch (e) {}
      return data
    },
    updateProps: function () {
      const propsStr = JSON.stringify(this.propModel)
      this.$emit('update:itemEntityProps', propsStr)
    }
  }
}
</script>
