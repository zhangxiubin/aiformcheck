<template>
  <DrugPrescriptionPermission :custom-props="customProps" />
</template>

<script>
import DrugPrescriptionPermission from '@/components/smart-form/custom-item-components/drug-prescription-permission'

export default {
  name: 'DrugPrescriptionPermissionDemo',
  components: {
    DrugPrescriptionPermission
  },
  data () {
    return {
      loading: false,
      customProps: {
        hospitalSOID: 993718
      }
    }
  }
}
</script>
