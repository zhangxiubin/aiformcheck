<template>
  <w-dialog
    v-model="dialogVisible"
    :title="isEdit ? '编辑变量' : '新增变量'"
    width="600px"
    :before-close="handleClose"
    @confirm="handleSubmit"
  >
    <w-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
    >
      <w-form-item label="变量名称" prop="mrasQaUservarName">
        <w-input
          v-model.trim="formData.mrasQaUservarName"
          placeholder="请输入变量名称"
          :disabled="loading"
        />
      </w-form-item>

      <w-form-item label="变量字段" prop="mrasQaUservarNo">
        <w-input
          v-model.trim="formData.mrasQaUservarNo"
          placeholder="请输入变量字段（字母、数字、下划线）"
          :disabled="loading"
        />
      </w-form-item>

      <w-form-item label="变量描述" prop="mrasQaUservarDesc">
        <w-input
          v-model.trim="formData.mrasQaUservarDesc"
          type="textarea"
          :rows="3"
          placeholder="请输入变量描述"
          :disabled="loading"
        />
      </w-form-item>

      <w-form-item label="变量类型" prop="mrasQaUservarType">
        <w-select
          v-model="formData.mrasQaUservarType"
          placeholder="请选择变量类型"
          :disabled="loading"
          clearable
        >
          <w-option
            v-for="option in varTypeOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </w-select>
      </w-form-item>

      <w-form-item label="数据类型" prop="userdataType">
        <w-select
          v-model="formData.userdataType"
          placeholder="请选择数据类型"
          disabled
          clearable
        >
          <w-option
            v-for="option in dataTypeOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </w-select>
      </w-form-item>

      <template v-if="formData.userdataType === 'SQL'">
        <w-form-item label="公版SQL" prop="publicSql">
          <w-input
            v-model="formData.publicSql"
            type="textarea"
            :rows="4"
            placeholder="请输入公版SQL"
            :disabled="loading"
          />
        </w-form-item>

        <w-form-item label="现场SQL" prop="proSql">
          <w-input
            v-model="formData.proSql"
            type="textarea"
            :rows="4"
            placeholder="请输入现场SQL"
            :disabled="loading"
          />
        </w-form-item>
      </template>
    </w-form>
  </w-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Message } from 'spark';

interface VariableDir {
  mrasQaValclassId: string;
  mrasDataSourceConfigId?: string;
}

interface VariableItem {
  mrasQaUservarId?: string;
  mrasQaUservarName: string;
  mrasQaUservarNo: string;
  mrasQaUservarDesc?: string;
  mrasQaUservarType: string;
  userdataType?: string;
  publicSql?: string;
  proSql?: string;
}

interface Props {
  modelValue: boolean;
  varDir: VariableDir | null;
  toBeEdit?: VariableItem | null;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'success'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const formRef = ref();
const loading = ref(false);

// 变量类型选项
const varTypeOptions = [
  { value: 'NORMAL', label: '普通变量' },
  { value: 'SYSTEM', label: '系统变量' },
  { value: 'CUSTOM', label: '自定义变量' },
];

// 数据类型选项
const dataTypeOptions = [
  { value: 'SQL', label: 'SQL' },
];

const formData = ref<VariableItem>({
  mrasQaUservarId: '',
  mrasQaUservarName: '',
  mrasQaUservarNo: '',
  mrasQaUservarDesc: '',
  mrasQaUservarType: 'NORMAL',
  userdataType: 'SQL',
  publicSql: '',
  proSql: '',
});

const formRules = {
  mrasQaUservarName: [{ required: true, message: '请输入变量名称', trigger: 'blur' }],
  mrasQaUservarNo: [
    { required: true, message: '请输入变量字段', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z_$][a-zA-Z0-9_$]*$/,
      message: '必须以字母、下划线或$开头，只能包含字母、数字、下划线或$',
      trigger: 'blur',
    },
  ],
  mrasQaUservarType: [{ required: true, message: '请选择变量类型', trigger: 'change' }],
  userdataType: [{ required: true, message: '请选择数据类型', trigger: 'change' }],
};

const isEdit = computed(() => !!props.toBeEdit);

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

// 监听对话框打开，初始化表单数据
watch(() => props.modelValue, (val) => {
  if (val) {
    if (isEdit.value && props.toBeEdit) {
      formData.value = {
        mrasQaUservarId: props.toBeEdit.mrasQaUservarId || '',
        mrasQaUservarName: props.toBeEdit.mrasQaUservarName,
        mrasQaUservarNo: props.toBeEdit.mrasQaUservarNo,
        mrasQaUservarDesc: props.toBeEdit.mrasQaUservarDesc || '',
        mrasQaUservarType: props.toBeEdit.mrasQaUservarType,
        userdataType: props.toBeEdit.userdataType || 'SQL',
        publicSql: props.toBeEdit.publicSql || '',
        proSql: props.toBeEdit.proSql || '',
      };
    } else {
      resetForm();
    }
    formRef.value?.clearValidate();
  }
});

async function handleSubmit() {
  if (!formRef.value) return;

  const valid = await formRef.value.validate();
  if (!valid) return;

  loading.value = true;
  try {
    // 模拟 API 调用
    // const res = await updateAIVariable({
    //   ...formData.value,
    //   mrasQaValclassId: props.varDir?.mrasQaValclassId,
    //   mrasDataSourceConfigId: props.varDir?.mrasDataSourceConfigId,
    //   enabledFlag: 98360,
    // });

    // 模拟成功
    await new Promise(resolve => setTimeout(resolve, 500));
    Message.success(isEdit.value ? '编辑成功' : '新增成功');
    emit('success');
    handleClose();
  } catch (error) {
    console.error('Failed to save variable:', error);
  } finally {
    loading.value = false;
  }
}

function handleClose() {
  dialogVisible.value = false;
  resetForm();
}

function resetForm() {
  formData.value = {
    mrasQaUservarId: '',
    mrasQaUservarName: '',
    mrasQaUservarNo: '',
    mrasQaUservarDesc: '',
    mrasQaUservarType: 'NORMAL',
    userdataType: 'SQL',
    publicSql: '',
    proSql: '',
  };
}
</script>

<style scoped>
/* Form styles handled by win-design */
</style>
