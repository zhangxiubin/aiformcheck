<template>
  <div class="item-props">
    <el-form v-bind="FORM_PROPS" :model="formData">
      <el-form-item label="ID">
        <el-input v-model.trim="formData.id" disabled />
      </el-form-item>
      <el-form-item
        :label="
          get(itemData, 'type') === 'slot'
            ? '字段名(将被用作自定义插槽名)'
            : '字段名'
        "
      >
       <!-- isRequiredField 业务配置参数 字段名是否只读下拉选择   notBindToModel 不需要绑定到表单数据模型 如text empty divider -->
      <el-select v-if="isRequiredField && !formData.notBindToModel" v-model.trim="formData.field" filterable :disabled="isRequiredField"  popper-class="max-width-popper" >
          <el-option
            v-for="item in dataElementList"
              :key="item.value"
              :label="item.value"
              :disabled="disabledData(item.value,formData.id)"
              :value="item.value"
            >
            <div class="d-flex-option">
            <span>{{item.value  }}</span> <span>{{item.label  }}</span>
          </div>
          </el-option>
        </el-select>
        <el-input v-else v-model.trim="formData.field"  />
      </el-form-item>
      <el-collapse v-model="collapse" accordion class="smart-collapse">
        <el-collapse-item name="1" title="基本属性">
          <!-- colProps -->
          <el-form-item label="宽度">
            <el-select v-model="formData.colProps.span" filterable>
              <el-option
                v-for="item in spans"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <!-- formItemProps -->
          <el-form-item v-show="showFormItemPropsLabel" label="标签文本">
            <el-input v-model.trim="formData.formItemProps.label" />
          </el-form-item>
          <el-form-item  label="标签宽度" v-if="showFormItemPropsLabel">
            <el-input v-model.trim="formData.formItemProps.labelWidth" />
            <p class="form-tip">auto为自动， 宽度需加px</p>
          </el-form-item>
          <el-form-item v-show="showDefaultValue" label="默认值">
            <el-input
              v-model.trim="formData.defaultValue"
              placeholder="以 $valueMap: 开头则会取动态值"
            >
              <template #prepend>
                <el-select
                  v-model="formData.valueType"
                  placeholder="值类型"
                  style="width: 96px"
                >
                  <el-option
                    v-for="item in VALUE_TYPES"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </template>
            </el-input>
            <!-- <p class="form-tip">
            以<code>$valueMap:</code>开头则会取动态值；以<code>$dataOrigin:index</code>则会取当前数据源的第 index 个
            </p> -->
          </el-form-item>

          <!-- formItemEntityProps -->
          <div v-if="showFormItemEntityProps">
            <!-- 控件属性 -->
            <component
              :is="FORM_ITEMS_MAP[formData.type] + 'Props'"
              :itemEntityProps.sync="formData.formItemEntityProps"
              :itemEntityChildProps.sync="formData.formItemEntityChildProps"
              :formConfig="formConfig"
              :formProps="FORM_PROPS"
              :filed="formData.field"
            />
          </div>
          <el-form-item v-show="showRemarks" label="备注内容">
            <el-input v-model.trim="formData.remarks" />
          </el-form-item>
          <el-form-item v-show="showHiddenLabel" label="隐藏Label">
            <el-switch v-model="formData.hideLabel" />
          </el-form-item>
          <el-form-item  label="默认显示">
            <el-switch v-model="isDisplay" />
          </el-form-item>
          <el-form-item v-if="isNoFilledItem"  label="隐藏保留数据" label-width="120px">
            <el-switch v-model="isDisplaySaveData" />
          </el-form-item>
          <!-- 风格样式 及 星号设置 -->
          <styleProps
            :styles.sync="formData.styles"
            :textAsterisk.sync="formData.textAsterisk"
            :itemType="formData.type"
            :formProps="FORM_PROPS"
          >
          </styleProps>
          <el-form-item v-show="!isNoFilledItem" label="可编辑审批节点" label-width="110px">
          <div class="d-flex">
            <el-input class="flex-1" v-model.trim="formData.editWfNodeNames" placeholder="审批节点名称" />
            <el-tooltip class="item" effect="dark" content="输入审批环节名称，则审批人在审批过程中可编辑该字段，多个环节用英文逗号隔开（空值表示仅在提交申请时可编辑）" placement="top">
        <i class="el-icon-question"></i>
    </el-tooltip>

          </div>
          </el-form-item>

          <template v-if="showMoreSetting">
            <div class="style-config"  v-show="showFormItemEntityProps">
              元素属性
              <el-input
                v-model.trim="formItemEntityPropsJson"
                type="textarea"
                :autosize="autosize"
                @blur="updateEntityProps"
              />
            </div>
            <div class="style-config"   v-show="showFormItemEntityChildProps">
              子元素属性
              <el-input
                v-model.trim="formItemEntityChildPropsJson"
                type="textarea"
                :autosize="autosize"
                @blur="updateEntityPropsChild"
              />
            </div>
            <div class="style-config" >
              元素样式：
              <el-input
                v-model.trim="stylesJson"
                type="textarea"
                :autosize="autosize"
                @blur="updateStyles"
              />
            </div>
          </template>
          <div class="right-button"><el-button type="text" size="mini" @click="showMoreSetting = !showMoreSetting">{{!showMoreSetting?'打开':'收起'}}更多设置></el-button></div>
        </el-collapse-item>

        <el-collapse-item name="2" title="数据源" v-show="showDataOrigin">
          <el-form-item label="数据源">
            <el-select v-model="formData.dataOrigin" placeholder="请选择" @change="changeDataOrigin">
              <el-option
                v-for="item in dataOrigins"
                :key="item.value"
                :label="item.text"
                :value="item.value"
                :disabled="item.disabled"
              />
            </el-select>
          </el-form-item>

          <!-- 数据源: 静态数据 -->
          <el-form-item
            v-show="showDataOrigin && formData.dataOrigin === 'static'"
            label="静态数据"
            class="data-origin"
          >
            <ul class="opt-list">
              <li v-for="(opt, i) in staticData" :key="i" class="opt-item">
                <el-input v-model="opt.text" @input="setFormStaticData"  placeholder="文本"/>
                <el-input v-model="opt.value" @input="setFormStaticData" placeholder="值" />
                <el-button
                  icon="el-icon-minus"
                  circle
                  type="danger"
                  plain
                  size="mini"
                  @click="deleteStaticData(i)"
                />
              </li>
            </ul>
            <el-button type="text" icon="el-icon-plus" @click="addStaticData"
              >添加</el-button
            >
          </el-form-item>
          <!-- 数据源: 数据元 -->
          <el-form-item
            v-show="showDataOrigin && formData.dataOrigin === 'dataElement'"
            label="数据元"
          >
            <!-- <DataElementSelect v-model="formData.dataElement" />
            <el-link type="primary" @click="onSelectDataElement">选择数据元</el-link> -->
            <el-link type="primary" @click="onSelectDataElement">
              {{ get(formData, "dataElement.rtaNodeName") || "设置数据元" }}
            </el-link>
          </el-form-item>
          <el-form-item
            v-show="showDataOrigin && formData.dataOrigin === 'dataElement'"
            label="字典来源"
          >
            <el-select v-model="formData.apiConf.dictTypeCode" placeholder="请选择">
              <el-option label="上报字典" value="2" />
              <el-option label="本地字典" value="1"/>
            </el-select>
          </el-form-item>

          <!-- 数据源: 接口数据 -->
          <el-form-item
            v-show="showDataOrigin && formData.dataOrigin === 'api'"
            label="接口地址"
          >
            <el-input v-model.trim="formData.apiConf.url" />
          </el-form-item>
          <el-form-item
            v-show="showDataOrigin && formData.dataOrigin === 'api'"
            label="请求方法"
          >
            <el-select v-model="formData.apiConf.method" placeholder="请选择">
              <el-option
                v-for="item in API_METHODS"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-show="showDataOrigin && formData.dataOrigin === 'api' "
            label="请求参数"
          >
            <el-input
              v-model="formData.apiConf.params"
              type="textarea"
              :autosize="autosize"
            />
          </el-form-item>

          <el-form-item
            v-show="
              showDataOrigin &&
              ['api', 'dataElement'].includes(formData.dataOrigin)
            "
            label="数据处理"
          >
            <el-input
              v-model="formData.apiConf.dataProcessor"
              type="textarea"
              placeholder="输入数据处理函数"
              :autosize="autosize"
            />
          </el-form-item>
          <template v-if="showDataOrigin">
          <el-form-item  label="绑定关联字段" label-width="100px">
            <el-select v-if="isRequiredField && dataElementList.length>0 " v-model.trim="formData.relatedField" filterable clearable  popper-class="max-width-popper" >
            <el-option
            v-for="item in dataElementList"
              :key="item.value"
              :label="item.value"
              :disabled="disabledData(item.value, formData.id)"
              :value="item.value"
            >
            <div class="d-flex-option">
            <span>{{item.value  }}</span> <span>{{item.label  }}</span>
          </div>
          </el-option>
        </el-select>
        <el-input v-else v-model.trim="formData.relatedField" />
    </el-form-item>
    <el-form-item v-if="showDataOrigin" label="绑定关联字段默认值">
            <el-input
              v-model.trim="formData.relatedDefaultValue"
              placeholder="以 $valueMap: 开头则会取动态值"
            >
              <template #prepend>
                <el-select
                  v-model="formData.relatedValueType"
                  placeholder="值类型"
                  style="width: 96px"
                >
                  <el-option
                    v-for="item in VALUE_TYPES"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </template>
            </el-input>
          </el-form-item>

  </template>
        </el-collapse-item>
        <!-- 接口数据 -->

        <el-form-item v-show="showCustomCompConfig" label="自定义配置">
          <el-input
            v-model.trim="formData.customCompConfig"
            type="textarea"
            :autosize="autosize"
          />
          <p class="form-tip">
            自定义组件的配置，传入自定义组件的属性名为
            <code>customCompConfig</code>， 值类型是
            string，如果有必要，可以通过注入的
            <code>parseCustomCompConfig</code> 方法 将其解析为一个 js 对象。
          </p>
        </el-form-item>

        <el-collapse-item name="3" title="联动设置" v-if="showLinkageProps">
          <LinkageProps
            :data="formData"
            :formConfig="formConfig"
            @updateLinkageProps="updateLinkageProps"
          ></LinkageProps>
        </el-collapse-item>
        <el-collapse-item v-show="showItemRuleConfig" name="4" title="校验设置">
          <RulesConfig :item-data="formData"
            :form-config="formConfig"
          />
        </el-collapse-item>
      </el-collapse>
    </el-form>
    <SelectDataElement
       v-if="selectDataElement.visible"
      v-bind="selectDataElement"
      :visible.sync="selectDataElement.visible"
      @submit="onSelectDataElementSubmit"
    >
    <template #select-data-element-slot>
        <slot name="select-data-element-slot"></slot>
      </template>

    </SelectDataElement>

  </div>
</template>

<script>
import { cloneDeep, debounce, get, pick, has } from 'lodash'
import { FORM_ITEMS_MAP } from '../../../../smart-form/consts/form-items'
import mixin from '../mixins'
import itemShowMixin from '../mixins/item-props-show'
import LinkageProps from './LinkageProps'
import styleProps from './styleProps'
import batchRegisterItems from '../batch-register-item-props'
import { parseJsValue } from '@/utils/parse-code'
import DataElementSelect from './DataElementSelect'
import RulesConfig from './rules-config'
import SelectDataElement from './select-data-element'

export default {
  name: 'ItemProps',
  inject: ['setConfig', 'updateFormItem'],
  mixins: [mixin, itemShowMixin],
  components: {
    LinkageProps,
    DataElementSelect,
    styleProps,
    SelectDataElement,
    ...batchRegisterItems(),
    RulesConfig
  },
  props: {
    itemData: {
      type: Object,
      default: () => ({})
    },
    formConfig: {
      type: Object,
      default: () => ({})
    },
    designConfig: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    const spans = []
    const recommendedSpans = [4, 6, 8, 12, 24]
    for (let i = 1; i < 25; i++) {
      spans.push({
        text: recommendedSpans.includes(i) ? `${i}（推荐）` : String(i),
        value: i
      })
    }

    return {
      FORM_ITEMS_MAP,
      loading: false,
      collapse: ['1'],
      API_METHODS: ['get', 'post', 'put', 'delete', 'head', 'options', 'patch'],
      VALUE_TYPES: ['string', 'number', 'boolean', 'array', 'object'],
      spans,
      autosize: {
        minRows: 5,
        maxRows: 10
      },
      formData: cloneDeep(this.itemData),
      dataOrigins: [
        { text: '静态数据', value: 'static' },
        { text: '数据元', value: 'dataElement' },
        { text: '接口', value: 'api' },
        { text: '术语', value: 'term', disabled: true }
      ],
      defaultStaticData: [{ text: '', value: '' }],
      selectDataElement: {
        visible: false,
        element: null
      },
      stylesJson: '',
      formItemEntityPropsJson: '',
      formItemEntityChildPropsJson: '',
      showMoreSetting: false
    }
  },
  computed: {
    isDisplay: {
      get () {
        return this.formData.display !== false
      },
      set (v) {
        this.$set(this.formData, 'display', v)
      }
    },
    isDisplaySaveData: {
      get () {
        return this.formData.displaySaveData !== false
      },
      set (v) {
        this.$set(this.formData, 'displaySaveData', v)
      }
    },
    staticData: {
      get () {
        return this.defaultStaticData
      },
      set (v) {
        this.defaultStaticData = v
        this.setFormStaticData()
      }
    },
    showLinkageProps () {
      const type = ['empty', 'text', 'divider']
      return !type.includes(this.formData.type)
    },

    dataElementList () {
      return this.designConfig?.dataElementList || []
    },
    isRequiredField () {
      return this.designConfig?.isRequiredField || false
    }

  },
  watch: {
    itemData: {
      immediate: true,
      handler (val) {
        console.log('watch itemData')
        if (!val.linkageProps) {
          val.linkageProps = []
        }
        this.defaultStaticData = this.parseStaticData(val.staticData)
        this.formData = cloneDeep(val)
      }
    },
    'formData.field' (val, oldVal) {
      // 检查当前有么有配置表单校验, 如果有, 则需要同步更新字段名
      // 两个 id 不一样, 表示切换了 item, 此时不需要同步更新
      if (this.formData.id !== this.__unreactive_itemId) return

      let formRules = {}
      const { formProps } = this.formConfig || {}
      try {
        formRules = parseJsValue(formProps?.rulesStr)?.value || {}
      } catch (e) {}
      console.log(formRules)

      if (has(formRules, oldVal)) {
        const itemRule = formRules[oldVal]
        delete formRules[oldVal]
        formRules[val] = itemRule
      }

      formProps.rulesStr = JSON.stringify(formRules)
      this.setConfig({
        formProps
      }, {
        disableEmitToBus: true
      })
    },
    formData: {
      deep: true,
      handler (val, oldVal) {
        this.stylesJson = cloneDeep(val.styles)
        // 前期用的readonly属性没有置灰，批量更换成disabled
        if (val.formItemEntityProps.includes('readonly')) {
          val.formItemEntityProps = val.formItemEntityProps.replace('readonly', 'disabled')
        }
        this.formItemEntityPropsJson = cloneDeep(val.formItemEntityProps)
        this.formItemEntityChildPropsJson = cloneDeep(val.formItemEntityChildProps)
        this.syncToForm()
        this.$nextTick(() => {
          this.__unreactive_itemId = val.id
        })
      }
    } // end of watch.formData

  },
  methods: {
    // 已选择数据元 不可复选
    disabledData (val, id) {
      // 过滤掉自己
      const items = this.formConfig.items.filter(v => v.id !== id)
      if (!items) return false
      return items.findIndex(v => (v.field === val || v.relatedField === val)) >= 0
    },
    syncToForm: debounce(function () {
      this.updateFormItem(this.formData.id, this.formData)
    }, 200),
    parseStaticData (staticData) {
      let staticOptions = []
      try {
        staticOptions = parseJsValue(staticData)?.value
      } catch (e) {}
      return staticOptions
    },
    addStaticData () {
      const defaultData = { text: '', value: '' }
      this.staticData = this.staticData.concat(defaultData)
    },
    deleteStaticData (i) {
      this.staticData = this.staticData.filter((item, ii) => i !== ii)
    },
    setFormStaticData () {
      this.formData.staticData = JSON.stringify(this.staticData)
    },

    onSelectDataElement () {
      Object.assign(this.selectDataElement, {
        visible: true,
        element: this.formData.dataElement
      })
    },

    onSelectDataElementSubmit (dataElement) {
      this.formData.dataElement = pick(dataElement, [
        'mrasEleDataId',
        'rtaClassNo',
        'rtaClassName',
        'rtaNodeNo',
        'rtaNodeName'
      ])
    },
    // 数据源更换
    changeDataOrigin () {
      this.formData.apiConf.dictTypeCode = this.formData.dataOrigin === 'dataElement' ? '2' : ''
    },
    updateEntityProps () {
      this.formData.formItemEntityProps = this.formItemEntityPropsJson
    },
    updateEntityPropsChild () {
      this.formData.formItemEntityChildProps = this.formItemEntityChildPropsJson
    },
    updateStyles () {
      this.formData.styles = this.stylesJson
    },
    updateLinkageProps (data) {
      this.formData.linkageProps = data
    },

    get
  }
}
</script>

<style lang="scss" scoped>
.style-config{
  font-size: 14px;
}
.right-button{
  text-align: right;
}
::v-deep .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
  margin-bottom: 12px
}
.d-flex-option{
  display: flex;
  justify-content: space-between;
  span:last-child{
    padding-left:10px;
    font-size:12px;
    color: #999
  }
}
.d-flex{
  display: flex;
  align-items: center;
  .flex-1{
    flex: 1;
    padding-right: 10px;
  }
}

</style>
