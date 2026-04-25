<template>
  <div v-loading="loading" class="smart-form-design">
    <split-panes class="default-theme"   >
      <SplitPane min-size="10" max-size="50" size="18">
      <SmartFormDesignLeft ref="left" class="smart-form-design--left"
        :leftTabSlots="leftTabSlots"
        :mode="mode"
        @drag-start="onDragStart"
        @drag-end="onDragEnd">
        <template v-for="(index, name) in $slots" v-slot:[name]>
          <slot :name="name"></slot>
        </template>
      </SmartFormDesignLeft>
      </SplitPane>
    <SplitPane min-size="20" size="66">
    <div class="smart-form-design--center">

      <!-- $_onRibbonAction 在 ./mixins/ribbon-action.js 中定义 -->
      <SmartFormDesignRibbon ref="smartFormDesignRibbon"
        @change-mode="onChangeMode"
        @preview="onPreview"
        @save="onSave"
      />

      <div class="design-smart-form-wrapper" ref="smartFormWrapper">
        <SmartForm ref="smartForm"
          :api-params="apiParams"
          :value-map="valueMap"
          :mode="mode"
          :dragAreaStyle="dragAreaStyle"
          @active-field-change="onActiveFieldChange"
        />
      </div>
    </div>
  </SplitPane>
  <SplitPane min-size="10" max-size="50" size="17">
    <SmartFormDesignRight class="smart-form-design--right"
    :form-config="formConfig"
    :designConfig="designConfig"
    :item-data="itemData"
    :rightTabSlots="rightTabSlots"
    >
    <template v-slot:select-data-element-slot>
      <slot name="select-data-element-slot"></slot>
    </template>

    <template v-slot:form-config-slot>

      <slot name="form-config-slot"></slot>
    </template>
  </SmartFormDesignRight>
</SplitPane>
</split-panes>
    <FormPreview
      :visible.sync="formPreview.visible"
      :form-config="formPreview.formConfig"
      :api-params="apiParams"
      :value-map="valueMap"
      :preview-dialog-width="previewDialogWidth"
    />
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import SmartForm from '@/components/smart-form'
// import DrugPrescriptionPermission from '@/components/smart-form/custom-item-components/drug-prescription-permission'
import SmartFormDesignLeft from './components/left/SmartFormDesignLeft'
import SmartFormDesignRight from './components/right/SmartFormDesignRight'
import SmartFormDesignRibbon from './components/ribbon/SmartFormDesignRibbon'
import FormPreview from './components/FormPreview'

import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
export default {
  name: 'SmartFormDesign',

  components: {
    SplitPanes: Splitpanes,
    SplitPane: Pane,
    SmartForm,
    SmartFormDesignLeft,
    SmartFormDesignRight,
    SmartFormDesignRibbon,
    FormPreview
  },
  props: {
    apiParams: Object,
    valueMap: Object,
    // 预览弹窗的宽
    previewDialogWidth: {
      type: String,
      default: '960px'
    },
    /*
     * 左侧 tab 插槽配置
     * [
     *   {
     *     // 插槽名, 可任意定义(只要是有效的插槽名即可), kebab-case 命名风格, 以 left-tab- 开头, 不得重复
     *     name: 'left-tab-a',
     *     // tab 标签名, 即显示的 tab 文本
     *     label: 'A'
     *   }
     * ]
     */
    leftTabSlots: {
      type: Array,
      default: () => ([])
    },
    designConfig: Object,
    rightTabSlots: Array
  },

  data () {
    return {
      loading: false,
      mode: 'design',
      itemData: {
        colProps: {
          span: 6
        },
        formItemProps: {
          label: '标签名'
        },
        linkageProps: []

      },
      formConfig: {},
      // 已经注册的自定义组件
      customComps: [],
      formPreview: {
        visible: false,
        formConfig: {}
      },
      dragAreaStyle: null,
      itemDataElement: null
    }
  },
  provide () {
    return {
      existField: this.existField,
      existId: this.existId,
      setActiveField: this.setActiveField,
      getFormBus: this.getFormBus,
      setConfig: this.setConfig,
      updateFormItem: this.updateFormItem,
      pushCustomItem: this.pushCustomItem,
      pushTypedItem: this.pushTypedItem,
      getFormRef: this.getFormRef,
      setItemDataElement: this.setItemDataElement, //  设置选中数据元
      getItemDataElement: () => this.$data.itemDataElement // 获取选中数据元

    }
  },
  computed: {
    leftTabwidth () {
      return this.designConfig?.leftTabwidth || '230px'
    }
  },
  mounted () {
    // this.registerComponent({
    //   text: '药品处方权',
    //   value: 'DrugPrescriptionPermission',
    //   desc: '药品处方权'
    // }, DrugPrescriptionPermission)
  },

  methods: {
    existField (field) {
      return this.$refs.smartForm.existField(field)
    },
    existId (id) {
      return this.$refs.smartForm.existId(id)
    },
    setActiveField (field) {
      return this.$refs.smartForm.setActiveField(field)
    },
    getFormBus () {
      let bus = null
      try {
        bus = this.$refs.smartForm.getFormBus()
      } catch (e) {}

      return bus
    },
    getFormRef () {
      return this.$refs.smartForm
    },
    setConfig (config) {
      if (typeof config.name === 'string') {
        this.setTemplateName(config.name)
      }
      return this.$refs.smartForm.setConfig(config)
    },
    updateFormItem (id, newItem) {
      return this.$refs.smartForm.updateFormItem(id, newItem)
    },
    getCustomComponent (field) {
      return this.$refs.smartForm.getCustomComponent(field)
    },
    /**
     * 注册自定义组件
     * @author wangkai 2022-10-28T14:29:53+0800
     * @param  {Object} componentInfo {
     *                                  text: '自定义表格',
     *                                  value: 'CustomTable', // 组件名称
     *                                  desc: '自定义的表格'
     *                                }
     * @param  {Object} component     组件
     * @return {[type]}               [description]
     */
    registerComponent (componentInfo, component) {
      const { smartForm } = this.$refs
      const result = smartForm.registerComponent(componentInfo, component)

      if (result) {
        this.$nextTick(() => {
          this.$refs.left.updateCustomComps(cloneDeep(smartForm.customComps))
        })
      }
      return result
    },
    registerComponents (list) {
      const { smartForm } = this.$refs
      const result = smartForm.registerComponents(list)

      if (result) {
        this.$nextTick(() => {
          this.$refs.left.updateCustomComps(cloneDeep(smartForm.customComps))
        })
      }
      return result
    },
    // 插入内置组件
    pushTypedItem (type, options) {
      return this.$refs.smartForm.pushTypedItem(type, options)
    },
    pushCustomItem (customCompName) {
      return this.$refs.smartForm.pushCustomItem(customCompName)
    },
    setTemplateName (name) {
      return this.$refs.smartFormDesignRibbon.setTemplateName(name)
    },
    // 设置选中数据元
    setItemDataElement (val) {
      this.itemDataElement = val
    },

    // 切换激活的表单项, 比如原来选中的是单选 item, 现在切换到复选 item
    onActiveFieldChange (itemData) {
      console.log(itemData)
      this.itemData = itemData
      this.$refs.left.setActiveTypeOrCustomComp(itemData)
      this.formConfig = this.$refs.smartForm.getConfig()
    },

    onChangeMode (mode) {
      this.mode = mode
    },
    onPreview () {
      Object.assign(this.formPreview, {
        visible: true,
        formConfig: this.$refs.smartForm.getConfig()
      })
    },
    onSave () {
      const config = this.$refs.smartForm.getConfig()

      this.$emit('save', {
        config,
        templateName: config.name
      })
    },

    onDragStart () {
      if (this.mode !== 'design') return

      this.dragAreaStyle = {
        height: this.$refs.smartFormWrapper.getBoundingClientRect().height - 2 + 'px',
        background: 'rgba(64, 158, 255, .1)',
        border: 'rgba(64, 158, 255, 1) solid 1px'
      }
    },

    onDragEnd () {
      this.dragAreaStyle = {}
    }
  } // end of methods
}
</script>

<style lang="scss" >
@import 'style/index.scss';

.smart-form-design {
  $width-left: 230px;
  $width-right: 320px;
  $border-style: 1px solid #ccc;

  box-sizing: border-box;
  width: 100%;
  height: 100%;
  display: flex;
  border: $border-style;

  &--left {
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    overflow: auto;
    flex-shrink: 0;
    background: #fff;
  }
  &--right {
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    overflow: auto;
    border-left: 1px solid #eee;
    flex-shrink: 0;
    background: #fff;
  }
  &--center {
    box-sizing: border-box;
    height: 100%;
    // flex: 1;
    width: 100%;
    background: #fff;
    border-left: 1px solid #eee;
    border-right: 1px solid #eee;
  }
}

.design-smart-form-wrapper {
  height: calc(100% - 40px);
  overflow: auto;

  // .list-group {
  //   min-height: ;
  // }
}

</style>
