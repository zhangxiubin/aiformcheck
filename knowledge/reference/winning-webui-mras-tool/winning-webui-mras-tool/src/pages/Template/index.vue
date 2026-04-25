<template>
  <div class="template-container full-width full-height" v-loading="loading">
    <div class="template-header">
      <w-button type="primary" @click="createDialogVisible = true">
        新建模板
      </w-button>
      <w-button type="primary" plain @click="reportClassManagerVisible = true">
        报告分类
      </w-button>
      <div class="spacer"></div>
      <w-input-search
        v-model="filterParams.templateName"
        placeholder="模板名称"
        style="width: 240px;"
        :loading="loading"
        @search="onSearch"
        @clear="onSearch"
      />
    </div>

    <div class="template-content">
      <w-table :data="tableData" border stripe height="100%">
        <w-table-column label="序号" type="index" align="center" width="70">
          <template #default="{ $index }">
            {{ pagination.pageSize * (pagination.pageNo - 1) + $index + 1 }}
          </template>
        </w-table-column>

        <w-table-column
          v-for="col in cols"
          v-bind="col"
          :key="col.prop"
        >
          <template v-if="col.prop === 'actions'" #default="{ row }">
            <w-link type="error" @click="onDel(row)">删除</w-link>
            <w-divider direction="vertical" />
            <w-link type="warning" @click="onEdit(row)">编辑</w-link>
          </template>
        </w-table-column>
      </w-table>
    </div>

    <div class="template-pagination">
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

    <!-- 新建模板对话框 -->
    <TemplateCreate
      v-model="createDialogVisible"
      @success="onCreateSuccess"
    />

    <!-- 报告分类管理 -->
    <ReportClassManager
      v-model="reportClassManagerVisible"
    />

    <!-- 编辑模板对话框 -->
    <TemplateConf
      v-model="confDialog.visible"
      :toBeEdit="confDialog.toBeEdit"
      @success="refresh"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Message, WMessageBox } from 'spark';
import * as templateApi from './api';
import type { Template } from './api';
import ReportClassManager from './components/ReportClassManager.vue';
import TemplateCreate from './components/TemplateCreate.vue';
import TemplateConf from './components/TemplateConf.vue';

const loading = ref(false);
const filterParams = ref({ templateName: '' });
const tableData = ref<Template[]>([]);

const pagination = ref({
  total: 0,
  pageSize: 20,
  pageNo: 1,
});

const cols = [
  { label: '名称', prop: 'templateName' },
  { label: '报告分类', prop: 'busClassName' },
  { label: '生成周期', prop: 'tempTypeDesc', align: 'center', width: 100 },
  { label: '模板形式', prop: 'templateTypeName', align: 'center', width: 100 },
  { label: '生成方式', prop: 'tempGenerateModeDesc', align: 'center', width: 100 },
  { label: '最后更新人', prop: 'modifierName' },
  { label: '最后更新时间', prop: 'modifiedAt', align: 'center', width: 180 },
  { label: '操作', prop: 'actions', align: 'center', width: 130 },
];

const reportClassManagerVisible = ref(false);
const createDialogVisible = ref(false);
const confDialog = ref({
  visible: false,
  toBeEdit: null as Template | null,
});

onMounted(() => {
  refresh();
});

async function refresh() {
  const { pageNo, pageSize } = pagination.value;

  loading.value = true;
  try {
    const res = await templateApi.queryTemplateList({
      ...filterParams.value,
      hiddenFlag: 98176,
      pageType: 'P',
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

function onCreateSuccess() {
  pagination.value.pageNo = 1;
  refresh();
}

function onSearch() {
  pagination.value.pageNo = 1;
  refresh();
}

function onPageSizeChange() {
  pagination.value.pageNo = 1;
  refresh();
}

async function onDel(row: Template) {
  try {
    await WMessageBox.confirm('确定删除该模板吗？', '提示', {
      type: 'warning',
    });

    loading.value = true;
    try {
      const res = await templateApi.deleteTemplate({ mrasQaTempId: row.mrasQaTempId });
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

function onEdit(row: Template) {
  Object.assign(confDialog.value, {
    visible: true,
    toBeEdit: row,
  });
}
</script>

<style scoped>
.template-container {
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  padding: 16px;
}

.template-header {
  display: flex;
  align-items: center;
  padding: 8px 0;
  background: #fff;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 8px;
}

.template-content {
  flex: 1;
  overflow: hidden;
  background: #fff;
  border-radius: 4px;
  margin-bottom: 8px;
}

.template-pagination {
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
</style>
