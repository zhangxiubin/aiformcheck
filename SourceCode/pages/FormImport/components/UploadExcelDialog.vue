<template>
  <el-dialog
    :model-value="modelValue"
    :title="dialogTitle"
    width="800px"
    :close-on-click-modal="false"
    @update:model-value="$emit('update:modelValue', $event)"
    @close="handleClose"
  >
    <div class="upload-dialog-content">
      <!-- 步骤指示器 -->
      <el-steps :active="currentStep" align-center>
        <el-step title="上传文件" />
        <el-step title="配置选项" />
        <el-step title="确认导入" />
      </el-steps>

      <!-- 步骤1: 上传文件 -->
      <div v-show="currentStep === 0" class="step-content">
        <el-upload
          ref="uploadRef"
          class="upload-area"
          drag
          action="#"
          :on-change="handleFileChange"
          :auto-upload="false"
          accept=".xls,.xlsx"
          :limit="1"
        >
          <el-icon class="el-icon--upload">
            <Upload />
          </el-icon>
          <div class="el-upload__text">
            将文件拖到此处，或<em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              支持 .xls、.xlsx 格式的Excel文件，文件大小不超过10MB
            </div>
          </template>
        </el-upload>

        <!-- 文件信息 -->
        <div v-if="uploadedFile" class="file-info">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="文件名">
              {{ uploadedFile.name }}
            </el-descriptions-item>
            <el-descriptions-item label="文件大小">
              {{ formatFileSize(uploadedFile.size) }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>

      <!-- 步骤2: 配置选项 -->
      <div v-show="currentStep === 1" class="step-content">
        <el-form ref="formRef" :model="importConfig" label-width="120px">
          <el-form-item label="覆盖已存在的表单">
            <el-switch v-model="importConfig.overwriteExisting" />
            <span class="form-item-tip">
              如果表单名称已存在，是否覆盖
            </span>
          </el-form-item>

          <el-form-item label="创建新版本">
            <el-switch v-model="importConfig.createNewVersion" />
            <span class="form-item-tip">
              保留旧版本，创建新的版本
            </span>
          </el-form-item>

          <el-form-item label="验证数据">
            <el-switch v-model="importConfig.validateData" />
            <span class="form-item-tip">
              导入前验证数据格式和完整性
            </span>
          </el-form-item>

          <el-form-item label="跳过空行">
            <el-switch v-model="importConfig.skipEmptyRows" />
            <span class="form-item-tip">
              自动跳过Excel中的空行
            </span>
          </el-form-item>

          <el-form-item label="工作表索引">
            <el-input-number
              v-model="importConfig.sheetIndex"
              :min="0"
              :max="10"
            />
            <span class="form-item-tip">
              如果Excel有多个工作表，指定要导入的工作表
            </span>
          </el-form-item>
        </el-form>
      </div>

      <!-- 步骤3: 确认导入 -->
      <div v-show="currentStep === 2" class="step-content">
        <el-descriptions title="导入配置确认" :column="1" border>
          <el-descriptions-item label="文件名">
            {{ uploadedFile?.name || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="文件大小">
            {{ uploadedFile ? formatFileSize(uploadedFile.size) : '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="覆盖已存在的表单">
            {{ importConfig.overwriteExisting ? '是' : '否' }}
          </el-descriptions-item>
          <el-descriptions-item label="创建新版本">
            {{ importConfig.createNewVersion ? '是' : '否' }}
          </el-descriptions-item>
          <el-descriptions-item label="验证数据">
            {{ importConfig.validateData ? '是' : '否' }}
          </el-descriptions-item>
          <el-descriptions-item label="跳过空行">
            {{ importConfig.skipEmptyRows ? '是' : '否' }}
          </el-descriptions-item>
        </el-descriptions>

        <!-- 预览数据 -->
        <div v-if="previewData" class="preview-section">
          <h4>数据预览（前5条）</h4>
          <el-table :data="previewData" border max-height="300">
            <el-table-column
              v-for="col in previewColumns"
              :key="col.prop"
              :prop="col.prop"
              :label="col.label"
              min-width="120"
            />
          </el-table>
        </div>
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button v-if="currentStep > 0" @click="previousStep">上一步</el-button>
        <el-button
          v-if="currentStep < 2"
          type="primary"
          @click="nextStep"
          :disabled="!canNextStep"
        >
          下一步
        </el-button>
        <el-button
          v-if="currentStep === 2"
          type="primary"
          @click="handleConfirm"
          :loading="confirming"
        >
          开始导入
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { Upload } from '@element-plus/icons-vue';
import type { UploadFile } from 'element-plus';
import * as formImportApi from '../api';
import type { ImportConfig } from '../types';

interface Props {
  modelValue: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'success'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const currentStep = ref(0);
const uploadedFile = ref<UploadFile | null>(null);
const fileList = ref<UploadFile[]>([]);
const importConfig = ref<ImportConfig>({
  overwriteExisting: false,
  createNewVersion: false,
  validateData: true,
  skipEmptyRows: true,
  sheetIndex: 0,
});

const previewData = ref<any[]>([]);
const previewColumns = ref<any[]>([]);
const confirming = ref(false);

const uploadRef = ref();
const formRef = ref();

const dialogTitle = computed(() => {
  const titles = ['上传Excel文件', '配置导入选项', '确认导入信息'];
  return titles[currentStep.value];
});

const canNextStep = computed(() => {
  if (currentStep.value === 0) {
    return !!uploadedFile.value;
  }
  if (currentStep.value === 1) {
    return true;
  }
  return false;
});

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      resetDialog();
    }
  }
);

function resetDialog() {
  currentStep.value = 0;
  uploadedFile.value = null;
  fileList.value = [];
  previewData.value = [];
  previewColumns.value = [];
  importConfig.value = {
    overwriteExisting: false,
    createNewVersion: false,
    validateData: true,
    skipEmptyRows: true,
    sheetIndex: 0,
  };
}

function handleFileChange(file: UploadFile) {
  uploadedFile.value = file;
  fileList.value = [file];

  // 模拟预览数据
  if (file.raw) {
    generatePreviewData(file.raw);
  }
}

function generatePreviewData(file: File) {
  // 模拟生成预览数据（实际应用中应该解析Excel文件）
  previewColumns.value = [
    { prop: 'field1', label: '字段1' },
    { prop: 'field2', label: '字段2' },
    { prop: 'field3', label: '字段3' },
  ];

  previewData.value = [
    { field1: '数据1', field2: '数据2', field3: '数据3' },
    { field1: '数据4', field2: '数据5', field3: '数据6' },
    { field1: '数据7', field2: '数据8', field3: '数据9' },
    { field1: '数据10', field2: '数据11', field3: '数据12' },
    { field1: '数据13', field2: '数据14', field3: '数据15' },
  ];
}

function nextStep() {
  if (currentStep.value < 2) {
    currentStep.value++;
  }
}

function previousStep() {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
}

async function handleConfirm() {
  if (!uploadedFile.value) {
    ElMessage.warning('请先上传文件');
    return;
  }

  confirming.value = true;
  try {
    // 模拟导入过程
    await new Promise((resolve) => setTimeout(resolve, 2000));

    ElMessage.success('导入成功');
    emit('success');
    handleClose();
  } catch (error) {
    ElMessage.error('导入失败');
  } finally {
    confirming.value = false;
  }
}

function handleClose() {
  emit('update:modelValue', false);
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
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

.el-icon--upload {
  font-size: 48px;
  color: #409eff;
  margin-bottom: 16px;
}

.el-upload__text {
  font-size: 14px;
  color: #606266;
}

.el-upload__text em {
  color: #409eff;
  font-style: normal;
}

.el-upload__tip {
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
}

.file-info {
  margin-top: 20px;
}

.form-item-tip {
  margin-left: 12px;
  font-size: 12px;
  color: #909399;
}

.preview-section {
  margin-top: 30px;
}

.preview-section h4 {
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
