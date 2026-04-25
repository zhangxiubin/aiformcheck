<template>
  <el-input
    v-bind="parsedFormItemEntityProps"
    v-model="localValue"
    v-loading="loading"
    autocomplete="new-password"
    @input="onInput"
  />
</template>

<script>
import { debounce } from 'lodash'
import mixin from '../mixins'

export default {
  name: 'ItemInput',
  mixins: [mixin],
  data () {
    return {}
  },
  methods: {
    onInput: debounce(function (val) {
      switch (this.parsedFormItemEntityProps.validInputFormat) {
        case 'isNum':
          val = val.replace(/[^\d]/g, '')
          this.localValue = val
          break
        case 'isLetter':
          val = val.replace(/[^A-Za-z]/g, '')
          this.localValue = val
          break
        case 'isNumAndLetter':
          val = val.replace(/[^A-Za-z0-9]/g, '')
          this.localValue = val
          break
        case 'idCard':
          val = val.toUpperCase()
          val = val.replace(/[^0-9X]/g, '')
          this.localValue = val
          break
        default:
          break
      }

      this.updateField(this.field, val)
    }, 200)
  }
}
</script>
