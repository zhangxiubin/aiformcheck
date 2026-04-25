<template>
  <div v-loading="loading" class="smart-form-design-left" >
    <el-tabs v-model="activeTab" stretch>
      <el-tab-pane label="组件" name="component">
        <el-divider>内置组件</el-divider>
        <VueDraggable
          v-model="FORM_ITEMS"
          :group="dragGroup"
          :sort="false"
          :clone="onClone"
          class="form-items-group"
          @start="onStart"
          @end="onEnd">
          <div
            v-for="item in FORM_ITEMS"
            :key="item.value"
            :class="{
              'form-item-menu': true,
              active: item.value === activeType
            }"
            :title="`${item.text}（按住拖动到中间表单区）`">
              {{ item.text }}
            </div>
        </VueDraggable>

        <el-divider>自定义组件</el-divider>
        <VueDraggable
          v-model="customComps"
          :group="dragGroup"
          :sort="false"
          :clone="onClone"
          class="form-items-group">
          <div
            v-for="item in customComps"
            :key="item.value"
            :class="{
              'form-item-menu': true,
              active: (item.value === activeCustomComp) || (item.value === `Sfcc${activeCustomComp}`)
            }"
            :title="`${item.text}（按住拖动到中间表单区）`">
              {{ item.text }}
            </div>
        </VueDraggable>
      </el-tab-pane>
      <!-- <el-tab-pane v-if="$slots" label="数据元" name="dateEl">
        <slot name="left-tab"></slot>
      </el-tab-pane> -->
      <template v-for="item in leftTabSlots">
        <el-tab-pane :key="item.name"  :label="item.label" :name="item.name">
          <slot :name="item.name"></slot>
        </el-tab-pane>
      </template>
    </el-tabs>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import VueDraggable from 'vuedraggable'
import { DRAG_GROUP_NAME } from '@/components/smart-form/consts'
import { FORM_ITEMS } from '@/components/smart-form/consts/form-items'
import { genFormItem } from '@/components/smart-form/utils'

export default {
  name: 'SmartFormDesignLeft',

  props: {
    mode: String,
    leftTabSlots: Array
  },

  components: {
    VueDraggable
  },
  inject: ['existField', 'existId', 'pushCustomItem'],
  data () {
    return {
      activeTab: 'component',
      FORM_ITEMS: cloneDeep(FORM_ITEMS),
      dragGroup: {
        name: DRAG_GROUP_NAME,
        pull: 'clone',
        put: false
      },
      loading: false,
      // 注册的自定义组件名 [{ text, value, desc, custom: true }]
      customComps: [],
      activeType: '',
      activeCustomComp: ''
    }
  },

  watch: {
    mode: {
      immediate: true,
      handler () {
        this.activeType = ''
      }
    }
  },

  methods: {
    updateCustomComps (customComps) {
      this.customComps = customComps
    },
    setActiveTypeOrCustomComp (itemData) {
      const { type, customCompName } = itemData || {}
      if (customCompName) {
        this.activeType = ''
        this.activeCustomComp = customCompName
      } else if (type) {
        this.activeType = type
        this.activeCustomComp = ''
      } else {
        this.activeType = ''
        this.activeCustomComp = ''
      }
    },

    onClone (formItem) {
      if (formItem.custom) return this.cloneCustomComp(formItem)
      return this.cloneInnerComp(formItem.value)
    },
    onStart () {
      this.$emit('drag-start')
    },
    onEnd () {
      this.$emit('drag-end')
    },
    cloneCustomComp ({ value, field }) {
      const formItemConf = genFormItem('', {
        customCompName: value,
        field
      })
      if (this.existField(formItemConf.field)) {
        this.$message.warning('生成的 field 重复，请重试！')
        return
      }

      if (this.existId(formItemConf.id)) {
        this.$message.warning('生成的 id 重复，请重试！')
        return
      }

      return formItemConf
    },
    cloneInnerComp (type) {
      let formItemConf
      if (type === 'text') {
        formItemConf = genFormItem(type, {
          defaultValue: '文本标题',
          formItemProps: {
            label: '文本标题'
          },
          colProps: {
            span: 24
          }
        })
      } else if (type === 'divider') {
        formItemConf = genFormItem(type, {
          formItemProps: {
            label: '分割线'
          },
          colProps: {
            span: 24
          }
        })
      } else if (type === 'empty') {
        formItemConf = genFormItem(type, {
          formItemProps: {
            label: '占位符'
          },
          colProps: {
            span: 24
          }
        })
      } else if (type === 'upload') {
        formItemConf = genFormItem(type, {
          formItemProps: {
            label: '上传文件'
          },
          colProps: {
            span: 24
          }
        })
      } else if (type === 'table') {
        formItemConf = genFormItem(type, {
          formItemProps: {
            label: '表格'
          },
          colProps: {
            span: 24
          }
        })
      } else {
        formItemConf = genFormItem(type)
      }
      // console.log(formItemConf)

      if (this.existField(formItemConf.field)) {
        this.$message.warning('生成的 field 重复，请重试！')
        return
      }

      if (this.existId(formItemConf.id)) {
        this.$message.warning('生成的 id 重复，请重试！')
        return
      }

      return formItemConf
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.el-tabs) {
  height: 100%;

  .el-tabs__content {
    height: calc(100% - 40px);
    overflow: auto;
  }
}

:deep(.el-divider__text) {
  white-space: nowrap;
}

:deep(.el-tabs__header) {
  margin-bottom: 0;
}

.smart-form-design-left {
  user-select: none;
  .el-tabs .el-tab-pane{
   height: 100%;
  }
}

.form-items-group {
  display: flex;
  flex-wrap: wrap;
  margin: 0 12px;
  gap: 10px;
}

.form-item-menu {
  box-sizing: border-box;
  width: 60px;
  height: 40px;
  padding: 4px;
  // line-height: 28px;
  // text-align: center;
  overflow: hidden;
  border: 1px solid #ccc;
  font-size: 12px;
  // margin: 8px 8px 0 0;
  cursor: default;
  display: flex;
  align-items: center;
  justify-content: center;
  word-break: break-all;
  text-align: center;

  &.active {
    border-color: #409EFF;
    color: #409EFF;
    font-weight: bold;
    box-shadow: 2px 2px 4px #409eff;
  }
}
</style>
