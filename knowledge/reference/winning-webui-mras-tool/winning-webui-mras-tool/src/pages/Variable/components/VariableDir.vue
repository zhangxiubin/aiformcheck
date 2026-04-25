<template>
  <div class="variable-dir" v-loading="loading">
    <div class="variable-dir-header">
      <div class="header-content">
        <span class="variable-dir-title">变量目录</span>
        <div class="header-actions">
          <w-link type="primary" :underline="false" @click="refresh">
            <span class="refresh-icon">↻</span>
          </w-link>
          <w-button size="small" type="primary" @click="onAction('add', null)">添加</w-button>
        </div>
      </div>
    </div>

    <ul class="variable-dir-list">
      <li
        v-for="item in dirList"
        :key="item.mrasQaValclassId"
        class="dir-item"
        :class="{ active: activeMrasQaValclassId === item.mrasQaValclassId }"
        @click="handleSelectDir(item)"
      >
        <div class="dir-item-content">
          <span class="dir-name">{{ item.vaclassName }}</span>
          <div class="dir-actions">
            <w-link type="error" size="small" @click.stop="onDelete(item)">删除</w-link>
            <w-link type="warning" size="small" @click.stop="onAction('edit', item)">编辑</w-link>
          </div>
        </div>
      </li>
    </ul>

    <VariableDirForm
      v-model="variableDirForm.visible"
      :action="variableDirForm.action"
      :toBeEdit="variableDirForm.toBeEdit"
      @success="refresh"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Message, WMessageBox } from 'spark';
import VariableDirForm from './VariableDirForm.vue';

interface VariableDirItem {
  mrasQaValclassId: string;
  vaclassName: string;
  mrasDataSourceConfigId?: string;
}

interface Emits {
  (e: 'change', dir: VariableDirItem | null): void;
}

const emit = defineEmits<Emits>();

const loading = ref(false);
const dirList = ref<VariableDirItem[]>([]);
const activeMrasQaValclassId = ref('');
const variableDirForm = ref({
  visible: false,
  action: 'add',
  toBeEdit: null as VariableDirItem | null,
});

// 模拟 API 调用 - 实际项目中需要替换为真实 API
async function queryAIVariableDir() {
  // 模拟数据 - 与 mock/aiReportAPI.ts 保持一致
  return {
    success: true,
    data: [
      { mrasQaValclassId: 'dir-001', vaclassName: '系统基础变量', mrasDataSourceConfigId: 'ds-001' },
      { mrasQaValclassId: 'dir-002', vaclassName: '患者基本信息', mrasDataSourceConfigId: 'ds-002' },
      { mrasQaValclassId: 'dir-003', vaclassName: '诊疗相关变量', mrasDataSourceConfigId: 'ds-003' },
      { mrasQaValclassId: 'dir-004', vaclassName: '医嘱执行变量', mrasDataSourceConfigId: 'ds-004' },
      { mrasQaValclassId: 'dir-005', vaclassName: '检验检查变量', mrasDataSourceConfigId: 'ds-005' },
      { mrasQaValclassId: 'dir-006', vaclassName: '护理质量变量', mrasDataSourceConfigId: 'ds-006' },
      { mrasQaValclassId: 'dir-007', vaclassName: '药品管理变量', mrasDataSourceConfigId: 'ds-007' },
      { mrasQaValclassId: 'dir-008', vaclassName: '费用统计变量', mrasDataSourceConfigId: 'ds-008' },
    ],
  };
}

async function deleteAIVariableDir(mrasQaValclassId: string) {
  // 模拟删除
  return { success: true };
}

onMounted(() => {
  refresh();
});

async function refresh() {
  loading.value = true;
  try {
    const res = await queryAIVariableDir();
    if (res.success && res.data) {
      dirList.value = res.data;

      // 自动选中第一个目录
      if (!activeMrasQaValclassId.value || !dirList.value.find(item => item.mrasQaValclassId === activeMrasQaValclassId.value)) {
        const firstDir = dirList.value[0];
        if (firstDir) {
          handleSelectDir(firstDir);
        }
      }
    }
  } catch (error) {
    console.error('Failed to load variable directories:', error);
  } finally {
    loading.value = false;
  }
}

function handleSelectDir(item: VariableDirItem) {
  activeMrasQaValclassId.value = item.mrasQaValclassId;
  emit('change', item);
}

function onAction(action: string, toBeEdit: VariableDirItem | null) {
  variableDirForm.value = {
    visible: true,
    action,
    toBeEdit,
  };
}

async function onDelete(item: VariableDirItem) {
  try {
    await WMessageBox.confirm(`确定删除目录：${item.vaclassName}？`, '提示', {
      type: 'error',
      confirmButtonText: '确定删除',
    });
    const res = await deleteAIVariableDir(item.mrasQaValclassId);
    if (res.success) {
      Message.success('删除成功');
      refresh();
    }
  } catch {
    // 用户取消
  }
}
</script>

<style scoped>
.variable-dir {
  width: 240px;
  flex-shrink: 0;
  background: #fff;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
}

.variable-dir-header {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.variable-dir-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.refresh-icon {
  display: inline-block;
  cursor: pointer;
  font-size: 16px;
}

.variable-dir-list {
  flex: 1;
  overflow-y: auto;
  list-style: none;
  padding: 8px 0;
  margin: 0;
}

.dir-item {
  padding: 10px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dir-item:hover,
.dir-item.active {
  background-color: rgba(45, 90, 250, 0.1);
}

.dir-item.active .dir-name {
  color: #2d5afa;
}

.dir-item-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dir-name {
  font-size: 14px;
  color: #333;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dir-actions {
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s;
}

.dir-item:hover .dir-actions {
  opacity: 1;
}
</style>
