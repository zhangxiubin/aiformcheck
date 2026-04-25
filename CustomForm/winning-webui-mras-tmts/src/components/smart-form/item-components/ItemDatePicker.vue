<template>
  <el-date-picker
    v-bind="parsedFormItemEntityProps"
    v-model="localValue"
    v-loading="loading"
    :picker-options="pickerOptions"
    @change="onChange"
  />
</template>

<script>
import { debounce } from 'lodash'
import mixin from '../mixins'

export default {
  name: 'ItemDatePicker',
  mixins: [mixin],
  data () {
    return {
      startDate: '',
      endDate: ''
    }
  },
  computed: {
    pickerOptions () {
      let startDate = this.startDate
      let endDate = this.endDate
      const { isLimitDate, startId, endId } = this.parsedFormItemEntityProps

      if (!isLimitDate || (!startId && !endId)) {
        return null
      } else {
        return {
          disabledDate (time) {
            let startDisabeld = false
            let endDisabeld = false
            if (startId) {
              // 此组件当前时间 只适用于限制日期。无法限制时间
              const currentTime = new Date().getTime() - 8.64e7
              if (startDate) {
                startDate = new Date(startDate).setHours(0, 0, 0, 0)
              }
              if (endDate) {
                endDate = new Date(endDate).setHours(23, 59, 59, 59)
              }

              startDisabeld = startId === 'today' ? (time.getTime() < currentTime) : (startDate && time.getTime() < new Date(startDate).getTime())
            }
            if (endId) {
              endDisabeld = endId === 'today' ? (time.getTime() > new Date().getTime()) : (endDate && time.getTime() > new Date(endDate).getTime())
            }
            return startDisabeld || endDisabeld
          }
        }
      }
    }
  },
  watch: {
    'parsedFormItemEntityProps.defaultNowDate' (val, oldVal) {
      if (val !== oldVal) {
        this.setDefaultDate()
      }
    }

  },
  mounted () {
    // 延迟显示
    setTimeout(() => {
      this.setDefaultDate()
    }, 800)
  },
  methods: {
    onChange: debounce(function (val) {
      this.updateField(this.field, val)
    }, 200),
    $_onChangeField (val) {
      const { startId, endId } = this.parsedFormItemEntityProps
      const { field, value } = val
      // const timePattern = /^(\d{4})([-/])?(\d{2})\2(\d{2})\s+(\d{2}:\d{2}:\d{2})$/
      // const datePattern = /^(\d{4})([-/])?(\d{2})\2(\d{2})$/
      // if (
      //   (value && typeof value !== 'string') ||
      //   (typeof value === 'string' && !value.match(datePattern) && !value.match(timePattern))
      // ) {
      //   return
      // }
      if (field === startId) {
        this.startDate = this.formatDate(new Date(value), 'yyyy-MM-dd HH:mm:ss')
      } else if (field === endId) {
        this.endDate = this.formatDate(new Date(value), 'yyyy-MM-dd HH:mm:ss')
        console.log('this.endDate', this.endDate)
      }
    },
    setDefaultDate () {
      const { defaultNowDate } = this.parsedFormItemEntityProps
      if (defaultNowDate) {
        this.localValue = new Date()
        const val = this.formatDate(this.localValue, this.parsedFormItemEntityProps.valueFormat)
        this.updateField(this.field, val)
      }
    },
    formatDate (date, format) {
      const year = date.getFullYear().toString()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      const hour = date.getHours().toString().padStart(2, '0')
      const minute = date.getMinutes().toString().padStart(2, '0')
      const second = date.getSeconds().toString().padStart(2, '0')

      const result = format.replace(/yyyy/g, year)
        .replace(/MM/g, month)
        .replace(/dd/g, day)
        .replace(/HH/g, hour)
        .replace(/mm/g, minute)
        .replace(/ss/g, second)

      return result
    }
  }
}
</script>
