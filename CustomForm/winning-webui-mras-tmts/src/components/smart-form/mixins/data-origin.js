import { cloneDeep, debounce } from 'lodash'
import { parseJsValue } from '@/utils/parse-code'
import { parseParamsSchema } from '@/utils/parse-params'
import { getStoragedUserInfo } from '@/utils/cache'
// import { genLogPrefix } from '@/utils/logger'
import { createAxios } from '@/api'
// import { parseDataElementStr } from '@/components/smart-form/utils/data-element'

export default {
  props: {
    // static(静态数据源, 即自行配置的), api(后台接口获取)
    dataOrigin: {
      type: String,
      default: 'static'
    },
    // 用户自行配置的静态数据, 当 dataOrigin 为 static 时有效
    // 为 base64 编码的值
    staticData: {
      type: String,
      default: ''
    },

    dataElement: Object,

    // api 数据, 当 dataOrigin 为 api 时有效
    apiData: {
      type: [Object, Array],
      default: () => []
    },
    // 配置的
    apiConf: {
      type: Object,
      default: () => ({
        method: 'post',
        url: '',
        params: '{}', // 请求参数
        // headers: {},
        dataProcessor: '',
        dictTypeCode: ''
      })
    },
    valueMap: Object
  },
  // 组件使用方通过 props 传入给 SmartForm 组件的数据
  inject: ['providedProps', 'getFormData', '$formBus'],
  data () {
    return {
      // 'initial'(初始状态), 'pending'(请求中),
      // 'succeed'(请求成功), 'error'(请求失败)
      requestState: 'initial',
      finalData: [],
      toBeFinalData: null
    }
  },
  computed: {
    parsedStaticData () {
      let data = []
      try {
        data = parseJsValue(this.staticData)?.value
      } catch (e) {}
      return data
    }
    // parsedApiParams () {
    //   const { params } = this.apiConf || {}

    //   // 解析参数
    //   let result = {}
    //   try {
    //     result = parseParamsSchema(
    //       parseJsValue(params).value || {},
    //       this.providedProps.apiParams,
    //       this.getFormData()
    //     )
    //   } catch (e) {}

    //   return result
    // }
  },
  // mixin 中的 watch 需要特别注意
  watch: {
    dataOrigin () {
      this.updateFinalData()
    },
    staticData () {
      this.updateFinalData()
    },
    dataElement () {
      this.updateFinalData()
    },
    'providedProps.apiParams' () {
      if (this.dataOrigin === 'api') {
        this.$_fetchData()
      }
    },
    'apiConf.params': {
      deep: true,
      handler () {
        if (this.dataOrigin === 'api') {
          this.$_fetchData()
        }
      }
    }
    // parsedApiParams () {
    //   console.log('---- dataOrigin changed ----')
    //   if (this.dataOrigin === 'api') {
    //     this.$_fetchData()
    //   }
    // }
  },
  created () {
    // this.__unreactive_debouncedUpdateFinalData () {}
    this.updateFinalData = debounce(function (keyword) {
      console.log('---- updateFinalData ----', this.dataOrigin)
      if (this.toBeFinalData) {
        this.finalData = this.toBeFinalData
      } else {
        if (this.dataOrigin === 'api') {
          this.$_fetchData(keyword)
        } else if (this.dataOrigin === 'dataElement') {
          this.$_fetchData2(keyword)
        } else {
          this.finalData = this.parseStaticData()
        }
      }
    }, 200)

    this.updateFinalData()
  },
  methods: {
    getFetchedData () {
      return cloneDeep(this.finalData)
    },
    setFetchedData (data) {
      this.finalData = data
    },
    // updateFinalData () {
    //   console.log('---- updateFinalData ----')
    //   if (this.toBeFinalData) {
    //     this.finalData = this.toBeFinalData
    //   } else {
    //     if (this.dataOrigin === 'api') {
    //       this.$_fetchData()
    //     } else if (this.dataOrigin === 'dataElement') {
    //       this.$_fetchData2()
    //     } else {
    //       this.finalData = this.parseStaticData()
    //     }
    //   }
    // },
    parseStaticData () {
      let data = []
      try {
        data = parseJsValue(this.staticData)?.value
      } catch (e) {}
      return data
    },

    parseApiParams () {
      const { params } = this.apiConf || {}
      // 解析参数
      let result = {}
      try {
        result = parseParamsSchema(
          parseJsValue(params).value || {},
          this.providedProps.apiParams,
          this.getFormData()
        )
      } catch (e) {}

      return result
    },

    $_fetchData (keyword, pageNo) {
      if (this.valueMap?.disableFetchRemoteData) return
      // 首先检查是否有 api 配置, 如果没有, 则使用数据
      const { method, url } = this.apiConf || {}

      if (!url) {
        this.finalData = []
        return
      }

      // 请求参数
      // const paramsObj = this.parsedApiParams
      const paramsObj = this.parseApiParams()

      paramsObj.pageNo = pageNo || 0

      const dataProcessor = parseJsValue(
        this.apiConf?.dataProcessor
      ).value

      this.requestState = 'pending'
      return createAxios()[method](url, {
        ...paramsObj,

        keyword
      }).then(res => {
        if (!res.success) {
          this.requestState = 'error'
          this.finalData = [] // 获取数据失败, 则清空原来的数据
          return
        }

        this.requestState = 'success'
        let { data } = res
        if (typeof dataProcessor === 'function') {
          try {
            data = dataProcessor(res)
            // this.$message.info('1: 已使用自定义数据处理器')
          } catch (e) {
            // this.$message.error('2: 使用自定义数据处理器出错，请检查！')
          }
        }
        if (paramsObj.pageNo === 0) {
          this.finalData = this.formatApiData(data)
        } else {
          this.finalData = this.finalData.concat(this.formatApiData(data))
        }

        // select有下拉 要拿分页
        if (paramsObj.pageNo === 0 && this.pagination) {
          this.pagination.total = res.count && res.count > -1 ? res.count : this.pagination.total
          this.maxPageNo = Math.ceil(this.pagination.total / paramsObj.pageSize)
        }
      }).catch(e => {
        this.finalData = null
        this.requestState = 'error'
      }).finally(() => {
        this.$formBus.$emit('fetch-remote-data-done')
      })
    },
    // 数据元接口
    $_fetchData2 (keyword) {
      if (this.valueMap?.disableFetchRemoteData) return
      const dictTypeCode = this.apiConf.dictTypeCode || '2'
      // 请求参数
      const paramsObj = this.parseApiParams()
      const dataProcessor = parseJsValue(
        this.apiConf?.dataProcessor
      ).value

      const { mrasEleDataId } = this.dataElement || {}
      if (!mrasEleDataId) return
      let pageObj = {}
      if (this.parsedFormItemEntityProps.remote) {
        pageObj = {
          pageSize: 100,
          pageNo: 0,
          pageType: 'P'
        }
      }
      const url = '/mras-mdm/api/v1/mras_mas_mars/mras_ele_data_value/mas/query/by_example'
      const { hospitalSOID } = getStoragedUserInfo()

      this.requestState = 'pending'
      return createAxios().post(url, {
        mrasEleDataId,
        ...paramsObj,
        ...pageObj,
        dictTypeCode,
        keyword,
        hospitalSOID,
        soid: [hospitalSOID, 10]
      }).then(res => {
        if (!res.success) {
          this.requestState = 'error'
          this.finalData = [] // 获取数据失败, 则清空原来的数据
          return
        }

        this.requestState = 'success'
        let { data } = res
        if (typeof dataProcessor === 'function') {
          try {
            data = dataProcessor(res)
            // this.$message.info('1: 已使用自定义数据处理器')
          } catch (e) {
            // this.$message.error('2: 使用自定义数据处理器出错，请检查！')
          }
        }

        this.finalData = this.formatApiData(data)
      }).catch(e => {
        this.finalData = null
        this.requestState = 'error'
      }).finally(() => {
        this.$formBus.$emit('fetch-remote-data-done')
      })
    },
    formatApiData (data) {
      // console.warn(`${genLogPrefix('warn')} ${this.$options.name} 没有实现 formatApiData() 方法`)
      return data
    }
  }
}
