<template>
  <div class="item-table" :style="{ maxHeight: maxHeight }">
    <!-- 设计态无列配置时的提示 -->
    <div v-if="isDesignMode && columns.length === 0" class="empty-columns-tip">
      <el-empty description="请先在右侧配置表格列">
        <el-button type="primary" size="mini" @click="addDefaultColumn">
          添加默认列
        </el-button>
      </el-empty>
    </div>

    <!-- 有列配置时显示表格 -->
    <el-table
      v-else
      :data="tableData"
      :border="tableConfig.border !== false"
      :size="tableConfig.size || 'mini'"
      :cell-style="{ padding: '4px 8px' }"
      v-loading="loading"
    >
      <!-- 序号列 -->
      <el-table-column
        v-if="tableConfig.showSeq"
        type="index"
        :label="tableConfig.seqLabel || '序号'"
        :min-width="seqWidth"
        :index="indexMethod"
        align="center"
      />

      <!-- 动态列 -->
      <el-table-column
        v-for="(col, index) in columns"
        :key="index"
        :prop="col.prop"
        :label="col.label"
        :min-width="col.width || col.minWidth || 100"
        align="center"
      >
        <template slot-scope="{ row, $index }">
          <!-- 文本输入 -->
          <div v-if="col.type === 'input'" :class="{ 'cell-error': hasCellError($index, col.prop) }">
            <el-input
              v-model="row[col.prop]"
              :disabled="isDisabled(col)"
              :placeholder="col.placeholder || '请输入'"
              size="mini"
              @input="onCellChange($index, col.prop, row[col.prop])"
            />
          </div>

          <!-- 数字输入 -->
          <div v-else-if="col.type === 'inputNumber'" :class="{ 'cell-error': hasCellError($index, col.prop) }">
            <el-input-number
              v-model="row[col.prop]"
              :disabled="isDisabled(col)"
              :placeholder="col.placeholder || '请输入'"
              size="mini"
              :controls="col.controls !== false"
              :min="col.min"
              :max="col.max"
              :precision="col.precision"
              style="width: 100%"
              @change="onCellChange($index, col.prop, row[col.prop])"
            />
          </div>

          <!-- 日期选择 -->
          <div v-else-if="col.type === 'date'" :class="{ 'cell-error': hasCellError($index, col.prop) }">
            <el-date-picker
              v-model="row[col.prop]"
              :disabled="isDisabled(col)"
              :type="col.dateType || 'date'"
              :placeholder="col.placeholder || '请选择日期'"
              :format="col.format || 'yyyy-MM-dd'"
              :value-format="col.valueFormat || 'yyyy-MM-dd'"
              size="mini"
              style="width: 100%"
              @change="onCellChange($index, col.prop, row[col.prop])"
            />
          </div>

          <!-- 下拉选择 -->
          <div v-else-if="col.type === 'select'" :class="{ 'cell-error': hasCellError($index, col.prop) }">
            <el-select
              v-model="row[col.prop]"
              :disabled="isDisabled(col)"
              :placeholder="col.placeholder || '请选择'"
              :multiple="col.multiple"
              :clearable="col.clearable !== false"
              size="mini"
              style="width: 100%"
              @change="onCellChange($index, col.prop, row[col.prop])"
            >
              <el-option
                v-for="opt in getColOptions(col)"
                :key="opt.value"
                :label="opt.text || opt.label"
                :value="opt.value"
              />
            </el-select>
          </div>

          <!-- 单选 -->
          <div v-else-if="col.type === 'radio'" :class="{ 'cell-error': hasCellError($index, col.prop) }">
            <el-radio-group
              v-model="row[col.prop]"
              :disabled="isDisabled(col)"
              size="mini"
              @change="onCellChange($index, col.prop, row[col.prop])"
            >
              <el-radio
                v-for="opt in getColOptions(col)"
                :key="opt.value"
                :label="opt.value"
              >
                {{ opt.text || opt.label }}
              </el-radio>
            </el-radio-group>
          </div>

          <!-- 复选 -->
          <div v-else-if="col.type === 'checkbox'" :class="{ 'cell-error': hasCellError($index, col.prop) }">
            <el-checkbox-group
              v-model="row[col.prop]"
              :disabled="isDisabled(col)"
              size="mini"
              @change="onCellChange($index, col.prop, row[col.prop])"
            >
              <el-checkbox
                v-for="opt in getColOptions(col)"
                :key="opt.value"
                :label="opt.value"
              >
                {{ opt.text || opt.label }}
              </el-checkbox>
            </el-checkbox-group>
          </div>

          <!-- 文本展示 -->
          <span v-else-if="col.type === 'text'" class="text-display">
            {{ row[col.prop] || '' }}
          </span>

          <!-- 默认文本输入 -->
          <div v-else :class="{ 'cell-error': hasCellError($index, col.prop) }">
            <el-input
              v-model="row[col.prop]"
              :disabled="isDisabled(col)"
              size="mini"
              @input="onCellChange($index, col.prop, row[col.prop])"
            />
          </div>
        </template>
      </el-table-column>

      <!-- 操作列 -->
      <el-table-column
        v-if="showOperation"
        label="操作"
        :min-width="operationWidth"
        align="center"
      >
        <template slot-scope="{ $index }">
          <el-button
            circle
            plain
            type="primary"
            size="mini"
            icon="el-icon-plus"
            :disabled="isDisabled()"
            style="padding: 4px"
            @click="addRow($index + 1)"
          />
          <el-button
            circle
            plain
            type="danger"
            size="mini"
            icon="el-icon-minus"
            :disabled="isDisabled() || tableData.length <= 1"
            style="padding: 4px; margin-left: 5px"
            @click="deleteRow($index)"
          />
        </template>
      </el-table-column>
    </el-table>

    <!-- 底部添加按钮 -->
    <div v-if="showBottomAdd " class="table-footer">
      <el-button
        type="text"
        size="mini"
        :disabled="isDisabled()"
        @click="addRow(tableData.length)"
      >
        + 添加一行
      </el-button>
    </div>
  </div>
</template>

<script>
import { debounce, cloneDeep } from 'lodash'
import mixin from '../mixins'
import { parseJsValue } from '@/utils/parse-code'

export default {
  name: 'ItemTable',
  mixins: [mixin],
  props: {
    // 表格配置JSON字符串
    formItemEntityProps: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      loading: false,
      tableData: [],
      colOptionsCache: {}, // 列选项缓存
      validationErrors: [] // 校验错误列表
    }
  },
  computed: {
    // 解析表格配置
    tableConfig () {
      let config = {}
      try {
        config = parseJsValue(this.formItemEntityProps)?.value || {}
      } catch (e) {
        console.error('解析表格配置失败:', e)
      }
      return {
        showSeq: config.showSeq !== false,
        seqLabel: config.seqLabel || '序号',
        columns: config.columns || [],
        border: config.border !== false,
        size: config.size || 'mini',
        maxHeight: config.maxHeight || '500px',
        showOperation: config.showOperation !== false,
        showBottomAdd: config.showBottomAdd !== false,
        seqWidth: config.seqWidth || 60,
        operationWidth: config.operationWidth || 90,
        maxRows: config.maxRows || 50
      }
    },

    // 列配置
    columns () {
      return this.tableConfig.columns || []
    },

    // 最大高度
    maxHeight () {
      return this.tableConfig.maxHeight || '500px'
    },

    // 是否显示操作列
    showOperation () {
      return this.tableConfig.showOperation !== false
    },

    // 是否显示底部添加按钮
    showBottomAdd () {
      return this.tableConfig.showBottomAdd !== false
    },

    // 序号列宽度
    seqWidth () {
      return this.tableConfig.seqWidth || 60
    },

    // 操作列宽度
    operationWidth () {
      return this.tableConfig.operationWidth || 90
    },

    // 是否设计态
    isDesignMode () {
      return this.providedProps?.mode === 'design'
    }
  },
  watch: {
    value: {
      handler (val) {
        if (Array.isArray(val)) {
          const data = cloneDeep(val)
          // 确保 checkbox 列的值为数组，文本展示列有默认值
          const cols = this.tableConfig.columns || []
          cols.forEach(col => {
            if (col.type === 'checkbox') {
              data.forEach(row => {
                if (!Array.isArray(row[col.prop])) {
                  row[col.prop] = []
                }
              })
            }
            if (col.type === 'text') {
              data.forEach(row => {
                // 文本展示列如果值为空，使用 placeholder 作为默认值
                if (row[col.prop] === undefined || row[col.prop] === null || row[col.prop] === '') {
                  row[col.prop] = col.placeholder || ''
                }
              })
            }
          })

          // 检查是否为空数据（空数组或单个空对象）
          const isEmptyData = data.length === 0 ||
            (data.length === 1 && this.isEmptyRowWithCols(data[0], cols))

          if (isEmptyData) {
            // 数据为空，显示一行空数据供用户填写
            const emptyRow = this.genEmptyRow()
            this.tableData = [emptyRow]
            // 只有当原数据是 [{}]（单个空对象）时才需要同步更新 formData 为空数组
            // 如果原数据已经是 []（空数组），则不需要 emit，避免无限循环
            if (val.length === 1 && !this._isEmptyDataEmitting) {
              this._isEmptyDataEmitting = true
              this.$nextTick(() => {
                this.$emit('input', [])
                this.updateField(this.field, [])
                this._isEmptyDataEmitting = false
              })
            }
          } else {
            this.tableData = data
          }
        } else {
          // 非数组类型，初始化为有一行空数据的数组
          const emptyRow = this.genEmptyRow()
          this.tableData = [emptyRow]
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    // 序号生成方法
    indexMethod (index) {
      return index + 1
    },

    // 设计态添加默认列
    addDefaultColumn () {
      if (!this.isDesignMode) return

      const defaultColumn = {
        prop: 'col1',
        label: '列1',
        type: 'input',
        width: 100,
        required: false,
        placeholder: '',
        dataOrigin: 'static',
        staticData: '[]',
        defaultValue: ''
      }

      // 获取当前配置
      let config = {}
      try {
        config = parseJsValue(this.formItemEntityProps)?.value || {}
      } catch (e) {
        config = {}
      }

      // 添加新列
      const columns = config.columns || []
      columns.push(defaultColumn)
      config.columns = columns

      // 更新配置
      const newEntityProps = JSON.stringify(config)
      if (this.updateFormItemEntityProps) {
        this.updateFormItemEntityProps(this.field, newEntityProps)
      }
    },

    // 判断是否禁用
    isDisabled (col) {
      const { mode } = this.providedProps
      // 设计态和浏览态都禁用表格内操作
      if (mode === 'view' || mode === 'design') {
        return true
      }
      return this.parsedFormItemEntityProps?.disabled || false
    },

    // 获取列选项数据
    getColOptions (col) {
      // 静态数据
      if (col.dataOrigin === 'static' || !col.dataOrigin) {
        if (col.staticData) {
          try {
            const data = parseJsValue(col.staticData)?.value || []
            return Array.isArray(data) ? data : []
          } catch (e) {
            return []
          }
        }
        return []
      }

      // 使用缓存的选项数据
      const cacheKey = col.prop
      if (this.colOptionsCache[cacheKey]) {
        return this.colOptionsCache[cacheKey]
      }

      return []
    },

    // 单元格值变更
    onCellChange: debounce(function (rowIndex, field, value) {
      // 清除该单元格的错误状态
      this.validationErrors = this.validationErrors.filter(err =>
        err.rowIndex !== rowIndex + 1 || err.field !== field
      )
      this.emitChange()
    }, 200),

    // 添加行
    addRow (index) {
      if (this.tableData.length >= this.tableConfig.maxRows) {
        this.$message.warning(`最多支持 ${this.tableConfig.maxRows} 行数据`)
        return
      }

      const newRow = this.genEmptyRow()
      if (typeof index === 'number' && index >= 0) {
        this.tableData.splice(index, 0, newRow)
      } else {
        this.tableData.push(newRow)
      }
      this.emitChange()
    },

    // 删除行
    deleteRow (index) {
      if (this.tableData.length <= 1) {
        this.$message.warning('至少保留一行数据')
        return
      }
      this.tableData.splice(index, 1)
      this.emitChange()
    },

    // 生成空行数据
    genEmptyRow () {
      const row = {}
      this.columns.forEach(col => {
        // 根据类型设置默认值
        switch (col.type) {
          case 'checkbox':
            row[col.prop] = []
            break
          case 'inputNumber':
            row[col.prop] = col.defaultValue || undefined
            break
          case 'text':
            // 文本展示类型，placeholder 即为该列的值
            row[col.prop] = col.placeholder || ''
            break
          default:
            row[col.prop] = col.defaultValue || ''
        }
      })
      return row
    },

    // 触发数据变更事件
    emitChange () {
      const data = cloneDeep(this.tableData)
      // 如果只有一行且该行所有字段都为空，则提交空数组
      if (data.length === 1 && this.isEmptyRow(data[0])) {
        this.$emit('input', [])
        this.updateField(this.field, [])
      } else {
        this.$emit('input', data)
        this.updateField(this.field, data)
      }
    },

    // 判断一行数据是否为空（所有列都无有效值）
    isEmptyRow (row) {
      return this.columns.every(col => {
        const value = row[col.prop]
        // 文本展示列的默认值（placeholder）不算有效数据
        if (col.type === 'text' && value === col.placeholder) {
          return true
        }
        return this.isEmptyValue(value, col.type)
      })
    },

    // 校验表格必填列
    validate () {
      const errors = []
      const requiredColumns = this.columns.filter(col => col.required)

      if (requiredColumns.length === 0) {
        this.validationErrors = []
        return { valid: true, errors: [] }
      }

      // 对所有行进行必填校验
      this.tableData.forEach((row, rowIndex) => {
        requiredColumns.forEach(col => {
          const value = row[col.prop]
          const isEmpty = this.isEmptyValue(value, col.type)
          if (isEmpty) {
            errors.push({
              rowIndex: rowIndex + 1,
              columnLabel: col.label,
              field: col.prop,
              message: `第${rowIndex + 1}行 "${col.label}" 不能为空`
            })
          }
        })
      })

      // 存储校验错误，用于显示红色边框
      this.validationErrors = errors

      return {
        valid: errors.length === 0,
        errors
      }
    },

    // 判断值是否为空
    isEmptyValue (value, type) {
      if (type === 'checkbox') {
        return !Array.isArray(value) || value.length === 0
      }
      if (type === 'inputNumber') {
        return value === undefined || value === null || value === ''
      }
      return value === undefined || value === null || value === ''
    },

    // 根据列配置判断一行是否为空
    isEmptyRowWithCols (row, cols) {
      return cols.every(col => {
        const value = row[col.prop]
        // 文本展示列的默认值（placeholder）不算有效数据
        if (col.type === 'text' && value === col.placeholder) {
          return true
        }
        return this.isEmptyValue(value, col.type)
      })
    },

    // 检查单元格是否有校验错误
    hasCellError (rowIndex, field) {
      return this.validationErrors.some(err =>
        err.rowIndex === rowIndex + 1 && err.field === field
      )
    },

    // 清除校验错误状态
    clearValidation () {
      this.validationErrors = []
    },

    // 滚动到表格位置（用于校验失败定位）
    scrollIntoView () {
      this.$el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }
}
</script>

<style lang="scss" scoped>
.item-table {
  width: 100%;

  .el-table {
    font-size: 12px;
  }

  // 表头使用系统皮肤色
  ::v-deep .el-table__header-wrapper .el-table__header th.el-table__cell {
    background-color: var(--COLOR-BTN-TABLE-HEADER-BG, #EAEEFE);
  }

  // 校验错误样式 - 红色边框提示
  .cell-error {
    ::v-deep .el-input__inner {
      border-color: #f56c6c !important;
    }
    ::v-deep .el-input-number__wrapper {
      border-color: #f56c6c !important;
    }
    ::v-deep .el-date-editor .el-input__inner {
      border-color: #f56c6c !important;
    }
    ::v-deep .el-select .el-input__inner {
      border-color: #f56c6c !important;
    }
    ::v-deep .el-radio__input .el-radio__inner {
      border-color: #f56c6c !important;
    }
    ::v-deep .el-checkbox__input .el-checkbox__inner {
      border-color: #f56c6c !important;
    }
  }

  .table-footer {
    padding: 8px 0;
    text-align: left;
    border-top: 1px solid #ebeef5;
  }

  .empty-columns-tip {
    padding: 20px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    background: #fafafa;
    min-height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
