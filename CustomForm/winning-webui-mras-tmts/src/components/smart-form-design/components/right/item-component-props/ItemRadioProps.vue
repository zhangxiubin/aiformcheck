<template>
  <el-form :model="propModel" v-bind="formProps">
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
