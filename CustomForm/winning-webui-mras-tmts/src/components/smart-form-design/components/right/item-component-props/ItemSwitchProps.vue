<template>
  <el-form :model="propModel" v-bind="formProps">
    <el-form-item label="文字描述(开)">
      <el-input v-model.trim="propModel.activeText" />
    </el-form-item>
    <el-form-item label="文字描述(关)">
      <el-input v-model.trim="propModel.inactiveText" />
    </el-form-item>
    <el-form-item label="开启时背景色">
      <el-color-picker v-model="propModel.activeColor"></el-color-picker>
    </el-form-item>
    <el-form-item label="关闭时背景色">
      <el-color-picker v-model="propModel.inactiveColor"></el-color-picker>
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
  name: 'itemRadioProps',
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
      activeText: '',
      inactiveText: '',
      activeColor: '#409EFF',
      inactiveColor: '#C0CCDA',
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
