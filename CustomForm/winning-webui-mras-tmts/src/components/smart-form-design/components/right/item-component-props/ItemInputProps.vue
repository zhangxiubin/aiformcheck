<template>
  <el-form :model="propModel" v-bind="formProps">
    <el-form-item label="最大文字数">
      <el-input-number
        v-model="propModel.maxlength"
        :min="1"
        controls-position="right"
      ></el-input-number>
    </el-form-item>
    <el-form-item label="文本框类型">
      <el-select v-model="propModel.type">
        <el-option
          v-for="item in inputTypes"
          :key="item.value"
          :label="item.text"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item v-if="propModel.type === 'textarea'" label="自适应高度">
      <el-switch v-model="isAutosize"> </el-switch>
    </el-form-item>
    <el-form-item
      v-if="propModel.type === 'textarea' && !isAutosize"
      label="行数"
    >
      <el-input-number
        v-model="propModel.rows"
        :min="1"
        controls-position="right"
      ></el-input-number>
    </el-form-item>
    <template v-if="isAutosize">
      <el-form-item label="最小行数">
        <el-input-number
          v-model="propModel.autosize.minRows"
          :min="1"
          controls-position="right"
        ></el-input-number>
      </el-form-item>
      <el-form-item v-if="isAutosize" label="最大行数">
        <el-input-number
          v-model="propModel.autosize.maxRows"
          :min="1"
          controls-position="right"
        ></el-input-number>
      </el-form-item>
    </template>
    <el-form-item label="格式限制">
      <el-select v-model="propModel.validInputFormat">
        <el-option
          v-for="item in validFormatList"
          :key="item.value"
          :label="item.text"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="是否只读">
      <el-switch v-model="propModel.disabled"> </el-switch>
    </el-form-item>
  </el-form>
</template>

<script>
// import { get } from 'lodash'
import { parseJsValue } from '@/utils/parse-code'

export default {
  name: 'itemInputProps',
  props: {
    itemEntityProps: {
      type: String,
      default: ''
    },
    formProps: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    const defaultProp = {
      maxlength: undefined,
      type: 'input',
      rows: 3,
      autosize: false,
      disabled: false
    }
    return {
      defaultProp,
      propModel: {},
      inputTypes: [
        { text: '输入框', value: 'input' },
        { text: '文本域', value: 'textarea' }
      ],
      validFormatList: [
        { text: '普通文本', value: '' },
        { text: '纯数字', value: 'isNum' },
        { text: '纯字母', value: 'isLetter' },
        { text: '数字+字母', value: 'isNumAndLetter' },
        { text: '身份证', value: 'idCard' }

      ]
    }
  },
  computed: {
    isAutosize: {
      get () {
        return Boolean(this.propModel.autosize)
      },
      set (v) {
        if (v) {
          this.propModel.autosize = {
            minRows: 3,
            maxRows: 6
          }
        } else {
          this.propModel.autosize = false
        }
      }
    }
  },
  watch: {
    itemEntityProps: {
      handler (val) {
        this.propModel = this.parseProps(val)
      }
    },
    propModel: {
      deep: true,
      handler () {
        this.updateProps()
      }
    }
  },
  mounted () {
    this.propModel = this.parseProps(this.itemEntityProps)
  },
  methods: {
    // changeTextAreaSize () {
    //   if (this.propModel.isAutosize === true) {
    //     this.propModel.rows && delete this.propModel.rows
    //     this.propModel.autosize = {
    //       minRows: 2,
    //       maxRows: 6
    //     }
    //   } else {
    //     this.propModel.rows = 3
    //     this.propModel.autosize && delete this.propModel.autosize
    //   }
    // },
    parseProps (propStr) {
      let data = {}
      try {
        data = parseJsValue(propStr)?.value || {}
        data = { ...this.defaultProp, ...data }
      } catch (e) {}
      return data
    },
    updateProps: function () {
      const propsStr = JSON.stringify(this.propModel)
      this.$emit('update:itemEntityProps', propsStr)
    }
  }
}
</script>
