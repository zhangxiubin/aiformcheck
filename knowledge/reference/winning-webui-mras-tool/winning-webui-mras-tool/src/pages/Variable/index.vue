<template>
  <div class="variable-container full-width full-height">
    <VariableDirComponent @change="handleVariableDirChange" />

    <div class="variable-main">
      <div class="variable-header">
        <w-button
          size="small"
          type="primary"
          :disabled="!activeVariableDir"
          @click="handleAddVariable"
        >
          新增
        </w-button>
        <div class="spacer"></div>
        <w-input-search
          v-model="filterParams.mrasQaUservarName"
          :disabled="!activeVariableDir"
          placeholder="请输入变量名称"
          clearable
          size="small"
          @clear="handleFilter"
          @search="handleFilter"
        />
      </div>

      <template v-if="activeVariableDir">
        <div class="variable-content">
          <w-table
            :data="variables"
            border
            stripe
            height="100%"
            v-loading="loading"
          >
            <w-table-column label="序号" type="index" align="center" width="70">
              <template #default="{ $index }">
                {{ (pagination.pageNo - 1) * pagination.pageSize + $index + 1 }}
              </template>
            </w-table-column>
            <w-table-column label="变量名称" prop="mrasQaUservarName" />
            <w-table-column label="变量字段" prop="mrasQaUservarNo" />
            <w-table-column label="变量描述" prop="mrasQaUservarDesc" />
            <w-table-column
              label="变量类型"
              prop="mrasQaUservarType"
              align="center"
              width="120"
            >
              <template #default="{ row }">
                {{ getVarTypeDesc(row.mrasQaUservarType) }}
              </template>
            </w-table-column>
            <w-table-column label="操作" align="center" width="120">
              <template #default="{ row }">
                <w-link type="error" @click="handleDelete(row)">删除</w-link>
                <w-divider direction="vertical" />
                <w-link type="warning" @click="handleEdit(row)">编辑</w-link>
              </template>
            </w-table-column>
          </w-table>
        </div>

        <div class="variable-pagination">
          <w-pagination
            layout="prev, pager, next, sizes, total, jump"
            :page-sizes="[10, 20, 30, 50]"
            :total="pagination.total"
            :page-size="pagination.pageSize"
            :current-page="pagination.pageNo"
            @current-change="handlePageChange"
            @size-change="handleSizeChange"
          />
        </div>
      </template>

      <div v-else class="variable-empty">请先选择变量目录</div>
    </div>

    <!-- Variable Form Dialog -->
    <VariableForm
      v-model="variableFormVisible"
      :var-dir="activeVariableDir"
      :toBeEdit="toBeEditVariable"
      @success="handleVariableSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import * as variableApi from './api';
import type { Variable, VariableDir } from './api';
import VariableDirComponent from './components/VariableDir.vue';
import VariableForm from './components/VariableForm.vue';
import { Message, WMessageBox } from 'spark';

const filterParams = ref({ mrasQaUservarName: '' });
const variableFormVisible = ref(false);
const toBeEditVariable = ref(null);
const loading = ref(false);
const variables = ref<Variable[]>([]);
const activeVariableDir = ref<VariableDir | null>(null);
const pagination = ref({
  total: 0,
  pageSize: 20,
  pageNo: 1,
});

// 变量类型映射
const varTypeMap: Record<string, string> = {
  'NORMAL': '普通变量',
  'SYSTEM': '系统变量',
  'CUSTOM': '自定义变量',
};

function getVarTypeDesc(type: string) {
  return varTypeMap[type] || type;
}

async function loadVariables() {
  if (!activeVariableDir.value) return;

  loading.value = true;
  try {
    const res = await variableApi.queryVariable({
      ...filterParams.value,
      mrasQaValclassId: activeVariableDir.value.mrasQaValclassId,
      pageType: 'P',
      pageNo: pagination.value.pageNo - 1,
      pageSize: pagination.value.pageSize,
    });

    if (res.success) {
      variables.value = res.data || [];
      pagination.value.total = Number(res.count) || 0;
    }
  } finally {
    loading.value = false;
  }
}

function handleVariableDirChange(dir: VariableDir) {
  activeVariableDir.value = dir;
  pagination.value.pageNo = 1;
  loadVariables();
}

function handleFilter() {
  pagination.value.pageNo = 1;
  loadVariables();
}

function handlePageChange(pageNo: number) {
  pagination.value.pageNo = pageNo;
  loadVariables();
}

function handleSizeChange(pageSize: number) {
  pagination.value.pageSize = pageSize;
  pagination.value.pageNo = 1;
  loadVariables();
}

function handleAddVariable() {
  toBeEditVariable.value = null;
  variableFormVisible.value = true;
}

function handleEdit(row: Variable) {
  toBeEditVariable.value = row;
  variableFormVisible.value = true;
}

async function handleDelete(row: Variable) {
  try {
    await WMessageBox.confirm(`确定删除变量：${row.mrasQaUservarName}？`, '提示', {
      type: 'error',
      confirmButtonText: '确定删除',
    });

    loading.value = true;
    try {
      const res = await variableApi.deleteVariable({ mrasQaUservarId: row.mrasQaUservarId });
      if (res.success) {
        Message.success('删除成功');
        loadVariables();
      }
    } finally {
      loading.value = false;
    }
  } catch {
    // User canceled
  }
}

function handleVariableSuccess() {
  loadVariables();
}
</script>

<style scoped>
.variable-container {
  display: flex;
  background: #f5f5f5;
}

.variable-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 12px;
  overflow: hidden;
}

.variable-header {
  display: flex;
  align-items: center;
  padding: 8px 0;
  background: #fff;
  border-radius: 4px;
  padding: 12px;
}

.variable-content {
  flex: 1;
  overflow: hidden;
  background: #fff;
  border-radius: 4px;
  margin: 8px 0;
}

.variable-pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 12px;
  background: #fff;
  border-radius: 4px;
}

.variable-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  background: #fff;
  border-radius: 4px;
}

.spacer {
  flex: 1;
}
</style>
