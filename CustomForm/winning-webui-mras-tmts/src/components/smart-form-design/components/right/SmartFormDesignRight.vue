<template>
  <div v-loading="loading" class="smart-form-design-right">
    <el-tabs v-model="activeTab" stretch>
      <el-tab-pane label="表单项设置" name="formItem">
        <ItemProps v-if="showPropsPane" :item-data="itemData" :formConfig="formConfig" :designConfig="designConfig" :selectDataElementSlot="selectDataElementSlot" >
          <template #select-data-element-slot>
           <slot name="select-data-element-slot"></slot>
          </template>
        </ItemProps>
        <p v-else class="empty-tips">请先添加或选中表单项</p>
      </el-tab-pane>
      <el-tab-pane label="整体设置" name="form">
        <FormProps>
          <template #form-config-slot>
          <slot name="form-config-slot"></slot>
        </template>
        </FormProps>
        <!-- <RowProps /> -->
      </el-tab-pane>
    </el-tabs>

    <!-- <div v-if="!itemData || !get(itemData, 'id')" class="empty-mask">
      请先添加或选中表单项
    </div> -->
  </div>
</template>

<script>
import { get } from 'lodash'
import { isValidFormItemSchcma } from '@/components/smart-form/utils'
import FormProps from './components/FormProps'
// import RowProps from './components/RowProps'
import ItemProps from './components/ItemProps'

export default {
  name: 'SmartFormDesignRight',
  components: {
    FormProps,
    // RowProps,
    ItemProps
  },
  props: {
    itemData: Object,
    formConfig: Object,
    designConfig: Object,
    selectDataElementSlot: Object,
    rightTabSlots: Array
  },
  data () {
    return {
      loading: false,
      activeTab: 'formItem'
    }
  },
  computed: {
    showPropsPane () {
      return isValidFormItemSchcma(this.itemData)
    }
  },
  methods: {
    get
  }
}
</script>

<style lang="scss" scoped src="./index.scss"></style>
<style>
.max-width-popper{
  max-width: 300px;
}

</style>
