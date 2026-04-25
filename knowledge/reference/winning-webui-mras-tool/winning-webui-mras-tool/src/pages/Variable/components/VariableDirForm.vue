<template>
  <w-dialog
    v-model="dialogVisible"
    :title="isEdit ? '编辑变量目录' : '新增变量目录'"
    width="500px"
    @confirm="handleSubmit"
  >
    <w-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
    >
      <w-form-item label="目录名称" prop="vaclassName">
        <w-input
          v-model="formData.vaclassName"
          placeholder="请输入目录名称"
        />
      </w-form-item>

      <w-form-item label="数据源配置" prop="mrasDataSourceConfigId">
        <w-input
          v-model="formData.mrasDataSourceConfigId"
          placeholder="请输入数据源配置ID"
        />
      </w-form-item>
    </w-form>
  </w-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Message } from 'spark';

interface VariableDirItem {
  mrasQaValclassId: string;
  vaclassName: string;
  mrasDataSourceConfigId?: string;
}

interface Props {
  modelValue: boolean;
  action: 'add' | 'edit';
  toBeEdit: VariableDirItem | null;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'success'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const formRef = ref();
const formData = ref({
  vaclassName: '',
  mrasDataSourceConfigId: '',
  mrasQaValclassId: '',
});

const formRules = {
  vaclassName: [{ required: true, message: '请输入目录名称', trigger: 'blur' }],
  mrasDataSourceConfigId: [{ required: true, message: '请输入数据源配置ID', trigger: 'blur' }],
};

const isEdit = computed(() => props.action === 'edit');

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

// 监听对话框打开，初始化表单数据
watch(() => props.modelValue, (val) => {
  if (val) {
    if (isEdit.value && props.toBeEdit) {
      formData.value = {
        vaclassName: props.toBeEdit.vaclassName,
        mrasDataSourceConfigId: props.toBeEdit.mrasDataSourceConfigId || '',
        mrasQaValclassId: props.toBeEdit.mrasQaValclassId,
      };
    } else {
      resetForm();
    }
  }
});

async function handleSubmit() {
  if (!formRef.value) return;

  const valid = await formRef.value.validate();
  if (!valid) return;

  // 模拟 API 调用
  const res = { success: true };
  if (res.success) {
    Message.success(isEdit.value ? '编辑成功' : '新增成功');
    emit('success');
    dialogVisible.value = false;
    resetForm();
  }
}

function resetForm() {
  formData.value = {
    vaclassName: '',
    mrasDataSourceConfigId: '',
    mrasQaValclassId: '',
  };
  formRef.value?.clearValidate();
}
</script>

<style scoped>
/* Form styles handled by win-design */
</style>
