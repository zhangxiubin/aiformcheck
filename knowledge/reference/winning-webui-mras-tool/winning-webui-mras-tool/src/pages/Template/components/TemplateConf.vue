<template>
  <w-dialog
    v-model="dialogVisible"
    :title="title"
    width="900px"
    fullscreen
    :close-on-click-modal="false"
    @close="handleClose"
    @opened="onOpened"
  >
    <div class="template-conf-container">
      <!-- 左侧目录树 (仅多级模板显示) -->
      <div v-if="isMultipleTemplate" class="left-panel">
        <div class="panel-header">
          <span>目录列表</span>
          <w-button size="small" type="primary" @click="handleAddDir">
            新增目录
          </w-button>
        </div>
        <div class="panel-content">
          <w-tree
            :data="treeData"
            :props="treeProps"
            node-key="id"
            default-expand-all
            highlight-current
            @node-click="onNodeClick"
          />
        </div>
      </div>

      <!-- 中间编辑区 -->
      <div class="center-panel" :class="{ 'has-left': isMultipleTemplate }">
        <div class="panel-toolbar">
          <span class="current-node-name">{{ currentNodeName }}</span>
          <div class="toolbar-actions">
            <w-button size="small" @click="handlePreview">预览</w-button>
          </div>
        </div>
        <div class="editor-container">
          <MrasPangoEditor
            ref="mrasPangoEditor"
            :instance-props="pangoEditorProps"
            @ready="onEditorReady"
          />
        </div>
      </div>

      <!-- 右侧属性面板 -->
      <div class="right-panel">
        <div class="panel-header">模板属性</div>
        <div class="panel-content">
          <w-form
            ref="propFormRef"
            :model="propFormData"
            label-width="80px"
            label-position="top"
          >
            <w-form-item label="元素名称">
              <w-input v-model="propFormData.elementName" placeholder="输入元素名称" />
            </w-form-item>

            <w-form-item label="变量名称">
              <w-input v-model="propFormData.varName" placeholder="输入变量名" />
            </w-form-item>

            <w-form-item label="图表类型">
              <w-select v-model="propFormData.chartType" placeholder="选择图表类型">
                <w-option label="表格" value="table" />
                <w-option label="折线图" value="line" />
                <w-option label="柱状图" value="bar" />
                <w-option label="饼图" value="pie" />
              </w-select>
            </w-form-item>

            <w-form-item label="样式">
              <w-input
                v-model="propFormData.style"
                type="textarea"
                :rows="3"
                placeholder="输入样式，如：color: red; font-size: 14px;"
              />
            </w-form-item>

            <w-button type="primary" size="small" @click="handleApplyProps">
              应用属性
            </w-button>
          </w-form>
        </div>
      </div>
    </div>

    <template #footer>
      <w-button @click="handleClose">取消</w-button>
      <w-button type="primary" :loading="loading" @click="handleSave">
        保存
      </w-button>
    </template>
  </w-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Message } from 'spark';
import MrasPangoEditor from '@/components/MrasPangoEditor.vue';

interface TemplateNode {
  id: string;
  label: string;
  type: 'template' | 'directory';
  mrasQaTempId?: string;
  children?: TemplateNode[];
}

interface Template {
  mrasQaTempId: string;
  templateName: string;
  busClassId: string;
  templateTypeCode: string;
  tempGenerateMode: string;
  tempType: string;
  templateDesc: string;
  templateContent?: string;
}

interface Props {
  modelValue: boolean;
  toBeEdit: Template | null;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'success'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const mrasPangoEditor = ref();
const loading = ref(false);
const currentNodeName = ref('根模板');

const treeData = ref<TemplateNode[]>([
  {
    id: 'root',
    label: '根模板',
    type: 'template',
    mrasQaTempId: '',
    children: [],
  },
]);

const treeProps = {
  children: 'children',
  label: 'label',
};

const propFormData = ref({
  elementName: '',
  varName: '',
  chartType: '',
  style: '',
});

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const title = computed(() => {
  let t = '编辑报表模板';
  if (props.toBeEdit?.templateName) {
    t += `（${props.toBeEdit.templateName}）`;
  }
  return t;
});

const isMultipleTemplate = computed(() => {
  return props.toBeEdit?.templateTypeCode === 'MULTIPLE';
});

// PangoEditor 实例属性
const pangoEditorProps = {
  Adaptive: true
};

watch(() => props.modelValue, (val) => {
  if (val) {
    loadTemplateData();
  }
});

async function loadTemplateData() {
  if (!props.toBeEdit) return;

  // 等待编辑器初始化后再加载内容
  setTimeout(() => {
    if (mrasPangoEditor.value?.getEditor()) {
      // 加载模板内容
      const defaultContent = `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="http://www.winning.com.cn/pango" version="1.0">
  <Body>
    <Section>
      <Paragraph>
        <Text>{{reportTitle}}</Text>
      </Paragraph>
      <Paragraph>
        <Text>报告周期：{{reportPeriod}}</Text>
      </Paragraph>
      <Paragraph>
        <Text>生成时间：{{generateTime}}</Text>
      </Paragraph>
    </Section>
  </Body>
</Document>`;

      if (props.toBeEdit.templateContent) {
        mrasPangoEditor.value?.setXML(props.toBeEdit.templateContent);
      } else {
        mrasPangoEditor.value?.setXML(defaultContent);
      }
    }
  }, 500);

  // 如果是多级模板，加载目录树
  if (isMultipleTemplate.value) {
    loadTemplateTree();
  }
}

function onEditorReady(editor: any) {
  console.log('PangoEditor ready', editor);
}

function loadTemplateTree() {
  // 模拟目录树数据
  treeData.value = [
    {
      id: 'root',
      label: '根模板',
      type: 'template',
      mrasQaTempId: props.toBeEdit?.mrasQaTempId,
      children: [
        {
          id: 'section-1',
          label: '章节一：概述',
          type: 'template',
          children: [],
        },
        {
          id: 'section-2',
          label: '章节二：数据分析',
          type: 'template',
          children: [],
        },
      ],
    },
  ];
}

function onNodeClick(data: TemplateNode) {
  currentNodeName.value = data.label;
  // 这里可以加载对应节点的内容
}

function handleAddDir() {
  Message.info('新增目录功能待实现');
}

function handlePreview() {
  // 切换到预览模式
  mrasPangoEditor.value?.setWorkMode('printPreview');
}

function handleApplyProps() {
  Message.success('属性已应用');
  // 这里可以将属性应用到编辑器中的选中元素
}

async function handleSave() {
  loading.value = true;
  try {
    // 获取编辑器内容
    const content = mrasPangoEditor.value?.getXML() || '';
    console.log('保存模板内容:', content);

    // 模拟保存
    await new Promise(resolve => setTimeout(resolve, 500));
    Message.success('保存成功');
    emit('success');
    handleClose();
  } catch (error) {
    console.error('保存失败:', error);
  } finally {
    loading.value = false;
  }
}

function handleClose() {
  dialogVisible.value = false;
  currentNodeName.value = '根模板';
  propFormData.value = {
    elementName: '',
    varName: '',
    chartType: '',
    style: '',
  };
}

function onOpened() {
  loadTemplateData();
}
</script>

<style scoped>
.template-conf-container {
  display: flex;
  height: calc(100vh - 200px);
  gap: 8px;
}

.left-panel,
.right-panel {
  width: 240px;
  display: flex;
  flex-direction: column;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.center-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.center-panel.has-left {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.panel-header {
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 500;
}

.panel-content {
  flex: 1;
  overflow: auto;
  padding: 16px;
}

.panel-toolbar {
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.current-node-name {
  font-weight: 500;
  color: #333;
}

.toolbar-actions {
  display: flex;
  gap: 8px;
}

.editor-container {
  flex: 1;
  overflow: hidden;
  position: relative;
}
</style>
