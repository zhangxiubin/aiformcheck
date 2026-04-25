<template>
  <w-form
    ref="form"
    :model="formData"
    :rules="rules"
    :label-position="labelPosition"
    :label-width="labelWidth"
  >
    <w-form-item label="模板名称" prop="templateName">
      <w-input
        v-model="formData.templateName"
        :disabled="disabled || disabledFields.includes('templateName')"
      />
    </w-form-item>

    <w-form-item label="报告分类" prop="busClassId">
      <w-select
        v-model="formData.busClassId"
        :disabled="disabled || disabledFields.includes('busClassId')"
        style="width: 100%;"
      >
        <w-option
          v-for="item in reportClassList"
          :key="item.mrasQaClassId"
          :label="item.className"
          :value="item.mrasQaClassId"
        />
      </w-select>
    </w-form-item>

    <w-form-item label="模板形式" prop="templateTypeCode">
      <w-radio-group
        v-model="formData.templateTypeCode"
        :disabled="disabled || disabledFields.includes('templateTypeCode')"
        @change="onTemplateTypeCodeChange"
      >
        <w-radio label="MULTIPLE">多级模板</w-radio>
        <w-radio label="SOLO">单一模板</w-radio>
      </w-radio-group>
    </w-form-item>

    <w-form-item label="生成方式" prop="tempGenerateMode">
      <w-radio-group
        v-model="formData.tempGenerateMode"
        :disabled="disabled || disabledFields.includes('tempGenerateMode') || formData.templateTypeCode === 'MULTIPLE'"
      >
        <w-radio label="AUTO">自动</w-radio>
        <w-radio label="MANUAL">手动</w-radio>
      </w-radio-group>
    </w-form-item>

    <w-form-item label="生成周期" prop="tempType">
      <w-select
        v-model="formData.tempType"
        :disabled="disabled || disabledFields.includes('tempType')"
        placeholder="请选择生成周期"
        style="width: 100%;"
      >
        <w-option label="实时" value="REALTIME" />
        <w-option label="日度" value="DAILY" />
        <w-option label="周度" value="WEEKLY" />
        <w-option label="月度" value="MONTHLY" />
        <w-option label="季度" value="QUARTERLY" />
        <w-option label="年度" value="YEARLY" />
      </w-select>
    </w-form-item>

    <w-form-item label="模板描述" prop="templateDesc">
      <w-input
        v-model="formData.templateDesc"
        type="textarea"
        :rows="3"
        :disabled="disabled || disabledFields.includes('templateDesc')"
      />
    </w-form-item>
  </w-form>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { cloneDeep } from 'lodash-es';

interface ReportClass {
  mrasQaClassId: string;
  className: string;
}

interface Props {
  labelPosition?: string;
  labelWidth?: string;
  disabled?: boolean;
  disabledFields?: string[];
}

interface Emits {
  (e: 'update:modelValue', value: any): void;
}

const props = withDefaults(defineProps<Props>(), {
  labelPosition: 'top',
  labelWidth: '100px',
  disabled: false,
  disabledFields: () => [],
});

const emit = defineEmits<Emits>();

const form = ref();
const loading = ref(false);
const reportClassList = ref<ReportClass[]>([
  { mrasQaClassId: 'class-001', className: '质控报告' },
  { mrasQaClassId: 'class-002', className: '总结报告' },
  { mrasQaClassId: 'class-003', className: '分析报告' },
  { mrasQaClassId: 'class-004', className: '巡检报告' },
  { mrasQaClassId: 'class-005', className: '事件报告' },
]);

const formData = ref({
  templateName: '',
  busClassId: '',
  templateTypeCode: 'SOLO',
  tempGenerateMode: 'AUTO',
  tempType: '',
  templateDesc: '',
});

const rules = {
  templateName: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
  busClassId: [{ required: true, message: '请选择报告分类', trigger: 'change' }],
  templateTypeCode: [{ required: true, message: '请选择模板形式', trigger: 'change' }],
  tempGenerateMode: [{ required: true, message: '请选择生成方式', trigger: 'change' }],
  tempType: [{ required: true, message: '请选择生成周期', trigger: 'change' }],
};

function getData() {
  const data = cloneDeep(formData.value);
  data.templateTypeName = formData.value.templateTypeCode === 'MULTIPLE' ? '多级模板' : '单一模板';
  return data;
}

function setData(data: any) {
  Object.assign(formData.value, data);
}

function initData() {
  formData.value = {
    templateName: '',
    busClassId: '',
    templateTypeCode: 'SOLO',
    tempGenerateMode: 'AUTO',
    tempType: '',
    templateDesc: '',
  };
}

function validate() {
  return new Promise((resolve) => {
    form.value?.validate((valid: boolean) => {
      resolve(valid);
    });
  });
}

function onTemplateTypeCodeChange(v: string) {
  if (v === 'MULTIPLE') {
    formData.value.tempGenerateMode = 'MANUAL';
  }
}

defineExpose({
  getData,
  setData,
  initData,
  validate,
});
</script>
