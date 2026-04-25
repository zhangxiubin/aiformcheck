import { parseJsValue } from '@/utils/parse-code'
import { getStoragedUserInfo } from '@/utils/cache'
import { createAxios } from '@/api'
function fetchData () {
  return []
}
// 数据元接口
function fetchData2 (keyFormData) {
  const dataProcessor = parseJsValue(
    keyFormData.apiConf?.dataProcessor
  ).value

  const dictTypeCode = keyFormData.apiConf.dictTypeCode || '2'
  const { mrasEleDataId } = keyFormData.dataElement || {}
  if (!mrasEleDataId) return
  // todo 暂未用上，有实际数据再做处理
  let pageObj = {}
  if ((parseJsValue(keyFormData.formItemEntityProps).value.remote)) {
    pageObj = {
      pageSize: 100,
      pageNo: 0,
      pageType: 'P'
    }
  }

  const url = '/mras-mdm/api/v1/mras_mas_mars/mras_ele_data_value/mas/query/by_example'
  const { hospitalSOID } = getStoragedUserInfo()

  return new Promise(resolve => {
    createAxios().post(url, {
      mrasEleDataId,
      dictTypeCode,
      ...pageObj,
      hospitalSOID,
      soid: [hospitalSOID, 10]
    }).then(res => {
      if (!res.success) {
        return
      }
      let { data } = res
      if (typeof dataProcessor === 'function') {
        try {
          data = dataProcessor(res)
        // this.$message.info('1: 已使用自定义数据处理器')
        } catch (e) {
        // this.$message.error('2: 使用自定义数据处理器出错，请检查！')
        }
      }
      resolve(data)
    }).catch(e => {

    }).finally(() => {

    })
  })
}

export {
  fetchData,
  fetchData2
}
