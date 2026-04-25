<template>
  <el-checkbox-group
    v-bind="parsedFormItemEntityProps"
    v-model="checkboxValue"
    @change="onChange">
    <el-checkbox
      v-for="item in finalData"
      v-bind="parsedFormItemEntityChildProps"
      :key="item.value"
      :label="item.value">
      {{ item.text }}
    </el-checkbox>
  </el-checkbox-group>
</template>

<script>
import mixin from '../mixins'
import dataMixin from '../mixins/data-origin'

export default {
  name: 'ItemCheckbox',
  mixins: [mixin, dataMixin],
  data () {
    return {
      checkboxValue: []
    }
  },
  watch: {
    // 监听setFormData方法传入的value值
    // 当value值改变时，更新checkboxValue的值

    value (val) {
      const { symbol } = this.parsedFormItemEntityProps
      let thisValue = JSON.parse(JSON.stringify(this.checkboxValue))
      thisValue = thisValue.join(symbol || ',')
      if (val === thisValue) return

      if (val && !Array.isArray(val)) {
        this.checkboxValue = val.split(symbol || ',')
      }
      let value = JSON.parse(JSON.stringify(this.checkboxValue))
      value = value.join(symbol || ',')
      this.updateField(this.field, value)
    }

  },

  mounted () {
    const { symbol } = this.parsedFormItemEntityProps
    if (this.localValue && !Array.isArray(this.localValue)) {
      this.checkboxValue = this.localValue.split(symbol || ',')
    }
    let value = JSON.parse(JSON.stringify(this.checkboxValue))
    value = value.join(symbol || ',')
    console.log('localValue change===mounted')
    this.updateField(this.field, value)
  },
  methods: {
    onChange () {
      const { symbol } = this.parsedFormItemEntityProps
      let value = JSON.parse(JSON.stringify(this.checkboxValue))
      value = value.join(symbol || ',')
      this.updateField(this.field, value)
      console.log('localValue change===onChange')
      // 有关联字段name
      if (this.relatedField) {
        this.updateRelatedField(value, true)
      }
    }
  }
}
</script>
