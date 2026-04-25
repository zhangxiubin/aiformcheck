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
          :auto-upload="false"
          :on-change="handleFileChange"
          :file-list="fileList"
          accept=".xls,.xlsx"
          :limit="1"
        >
          <div class="upload-placeholder">
            <el-icon class="upload-icon"><Upload /></el-icon>
            <div class="upload-text">
              将文件拖到此处，或<span class="upload-highlight">点击上传</span>
            </div>
            <div class="upload-tip">支持 .xls、.xlsx 格式的Excel文件</div>
          </div>
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
            <el-descriptions-item label="文件类型">
              {{ uploadedFile.type || 'application/vnd.ms-excel' }}
            </el-descriptions-item>
            <el-descriptions-item label="上传时间">
              {{ uploadTime }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>

      <!-- 步骤2: 配置选项 -->
      <div v-show="currentStep === 1" class="step-content">
        <el-form ref="configFormRef" :model="importConfig" label-width="140px">
          <el-form-item label="覆盖已存在的表单">
            <el-switch v-model="importConfig.overwriteExisting" />
            <span class="form-item-tip">如果表单名称已存在，是否覆盖</span>
          </el-form-item>

          <el-form-item label="创建新版本">
            <el-switch v-model="importConfig.createNewVersion" />
            <span class="form-item-tip">为现有表单创建新版本</span>
          </el-form-item>

          <el-form-item label="验证数据">
            <el-switch v-model="importConfig.validateData" />
            <span class="form-item-tip">导入前验证数据格式和完整性</span>
          </el-form-item>

          <el-form-item label="跳过空行">
            <el-switch v-model="importConfig.skipEmptyRows" />
            <span class="form-item-tip">自动跳过Excel中的空行</span>
          </el-form-item>

          <el-form-item label="工作表索引">
            <el-input-number
              v-model="importConfig.sheetIndex"
              :min="0"
              :max="10"
              placeholder="请输入工作表索引"
            />
            <span class="form-item-tip">从0开始，默认为第一个工作表</span>
          </el-form-item>
        </el-form>
      </div>

      <!-- 步骤3: 确认导入 -->
      <div v-show="currentStep === 2" class="step-content">
        <el-alert type="info" :closable="false" show-icon>
          <div>请确认以下信息后开始导入：</div>
        </el-alert>

        <el-descriptions :column="1" border class="confirm-info">
          <el-descriptions-item label="文件名">
            {{ uploadedFile?.name }}
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
        <div v-if="previewData.length > 0" class="preview-section">
          <div class="preview-title">数据预览（前10条）</div>
          <el-table :data="previewData" border max-height="300">
            <el-table-column
              v-for="col in previewColumns"
              :key="col.prop"
              :prop="col.prop"
              :label="col.label"
              :min-width="col.width"
            />
          </el-table>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button v-if="currentStep > 0" @click="handlePrevStep">
          上一步
        </el-button>
        <el-button
          v-if="currentStep < 2"
          type="primary"
          :disabled="!canNextStep"
          @click="handleNextStep"
        >
          下一步
        </el-button>
        <el-button
          v-if="currentStep === 2"
          type="primary"
          :loading="importing"
          @click="handleImport"
        >
          开始导入
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
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
const importing = ref(false);
const fileList = ref<UploadFile[]>([]);
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
 * 文件变化
 */
function handleFileChange(file: UploadFile) {
  if (file.raw) {
    uploadedFile.value = file.raw;
    uploadTime.value = new Date().toLocaleString();
    fileList.value = [file];
  }
}

/**
 * 下一步
 */
async function handleNextStep() {
  if (currentStep.value === 0) {
    // 验证文件
    if (!uploadedFile.value) {
      ElMessage.warning('请先选择要上传的文件');
      return;
    }

    try {
      const res = await formImportApi.validateExcelFile(uploadedFile.value);
      if (!res.success || !res.valid) {
        ElMessage.error(res.message || '文件格式验证失败');
        return;
      }
    } catch (e) {
      console.error(e);
      ElMessage.error('文件验证失败');
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
 * 开始导入
 */
async function handleImport() {
  if (!uploadedFile.value) {
    ElMessage.warning('请先选择要上传的文件');
    return;
  }

  importing.value = true;
  try {
    const res = await formImportApi.uploadFormFile(
      uploadedFile.value,
      importConfig.value
    );

    if (!res.success) {
      ElMessage.error(res.message || '导入失败');
      return;
    }

    ElMessage.success('表单导入成功');
    emit('success');
    handleClose();
  } catch (e) {
    console.error(e);
    ElMessage.error('导入失败');
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
  padding: 40px 0;
}

.upload-icon {
  font-size: 48px;
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
