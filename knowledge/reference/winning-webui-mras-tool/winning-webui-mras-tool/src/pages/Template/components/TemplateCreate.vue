<template>
  <w-dialog
    v-model="dialogVisible"
    title="新建模板"
    width="600px"
    :close-on-click-modal="false"
    @close="handleClose"
    @open="onOpen"
  >
    <TemplateBaseForm
      ref="templateBaseFormRef"
      label-position="right"
      label-width="90px"
    />

    <template #footer>
      <w-button :disabled="loading" @click="handleClose">取消</w-button>
      <w-button :loading="loading" type="primary" @click="handleSubmit">
        确定
      </w-button>
    </template>
  </w-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Message } from 'spark';
import TemplateBaseForm from './TemplateBaseForm.vue';

interface Props {
  modelValue: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'success'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const templateBaseFormRef = ref();
const loading = ref(false);

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

function onOpen() {
  templateBaseFormRef.value?.initData();
}

async function handleSubmit() {
  const valid = await templateBaseFormRef.value?.validate();
  if (!valid) return;

  loading.value = true;
  try {
    const data = templateBaseFormRef.value?.getData();
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 500));
    Message.success('保存成功');
    emit('success', data);
    handleClose();
  } catch (error) {
    console.error('保存失败:', error);
  } finally {
    loading.value = false;
  }
}

function handleClose() {
  dialogVisible.value = false;
}
</script>
