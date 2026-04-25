<template>
  <el-select
    v-bind="parsedFormItemEntityProps"
    v-model="selectValue"
    @visible-change="onVisibleChange"
    @change="onChange"
    v-mras-scroll-to-bottom="onLoadMore"
    mras-scroll-to-bottom-selector=".el-select-dropdown__wrap"
    :mras-scroll-to-bottom-disabled="freezeScrollLoad"
    :mras-scroll-to-bottom-distance="30"
    >
    <el-option
      v-for="item in finalData"
      v-bind="parsedFormItemEntityChildProps"
      :key="item.value"
      :label="getLabel(item)"
      :value="item.value">
    </el-option>
      <span v-if="loading" style="padding: 4px 20px;color: #999;">
        加载中...
      </span>
  </el-select>
</template>

<script>
import mixin from '../mixins'
import dataMixin from '../mixins/data-origin'
import { debounce } from 'lodash'
import MrasScrollToBottom from '@/directives/mras-scroll-to-bottom'
export default {
  name: 'ItemSelect',
  mixins: [mixin, dataMixin],

  directives: {
    MrasScrollToBottom
  },
  data () {
    return {
      valueOption: [],
      optionsData: [],

      keyword: '',
      pagination: {
        total: 0,
        pageNo: 0
      },
      maxPageNo: 0,
      isOpen: false,
      freezeScrollLoad: false,
      /*
       * 标识是否还可以拉取更多数据, 当调用接口查询数据时, 如果数据返回的是空, 则会置为 true
       * 原来是通过分页接口返回的数据总条数来判断的, 这样做的弊端是总数返回可能错误
       */
      noMoreData: false
    }
  },
  computed: {
    labelType () {
      return this.parsedFormItemEntityProps.labelType || 'name'
    },
    selectValue: {
      get () {
        const { multiple, symbol } = this.parsedFormItemEntityProps
        if (multiple && (this.localValue && !Array.isArray(this.localValue))) {
          return this.localValue.split(symbol || ',')
        }
        return this.localValue
      },
      set (v) {
        const { multiple, symbol } = this.parsedFormItemEntityProps
        if (multiple) {
          this.localValue = v.join(symbol || ',')
        } else {
          this.localValue = v
        }
      }
    }
    // 最大页码数, 滚动到最大页码数后就不再查询了

  },

  mounted () {
    this.pagination.pageNo = 0
    const formData = this.getFormData()
    // 默认值自动 带入
    this.valueOption = []
    const values = formData[this.field]
    const names = formData[this.relatedField] || ''
    if (!values || !names) return
    const { multiple, symbol } = this.parsedFormItemEntityProps
    // 多选
    if (multiple) {
      const localValue = values.split(symbol || ',')
      const namesValue = names.split(symbol || ',')

      this.finalData = localValue.map((item, index) => {
        return {
          value: item,
          text: namesValue[index]
        }
      })
    } else {
      this.finalData = [{ value: values, text: names }]
    }
  },
  methods: {
    onChange () {
      this.updateField(this.field, this.localValue)
      // 有关联字段  如name
      if (this.relatedField) {
        this.updateRelatedField(this.localValue, this.parsedFormItemEntityProps.multiple)
      }
    },
    getLabel (item) {
      const { labelType } = this.parsedFormItemEntityProps
      switch (labelType) {
        case 'nameAndValue':
          return `${item.text || ''}(${item.value || ''})`
        case 'nameAndNo':
          return `${item.text || ''}(${item.no || ''})`
        case 'noAndName':
          return `${item.no || ''}-${item.text || ''}`
        case 'value':
          return item.value
        default:
          return item.text
      }
    },
    // 远程搜索
    onRemoteMethod: debounce(async function (keyword = '') {
      this.keyword = keyword
      this.pagination.pageNo = 0
      this.finalData = []
      this.updateFinalData(keyword)
    }, 200),

    onVisibleChange (v) {
      // console.log(v)
      if (v) {
        setTimeout(() => {
          this.isOpen = v
        }, 300)
      } else {
        this.isOpen = v
      }
    },
    async onLoadMore () {
      // 只在api模式下才支持
      if (this.dataOrigin !== 'api' || !this.parsedFormItemEntityProps.remote) return
      if (this.pagination.pageNo >= this.maxPageNo) {
        console.log(`当前是第 ${this.pagination.pageNo} 页，一共 ${this.maxPageNo} 页`)
        return
      }
      if (!this.isOpen || this.freezeScrollLoad) return
      this.freezeScrollLoad = true

      this.pagination.pageNo++

      await this.$_fetchData(this.keyword, this.pagination.pageNo)
      this.freezeScrollLoad = false
    } // end of onLoadMore
  }
}
</script>
<style lang="scss" scoped>
.opt-left {
  float: left
}
.opt-right {
  float: right;
  color: #8492a6;
  font-size: 12px;
}
</style>
