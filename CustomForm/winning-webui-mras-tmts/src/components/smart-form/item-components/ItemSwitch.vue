<template>
  <el-switch
    v-bind="parsedFormItemEntityProps"
    v-model="localValue"
    v-loading="loading"
    @change="onChange">
  </el-switch>
</template>

<script>
import mixin from '../mixins'

export default {
  name: 'ItemSwitch',
  mixins: [mixin],
  data () {
    return {}
  },
  methods: {
    onChange (val) {
      this.updateField(this.field, val)
    }
  }
}
</script>
