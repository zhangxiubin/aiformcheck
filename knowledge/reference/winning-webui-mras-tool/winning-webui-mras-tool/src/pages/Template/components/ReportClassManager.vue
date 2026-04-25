<template>
  <w-dialog
    v-model="dialogVisible"
    title="报告分类管理"
    width="500px"
    @confirm="handleConfirm"
  >
    <div class="report-class-manager">
      <div class="report-class-header">
        <w-input
          v-model="newClassName"
          placeholder="请输入分类名称"
          style="width: 200px;"
        />
        <w-button type="primary" @click="handleAddClass">
          新增
        </w-button>
      </div>

      <div class="report-class-list">
        <div
          v-for="reportClass in reportClasses"
          :key="reportClass.mrasQaClassId"
          class="report-class-item"
        >
          <span>{{ reportClass.className }}</span>
          <w-link type="error" @click="handleDelete(reportClass)">
            删除
          </w-link>
        </div>

        <div v-if="reportClasses.length === 0" class="report-class-empty">
          暂无报告分类
        </div>
      </div>
    </div>
  </w-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Message, WMessageBox } from 'spark';

interface ReportClass {
  mrasQaClassId: string;
  className: string;
}

interface Props {
  modelValue: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const newClassName = ref('');
const reportClasses = ref<ReportClass[]>([
  { mrasQaClassId: 'class-001', className: '质控报告' },
  { mrasQaClassId: 'class-002', className: '总结报告' },
  { mrasQaClassId: 'class-003', className: '分析报告' },
  { mrasQaClassId: 'class-004', className: '巡检报告' },
  { mrasQaClassId: 'class-005', className: '事件报告' },
  { mrasQaClassId: 'class-006', className: '统计报告' },
  { mrasQaClassId: 'class-007', className: '满意度报告' },
  { mrasQaClassId: 'class-008', className: '环境报告' },
  { mrasQaClassId: 'class-009', className: '培训报告' },
]);

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

async function handleAddClass() {
  if (!newClassName.value.trim()) {
    Message.warning('请输入分类名称');
    return;
  }

  const newClass: ReportClass = {
    mrasQaClassId: `class-${Date.now()}`,
    className: newClassName.value.trim(),
  };

  reportClasses.value.push(newClass);
  newClassName.value = '';
  Message.success('新增成功');
}

async function handleDelete(reportClass: ReportClass) {
  try {
    await WMessageBox.confirm(`确定删除分类：${reportClass.className}？`, '提示', {
      type: 'warning',
    });
    const index = reportClasses.value.findIndex(c => c.mrasQaClassId === reportClass.mrasQaClassId);
    if (index > -1) {
      reportClasses.value.splice(index, 1);
      Message.success('删除成功');
    }
  } catch {
    // 用户取消
  }
}

function handleConfirm() {
  dialogVisible.value = false;
}

// 对外暴露获取报告分类列表的方法
function getReportClasses() {
  return reportClasses.value;
}

defineExpose({
  getReportClasses,
});
</script>

<style scoped>
.report-class-manager {
  padding: 16px;
}

.report-class-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.report-class-list {
  max-height: 400px;
  overflow-y: auto;
}

.report-class-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  margin-bottom: 8px;
}

.report-class-item:hover {
  background: #f9f9f9;
}

.report-class-empty {
  text-align: center;
  padding: 32px;
  color: #999;
}
</style>
