<template>
  <div
    v-bind="parsedFormItemEntityProps"
    class="item-text">
    <span v-if="get(parsedAsterisk, 'position') === 'left'"
      class="item-text__asterisk item-text__asterisk--left"
      :class="`item-text__asterisk--${get(parsedAsterisk, 'visibility')}`">*</span>
    <span style="font-weight:inherit">{{ parsedText }}</span>
    <span v-if="get(parsedAsterisk, 'position') === 'right'"
      class="item-text__asterisk item-text__asterisk--right"
      :class="`item-text__asterisk--${get(parsedAsterisk, 'visibility')}`">*</span>
  </div>
</template>

<script>
import { get } from 'lodash'
import { parseJsValue } from '@/utils/parse-code'

export default {
  name: 'ItemText',
  props: ['defaultValue', 'formItemEntityProps'],
  inject: ['providedProps'],
  data () {
    return {
    }
  },
  computed: {
    parsedFormItemEntityProps () {
      let data = {}
      try {
        data = parseJsValue(this.formItemEntityProps)?.value || {}
      } catch (e) {}
      return data
    },
    parsedAsterisk () {
      let data = {}
      try {
        data = parseJsValue(this.$attrs.textAsterisk)?.value || {}
      } catch (e) {}
      return data
    },
    parsedText () {
      let val = this.defaultValue
      const reg = /^\$valueMap\s{0,}:\s{0,}/i
      if (reg.test(val)) {
        val = val.replace(reg, '')
        return get(this.providedProps.valueMap, val)
      }
      return val
    }
  },

  methods: {
    get
  }
}
</script>

<style lang="scss">
.item-text {
  box-sizing: border-box;
 padding: 0 20px;
  // 与 formItem 的标题保持一致

  &__asterisk {
    color: #ec0000;

    &--left {
      margin-right: 4px;
    }
    &--right {
      margin-left: 4px;
    }

    &--hidden {
      visibility: hidden;
      pointer-events: none;
    }
  }
}
</style>
