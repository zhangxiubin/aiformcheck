<template>
  <div class="home">
    <FormPro ref="formPro" />

    <el-input
      v-model="conf"
      type="textarea"
      :autosize="{ minRows: 6, maxRows: 30 }"
      placeholder="请输入内容"
      style="margin: 16px 0;">
    </el-input>

    <el-button @click="onSync">同步配置</el-button>
    <el-button type="primary" @click="onSubmit">确定</el-button>
    <el-button type="primary" @click="onSubmitCustom">插入自定义组件</el-button>
  </div>
</template>

<script>
// @ is an alias to /src
// import FormPro from '@/components/form-pro/index.js'
import FormPro from '@/components/smart-form/index.vue'
import CustomFormItem from '@/components/CustomFormItem'
import { FORM_CONF } from './config'

export default {
  name: 'HomeView',
  components: {
    FormPro
  },
  data () {
    return {
      conf: ''
    }
  },
  mounted () {
    this.$refs.formPro.registerComponent('CustomFormItem', CustomFormItem)
  },
  methods: {
    onSync () {
      this.conf = JSON.stringify(this.$refs.formPro.getConfig())
    },
    onSubmit () {
      try {
        const conf = JSON.parse(this.conf)
        this.$refs.formPro.setConfig(conf)
      } catch (e) {
        console.log(e)
      }
    },
    onSubmitCustom () {
      this.conf = JSON.stringify(FORM_CONF)
      this.onSubmit()
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  padding: 16px;
}
</style>
