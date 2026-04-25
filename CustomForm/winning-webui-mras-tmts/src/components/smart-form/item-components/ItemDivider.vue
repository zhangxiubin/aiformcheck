<template>
  <div class="divider-wrapper">
    <el-divider v-bind="parsedFormItemEntityProps" />
  </div>
</template>

<script>
import mixin from '../mixins'

export default {
  name: 'ItemDivider',
  mixins: [mixin]
}
</script>

<style lang="scss" scoped>
.divider-wrapper {
  display: flex;
  align-items: center;

  :deep(.el-divider) {
    margin: 0;
  }
}
</style>
