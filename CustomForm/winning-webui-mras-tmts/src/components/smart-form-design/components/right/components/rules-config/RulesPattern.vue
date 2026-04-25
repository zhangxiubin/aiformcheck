<template>
  <el-form :model="formData" label-width="70px" size="small">
    <el-form-item label="正则校验">
      <el-switch v-model="formData.isPattern" @change="onChange" />
    </el-form-item>
    <template v-if="formData.isPattern">
    <el-form-item label="正则式">
      <el-input v-model="formData.pattern" @blur="onChange" clearable />
      <el-link  @click="dialogVisible= true">常用正则</el-link>
    </el-form-item>
    <el-form-item label="提示信息">
      <el-input v-model="formData.message"
        :disabled="!formData.pattern"
        @blur="onInput"
      />
    </el-form-item>
  </template>
  <el-dialog
  title="常用正则"
  :visible.sync="dialogVisible"
  width="800px"
>
  <el-table :data="ruleData" border   size="small">
    <el-table-column width="150" property="label" label="名称">
      <template #default="{ row }">
       {{ row.label }}
       <el-tooltip v-if="row.tips " class="item" effect="dark" :content="row.tips" placement="top-start">
      <i class="el-icon-warning"></i>
    </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column property="value" label="正则表达式"></el-table-column>
    <el-table-column width="110" property="value" label="操作">
      <template #default="{ row }">
        <el-button @click="quote(row)" size="mini">一键引用</el-button>
      </template>
    </el-table-column>
  </el-table>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
</el-dialog>
  </el-form>
</template>

<script>
import { cloneDeep, debounce } from 'lodash'
import { PATTERN_LIST } from './pattern'

export default {
  name: 'RulesPattern',

  data () {
    return {
      formData: {
        isPattern: false,
        pattern: '',
        message: '手机号校验不通过'
        // 'input', 'inputNumber' 为 blur
        // 'radio', 'checkbox', 'select', 'switch', 'timePicker', 'datePicker' 为 change
        // trigger: 'blur'
      },
      dialogVisible: false,
      ruleData: PATTERN_LIST
    }
  },

  created () {
    this.__unreactive_onInput = debounce(function () {
      this.$emit('change', cloneDeep(this.formData))
    }, 200)
  },

  methods: {
    setData (data) {
      Object.assign(this.formData, data)
      this.onChange()
    },

    onInput () {
      this.__unreactive_onInput()
    },
    showCommonRule () {

    },

    onChange () {
      this.$emit('change', cloneDeep(this.formData))
    },
    quote (row) {
      this.formData.pattern = row.value
      this.formData.message = row.message
      this.dialogVisible = false
      this.$emit('change', cloneDeep(this.formData))
    }

  } // end of methods
}
</script>
