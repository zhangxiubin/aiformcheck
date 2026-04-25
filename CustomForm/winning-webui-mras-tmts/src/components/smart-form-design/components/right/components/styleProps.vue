<template>
  <el-form :model="styleModel" v-bind="formProps">
    <el-form-item label="背景色">
      <el-color-picker
        v-model="styleModel.background"
        show-alpha
      ></el-color-picker>
    </el-form-item>
    <el-form-item v-show="isItemText" label="字体颜色">
      <el-color-picker v-model="styleModel.color" show-alpha></el-color-picker>
    </el-form-item>
    <el-form-item v-show="isItemText" label="对齐方式">
      <el-select v-model="styleModel.textAlign">
        <el-option
          v-for="item in textAlignTypes"
          :key="item.value"
          :label="item.text"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="文字加粗">
      <el-select v-model="styleModel.fontWeight">
        <el-option
          v-for="item in fontWeights"
          :key="item.value"
          :label="item.text"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="高度" v-show="isShowHeight">
      <el-input-number
        v-model="height"
        :min="1"
        controls-position="right"
      >  <template slot="append">px</template></el-input-number>
    </el-form-item>
    <el-form-item label="底间距">
      <el-input-number
        v-model="marginBottom"
        :min="0"
        :max="100"
        controls-position="right"
      >  <template slot="append">px</template></el-input-number>
    </el-form-item>
    <el-form-item v-show="isItemText" label="文字大小">
      <el-input-number
        v-model="fontSize"
        :min="1"
        controls-position="right"
      ></el-input-number>
    </el-form-item>
    <el-form-item  label="显示边框">
      <el-select v-model="border" multiple clearable>
        <el-option
          v-for="item in borderList"
          :key="item.value"
          :label="item.text"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item v-show="isItemText" label="显示星号">
      <el-switch
        v-model="textAsteriskModel.visibility"
        active-value="visible"
        inactive-value="hidden"
      >
      </el-switch>
    </el-form-item>
    <el-form-item v-show="isItemText && textAsteriskModel.visibility ==='visible'" label="星号位置">
      <el-select v-model="textAsteriskModel.position">
        <el-option
          v-for="item in textAsteriskTypes"
          :key="item.value"
          :label="item.text"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item>

  </el-form>
</template>

<script>
// import { get } from 'lodash'
import { parseJsValue } from '@/utils/parse-code'

export default {
  name: 'styleProps',
  props: {
    styles: {
      type: String,
      default: ''
    },
    textAsterisk: {
      type: String,
      default: ''
    },
    itemType: {
      type: String,
      default: ''
    },
    formProps: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    const defaultStyle = {
      background: 'rgba(255, 255, 255, 1)',
      color: 'rgba(0, 0, 0, 1)',
      textAlign: 'left',
      fontWeight: 'normal',
      lineHeight: '30px',
      height: '30px',
      fontSize: '16px',
      marginBottom: '0'
    }
    const defaultTextAsterisk = {
      visibility: 'hidden',
      position: ''
    }
    return {
      defaultStyle,
      defaultTextAsterisk,
      styleModel: {},
      textAsteriskModel: {},
      fontWeights: [
        { text: '普通', value: 'normal' },
        { text: '加粗', value: '600' }
        // { text: '特粗', value: '800' }
      ],
      textAlignTypes: [
        { text: '左对齐', value: 'left' },
        { text: '居中对齐', value: 'center' },
        { text: '右对齐', value: 'right' }
      ],
      textAsteriskTypes: [
        { text: '左', value: 'left' },
        { text: '右', value: 'right' }
      ],
      borderList: [
        { text: '上边框', value: 'borderTop' },
        { text: '下边框', value: 'borderBottom' },
        { text: '左边框', value: 'borderLeft' },
        { text: '右边框', value: 'borderRight' }
      ]

    }
  },
  computed: {
    height: {
      get () {
        return parseInt(this.styleModel.height || 30)
      },
      set (val) {
        if (this.isShowHeight) {
          this.styleModel.height = (val || 1) + 'px'
          this.styleModel.lineHeight = (val || 1) + 'px'
        }
      }
    },
    fontSize: {
      get () {
        return parseInt(this.styleModel.fontSize || '16px')
      },
      set (val) {
        this.styleModel.fontSize = val + 'px'
      }
    },
    marginBottom: {
      get () {
        return parseInt(this.styleModel.marginBottom || 0)
      },
      set (val) {
        this.$set(this.styleModel, 'marginBottom', (val || 0) + 'px')
      }
    },
    border: {
      get () {
        const arr = []
        if (this.styleModel.borderLeft && !arr.includes('borderLeft')) arr.push('borderLeft')
        if (this.styleModel.borderRight && !arr.includes('borderRight')) arr.push('borderRight')
        if (this.styleModel.borderTop && !arr.includes('borderTop')) arr.push('borderTop')
        if (this.styleModel.borderBottom && !arr.includes('borderBottom')) arr.push('borderBottom')
        return arr
      },
      set (val) {
        if (this.styleModel.borderLeft) delete this.styleModel.borderLeft
        if (this.styleModel.borderRight) delete this.styleModel.borderRight
        if (this.styleModel.borderTop) delete this.styleModel.borderTop
        if (this.styleModel.borderBottom) delete this.styleModel.borderBottom
        if (val.length === 0) this.$set(this.styleModel) // 重新set 刷新
        val.forEach(e => {
          this.$set(this.styleModel, e, '1px solid #ccc')
        })
      }

    },

    isItemText () {
      return this.itemType === 'text'
    },
    isShowHeight () {
      return ['text', 'empty', 'divider'].includes(this.itemType)
    },
    hasDefaultStyle () {
      return ['text', 'empty', 'divider'].includes(this.itemType)
    }

  },
  watch: {
    itemType: {
      immediate: true,
      handler (val) {
        if (val === 'divider') {
          this.defaultStyle.height = '10px'
        } else if (val === 'empty') {
          this.defaultStyle.height = '40px'
        } else {
          this.defaultStyle.height = '30px'
        }
      }
    },
    styles: {
      handler (val) {
        this.styleModel = this.hasDefaultStyle ? this.parseProps(val, this.defaultStyle) : this.parseProps(val, {})
      }
    },
    textAsterisk: {
      handler (val) {
        this.textAsteriskModel = this.parseProps(val, this.defaultTextAsterisk)
      }
    },
    styleModel: {
      deep: true,
      handler () {
        this.updateStyle()
      }
    },
    textAsteriskModel: {
      deep: true,
      handler () {
        this.updateTextAsterisk()
      }
    }
  },
  mounted () {
    this.styleModel = this.hasDefaultStyle ? this.parseProps(this.styles, this.defaultStyle) : this.parseProps(this.styles, {})
    this.textAsteriskModel = this.parseProps(
      this.textAsterisk,
      this.defaultTextAsterisk
    )
  },
  methods: {
    parseProps (propsStr, defaultModel) {
      let data = {}
      try {
        data = parseJsValue(propsStr)?.value || {}
        data = { ...defaultModel, ...data }
      } catch (e) {}
      return data
    },
    updateStyle () {
      const styleStr = JSON.stringify(this.styleModel)
      console.log('styleStr', styleStr)
      this.$emit('update:styles', styleStr)
    },
    updateTextAsterisk () {
      const asteriskStr = JSON.stringify(this.textAsteriskModel)
      this.$emit('update:textAsterisk', asteriskStr)
    }
  }
}
</script>
