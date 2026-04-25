<template>
  <w-dialog
    :model-value="modelValue"
    :title="dialogTitle"
    width="800px"
    :close-on-click-modal="false"
    @update:model-value="$emit('update:modelValue', $event)"
    @close="handleClose"
  >
    <div class="upload-dialog-content">
      <!-- 步骤指示器 -->
      <w-steps :active="currentStep" align-center>
        <w-step title="上传文件" />
        <w-step title="配置选项" />
        <w-step title="确认导入" />
      </w-steps>

      <!-- 步骤1: 上传文件 -->
      <div v-show="currentStep === 0" class="step-content">
        <w-upload
          ref="uploadRef"
          class="upload-area"
          drag
          :action="uploadAction"
          :on-change="handleFileChange"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
          :before-upload="beforeUpload"
          :file-list="fileList"
          :auto-upload="false"
          accept=".xls,.xlsx"
        >
          <div class="upload-placeholder">
            <w-icon name="upload" :size="48" />
            <div class="upload-text">
              将文件拖到此处，或<span class="upload-highlight">点击上传</span>
            </div>
            <div class="upload-tip">支持 .xls、.xlsx 格式的Excel文件</div>
          </div>
        </w-upload>

        <!-- 文件信息 -->
        <div v-if="uploadedFile" class="file-info">
          <w-descriptions :column="2" border>
            <w-descriptions-item label="文件名">
              {{ uploadedFile.name }}
            </w-descriptions-item>
            <w-descriptions-item label="文件大小">
              {{ formatFileSize(uploadedFile.size) }}
            </w-descriptions-item>
            <w-descriptions-item label="文件类型">
              {{ uploadedFile.type || 'application/vnd.ms-excel' }}
            </w-descriptions-item>
            <w-descriptions-item label="上传时间">
              {{ uploadTime }}
            </w-descriptions-item>
          </w-descriptions>
        </div>
      </div>

      <!-- 步骤2: 配置选项 -->
      <div v-show="currentStep === 1" class="step-content">
        <w-form ref="configFormRef" :model="importConfig" label-width="120px">
          <w-form-item label="覆盖已存在的表单" prop="overwriteExisting">
            <w-switch v-model="importConfig.overwriteExisting" />
            <span class="form-item-tip">如果表单名称已存在，是否覆盖</span>
          </w-form-item>

          <w-form-item label="创建新版本" prop="createNewVersion">
            <w-switch v-model="importConfig.createNewVersion" />
            <span class="form-item-tip">为现有表单创建新版本</span>
          </w-form-item>

          <w-form-item label="验证数据" prop="validateData">
            <w-switch v-model="importConfig.validateData" />
            <span class="form-item-tip">导入前验证数据格式和完整性</span>
          </w-form-item>

          <w-form-item label="跳过空行" prop="skipEmptyRows">
            <w-switch v-model="importConfig.skipEmptyRows" />
            <span class="form-item-tip">自动跳过Excel中的空行</span>
          </w-form-item>

          <w-form-item label="工作表索引" prop="sheetIndex">
            <w-input-number
              v-model="importConfig.sheetIndex"
              :min="0"
              :max="10"
              placeholder="请输入工作表索引"
            />
            <span class="form-item-tip">从0开始，默认为第一个工作表</span>
          </w-form-item>
        </w-form>
      </div>

      <!-- 步骤3: 确认导入 -->
      <div v-show="currentStep === 2" class="step-content">
        <w-alert type="info" :closable="false" show-icon>
          <div>请确认以下信息后开始导入：</div>
        </w-alert>

        <w-descriptions :column="1" border class="confirm-info">
          <w-descriptions-item label="文件名">
            {{ uploadedFile?.name }}
          </w-descriptions-item>
          <w-descriptions-item label="文件大小">
            {{ uploadedFile ? formatFileSize(uploadedFile.size) : '-' }}
          </w-descriptions-item>
          <w-descriptions-item label="覆盖已存在的表单">
            {{ importConfig.overwriteExisting ? '是' : '否' }}
          </w-descriptions-item>
          <w-descriptions-item label="创建新版本">
            {{ importConfig.createNewVersion ? '是' : '否' }}
          </w-descriptions-item>
          <w-descriptions-item label="验证数据">
            {{ importConfig.validateData ? '是' : '否' }}
          </w-descriptions-item>
          <w-descriptions-item label="跳过空行">
            {{ importConfig.skipEmptyRows ? '是' : '否' }}
          </w-descriptions-item>
        </w-descriptions>

        <!-- 预览数据 -->
        <div v-if="previewData.length > 0" class="preview-section">
          <div class="preview-title">数据预览（前10条）</div>
          <w-table :data="previewData" border max-height="300">
            <w-table-column
              v-for="col in previewColumns"
              :key="col.prop"
              :prop="col.prop"
              :label="col.label"
              :min-width="col.width"
            />
          </w-table>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <w-button @click="handleClose">取消</w-button>
        <w-button v-if="currentStep > 0" @click="handlePrevStep">
          上一步
        </w-button>
        <w-button
          v-if="currentStep < 2"
          type="primary"
          :disabled="!canNextStep"
          @click="handleNextStep"
        >
          下一步
        </w-button>
        <w-button
          v-if="currentStep === 2"
          type="primary"
          :loading="importing"
          @click="handleImport"
        >
          开始导入
        </w-button>
      </div>
    </template>
  </w-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Message } from 'spark';
import * as formImportApi from '../api';
import type { ImportConfig, FormFieldPreview } from '../types';

interface Props {
  modelValue: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'success'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const uploadAction = '/api/form-import/upload';
const currentStep = ref(0);
const uploading = ref(false);
const importing = ref(false);
const fileList = ref([]);
const uploadedFile = ref<File | null>(null);
const uploadTime = ref('');
const previewData = ref<any[]>([]);
const previewColumns = ref<Array<{ prop: string; label: string; width: string }>>([]);

const importConfig = ref<ImportConfig>({
  overwriteExisting: false,
  createNewVersion: false,
  validateData: true,
  skipEmptyRows: true,
  sheetIndex: 0,
});

const dialogTitle = computed(() => {
  const titles = ['上传Excel文件', '配置导入选项', '确认导入信息'];
  return titles[currentStep.value];
});

const canNextStep = computed(() => {
  if (currentStep.value === 0) {
    return !!uploadedFile.value;
  }
  return true;
});

/**
 * 文件选择前验证
 */
function beforeUpload(file: File) {
  const isValidType = /\.(xls|xlsx)$/.test(file.name);
  if (!isValidType) {
    Message.error('只能上传 .xls 或 .xlsx 格式的文件');
    return false;
  }

  const isLt10M = file.size / 1024 / 1024 < 10;
  if (!isLt10M) {
    Message.error('文件大小不能超过 10MB');
    return false;
  }

  return true;
}

/**
 * 文件变化
 */
function handleFileChange(file: any, fileList: any[]) {
  if (file.status === 'ready') {
    uploadedFile.value = file.raw;
    uploadTime.value = new Date().toLocaleString();
  }
}

/**
 * 上传成功
 */
function handleUploadSuccess(response: any) {
  if (response.success) {
    Message.success('文件上传成功');
    previewData.value = response.data?.preview || [];
    generatePreviewColumns();
  }
}

/**
 * 上传失败
 */
function handleUploadError(error: any) {
  console.error('Upload error:', error);
  Message.error('文件上传失败');
}

/**
 * 下一步
 */
async function handleNextStep() {
  if (currentStep.value === 0) {
    // 验证文件
    if (!uploadedFile.value) {
      Message.warning('请先选择要上传的文件');
      return;
    }

    try {
      const res = await formImportApi.validateExcelFile(uploadedFile.value);
      if (!res.success || !res.valid) {
        Message.error(res.message || '文件格式验证失败');
        return;
      }
    } catch (e) {
      console.error(e);
      Message.error('文件验证失败');
      return;
    }
  }

  if (currentStep.value === 1) {
    // 生成预览数据
    generatePreviewData();
  }

  currentStep.value++;
}

/**
 * 上一步
 */
function handlePrevStep() {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
}

/**
 * 生成预览数据
 */
function generatePreviewData() {
  // 这里应该从后端获取预览数据，暂时使用模拟数据
  previewColumns.value = [
    { prop: 'fieldName', label: '字段名称', width: '150' },
    { prop: 'fieldType', label: '字段类型', width: '120' },
    { prop: 'required', label: '是否必填', width: '100' },
    { prop: 'defaultValue', label: '默认值', width: '120' },
  ];

  previewData.value = [
    {
      fieldName: '项目名称',
      fieldType: 'text',
      required: '是',
      defaultValue: '-',
    },
    {
      fieldName: '检查要求',
      fieldType: 'text',
      required: '是',
      defaultValue: '-',
    },
    {
      fieldName: '评分标准',
      fieldType: 'text',
      required: '否',
      defaultValue: '-',
    },
    {
      fieldName: '标分',
      fieldType: 'inputNumber',
      required: '是',
      defaultValue: '0',
    },
  ];
}

/**
 * 生成预览列
 */
function generatePreviewColumns() {
  // 根据实际数据生成列配置
  if (previewData.value.length > 0) {
    const firstRow = previewData.value[0];
    previewColumns.value = Object.keys(firstRow).map(key => ({
      prop: key,
      label: key,
      width: '120',
    }));
  }
}

/**
 * 开始导入
 */
async function handleImport() {
  if (!uploadedFile.value) {
    Message.warning('请先选择要上传的文件');
    return;
  }

  importing.value = true;
  try {
    const res = await formImportApi.uploadFormFile(
      uploadedFile.value,
      importConfig.value
    );

    if (!res.success) {
      Message.error(res.message || '导入失败');
      return;
    }

    Message.success('表单导入成功');
    emit('success');
    handleClose();
  } catch (e) {
    console.error(e);
    Message.error('导入失败');
  } finally {
    importing.value = false;
  }
}

/**
 * 关闭对话框
 */
function handleClose() {
  emit('update:modelValue', false);
  // 重置状态
  setTimeout(() => {
    currentStep.value = 0;
    uploadedFile.value = null;
    uploadTime.value = '';
    fileList.value = [];
    previewData.value = [];
    importConfig.value = {
      overwriteExisting: false,
      createNewVersion: false,
      validateData: true,
      skipEmptyRows: true,
      sheetIndex: 0,
    };
  }, 300);
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
</script>

<style scoped>
.upload-dialog-content {
  padding: 20px 0;
}

.step-content {
  margin-top: 30px;
  min-height: 300px;
}

.upload-area {
  margin-bottom: 20px;
}

.upload-placeholder {
  text-align: center;
}

.upload-placeholder .w-icon {
  color: #409eff;
}

.upload-text {
  margin-top: 16px;
  font-size: 14px;
  color: #606266;
}

.upload-highlight {
  color: #409eff;
  font-weight: 500;
  cursor: pointer;
}

.upload-tip {
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
}

.file-info {
  margin-top: 20px;
}

.form-item-tip {
  margin-left: 8px;
  font-size: 12px;
  color: #909399;
}

.confirm-info {
  margin-top: 20px;
}

.preview-section {
  margin-top: 20px;
}

.preview-title {
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
