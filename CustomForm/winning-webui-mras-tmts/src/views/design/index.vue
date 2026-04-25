<template>
  <div class="design">
    <el-button style="margin-bottom: 20px;" @click="onAddCustom">
      注册自定义组件
    </el-button>
    <SmartFormDesign ref="smartFormDesign"
      :api-params="apiParams"
      :value-map="valueMap"
      :custom-props="customProps"
      :designConfig = "designConfig"
      show-data-el-tab
      :left-tab-slots="[
        { name: 'left-tab-data-element', label: '数据元' },
        { name: 'left-tab-a', label: 'A 插槽' },
        { name: 'left-tab-b', label: 'B 插槽' }
      ]"
      @save="onSave">
      <template #left-tab-data-element>
        <DataElement />
      </template>
      <template #left-tab-a>a</template>
      <template #left-tab-b>b</template>
      <template #select-data-element-slot>
        <select-data-element/>
      </template>
      <template #form-config-slot>
        <FormConfig/>
      </template>
    </SmartFormDesign>
  </div>
</template>

<script>
import Vue from 'vue'
import SmartFormDesign from '@/components/smart-form-design/index.vue'
import DataElement from './slots/data-element'
import SelectDataElement from './slots/select-data-element'
import FormConfig from './slots/form-config'
// import { genFormItem } from '@/components/smart-form/utils'
import CustomTable from './CustomTable'
import TestDemo from './TestDemo'
import { getStoragedUserInfo } from '@/utils/cache'
// import { createAxios } from '@/api'

// const axios = createAxios()

Vue.component('CustomTable', CustomTable)
Vue.component('TestDemo', TestDemo)

export default {
  name: 'HomeView',
  components: {
    SmartFormDesign,
    DataElement,
    SelectDataElement,
    FormConfig
  },
  data () {
    return {
      conf: '',
      valueMap: {
        employeeId: '255480612717443072',
        name: '张晓琳（1990）',
        employeeName: '六六',
        workAge: '5年',
        mobile: '171xxxxxxxx',
        deptName: '神经外科',
        techTitle: '主治医师',
        employeeNo: '6618',
        techTitleDate: '2022-10-28',
        qaCertificateNo: '123456789', // 资质证书编码
        qaCertificateDate: '2022-10-28', // 资质证书编码
        wfNodeName: '新建'
      },
      designConfig: { // 配置属性
        isRequiredField: false, // 字段名是否只读 下拉选择
        leftTabwidth: '300px', // 左侧tab初始宽度 无效
        dataElementList: [
          {
            value: 'M06C',
            label: '死亡可能涉及的因素死亡可能涉及的因素死亡可能涉及的因素死亡可能涉及的因素死亡可能涉及的因素死亡可能涉及的因素'
          },
          {
            value: 'M05A',
            label: '姓名'
          },

          {
            value: 'M07C',
            label: '非医嘱离院可能涉及因素'
          },
          {
            value: 'M75C',
            label: '性别ID'
          },
          {
            value: 'M75M',
            label: '性别名称'
          }
        ]
      },
      customProps: {
        hospitalSOID: 993718
      }
    }
  },
  computed: {
    apiParams () {
      const { userId, hospitalSOID } = getStoragedUserInfo()
      return {
        userId: userId,
        soid: [hospitalSOID, 10],
        hospitalSOID,
        currentUserHospitalSOID: hospitalSOID,
        soidParams: {
          hospitalSOID: hospitalSOID,
          soid: [hospitalSOID, 10],
          hospitalAreaId: hospitalSOID,
          hospitalAreaList: [hospitalSOID, 10]
        }
      }
    }
  },
  mounted () {
    this.onAddCustom()
  },
  methods: {
    onAddCustom () {
      // this.$refs.smartFormDesign.registerComponent({
      //   text: '自定义表格',
      //   value: 'CustomTable',
      //   desc: 'xxxx'
      // })

      this.$refs.smartFormDesign.registerComponents([
        {
          componentInfo: {
            text: '自定义表格',
            value: 'CustomTable',
            field: 'customTable',
            desc: 'xxxx'
          }
        },
        {
          componentInfo: {
            text: 'TestDemo',
            value: 'TestDemo',
            field: 'testDemo',
            desc: 'xxxx2'
          }
        }
      ])
    },
    onSave (config) {
      console.log(config)
    }
    // async function_name () {
    //   this.loading = true
    //   try {
    //     const res = await axios.post('/api/v1/mras_mas_mars/mras_form_temp/mas/add', {
    //       hospitalSOID: 10,
    //       mrasFormDefaultId: 0,
    //       soid: [],
    //       tempContentData: 'string',
    //       tempTypeName: 'string' // 模板名称
    //     })
    //     if (!res.success) return

    //     console.log(res)
    //   } catch (e) {
    //     console.log(e)
    //   } finally {
    //     this.loading = false
    //   }
    // },
  }
}
</script>

<style lang="scss" scoped>
.design {
  box-sizing: border-box;
  width: 100vw;
  height: calc(100vh - 60px);
  padding: 16px;

  // :deep(.smart-form) {
  //   width: 960px;
  //   margin: 20px auto;
  // }
}
</style>
