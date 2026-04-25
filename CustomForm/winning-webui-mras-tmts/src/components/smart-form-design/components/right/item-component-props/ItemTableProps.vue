<template>
  <el-form :model="propModel" v-bind="formProps" label-width="80px">
    <!-- 基础配置 -->
    <el-divider content-position="left">基础配置</el-divider>

    <el-form-item label="显示序号">
      <el-switch v-model="propModel.showSeq" />
    </el-form-item>

    <el-form-item v-if="propModel.showSeq" label="序号标题">
      <el-input v-model="propModel.seqLabel" placeholder="序号" />
    </el-form-item>

    <el-form-item label="最大行数">
      <el-input-number
        v-model="propModel.maxRows"
        :min="1"
        :max="100"
        style="width: 100%"
      />
    </el-form-item>

    <el-form-item label="显示边框">
      <el-switch v-model="propModel.border" />
    </el-form-item>

    <!-- 列配置 -->
    <el-divider content-position="left">列配置</el-divider>

    <div class="column-list">
      <div
        v-for="(col, index) in propModel.columns"
        :key="index"
        class="column-item"
      >
        <div class="column-header">
          <span class="column-index">{{ index + 1 }}</span>
          <span class="column-label">{{ col.label }}</span>
          <div class="column-actions">
            <el-button
              type="text"
              size="mini"
              icon="el-icon-arrow-up"
              :disabled="index === 0"
              @click="moveColumn(index, -1)"
            />
            <el-button
              type="text"
              size="mini"
              icon="el-icon-arrow-down"
              :disabled="index === propModel.columns.length - 1"
              @click="moveColumn(index, 1)"
            />
            <el-button
              type="text"
              size="mini"
              icon="el-icon-edit"
              @click="editColumn(index)"
            />
            <el-button
              type="text"
              size="mini"
              icon="el-icon-delete"
              style="color: #f56c6c"
              @click="deleteColumn(index)"
            />
          </div>
        </div>
        <div class="column-info">
          <span>字段: {{ col.prop }}</span>
          <span>类型: {{ getColTypeText(col.type) }}</span>
          <span v-if="col.width">宽度: {{ col.width }}px</span>
          <span v-if="col.required" class="required-tag">必填</span>
        </div>
      </div>

      <el-button
        type="primary"
        size="mini"
        icon="el-icon-plus"
        style="width: 100%; margin: 10px 0"
        @click="addColumn"
      >
        添加列
      </el-button>
    </div>

    <!-- 列编辑弹窗 -->
    <el-dialog
      :visible.sync="columnDialogVisible"
      :title="editingIndex >= 0 ? '编辑列' : '添加列'"
      width="500px"
      append-to-body
    >
      <el-form :model="editingColumn" label-width="80px" size="mini">
        <el-form-item label="列标题" required>
          <el-input v-model="editingColumn.label" placeholder="请输入列标题" />
        </el-form-item>

        <el-form-item label="字段名" required>
          <el-input v-model="editingColumn.prop" placeholder="请输入字段名，如: name" />
          <span class="form-tip">用于数据绑定，建议使用英文字母</span>
        </el-form-item>

        <el-form-item label="列类型" required>
          <el-select v-model="editingColumn.type" style="width: 100%">
            <el-option
              v-for="item in columnTypes"
              :key="item.value"
              :label="item.text"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="列宽度">
          <el-input-number
            v-model="editingColumn.width"
            :min="50"
            :max="500"
            :step="10"
            style="width: 100%"
          />
          <span class="form-tip">单位: px，留空则自适应</span>
        </el-form-item>

        <el-form-item label="是否必填">
          <el-switch v-model="editingColumn.required" />
        </el-form-item>

        <el-form-item :label="editingColumn.type === 'text' ? '默认值' : '占位提示'">
          <el-input
            v-model="editingColumn.placeholder"
            :placeholder="editingColumn.type === 'text' ? '请输入默认展示文本' : '请输入提示文字'"
          />
          <span v-if="editingColumn.type === 'text'" class="form-tip">文本展示类型，此值将作为该列的数据保存</span>
        </el-form-item>

        <!-- 选项类型配置 -->
        <template v-if="['select', 'radio', 'checkbox'].includes(editingColumn.type)">
          <el-divider content-position="left">选项配置</el-divider>

          <el-form-item label="数据来源">
            <el-select v-model="editingColumn.dataOrigin" style="width: 100%">
              <el-option label="静态数据" value="static" />
            </el-select>
          </el-form-item>

          <el-form-item label="选项数据">
            <el-input
              v-model="editingColumn.staticData"
              type="textarea"
              :rows="4"
              placeholder="请输入JSON数组格式数据，如: [{text: '选项1', value: '1'}]"
            />
            <span class="form-tip">格式: [{text: '显示文本', value: '值'}]</span>
          </el-form-item>
        </template>

        <!-- 数字类型配置 -->
        <template v-if="editingColumn.type === 'inputNumber'">
          <el-divider content-position="left">数字配置</el-divider>

          <el-form-item label="最小值">
            <el-input-number v-model="editingColumn.min" style="width: 100%" />
          </el-form-item>

          <el-form-item label="最大值">
            <el-input-number v-model="editingColumn.max" style="width: 100%" />
          </el-form-item>

          <el-form-item label="精度">
            <el-input-number
              v-model="editingColumn.precision"
              :min="0"
              :max="10"
              style="width: 100%"
            />
          </el-form-item>
        </template>

        <!-- 日期类型配置 -->
        <template v-if="editingColumn.type === 'date'">
          <el-divider content-position="left">日期配置</el-divider>

          <el-form-item label="显示格式">
            <el-select v-model="editingColumn.format" style="width: 100%" @change="dateFormatChange">
              <el-option
                v-for="item in dateFormatOptions"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="值格式">
            <el-select v-model="editingColumn.valueFormat" style="width: 100%">
              <el-option
                v-for="item in dateValueFormatOptions"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </template>
      </el-form>

      <div slot="footer">
        <el-button @click="columnDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveColumn">确定</el-button>
      </div>
    </el-dialog>
  </el-form>
</template>

<script>
import { parseJsValue } from '@/utils/parse-code'
import { DATE_FORMAT_OPTIONS, DATE_VALUE_FORMAT_OPTIONS, TABLE_COLUMN_TYPES } from '@/components/smart-form/consts/form-props'

export default {
  name: 'ItemTableProps',
  props: {
    itemEntityProps: {
      type: String,
      default: ''
    },
    formProps: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    const defaultProp = {
      showSeq: true,
      seqLabel: '序号',
      maxRows: 50,
      border: true,
      showOperation: true,
      operationWidth: 90,
      showBottomAdd: true,
      columns: []
    }

    return {
      defaultProp,
      propModel: {},
      columnDialogVisible: false,
      editingIndex: -1,
      editingColumn: this.genEmptyColumn(),
      columnTypes: TABLE_COLUMN_TYPES,
      dateFormatOptions: DATE_FORMAT_OPTIONS,
      dateValueFormatOptions: DATE_VALUE_FORMAT_OPTIONS
    }
  },
  watch: {
    itemEntityProps: {
      handler (val) {
        this.propModel = this.parseProps(val)
      },
      immediate: true
    },
    propModel: {
      deep: true,
      handler () {
        this.updateProps()
      }
    }
  },
  mounted () {
    this.propModel = this.parseProps(this.itemEntityProps)
  },
  methods: {
    parseProps (propStr) {
      let data = {}
      try {
        data = parseJsValue(propStr)?.value || {}
        data = { ...this.defaultProp, ...data }
        // 确保 columns 是数组
        if (!Array.isArray(data.columns)) {
          data.columns = []
        }
      } catch (e) {
        data = { ...this.defaultProp }
      }
      return data
    },

    updateProps () {
      const propsStr = JSON.stringify(this.propModel)
      this.$emit('update:itemEntityProps', propsStr)
    },

    // 生成空列配置
    genEmptyColumn () {
      return {
        prop: '',
        label: '',
        type: 'input',
        width: 100,
        required: false,
        placeholder: '',
        dataOrigin: 'static',
        staticData: '[]',
        defaultValue: ''
      }
    },

    // 获取列类型文本
    getColTypeText (type) {
      const item = this.columnTypes.find(t => t.value === type)
      return item ? item.text : type
    },

    // 添加列
    addColumn () {
      this.editingIndex = -1
      this.editingColumn = this.genEmptyColumn()
      this.columnDialogVisible = true
    },

    // 编辑列
    editColumn (index) {
      this.editingIndex = index
      this.editingColumn = { ...this.propModel.columns[index] }
      this.columnDialogVisible = true
    },

    // 保存列
    saveColumn () {
      if (!this.editingColumn.label) {
        this.$message.warning('请输入列标题')
        return
      }
      if (!this.editingColumn.prop) {
        this.$message.warning('请输入字段名')
        return
      }
      // 检查字段名是否重复
      const existingColumns = this.propModel.columns.filter((col, idx) =>
        idx !== this.editingIndex && col.prop === this.editingColumn.prop
      )
      if (existingColumns.length > 0) {
        this.$message.warning('字段名已存在，请使用不同的字段名')
        return
      }

      const column = { ...this.editingColumn }

      if (this.editingIndex >= 0) {
        // 编辑模式
        this.propModel.columns.splice(this.editingIndex, 1, column)
      } else {
        // 新增模式
        this.propModel.columns.push(column)
      }

      this.columnDialogVisible = false
    },

    // 删除列
    deleteColumn (index) {
      this.$confirm('确定删除该列吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.propModel.columns.splice(index, 1)
      }).catch(() => {})
    },

    // 移动列
    moveColumn (index, direction) {
      const newIndex = index + direction
      if (newIndex < 0 || newIndex >= this.propModel.columns.length) return

      const columns = this.propModel.columns
      const temp = columns[index]
      columns[index] = columns[newIndex]
      columns[newIndex] = temp

      // 强制触发更新
      this.propModel.columns = [...columns]
    },

    // 日期格式变更时自动设置 dateType 和 valueFormat
    dateFormatChange (val) {
      const dateType = this.dateFormatOptions.find(item => val === item.value)
      this.editingColumn.dateType = dateType.type
      if (dateType.type === 'datetime') {
        this.editingColumn.valueFormat = 'yyyy-MM-dd HH:mm:ss'
      } else if (dateType.type === 'month') {
        this.editingColumn.valueFormat = 'yyyy-MM'
      } else if (dateType.type === 'year') {
        this.editingColumn.valueFormat = 'yyyy'
      } else {
        this.editingColumn.valueFormat = 'yyyy-MM-dd'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.column-list {
  .column-item {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 8px 12px;
    margin-bottom: 8px;
    background: #fafafa;

    .column-header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .column-index {
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        background: c;
        color: #fff;
        border-radius: 4px;
        font-size: 12px;
      }

      .column-label {
        flex: 1;
        margin-left: 8px;
        font-weight: 500;
      }

      .column-actions {
        .el-button {
          padding: 0 4px;
        }
      }
    }

    .column-info {
      margin-top: 4px;
      font-size: 12px;
      color: #909399;

      span {
        margin-right: 12px;
      }

      .required-tag {
        color: #f56c6c;
        font-weight: 500;
      }
    }
  }
}

.form-tip {
  font-size: 12px;
  color: #909399;
  margin-left: 4px;
}
</style>
