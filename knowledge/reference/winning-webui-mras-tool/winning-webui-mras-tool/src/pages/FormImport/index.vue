<template>
  <div class="form-import-container full-width full-height" v-loading="loading">
    <!-- 页面头部 -->
    <div class="form-import-header">
      <w-button type="primary" @click="uploadDialogVisible = true">
        <w-icon name="upload" />
        导入表单
      </w-button>
      <w-button type="primary" plain @click="handleDownloadTemplate">
        <w-icon name="download" />
        下载模板
      </w-button>
      <div class="spacer"></div>
      <w-input-search
        v-model="filterParams.formName"
        placeholder="表单名称"
        style="width: 240px;"
        :loading="loading"
        @search="onSearch"
        @clear="onSearch"
      />
    </div>

    <!-- 表单列表 -->
    <div class="form-import-content">
      <w-table :data="tableData" border stripe height="100%">
        <w-table-column label="序号" type="index" align="center" width="70">
          <template #default="{ $index }">
            {{ pagination.pageSize * (pagination.pageNo - 1) + $index + 1 }}
          </template>
        </w-table-column>

        <w-table-column label="表单名称" prop="formName" min-width="200" />

        <w-table-column label="文件名" prop="fileName" min-width="180" />

        <w-table-column
          label="文件大小"
          prop="fileSize"
          align="center"
          width="120"
        >
          <template #default="{ row }">
            {{ formatFileSize(row.fileSize) }}
          </template>
        </w-table-column>

        <w-table-column
          label="上传时间"
          prop="uploadTime"
          align="center"
          width="180"
        />

        <w-table-column label="状态" prop="status" align="center" width="100">
          <template #default="{ row }">
            <w-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </w-tag>
          </template>
        </w-table-column>

        <w-table-column label="错误信息" prop="errorMessage" min-width="200">
          <template #default="{ row }">
            <span v-if="row.errorMessage" class="error-message">
              {{ row.errorMessage }}
            </span>
            <span v-else class="text-muted">-</span>
          </template>
        </w-table-column>

        <w-table-column label="操作" prop="actions" align="center" width="180">
          <template #default="{ row }">
            <w-link
              v-if="row.status === 'failed'"
              type="primary"
              @click="handleReImport(row)"
            >
              重新导入
            </w-link>
            <w-link type="error" @click="handleDelete(row)">删除</w-link>
          </template>
        </w-table-column>
      </w-table>
    </div>

    <!-- 分页 -->
    <div class="form-import-pagination">
      <w-pagination
        layout="prev, pager, next, sizes, total, jump"
        :page-sizes="[10, 20, 30, 50]"
        :total="pagination.total"
        :page-size="pagination.pageSize"
        :current-page="pagination.pageNo"
        @current-change="refresh"
        @size-change="onPageSizeChange"
      />
    </div>

    <!-- 导入对话框 -->
    <UploadExcelDialog
      v-model="uploadDialogVisible"
      @success="onUploadSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Message, WMessageBox } from 'spark';
import * as formImportApi from './api';
import type { FormImportData, ImportStatus } from './types';
import UploadExcelDialog from './components/UploadExcelDialog.vue';

const loading = ref(false);
const filterParams = ref({ formName: '' });
const tableData = ref<FormImportData[]>([]);

const pagination = ref({
  total: 0,
  pageSize: 20,
  pageNo: 1,
});

const uploadDialogVisible = ref(false);

onMounted(() => {
  refresh();
});

/**
 * 刷新列表
 */
async function refresh() {
  const { pageNo, pageSize } = pagination.value;

  loading.value = true;
  try {
    const res = await formImportApi.queryFormImportList({
      ...filterParams.value,
      pageSize,
      pageNo: pageNo - 1,
    });

    if (!res.success) return;

    tableData.value = res.data || [];

    if (pageNo === 1) {
      const total = parseInt(String(res.count), 10);
      pagination.value.total = isNaN(total) ? 0 : total;
    }
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
}

/**
 * 搜索
 */
function onSearch() {
  pagination.value.pageNo = 1;
  refresh();
}

/**
 * 分页大小变化
 */
function onPageSizeChange() {
  pagination.value.pageNo = 1;
  refresh();
}

/**
 * 上传成功回调
 */
function onUploadSuccess() {
  pagination.value.pageNo = 1;
  refresh();
}

/**
 * 下载模板
 */
async function handleDownloadTemplate() {
  try {
    const blob = await formImportApi.downloadTemplate();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '表单导入模板.xlsx';
    link.click();
    window.URL.revokeObjectURL(url);
    Message.success('模板下载成功');
  } catch (e) {
    console.error(e);
    Message.error('模板下载失败');
  }
}

/**
 * 重新导入
 */
async function handleReImport(row: FormImportData) {
  if (!row.formId) return;

  try {
    await WMessageBox.confirm('确定要重新导入该表单吗？', '提示', {
      type: 'warning',
    });

    loading.value = true;
    try {
      const res = await formImportApi.reImportForm(row.formId, {
        overwriteExisting: true,
        createNewVersion: false,
        validateData: true,
        skipEmptyRows: true,
      });

      if (!res.success) return;

      Message.success('重新导入成功');
      refresh();
    } catch (e) {
      console.error(e);
    } finally {
      loading.value = false;
    }
  } catch {
    // 用户取消
  }
}

/**
 * 删除
 */
async function handleDelete(row: FormImportData) {
  if (!row.formId) return;

  try {
    await WMessageBox.confirm('确定删除该表单吗？', '提示', {
      type: 'warning',
    });

    loading.value = true;
    try {
      const res = await formImportApi.deleteFormImport(row.formId);
      if (!res.success) return;

      Message.success('删除成功');
      pagination.value.pageNo = 1;
      refresh();
    } catch (e) {
      console.error(e);
    } finally {
      loading.value = false;
    }
  } catch {
    // 用户取消
  }
}

/**
 * 格式化文件大小
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * 获取状态类型
 */
function getStatusType(status: ImportStatus): string {
  const typeMap: Record<ImportStatus, string> = {
    pending: 'info',
    importing: 'warning',
    success: 'success',
    failed: 'error',
  };
  return typeMap[status] || 'info';
}

/**
 * 获取状态文本
 */
function getStatusText(status: ImportStatus): string {
  const textMap: Record<ImportStatus, string> = {
    pending: '待导入',
    importing: '导入中',
    success: '成功',
    failed: '失败',
  };
  return textMap[status] || '未知';
}
</script>

<style scoped>
.form-import-container {
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  padding: 16px;
}

.form-import-header {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #fff;
  border-radius: 4px;
  margin-bottom: 8px;
}

.form-import-content {
  flex: 1;
  overflow: hidden;
  background: #fff;
  border-radius: 4px;
  margin-bottom: 8px;
}

.form-import-pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 12px;
  background: #fff;
  border-radius: 4px;
}

.spacer {
  flex: 1;
}

.error-message {
  color: #f56c6c;
}

.text-muted {
  color: #909399;
}
</style>
