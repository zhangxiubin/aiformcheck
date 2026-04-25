<template>
  <div>
  <el-radio-group
    v-bind="parsedFormItemEntityProps"
    :disaled="false"
    v-model="localValue"
    @change="onChange">
    <el-radio
      v-for="item in finalData"
      v-bind="parsedFormItemEntityChildProps"
      :key="item.value"
      :label="item.value">
      {{ item.text }}
    </el-radio>
  </el-radio-group>
</div>
</template>

<script>
import mixin from '../mixins'
import dataMixin from '../mixins/data-origin'

export default {
  name: 'ItemRadio',
  mixins: [mixin, dataMixin],
  data () {
    return {}
  },
  methods: {
    onChange (val) {
      this.updateField(this.field, val)
      // 有关联字段name
      if (this.relatedField) {
        this.updateRelatedField(val)
      }
    }
  }
}
</script>
