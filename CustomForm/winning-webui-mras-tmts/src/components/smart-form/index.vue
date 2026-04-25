<template>

  <div
    v-if="canRender"
    class="smart-form-wrapper">
    <el-form
      v-bind="config.formProps"
      ref="form"
      :model="formData"
      :rules="formRules"
      :class="classes">
      <el-row v-if="formDataInitialized" v-bind="config.rowProps">
        <VueDraggable v-model="config.items"
          v-bind="dragOptions"
          class="list-group"
          :style="dragAreaStyle"
          @start="drag = true"
          @end="drag = false"
          @change="onDragChange">
          <!-- 有初始为空时, 有 transition-group 无法拖进来 -->
          <!-- <transition-group type="transition" :name="!drag ? 'flip-list' : null"> -->
          <template v-for="item in config.items">

            <el-col
            v-bind="item.colProps"
            v-if="item.display!==false  || mode === 'design'"
            :key="item.id"
            :id="item.id"
            :ref="item.id"

            :class="{
              'list-group-item': true,
              active: activeFieldId && activeFieldId === item.id
            }"
            @click.native="onFormItemClick(item)">

            <div v-if="['text', 'empty', 'divider'].includes(item.type)"
            class="smart-form-item" >
              <component
                v-bind="omit(item, ['colProps', 'formItemProps'])"
                :is="FORM_ITEMS_MAP[item.type]"
                :value-map="valueMap"
                :ref="`formItemEntity-${item.field}`"
                class="smart-form-item-entity unnormal"
                :style="parseStyles(item.styles, item.type)"

              />
            </div>

            <div v-else-if="item.type === 'slot'" class="smart-form-item" >
              <slot :name="item.field"> {{ mode==='design' ? 'slot占位':'' }}</slot>
            </div>
            <!-- 自定义组件 -->
            <div v-else-if="item.customCompName" class="smart-form-item" :style="parseStyles(item.styles)">
              <component
                v-bind="omit(item, ['colProps', 'formItemProps'])"
                :form-props="config.formProps"
                :ref="`custom-${item.field}`"
                :mode="mode"
                :value="formData[item.field]"
                :value-map="valueMap"
                :is="item.customCompName"
                class="smart-form-item-entity custom"
              />
            </div>
            <!-- 内置组件 -->

            <el-form-item v-else v-bind="item.formItemProps"
              :prop="get(item, 'field')"
              class="smart-form-item"
              :class="{hideLabel: item.hideLabel}"  :style="parseELStyles(item.styles, item.type)">
              <!-- <el-input v-model="formData.name1" /> -->
              <component :ref="`formItemEntity-${item.field}`"
                v-bind="omit(item, ['colProps', 'formItemProps'])"
                :form-props="config.formProps"
                :value="formData[item.field]"
                :is="FORM_ITEMS_MAP[item.type]"
                :value-map="valueMap"
                :editWfNodeNames ="item.editWfNodeNames"
                class="smart-form-item-entity"
              />
              <span v-show="item.remarks" class="remarks">{{item.remarks}}</span>
            </el-form-item>
            <template v-if="mode === 'design'">
              <div class="form-item-mask"></div>
              <div class="item-actions">
                <el-button type="danger" icon="el-icon-delete"
                  circle plain size="mini" title="移除"
                  @click="onItemRemove(item.id)"
                />
                <el-button type="success" icon="el-icon-document-copy"
                  circle plain size="mini" title="复制"
                  @click="onItemCopy(item)"
                />
              </div>
            </template>
          </el-col>
        </template>
          <!-- </transition-group> -->
        </VueDraggable>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import VueDraggable from 'vuedraggable'
import { cloneDeep, omit, get } from 'lodash'
import JSON5 from 'json5'
import { parseJsValue } from '@/utils/parse-code'
import { parseParamsSchema } from '@/utils/parse-params'
import captureMixin from '@/mixins/capture'
import { DRAG_GROUP_NAME } from './consts'
import { FORM_ITEMS_MAP } from './consts/form-items'
import { config } from './config'
import { genItemId, genItemField, genFormDataFromFormItems } from './utils'
import openApi from './mixins/smart-form-open-api'
import batchRegisterItems from './batch-register-items'
export default {
  name: 'SmartForm',
  components: {
    VueDraggable,
    ...batchRegisterItems()
  },
  mixins: [openApi, captureMixin],
  props: {
    // 表单模式(暂时只有 3 种):
    // 'design'(设计模式), 'app'(应用模式, 可以交互), 'view'(浏览模式, 禁用表单交互)
    mode: {
      type: String,
      default: 'app'
    },
    // $visitPath: 开头的从这里取值
    apiParams: {
      type: Object,
      default: () => ({})
    },
    // $valueMap: 开头的从这里取值
    // 主要为了做一些便捷的动态控制
    valueMap: {
      type: Object,
      default: () => ({})
    },
    /*
     * 表单拖动区域的样式
     * 某些情况下可能需要动态设置, 比如在设计组件中, 拖动组件时, 可能需要高亮
     */
    dragAreaStyle: Object
  },
  provide () {
    return {
      providedProps: this.providedProps,
      parseCustomCompConfig: this.parseCustomCompConfig
    }
  },
  data () {
    return {
      FORM_ITEMS_MAP,
      canRender: true,
      config,
      formDataInitialized: false,
      // form item 交互的变化都会通过 this.updateField() 同步 formData 的值
      formData: {},
      drag: false,
      activeFieldId: '',
      providedProps: {
        mode: this.mode,
        apiParams: this.apiParams,
        valueMap: this.valueMap
      }
    }
  },
  computed: {
    classes () {
      const { mode } = this
      const { border, size, showMessage, fixItemHeight } = this.config?.formProps || {}
      return [
        'smart-form',
        `smart-form--${size}`,
        showMessage ? '' : 'smart-form--no-message',
        border ? 'smart-form--border' : '',
        `smart-form--mode-${mode === 'design' ? 'design' : 'app'}`,
        fixItemHeight ? 'fix-item-height' : ''
      ]
    },
    formRules () {
      const rules = {}
      try {
        const defaultRules = parseJsValue(this.config?.formProps?.rulesStr)?.value || {}
        // 去掉非填写节点--不需要检验的字段
        Object.keys(defaultRules).forEach(field => {
          const currentItem = this.config.items.find(v => v.field === field)
          if (
            currentItem && currentItem.editWfNodeNames &&
      (!this.valueMap.wfNodeName || !currentItem.editWfNodeNames.split(',').includes(this.valueMap.wfNodeName))
          ) {
            return false
          } else {
            rules[field] = defaultRules[field]
          }
        })
      } catch (e) {
        console.log('e', e)
      }

      return rules
    },
    dragOptions () {
      return {
        animation: 200,
        group: DRAG_GROUP_NAME,
        disabled: this.mode !== 'design',
        ghostClass: 'drag-ghost'
      }
    }
  },
  watch: {
    mode (val) {
      this.setActiveField('')
      this.providedProps.mode = val
      console.log('config.items', this.config.items)
    },
    apiParams: {
      deep: true,
      handler (val) {
        this.providedProps.apiParams = val
      }
    },
    valueMap: {
      deep: true,
      handler (val) {
        this.providedProps.valueMap = val
      }
    },
    'config.items' (items) {
      if (this.mode === 'design') {
        this.formData = genFormDataFromFormItems(items, this.valueMap, this.apiParams)
      }
    },
    activeFieldId (id) {
      this.$emit('active-field-change', this.getItemConfigByID(id))
    }
  },
  mounted () {
    this.formData = genFormDataFromFormItems(this.config?.items || [], this.valueMap, this.apiParams)
    this.formDataInitialized = true
  },
  methods: {
    // 选中组件块
    onFormItemClick (formItem) {
      if (this.mode === 'design') {
        this.setActiveField(formItem.id)
        this.$emit('form-item-click', cloneDeep(formItem))
      }
    },
    onDragChange (e) {
      const formItem = e.added?.element || {}
      if (formItem.field) {
        this.setActiveField(formItem.id)
      }
    },

    async onItemRemove (id) {
      try {
        await this.$confirm('确定移除？', '提示', {
          type: 'warning'
        })
        this.removeItem(id)
        if (this.mode === 'design') {
          this.$emit('active-field-change', null)
        }
      } catch (e) {}
    },
    onItemCopy (item) {
      const id = genItemId()
      const field = genItemField()
      if (this.existId(id) || this.existField(field)) {
        this.$message.warning('复制失败，请再试一次。（DUPLICATE_ID_OR_FIELD）')
        return
      }

      const newItem = cloneDeep(item)
      newItem.id = id
      newItem.field = field

      const index = this.config.items.indexOf(item)
      this.config.items.splice(index, 0, newItem)
    },
    parseStyles (styles, type) {
      let parsedStyles = {}
      try {
        parsedStyles = parseJsValue(styles)?.value || {}
        if (type === 'text' && !parsedStyles.lineHeight) {
          parsedStyles.lineHeight = parsedStyles.height || '30px' // 老数据处理
        }
      } catch (e) {}
      return parsedStyles
    },
    // 内置组件 高度会影响对齐
    parseELStyles (styles, type) {
      let parsedStyles = {}
      try {
        parsedStyles = parseJsValue(styles)?.value || {}

        if (!parsedStyles.height.endsWith('px')) {
          parsedStyles.height = parsedStyles.height + 'px'
        }
      } catch (e) {}
      return parsedStyles
    },
    parseCustomCompConfig (customCompConfig) {
      let result = {}

      let parsedCustomCompConfig = {}
      try {
        parsedCustomCompConfig = JSON5.parse(customCompConfig)
      } catch (e) {
        console.log('JSON5 解析错误', e)
      }

      try {
        result = parseParamsSchema(
          // parseJsValue(customCompConfig).value || {},
          parsedCustomCompConfig,
          this.apiParams,
          this.formData
        )
      } catch (e) {}

      return result
    },
    omit,
    get
  }
}
</script>

<style lang="scss"  src="./style/index.scss"></style>
