<template>
  <el-select v-model="formData.value"
    placeholder="输入关键词搜索"
    filterable remote
    :remote-method="search"
    :loading="loading"
    @change="onChange">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.text"
      :value="item.value"
      :disabled="item.disabled"
    />
  </el-select>
</template>

<script>
import { createAxios } from '@/api'
import { getStoragedUserInfo } from '@/utils/cache'
import {
  stringifyDataElement,
  parseDataElementStr
} from '@/components/smart-form/utils/data-element'

export default {
  name: 'DataElementSelect',

  model: {
    prop: 'value',
    event: 'change'
  },

  props: {
    value: String
  },

  data () {
    return {
      loading: false,
      options: [],
      formData: {
        value: ''
      }
    }
  },

  watch: {
    value: {
      immediate: true,
      handler (v) {
        console.log('value-watch', v)
        if (!v) {
          this.formData.value = ''
        } else {
          if (this.options.findIndex(v => v.value === v) === -1) {
            this.options.push(parseDataElementStr(v))
          } else {
            this.formData.value = v
          }
        }
      }
    } // end of watch.value
  }, // end of watch

  methods: {
    onChange (v) {
      this.$emit('change', v)
    },

    search (queryLike) {
      if (!queryLike) {
        this.options = []
        return
      }

      const url = '/mras-mdm/api/v1/mras_mas_mars/mras_ele_rta_data/mas/query/by_example'
      const { hospitalSOID } = getStoragedUserInfo()
      createAxios().post(url, {
        hospitalSOID,
        soid: [hospitalSOID, 10],
        queryLike
      }).then(res => {
        console.log(res)
        this.options = this.formatOptions(res.data || [])
      })
    },

    formatOptions (options) {
      return options.map(v => ({
        text: `${v.rtaNodeName}(${v.rtaNodeNo}，${v.rtaClassName})`,
        value: stringifyDataElement(v)
      }))
    }
  } // end of methods
}
</script>
