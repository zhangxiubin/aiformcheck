<template>
  <div v-loading="loading" class="mras-pango-editor">
    <!-- 编辑器初始化容器 -->
    <div
      ref="editorContainer"
      :id="editorId"
      class="mras-pango-editor__container"
    ></div>
    <!-- 隐藏的文件输入，用于导入 XML -->
    <input
      ref="importTrigger"
      type="file"
      accept=".xml"
      class="mras-pango-editor__import-trigger"
      @change="handleImportXMLChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';

interface Props {
  editorContainerId?: string;
  instanceProps?: Record<string, unknown>;
}

interface Emits {
  (e: 'import-xml-success'): void;
  (e: 'import-xml-error'): void;
  (e: 'ready', editor: any): void;
}

const props = withDefaults(defineProps<Props>(), {
  instanceProps: () => ({ Adaptive: false }),
});

const emit = defineEmits<Emits>();

const editorContainer = ref<HTMLElement>();
const importTrigger = ref<HTMLInputElement>();
const loading = ref(false);
const editorId = props.editorContainerId || `mras-pango-editor-${Math.random().toString(36).substring(2, 9)}`;

// 编辑器实例（不放在 ref 中避免响应式）
let editorInstance: any = null;

const baseOptions = {
  updateCustomEvtGrp: {
    'CopyModel': '0'
  },
  // 粘贴前回调
  PasteBeforehandle: (text: string) => {
    if (text && text.length > 1000) {
      return new Promise((resolve) => {
        // 可以添加确认对话框
        setTimeout(() => {
          resolve(true);
        }, 200);
      });
    }
    return true;
  },
  // 操作栏插入图片回调
  CompressImgWithUpload: async (params: any) => {
    const isImage = params.type.startsWith('image/');
    if (!isImage) {
      console.warn('此文件不是图片，请检查文件格式！');
      return false;
    }
    // 图片压缩逻辑
    return params;
  }
};

onMounted(() => {
  initEditor();
  window.addEventListener('resize', handleWindowResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleWindowResize);
});

function initEditor() {
  // 检查 PangoEditor 是否加载
  if (typeof window.PangoEditor === 'undefined') {
    console.error('PangoEditor 未加载，请检查脚本是否正确引入');
    console.log('当前 window 对象包含的属性：', Object.keys(window).filter(k => k.includes('Pango') || k.includes('pango')));
    return;
  }

  try {
    const options = Object.assign({}, baseOptions, props.instanceProps);
    editorInstance = new (window as any).PangoEditor(editorContainer.value, options);
    emit('ready', editorInstance);
    console.log('PangoEditor 初始化成功', editorInstance);
  } catch (error) {
    console.error('PangoEditor 初始化失败:', error);
  }
}

function handleWindowResize() {
  if (editorInstance) {
    editorInstance.Resize();
  }
}

/**
 * 导入 XML 文件（调用后弹出文件选择）
 */
function importXML() {
  if (loading.value) return;
  importTrigger.value?.click();
}

/**
 * 导入 XML 字符串
 */
function importXMLString(xmlString: string, options: Record<string, unknown> = {}) {
  if (!editorInstance || !xmlString) return;

  editorInstance.postmessage({
    type: 'FileOpen',
    param: [{
      ...options,
      srcstr: xmlString
    }]
  });
}

/**
 * 导出 XML 文件
 */
function exportXML(filename?: string) {
  if (!editorInstance) return;

  if (filename && !filename.endsWith('.xml')) {
    filename = filename + '.xml';
  }

  editorInstance.postmessage({
    type: 'FileSaveAs',
    param: [`${filename || Date.now()}.xml}`]
  });
}

/**
 * 获取 XML 内容
 */
function getXML(encoded = false) {
  if (!editorInstance) return '';

  const xml = editorInstance.postmessage({
    type: 'LookUpXmlCode',
    param: [true]
  });

  if (encoded) {
    return btoa(unescape(encodeURIComponent(xml || '')));
  }
  return xml;
}

/**
 * 设置 XML 内容
 */
function setXML(xmlString: string, options: Record<string, unknown> = {}) {
  return importXMLString(xmlString, options);
}

/**
 * 获取编辑器实例
 */
function getEditor() {
  return editorInstance;
}

/**
 * 清空内容
 */
function clearContent() {
  if (!editorInstance) return;

  editorInstance.postmessage({
    type: 'FileNew',
    param: []
  });
}

/**
 * 导入 XML 文件变化处理
 */
function handleImportXMLChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  loading.value = true;

  const reader = new FileReader();
  reader.onload = (e) => {
    if (editorInstance) {
      editorInstance.postmessage({
        type: 'ImportDoc',
        param: e.target?.result
      });
    }
    target.value = '';
    loading.value = false;
    emit('import-xml-success');
  };

  reader.onabort = () => {
    target.value = '';
    loading.value = false;
    emit('import-xml-error');
  };

  reader.onerror = () => {
    target.value = '';
    loading.value = false;
    emit('import-xml-error');
  };

  reader.readAsText(file);
}

/**
 * 设置工作模式
 */
function setWorkMode(workMode: string) {
  if (!editorInstance) return;

  const modeMap: Record<string, string> = {
    'design': 'SetWorkMode_Design',
    'Design': 'SetWorkMode_Design',
    'app': 'SetWorkMode_App',
    'App': 'SetWorkMode_App',
    'form': 'SetWorkMode_Form',
    'Form': 'SetWorkMode_Form',
    'browse': 'SetWorkMode_Browse',
    'Browse': 'SetWorkMode_Browse',
    'view': 'SetWorkMode_Browse',
    'View': 'SetWorkMode_Browse',
    'print': 'SetPrintPreview',
    'printPreview': 'SetPrintPreview',
    'PrintPreview': 'SetPrintPreview'
  };

  const mappedMode = modeMap[workMode];
  if (!mappedMode) {
    console.warn('工作模式参数错误！支持的模式：design, app, form, browse, print');
    return;
  }

  editorInstance.postmessage({
    type: mappedMode,
    param: []
  });
}

/**
 * 获取工作模式
 */
function getWorkMode() {
  if (!editorInstance) return '';
  return editorInstance.WorkMode || '';
}

// 暴露方法供父组件调用
defineExpose({
  importXML,
  importXMLString,
  exportXML,
  getXML,
  setXML,
  getEditor,
  clearContent,
  setWorkMode,
  getWorkMode,
  getContent: getXML,
  setContent: setXML,
});
</script>

<style scoped>
.mras-pango-editor {
  width: 100%;
  height: 100%;
  position: relative;
}

.mras-pango-editor__container {
  width: 100%;
  height: 100%;
}

.mras-pango-editor__import-trigger {
  display: none;
}
</style>
