<template>
  <div v-loading="loading" class="custom-table">
    <el-button type="primary">新增业务科室</el-button>
    <el-table :data="tableData">
      <el-table-column label="科室名称" prop="dept" />
      <el-table-column label="授权情况" prop="permission" />
      <el-table-column label="有效期" prop="dates" />
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'CustomTable',
  inject: ['providedProps', 'updateField', '$formBus', 'getFormData'],
  data () {
    return {
      loading: false,
      tableData: []
    }
  },
  created () {
    this.$formBus.$on('change-field', this.$_onChangeField)
  },
  beforeDestroy () {
    this.$formBus.$off('change-field', this.$_onChangeField)
  },
  methods: {
    $_onChangeField (params) {
      console.log(params)
      console.log(this.getFormData())
    }
  }
}
</script>
