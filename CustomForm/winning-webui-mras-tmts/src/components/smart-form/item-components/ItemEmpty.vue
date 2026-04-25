<template>
  <div class="item-empty">
    <p v-if="providedProps.mode === 'design'" class="item-empty-tip">
      空白占位（本段文字仅在设计模式显示）
    </p>
  </div>
</template>

<script>
export default {
  name: 'ItemEmpty',
  inject: ['providedProps'],
  data () {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
.item-empty {
  background: transparent;
  pointer-events: none;
  display: flex;
  align-items: center;

  &-tip {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #999;
    font-style: italic;
    text-align: center;
  }
}
</style>
