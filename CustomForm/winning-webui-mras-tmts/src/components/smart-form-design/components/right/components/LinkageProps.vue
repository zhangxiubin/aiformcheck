<template>
  <div>
    <el-button
      type="text"
      size="small"
      icon="el-icon-plus"
      @click="addCondition"
      >添加条件</el-button
    >
    <VueDraggable
      v-model="conditions"
      v-bind="dragOptions"
      class="condition-list"
      @start="drag = true"
      @end="drag = false"
    >
      <li v-for="(item, index) in conditions" :key="item.id">
        <div class="condition-content">
          {{
            "条件" +
            (index + 1) +
            ": 当字段 " +
            getTargetLabel(item.event) +
            " " +
            (item.event == "onChange" && item.judgeList
              ? getJudgeListText(data.type, item.judgeList, item.rowCondition)
              : item.eventLabel)
          }}时，
          <span v-for="(it, index) in item.targetList" :key="index">
            {{ getTargetLabel(it.target) }}({{ it.target }})
            {{ getActionText(it.action) }} {{ it.toValue }},
          </span>
        </div>
        <div class="btns">
          <el-button
            circle
            plain
            type="primary"
            size="mini"
            icon="el-icon-edit"
            style="padding: 4px; margin-left: 5px"
            @click="handleEditCondition(item)"
          ></el-button>

          <el-button
            circle
            plain
            type="danger"
            size="mini"
            icon="el-icon-minus"
            style="padding: 4px; margin-left: 5px"
            @click="handleRemoveCondition(item.id)"
          ></el-button>
        </div>
      </li>
    </VueDraggable>
    <el-dialog
      title="联动条件设置"
      width="680px"
      :visible.sync="diagVisible"
      :close-on-click-modal="false"
      :append-to-body="true"
      center
    >
      <div class="form-card-editor">
        <el-form
          ref="conditionForm"
          :model="curCondition"
          size="small"
        >
          <el-form-item
            label="当前元素"
            style="margin-bottom: 5px"
            label-width="80px"
          >
            <el-select
              v-model="curCondition.event"
              placeholder="请选择"
              style="width: 100%"
              filterable
            >
              <el-option
                v-for="item in eventList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <div
            v-if="curCondition.event == 'onChange'"
            class="el-form-item__content"
            style="margin-left: 0; padding: 0 5px; border-radius: 4px"
          >
            <ul class="static-list">
              <li v-for="(item, index) in curCondition.judgeList" :key="index">
                <span
                  v-if="index != 0"
                  class="el-icon-paperclip"
                  style="margin-right: 10px"
                ></span>

                <div v-if="index != 0" style="margin-right: 10px; width: 60px">
                  <el-select
                    v-model="item.relation"
                    size="mini"
                    style="width: 100%"
                  >
                    <el-option label="与" value="&&"> </el-option>
                    <el-option label="或" value="||"> </el-option>
                  </el-select>
                </div>

                <el-button
                  v-else
                  style="margin-left: 17px; margin-right: 10px"
                  type="text"
                  size="small"
                  icon="el-icon-plus"
                  @click="handleAddJudge"
                  >新增条件
                </el-button>
                <div style="flex: 1">
                  <el-select
                    v-model="item.exportObjKey"
                    size="mini"
                    placeholder="当前元素"
                    filterable
                    style="width: 58%; margin-right: 1%"
                    @change="
                      getDataOption(item.exportObjKey, index, 'judgeList')
                    "
                  >
                    <el-option
                      v-for="item in getElements"
                      :key="item.id"
                      :label="item.formItemProps.label"
                      :value="item.id"
                    >
                      <div class="d-flex justify-space-between">
                        <span>{{ item.formItemProps.label }} </span>
                        <span> {{ item.field }}</span>
                      </div>
                    </el-option>
                  </el-select>

                  <el-select
                    v-model="item.judge"
                    size="mini"
                    style="width: 40%"
                  >
                    <el-option
                      v-for="item in logicList.filter((e) => {
                        if (data.type != 'date') {
                          return e.value != 'dateDiff';
                        }
                        return true;
                      })"
                      :key="item.value"
                      :label="item.label"
                      :value="item"
                    >
                    </el-option>
                  </el-select>
                </div>
                <div
                  v-if="
                    item.judge.value !== '' &&
                    item.judge.value !== 'empty' &&
                    item.judge.value !== 'noEmpty'
                  "
                  style="margin-left: 10px; width: 135px"
                >
                  <el-select
                    v-if="
                      checkDataSourceType(item.exportObjKey) &&
                      (item.judge.value === '=' ||
                        item.judge.value === '!=' ||
                        item.judge.value === 'contain' ||
                        item.judge.value === 'noContain')
                    "
                    v-model.trim="item.value"
                    size="mini"
                    filterable
                    clearable
                  >
                    <el-option
                      v-for="it in item.valueOptions"
                      :key="it.value"
                      :label="it.text"
                      :value="it.value"
                    ></el-option>
                  </el-select>
                  <el-input
                    v-else
                    v-model.trim="item.value"
                    size="mini"
                    clearable
                    style="width: 100%"
                  ></el-input>
                </div>
                <el-button
                  circle
                  plain
                  type="danger"
                  size="mini"
                  icon="el-icon-minus"
                  style="padding: 4px; margin-left: 5px"
                  @click="handleRemoveJudge(index)"
                ></el-button>
              </li>
            </ul>
          </div>

          <el-table
            class="mb-12px"
            :data="curCondition.targetList"
            border
            size="mini"
          >
            <el-table-column label="动作" prop="action">
              <template slot-scope="scope">

                <el-form-item
                :prop="'targetList[' + scope.$index + '].action'"
                  label=""
                  :rules="[
                    { required: true, message: '请输入动作' },
                  ]"
                >
                  <el-select
                    v-model="scope.row.action"
                    value-key="value"
                    size="small"
                    placeholder="请选择"
                    style="width: 100%"
                    clearable
                    @clear ="clearAction(scope.row, scope.$index)"
                    @change="changeAction(scope.row, scope.$index)"
                  >
                    <el-option
                      v-for="item in actionList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="目标元素" prop="target">
              <template slot-scope="scope">
                <el-form-item
                :prop="'targetList[' + scope.$index + '].target'"
                  label=""
                  :rules="[
                    { required: true, message: '请选择目标元素'},
                  ]"
                >
                <el-select
                  v-model="scope.row.target"
                  size="small"
                  filterable
                  :multiple="isMutiTarget(scope.row.action)"
                  placeholder="请选择目标元素"
                  :disabled="!scope.row.action"
                  style="width: 100%"
                  @change="
                    getDataOption(scope.row.target, scope.$index, 'targetList')
                  "
                >
                  <el-option
                    v-for="item in getElements"
                    :key="item.id"
                    :label="item.formItemProps.label"
                    :disabled="item.id === data.id"
                    :value="item.id"
                  >
                    <div class="d-flex justify-space-between">
                      <span>{{ item.formItemProps.label }} </span>
                      <span> {{ item.field }}</span>
                    </div>
                  </el-option>
                </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="setValue" label="设置值">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.action == 'setValue'"
                  label=""
                >
                  <el-select
                    v-if="checkDataSourceType(scope.row.target)"
                    v-model.trim="scope.row.toValue"
                    size="mini"
                  >
                    <el-option
                      v-for="item in scope.row.valueOptions"
                      :key="item.value"
                      :label="item.text"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                  <el-input
                    v-else
                    v-model="scope.row.toValue"
                    size="small"
                  ></el-input>
              </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="" label="操作" width="60">
              <template slot-scope="scope">
                <el-button
                  circle
                  plain
                  type="danger"
                  size="small"
                  icon="el-icon-minus"
                  style="padding: 4px; margin-left: 5px"
                  @click="handleRemoveTarget(scope.$index)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button
            size="small"
            type="primary"
            class="mb-12px"
            plain
            @click="addTarget"
            >新增</el-button
          >
        </el-form>
        <div style="text-align: center">
          <el-button
            type="primary"
            size="small"
            style="width: 120px"
            @click="dialogSave"
            >完成</el-button
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchData, fetchData2 } from '@/utils/data-origin'
import VueDraggable from 'vuedraggable'
import { nanoid } from 'nanoid'
import { cloneDeep } from 'lodash'

const eventList = [
  {
    label: '值变化',
    value: 'onChange'
  }
  // {
  //   label: '被隐藏',
  //   value: 'beHide'
  // },
  // {
  //   label: '被显示',
  //   value: 'beShow'
  // }
  // {
  //   label: '被禁用',
  //   value: 'beDisabled'
  // },
  // {
  //   label: '被启用',
  //   value: 'beEnabled'
  // }
]

const logicList = [
  {
    label: '等于',
    value: '='
  },
  {
    label: '不等于',
    value: '!='
  },
  {
    label: '大于',
    value: '>'
  },
  {
    label: '大于等于',
    value: '>='
  },
  {
    label: '小于',
    value: '<'
  },
  {
    label: '小于等于',
    value: '<='
  },
  {
    label: '包含',
    value: 'contain'
  },
  {
    label: '不包含',
    value: 'noContain'
  },
  {
    label: '为空',
    value: 'empty'
  },
  {
    label: '不为空',
    value: 'noEmpty'
  }
  // {
  //   label: '日期差（天）',
  //   value: 'dateDiff'
  // }
  // {
  //   label: '正则',
  //   value: 'regExp'
  // }
]

const actionList = [
  {
    label: '去隐藏',
    value: 'toHide'
  },
  {
    label: '去显示',
    value: 'toShow'
  },
  {
    label: '禁用',
    value: 'toDisabled'
  },
  {
    label: '启用',
    value: 'toEnabled'
  },
  {
    label: '设置值',
    value: 'setValue'
  },
  {
    label: '清空值',
    value: 'clearValue'
  },
  {
    label: '设置必填',
    value: 'toRequired'
  },
  {
    label: '设置非必填',
    value: 'toNotRequired'
  },
  {
    label: '计算日期差',
    value: 'calculateDiffDay'
  },
  {
    label: '数值（加法）',
    value: 'numberAdd'
  },
  {
    label: '数值（减法）',
    value: 'numberReduce'
  }
  //   {
  //     label: '去更新字典',
  //     value: 'updateDict'
  //   },
  //   {
  //     label: '去更新填充值数据源',
  //     value: 'updateFillSource'
  //   },
  //   {
  //     label: '去清空字典',
  //     value: 'cleanDict'
  //   },
  //   {
  //     label: '去设置字典项启用/禁用',
  //     value: 'toSetDicIsUsed'
  //   }
]

export default {
  name: 'LinkageProps',
  components: { VueDraggable },
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    formConfig: {
      type: Object,
      default: () => {}
    }
  },

  data () {
    return {
      list: [],
      diagVisible: false,
      curCondition: {
        event: 'onChange',
        targetList: []
      },

      eventList,
      actionList,
      logicList,
      conditions: [],
      dragOptions: {
        animation: 200,
        group: '2323',
        ghostClass: 'drag-ghost'
      },
      finalData: [],
      notMutiTargetActions: [
        'setValue',
        'calculateDiffDay',
        'numberAdd',
        'numberReduce'
      ]
    }
  },
  computed: {
    getElements () {
      return this.formConfig.items
    }
  },
  watch: {
    data: {
      immediate: true,
      handler (val) {
        this.conditions = val.linkageProps || []
      }
    },
    conditions: {
      deep: true,
      handler (val) {
        this.$emit('updateLinkageProps', val)
      }
    }
  },

  created () {},

  methods: {
    isMutiTarget (val) {
      return !this.notMutiTargetActions.includes(val)
    },
    getActionText (val) {
      return actionList.find((v) => v.value === val)?.label || ''
    },
    getTargetLabel (val) {
      return (
        this.getElements.find((v) => v.id === val)?.formItemProps.label || ''
      )
    },
    // 新增条件
    addCondition () {
      this.diagVisible = true
      this.curCondition = {
        event: 'onChange',
        judgeList: [
          {
            exportObjKey: this.data.id,
            relation: '',
            value: '',
            judge: ''
          }
        ],
        rowCondition: [
          {
            relation: null,
            judge: logicList[0],
            value: ''
          }
        ],
        targetList: [
          {
            action: '',
            target: '',
            toValue: ''
          }
        ]
      }
      this.getDataOption(this.data.id, 0, 'judgeList')
    },

    // 编辑条件
    handleEditCondition (row) {
      this.curCondition = cloneDeep(row)
      this.curCondition.judgeList.forEach((v, index) => {
        this.getDataOption(v.exportObjKey, index, 'judgeList', 'default')
      })
      this.curCondition.targetList.forEach((v, index) => {
        this.getDataOption(v.target, index, 'targetList', 'default')
      })
      this.diagVisible = true
    },
    // 新增逻辑
    handleAddJudge () {
      this.curCondition.judgeList.push({
        exportObjKey: this.data.id,
        relation: '&&',
        value: '',
        judge: ''
      })
      this.getDataOption(
        this.data.id,
        this.curCondition.judgeList.length - 1,
        'judgeList'
      )
    },
    // 删除逻辑
    handleRemoveJudge (index) {
      this.curCondition.judgeList.splice(index, 1)
    },
    // 新增目标元素
    addTarget () {
      this.curCondition.targetList.push({
        action: '',
        target: '',
        toValue: ''
      })
    },
    // 删除 目标元素
    handleRemoveTarget (index) {
      this.curCondition.targetList.splice(index, 1)
    },
    // 更新目标动作
    changeAction (row, index) {
      if (!this.validActionForm(row)) return false

      row.target = row.action === 'setValue' ? '' : []
      row.toValue = ''
      this.$nextTick(() => {
        this.$set(this.curCondition, index, row)
      })
    },

    validActionForm (row) {
      if (row.action === 'calculateDiffDay') {
        if (
          this.curCondition.judgeList.length !== 2 ||
          (this.curCondition.judgeList.length === 2 &&
            (this.getElementByID(this.curCondition.judgeList[0].exportObjKey)
              .type !== 'datePicker' ||
              this.getElementByID(this.curCondition.judgeList[1].exportObjKey)
                .type !== 'datePicker'))
        ) {
          this.$message.warning('计算日期差必须为两个日期时间元素')
          row.action = ''
          return false
        }
      } else if (row.action === 'numberAdd') {
        this.curCondition.judgeList.forEach((v) => {
          if (this.getElementByID(v.exportObjKey).type !== 'inputNumber') {
            this.$message.warning('数值计算必须全部为数字框元素')
            row.action = ''
            return false
          }
        })
      } else if (row.action === 'numberReduce') {
        if (
          this.curCondition.judgeList.length !== 2 ||
          (this.curCondition.judgeList.length === 2 &&
            (this.getElementByID(this.curCondition.judgeList[0].exportObjKey)
              .type !== 'inputNumber' ||
              this.getElementByID(this.curCondition.judgeList[1].exportObjKey)
                .type !== 'inputNumber'))
        ) {
          this.$message.warning('数值减法计算必须为两个数字框元素')
          row.action = ''
          return false
        }
      }
      return true
    },
    dialogSave () {
      const { targetList } = this.curCondition
      for (let i = 0; i < targetList.length; i++) {
        console.log(targetList[i])
        if (!this.validActionForm(targetList[i])) {
          return false
        }
      }
      this.$refs.conditionForm.validate((valid) => {
        if (valid) {
          this.diagVisible = false
          const newCondition = {
            ...this.curCondition,
            eventLabel: this.eventList.find((item) => {
              return item.value === this.curCondition.event
            }).label
          }
          newCondition.watchEventIds = []
          newCondition.judgeList.forEach((v) => {
            v.valueOptions = []
          })
          newCondition.targetList.forEach((v) => {
            v.valueOptions = []
          })
          if (this.curCondition.id) {
            this.conditions = this.conditions.map((item) => {
              if (item.id === newCondition.id) {
                item = newCondition
              }
              return item
            })
          } else {
            this.conditions.push({
              id: nanoid(6),
              ...newCondition
            })
          }
        }
      })
    },
    getJudgeListText (type, judgeList, rowCondition = {}) {
      let result = '('
      judgeList.forEach((item, index) => {
        result =
          result +
          (index === 0 ? '' : ',') +
          (item.relation || '') +
          ' "' +
          (this.getTargetLabel(item.exportObjKey) || '') +
          '"' +
          ((
            this.logicList.find((i) => {
              return item.judge.value === i.value
            }) || {}
          ).label || '') +
          ' ' +
          (item.judge.value !== 'empty' && item.judge.value !== 'noEmpty'
            ? item.value
            : '') +
          ' '
      })
      result = result + ')'

      return result
    },

    handleRemoveCondition (id) {
      this.$confirm('删除这条联动条件？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.conditions = this.conditions.filter((item) => {
            return item.id !== id
          })
        })
        .catch(() => {})
    },
    getElementByID (key) {
      const keyFormData = this.formConfig.items.find((item) => item.id === key)
      if (!keyFormData) return false
      return keyFormData
    },
    checkDataSourceType (key) {
      const keyFormData = this.getElementByID(key)
      const types = ['select', 'radio', 'checkbox']
      return !!types.includes(keyFormData.type)
    },

    async getDataOption (key, index, type, isDefault) {
      console.log('getDataOption', key, index, type, isDefault)
      if (!isDefault) {
        if (type === 'judgeList') {
          this.curCondition.judgeList[index].valueOptions = []
          this.curCondition.judgeList[index].value = ''
        } else {
          this.curCondition.targetList[index].valueOptions = []
          this.curCondition.targetList[index].toValue = ''
        }
      }
      if (Array.isArray(key)) {
        return false
      }
      if (!this.checkDataSourceType(key)) return false
      let options = []

      const keyFormData = this.formConfig.items.find((item) => item.id === key)
      if (!keyFormData) return []
      const dataOrigin = keyFormData.dataOrigin
      if (dataOrigin === 'api') {
        options = await fetchData(keyFormData)
      } else if (dataOrigin === 'dataElement') {
        options = await fetchData2(keyFormData)
      } else {
        options = JSON.parse(keyFormData.staticData)
      }

      if (type === 'judgeList') {
        const obj = this.curCondition.judgeList[index]
        obj.valueOptions = options
        this.$set(this.curCondition.judgeList, index, obj)
      } else {
        const obj = this.curCondition.targetList[index]
        obj.valueOptions = options
        this.$set(this.curCondition.targetList, index, obj)
        this.curCondition.targetList[index].valueOptions = options
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.form-card-editor ul {
  margin: 0;
}

.static-list > li {
  display: flex;

  align-items: center;
  padding: 0 14px;

  .el-button {
    height: 24px;
  }
}

.d-flex {
  display: flex;
}
.justify-space-between {
  justify-content: space-between;
  span:first-child {
    padding-right: 10px;
  }
}

.condition-list {
  padding: 0;
  margin: 0;
  li {
    list-style: none;
    display: flex;
    .condition-content {
      padding-right: 5px;
      flex: 1;
    }
    .btns {
      width: 70px;
    }
  }
}
.mb-12px {
  margin-bottom: 12px;
}
</style>
