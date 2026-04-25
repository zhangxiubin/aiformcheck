<template>
  <div v-loading="loading" class=" pos-r">
    <el-button @click="onTest">Test</el-button> <el-button @click="getFormData">获取数据</el-button>  <el-button @click="validate">校验</el-button>
    <SmartForm ref="smartForm"
      :api-params="apiParams"
      :value-map="valueMap"
      mode="app"
    />
  </div>
</template>

<script>
import SmartForm from '@/components/smart-form'
import { getStoragedFormConfig, getStoragedUserInfo } from '@/utils/cache'
export default {
  name: 'SmartFormDemo',
  components: {
    SmartForm
  },
  data () {
    return {
      loading: false,
      formData: {
        hospitalSOID: '993718',
        IGOW211: '',
        zhong_cao_yao: true,
        ma_zui_lei_yao: true,
        jing_er_lei_yao: false,
        ju_du_lei_yao: false,
        jing_yi_lei_yao: true
      }

    }
  },
  computed: {
    apiParams () {
      const { userId, hospitalSOID, orgId } = getStoragedUserInfo()
      return {
        userId: userId,
        soid: [hospitalSOID, 10],
        hospitalSOID: hospitalSOID,
        hospitalAreaId: orgId,
        // 当前登录用户的院区
        currentUserHospitalSOID: hospitalSOID,
        soidParams: {
          soid: [hospitalSOID, 10],
          hospitalSOID: hospitalSOID,
          hospitalAreaId: orgId
        }
      }
    },
    valueMap () {
      return {
        name: '张晓琳（1990）',
        workAge: '5年',
        mobile: '171xxxxxxxx',
        deptName: '神经外科',
        techTitle: '主治医师',
        techTitleDate: '2022-10-28',
        qaCertificateNo: '123456789', // 资质证书编码
        qaCertificateDate: '2022-10-28', // 资质证书编码
        apiParams: this.apiParams,
        disableFetchRemoteData: true,
        wfNodeName: '新建',
        executedStatus: ''

      }
    }
  },
  methods: {
    onTest () {
      const { smartForm } = this.$refs
      const config = getStoragedFormConfig()
      console.log(config)
      if (config) {
        smartForm.setConfig(config.formConfig)
        smartForm.setFormData(config.formData)
      }
    },
    getFormData () {
      const { smartForm } = this.$refs
      const formConfig = smartForm.getConfig()
      const formData = smartForm.getFormData()
      console.log('获取提交数据', {
        formConfig,
        formData
      })
    },
    async validate () {
      const { smartForm } = this.$refs
      const { valid, invalidFields } = await this.validateSmartForm(smartForm)

      if (!valid) {
        const tips = []
        for (const k in invalidFields) {
          invalidFields[k].forEach((v) => {
            tips.push(v.label + v.message)
          })
        }

        console.log('表单校验未通过', tips)
        // this.$Message.warning({
        //   message: '表单校验不通过！',
        //   customClass: 'mras-subapp-win-message',
        //   detail: tips.join('、')
        // })
      } else {
        console.log('表单校验通过')
      }
    },

    validateSmartForm (form) {
      return new Promise((resolve) => {
        form.validate((valid, obj) => {
          resolve({
            valid,
            invalidFields: obj
          })
        })
      })
    }
  }
}
</script>
