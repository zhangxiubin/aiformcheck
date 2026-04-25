<template>
  <el-form :model="propModel" v-bind="formProps">
    <el-form-item label="是否多选">
        <el-switch
        v-model="propModel.multiple"
        @change="multipleChange"
      >
      </el-switch>
    </el-form-item>
    <el-form-item v-show="propModel.multiple" label="多选值拼接">
      <el-select v-model="propModel.symbol" clearable>
        <el-option
          v-for="item in symbolTypes"
          :key="item.value"
          :label="item.text"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="下拉项显示">
      <el-select v-model="propModel.labelType">
        <el-option
          v-for="item in optionLabelTypes"
          :key="item.value"
          :label="item.text"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="可清空">
        <el-switch
        v-model="propModel.clearable"
      >
      </el-switch>
    </el-form-item>
    <el-form-item label="是否只读">
        <el-switch
        v-model="propModel.disabled"
      >
      </el-switch>
    </el-form-item>
    <el-form-item label="快速查询">
        <el-switch
        v-model="propModel.filterable"
      >
      </el-switch>
    </el-form-item>
    <el-form-item label="远程搜索">
        <el-switch
        v-model="propModel.remote"
        @change="changeRemote"
      >
      </el-switch>
      <span class="form-tip">
          此字段须与快速查询同时开启
      </span>
    </el-form-item>
    <el-form-item label="允许手录">
        <el-switch
        v-model="propModel.allowCreate"
        @change="changeAllowCreate"
      >
      </el-switch>
      <span class="form-tip">
          此字段须与快速查询同时开启
      </span>
    </el-form-item>
  </el-form>
</template>

<script>
// import { get } from 'lodash'
import { parseJsValue } from '@/utils/parse-code'

export default {
  name: 'itemSelectProps',
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
      multiple: false,
      symbol: '',
      labelType: 'name',
      clearable: false,
      disabled: false
    }
    return {
      defaultProp,
      propModel: {},
      childPropModel: {},
      optionLabelTypes: [
        { text: '名称', value: 'name' },
        { text: '值', value: 'value' },
        { text: '名称-值', value: 'nameAndValue' },
        { text: '名称-编码', value: 'nameAndNo' },
        { text: '编码-名称', value: 'noAndName' }
      ],
      symbolTypes: [
        { text: '分号', value: ';' },
        { text: '逗号', value: ',' }
      ]
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
    changeAllowCreate () {
      if (!this.propModel.allowCreate) return
      this.propModel.filterable = true
    },
    changeRemote () {
      if (!this.propModel.remote) return
      this.propModel.filterable = true
    },
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
    },
    multipleChange (val) {
      if (!val) {
        this.propModel.symbol = ''
      }
    }
  }
}
</script>
