<template>
  <el-time-select
    v-bind="parsedFormItemEntityProps"
    v-model="localValue"
    v-loading="loading"
    @change="onChange"
  />
</template>

<script>
import { debounce } from 'lodash'
import mixin from '../mixins'

export default {
  name: 'ItemTimePicker',
  mixins: [mixin],
  data () {
    return {}
  },
  methods: {
    onChange: debounce(function (val) {
      this.updateField(this.field, val)
    }, 200)
  }
}
</script>
