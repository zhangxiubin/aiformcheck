<template>

  <el-input-number
    v-bind="parsedFormItemEntityProps"
    v-model="localValue"
    v-loading="loading"
    @input="onInput"
    @input.native="changeInputPower($event)"
  />

</template>

<script>
import { debounce } from 'lodash'
import mixin from '../mixins'

export default {
  name: 'ItemInputNumber',
  mixins: [mixin],
  data () {
    return {}
  },

  methods: {
    changeInputPower (e) {
      const { precision, isRound } = this.parsedFormItemEntityProps

      if (!isRound) { // 不进位取数
        if (precision > 0) {
          e.target.value = e.target.value.substring(0, e.target.value.indexOf('.') + precision + 1)
        } else {
          e.target.value = Math.floor(e.target.value)
        }
      }
    },
    onInput: debounce(function (val) {
      console.log('val', val)

      this.updateField(this.field, val)
    }, 200)
  }
}
</script>
