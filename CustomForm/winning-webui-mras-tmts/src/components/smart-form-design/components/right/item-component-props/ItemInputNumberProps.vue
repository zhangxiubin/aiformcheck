<template>
  <el-form :model="propModel" v-bind="formProps">
    <el-form-item label="最小值">
      <el-input-number v-model.trim="propModel.min" />
    </el-form-item>
    <el-form-item label="最大值">
      <el-input-number v-model.trim="propModel.max" />
    </el-form-item>
    <el-form-item label="数值精度">
      <!-- 数字精度有precision，但只能做四舍五入，产品要求可以选择向上取整或向上，所以自己写逻辑 -->
      <el-select
        v-model.trim="propModel.precision"
        placeholder="默认保留计算结果"
        size="mini"
        clearable
      >
       <el-option
        v-for="item in precisionList"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="四舍五入">
      <el-switch v-model="propModel.isRound" />
      <!-- <el-select
        v-model.trim="propModel.mathType"
        placeholder=""
        size="mini"
        clearable
      >
       <el-option
        v-for="item in mathTypeList"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        ></el-option>
      </el-select> -->
    </el-form-item>
    <el-form-item label="显示控制按钮" label-width="130px">
      <el-switch v-model="propModel.controls" />
    </el-form-item>
    <el-form-item label="是否只读">
      <el-switch v-model="propModel.disabled" />
    </el-form-item>
  </el-form>
</template>

<script>
// import { get } from 'lodash'
import { parseJsValue } from '@/utils/parse-code'

export default {
  name: 'itemInputNumberProps',
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
      min: undefined,
      max: undefined,
      controls: true,
      controlsPosition: 'right',
      disabled: false,
      isRound: true // 数值 是否四舍五入， 否则不进位取数
    }
    const precisionList = [
      {
        label: '整数',
        value: 0
      },
      {
        label: '保留1位小数',
        value: 1
      },
      {
        label: '保留2位小数',
        value: 2
      }
    ]

    return {
      defaultProp,
      propModel: {},
      precisionList

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
      handler (val) {
        if (val.precision === '') {
          delete val.precision
        }
        this.updateProps()
      }
    }
  },
  mounted () {
    this.propModel = this.parseProps(this.itemEntityProps)
  },
  methods: {
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
