<!-- 药品处方权限申请 -->
<template>
  <div v-loading="loading" class=" pos-r">
    <w-collapse v-model="activeNames">
      <w-collapse-item
        v-for="item in fullPermissions"
        :key="item.mrasPermClassCode"
        :title="item.mrasPermClassName"
        :name="item.mrasPermClassCode">
        {{ item.mrasPermClassName }}
      </w-collapse-item>
    </w-collapse>
  </div>
</template>

<script>
import apiMixin from './mixins/api'

export default {
  name: 'DrugPrescriptionPermission',
  mixins: [apiMixin],
  props: {
    // 自定义组件需要的
    customProps: Object
  },
  data () {
    return {
      loading: false
    }
  }
}
</script>
