<template>
  <el-form :model="propModel" v-bind="formProps">
    <el-form-item label="是否可输入">
      <el-switch v-model="propModel.editable"> </el-switch>
    </el-form-item>
    <el-form-item label="默认值">
      <el-checkbox v-model="propModel.defaultNowDate">默认当前时间</el-checkbox>
    </el-form-item>
    <el-form-item label="时间格式">
      <el-select v-model="propModel.format" @change="formatChange">
        <el-option
          v-for="item in dateTypes"
          :key="item.value"
          :label="item.text"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="值格式">
      <el-select v-model="propModel.valueFormat">
        <el-option
          v-for="item in valueTypes"
          :key="item.value"
          :label="item.text"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="限定范围">
      <el-switch v-model="propModel.isLimitDate" />
    </el-form-item>
    <el-form-item v-show="isLimit" label="限定开始">
      <el-select
        v-model="propModel.startId"
        filterable
        clearable
      >
        <el-option label="当前时间" value="today"></el-option>
        <el-option
          v-for="item in getDateElements"
          :key="item.id"
          :label="item.formItemProps.label"
          :value="item.field"
        >
          <div class="opt-item">
            <span>{{ item.formItemProps.label }} </span>
            <span class="sub-label"> {{ item.field }}</span>
          </div>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item v-show="isLimit" label="限定结束">
      <el-select
        v-model="propModel.endId"
        filterable
        clearable
      >
        <el-option label="当前时间" value="today"></el-option>
        <el-option
          v-for="item in getDateElements"
          :key="item.id"
          :label="item.formItemProps.label"
          :value="item.field"
        >
          <div class="opt-item">
            <span>{{ item.formItemProps.label }} </span>
            <span class="sub-label">{{ item.field }}</span>
          </div>
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
  name: 'ItemDatePickerProps',
  props: {
    itemEntityProps: {
      type: String,
      default: ''
    },
    formProps: {
      type: Object,
      default: () => ({})
    },
    formConfig: {
      type: Object,
      default: () => ({})
    },
    filed: {
      type: String,
      default: ''
    }
  },
  data () {
    const defaultProp = {
      editable: true,
      defaultNowDate: false,
      type: 'date',
      format: 'yyyy-MM-dd',
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
      isLimit: false,
      startId: '',
      endId: '',
      disabled: false
    }
    return {
      defaultProp,
      propModel: {},
      dateTypes: [
        { text: 'yyyy-MM-dd', value: 'yyyy-MM-dd', type: 'date' },
        { text: 'yyyy/MM/dd', value: 'yyyy/MM/dd', type: 'date' },
        { text: 'yyyy年MM月dd日', value: 'yyyy年MM月dd日', type: 'date' },
        { text: 'yyyy-MM-dd HH:mm', value: 'yyyy-MM-dd HH:mm', type: 'datetime' },
        { text: 'yyyy/MM/dd HH:mm', value: 'yyyy/MM/dd HH:mm', type: 'datetime' },
        { text: 'yyyy年MM月dd日 HH时mm分', value: 'yyyy年MM月dd日 HH时mm分', type: 'datetime' },
        { text: 'yyyy-MM-dd HH:mm:ss', value: 'yyyy-MM-dd HH:mm:ss', type: 'datetime' },
        { text: 'yyyy-MM', value: 'yyyy-MM', type: 'month' },
        { text: 'yyyy年MM月', value: 'yyyy年MM月', type: 'month' },
        { text: 'yyyy年', value: 'yyyy', type: 'year' }
      ],
      valueTypes: [
        { text: 'yyyy-MM-dd', value: 'yyyy-MM-dd' },
        { text: 'yyyy/MM/dd', value: 'yyyy/MM/dd' },
        { text: 'yyyy-MM-dd HH:mm:ss', value: 'yyyy-MM-dd HH:mm:ss' },
        { text: 'yyyy/MM/dd HH:mm:ss', value: 'yyyy/MM/dd HH:mm:ss' },
        { text: 'yyyy-MM', value: 'yyyy-MM' },
        { text: 'yyyy', value: 'yyyy' }

      ]
    }
  },
  computed: {
    getElements () {
      return this.formConfig.items.filter(item => item.field !== this.filed)
    },
    getDateElements () {
      return this.getElements.filter(item => item.type === 'datePicker')
    },
    isLimit: {
      get () {
        return this.propModel.isLimitDate
      },
      set (v) {
        this.propModel.isLimitDate = v
        if (!v) {
          this.propModel.startId = ''
          this.propModel.endId = ''
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
    formatChange (val) {
      const dateType = this.dateTypes.find(item => val === item.value)
      this.propModel.type = dateType.type
      if (this.propModel.type === 'datetime') {
        this.propModel.valueFormat = 'yyyy-MM-dd HH:mm:ss'
      } else if (this.propModel.type === 'month') {
        this.propModel.valueFormat = 'yyyy-MM'
      } else if (this.propModel.type === 'year') {
        this.propModel.valueFormat = 'yyyy'
      } else {
        this.propModel.valueFormat = 'yyyy-MM-dd'
      }
    }
  }
}
</script>
<style scoped lang="scss">
.opt-item {
  display: flex;
  justify-content: space-between;
  .sub-label {
    color: #c9c9c9;
    font-size: 12px;
  }
}
</style>
