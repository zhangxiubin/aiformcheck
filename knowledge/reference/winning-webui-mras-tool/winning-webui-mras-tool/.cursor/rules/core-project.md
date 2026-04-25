# Spark 框架开发规则手册

> **适用范围**：本规则适用于所有基于 Spark 框架的 Vue3 项目开发  
> **强制级别**：所有开发者与 AI 编程工具（Cursor/Claude）必须严格遵守  
> **最后更新**：2025-12-09

---

## 📋 目录

- [0. AI 编程工具权限约束](#0-ai-编程工具权限约束)
- [1. 项目配置规范](#1-项目配置规范)
- [2. 目录结构规范](#2-目录结构规范)
- [3. 代码编写规范](#3-代码编写规范)
- [4. 依赖管理规范](#4-依赖管理规范)
- [5. Spark 框架 API 使用](#5-spark-框架-api-使用)
- [6. 接口请求规范](#6-接口请求规范)
- [7. Mock 数据规范](#7-mock-数据规范)
- [8. 规则级别说明](#8-规则级别说明)
---

## 0. AI 编程工具权限约束

### 0.1 文件修改权限（最高优先级）

**🚨 AI 编程工具（Cursor/Claude）仅允许修改以下路径：**

```
✅ 允许修改：
src/pages/**/*           # pages 目录下的所有文件
mock/**/*                # mock 目录下的所有文件
```

**❌ 严格禁止修改以下文件/目录：**

```
❌ 禁止修改：
❌ 禁止修改：
.sparkrc.ts              # 框架配置文件
tsconfig.json            # TypeScript 配置
typings.d.ts             # 类型声明文件
package.json             # 依赖配置文件
src/global.ts            # 全局配置
src/global.scss          # 全局样式
src/app.ts               # 应用入口配置
src/*                    # src 根目录下除 pages 外的所有文件/目录
```

### 0.2 权限说明

**这是最高优先级规则，覆盖本文档所有其他规则。**

- **业务逻辑开发**：AI 只能在 `src/pages/` 目录下进行
- **Mock 数据**：AI 可以在 `mock/` 目录下创建和修改 Mock 文件
- **框架配置**：由人工开发者或架构组负责
- **全局配置**：不允许 AI 修改，避免影响整体架构

### 0.3 异常处理

如果 AI 检测到需要修改禁止区域的文件才能完成任务：

1. **停止操作**：不得修改禁止文件
2. **提示用户**：明确说明需要修改哪个文件以及原因
3. **建议方案**：提供在 `pages` 目录内的替代实现方案

**示例提示**：
```
⚠️ 检测到需要修改 `src/app.ts` 以注册全局组件。
根据项目规则，AI 无权修改此文件。

建议方案：
1. 在 `src/pages/YourModule/` 内局部注册组件
2. 或联系架构组协助修改全局配置

是否继续使用局部注册方案？
```

---

## 1. 项目配置规范

### 1.1 框架要求（强制）

- ✅ **必须使用 Spark 框架**
- ✅ 配置文件**必须命名为** `.sparkrc.ts`
- ❌ **禁止**使用其他构建配置文件（如 `vue.config.js`、`vite.config.ts`）

### 1.2 `.sparkrc.ts` 配置模板

```typescript
import { defineConfig } from 'spark';

export default defineConfig({
  base: process.env.VUE_APP_MODULE_NAME,
  publicPath: process.env.VUE_APP_MODULE_NAME,
  vue: {},
  locale: {
    defaultLocale: 'zh_CN',
    separator: '_',
  },
});
```

**强制要点**：
- 使用 `defineConfig` 导出
- `base` 与 `publicPath` 基于 `VUE_APP_MODULE_NAME`
- 开启 Vue3 运行时

---

## 2. 目录结构规范

### 2.1 根目录必备文件（强制）

```
project-root/
├── .sparkrc.ts          ✅ 必须存在
├── tsconfig.json        ✅ 必须存在
├── typings.d.ts         ✅ 必须存在
├── package.json         ✅ 必须存在
└── src/
    ├── global.ts        ✅ 必须存在
    ├── global.scss      ✅ 必须存在
    ├── app.ts           ✅ 必须存在
    └── pages/           ✅ 必须存在
```

**缺失任一项视为不合规**

### 2.2 `pages` 目录组织规则

```
src/pages/
├── Home/                    # 业务模块目录
│   ├── apis/               # 接口定义
│   ├── assets/             # 模块资源文件
│   ├── components/         # 模块组件
│   ├── composables/        # 组合式函数
│   ├── stores/             # 状态管理
│   ├── tests/              # 测试文件
│   ├── asyncImport.ts      # 本模块的跨模块引用管理
│   ├── index.spec.ts       # 单元测试
│   ├── index.vue           # 模块入口组件
│   └── index2.spec.ts      # 其他测试
└── ModuleB/
    ├── apis/
    ├── components/
    ├── asyncImport.ts      # 本模块的跨模块引用管理
    └── index.vue
```

**目录结构规范**：

| 目录/文件 | 说明 | 是否必需 |
|-----------|------|----------|
| `apis/` | 模块相关的 API 接口定义 | 可选 |
| `assets/` | 模块专属的静态资源（图片、字体等） | 可选 |
| `components/` | 模块内部组件 | 可选 |
| `composables/` | Vue 组合式函数（hooks） | 可选 |
| `stores/` | 模块状态管理（Pinia stores） | 可选 |
| `tests/` | 测试相关文件 | 可选 |
| `asyncImport.ts` | 本模块引用其他模块的统一管理文件 | 按需 |
| `index.vue` | 模块入口页面 | **必需** |
| `*.spec.ts` | 单元测试文件 | 可选 |

**规则**：
- 模块内引用：使用相对路径
- 跨模块引用：必须在**本模块的** `asyncImport.ts` 中统一管理
- 每个模块必须有 `index.vue` 作为入口
- 子目录按功能分类，保持结构清晰

### 2.3 模块内部文件组织规范

#### apis/ - API 接口层
```typescript
// src/pages/Home/apis/user.ts
import { request } from 'spark';

export const userApi = {
  getUserList: () => request.get('/api/users'),
  createUser: (data: UserDTO) => request.post('/api/user', data),
};
```

#### composables/ - 组合式函数
```typescript
// src/pages/Home/composables/useUserList.ts
import { ref } from 'vue';
import { userApi } from '../apis/user';

export function useUserList() {
  const users = ref([]);
  const loading = ref(false);
  
  const fetchUsers = async () => {
    loading.value = true;
    try {
      users.value = await userApi.getUserList();
    } finally {
      loading.value = false;
    }
  };
  
  return { users, loading, fetchUsers };
}
```

#### stores/ - 状态管理
```typescript
// src/pages/Home/stores/user.ts
import { defineStore } from 'pinia';

export const useUserStore = defineStore('home-user', {
  state: () => ({
    currentUser: null,
  }),
  actions: {
    setUser(user) {
      this.currentUser = user;
    },
  },
});
```

#### components/ - 模块组件
```vue
<!-- src/pages/Home/components/UserCard.vue -->
<template>
  <div class="user-card">
    <h3>{{ user.name }}</h3>
  </div>
</template>

<script setup lang="ts">
interface Props {
  user: User;
}

const props = defineProps<Props>();
</script>
```

### 2.4 跨模块引用规范（强制）

**❌ 错误示例**：
```typescript
// 在 Home 模块的文件中直接引用 ModuleB
import SomeComponent from '@/pages/ModuleB/components/SomeComponent.vue';
```

**✅ 正确示例**：

每个模块在需要引用其他模块时，在**本模块内**创建 `asyncImport.ts`：

```typescript
// src/pages/Home/asyncImport.ts
// Home 模块需要引用其他模块的内容，在这里统一管理

const PgEditor = () => import('@/pages/PgEditor/index.vue');
const pdfEditor = () => import('@/pages/EmrEditor/components/PdfEditor.vue');
const MedicalRecordContainer = () =>
  import('@/pages/MedicalRecordContainer/index.vue');

export {
  MedicalRecordContainer,
  PgEditor,
  pdfEditor,
};
```

然后在 Home 模块内使用：
```typescript
<!-- src/pages/Home/SomePage.vue -->
<script setup lang="ts">
// 从本模块的 asyncImport 导入
import { PgEditor, pdfEditor } from './asyncImport';

const PgEditorCom = await PgEditor();
const PdfEditorCom = await pdfEditor();
</script>
```

**关键规则**：
- ✅ 每个模块有自己的 `asyncImport.ts`（如果需要引用其他模块）
- ✅ `asyncImport.ts` 使用绝对路径 `@/pages/...` 导入
- ✅ 业务文件从同目录的 `./asyncImport` 导入
- ❌ 禁止在业务文件中直接跨模块 import


2.5 mock 目录组织规则

mock/
├── home.ts                 # Home 模块的 mock 数据
├── user.ts                 # User 模块的 mock 数据
├── order.ts                # Order 模块的 mock 数据
└── common.ts               # 公共 mock 数据

规则：

- 每个 src/pages/ 下的模块对应一个 mock 文件
- Mock 文件命名与模块名对应（小写+连字符）
- 公共的 mock 数据放在 common.ts
---

## 3. 代码编写规范

### 3.1 `app.ts` 导出限制（强制）

**只能导出以下钩子函数**：
- `onAppCreated`
- `ark`
- `onRouterCreated`
- `layout`

**❌ 禁止**：
```typescript
// 禁止导出普通函数
export function myUtil() {}

// 禁止导出常量
export const APP_CONFIG = {};

// 禁止导出初始化逻辑
export const initApp = () => {};
```

### 3.2 Vue 组件编写规范（强制）

**必须使用 Composition API**：
```vue
<template>
  <div>{{ message }}</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// ✅ 正确：使用 script setup + TypeScript
const message = ref<string>('Hello');
</script>
```

**❌ 禁止**：
- Options API
- 混用 setup + Options API
- 缺少 `lang="ts"`

### 3.3 TypeScript 类型规范（强制）

```typescript
// ✅ 正确：完整类型定义
interface Props {
  title: string;
  count: number;
}

const props = defineProps<Props>();

const emits = defineEmits<{
  change: [value: number];
}>();

// ❌ 禁止使用 any
const data: any = {};  // 错误

// ❌ 禁止隐式类型
const result = fetchData();  // 缺少返回类型声明
```

**强约束**：
- Props、emits、函数返回值必须显式声明类型
- 禁止使用 `any`
- 禁止隐式类型推断

### 3.4 多语言调用规则（强制）

```vue
<template>
  <!-- ✅ 模板中使用 $t -->
  <div>{{ $t('common.save') }}</div>
</template>

<script setup lang="ts">
import { t } from 'spark';

// ✅ script 中使用 t
const message = t('common.cancel');

// ❌ 禁止自定义 i18n 实例
import { useI18n } from 'vue-i18n';  // 错误
</script>
```

### 3.5 UI 组件库规范（强制）

**🚨 组件库使用硬性规则**：

- ✅ **只能使用** `win-design` 组件库
- ✅ 组件标签必须以 `<w-` 开头（小写）
- ✅ 框架已全局注册，开箱即用
- ❌ **严格禁止**使用任何其他 UI 组件库
- ❌ **严格禁止**手动注册组件
- ❌ **严格禁止**手动导入组件

#### 3.5.1 Template 标签规范（强制）

**`<template>` 中只允许出现两类标签**：

1. **原生 HTML 标签**：`<div>`, `<span>`, `<p>`, `<input>`, `<button>`, `<img>`, `<a>`, `<ul>`, `<li>` 等
2. **win-design 组件**：以 `<w-` 开头的标签

**✅ 正确示例**：

```vue
<template>
  <!-- ✅ 原生 HTML 标签 -->
  <div class="container">
    <h1>标题</h1>
    <p>这是一段文本</p>
    
    <!-- ✅ win-design 组件 -->
    <w-button type="primary" @click="handleClick">提交</w-button>
    <w-input v-model="username" placeholder="请输入用户名" />
    
    <!-- ✅ 混合使用 -->
    <div class="form-wrapper">
      <w-form :model="form" :rules="rules">
        <w-form-item label="用户名" prop="username">
          <w-input v-model="form.username" />
        </w-form-item>
      </w-form>
    </div>
  </div>
</template>
```

**❌ 错误示例**：

```vue
<template>
  <!-- ❌ 错误：使用其他 UI 库组件 -->
  <el-button>按钮</el-button>
  <a-table :data="data" />
  <van-cell title="单元格" />
  
  <!-- ❌ 错误：自定义组件标签（应该通过组件导入使用） -->
  <my-custom-component />
  <UserCard />
  
  <!-- ❌ 错误：大写的 win-design 标签 -->
  <W-Button>按钮</W-Button>
  
  <!-- ❌ 错误：错误的前缀 -->
  <win-button>按钮</win-button>
</template>
```

**自定义业务组件的使用方式**：

```vue
<template>
  <div>
    <!-- ✅ 正确：自定义组件通过 script 导入后使用 -->
    <user-card :data="userData" />
    <custom-table :list="tableData" />
  </div>
</template>

<script setup lang="ts">
// 自定义组件需要在 script 中导入
import UserCard from './components/UserCard.vue';
import CustomTable from './components/CustomTable.vue';
</script>
```

#### 3.5.2 组件选择优先级原则

🎯 **核心原则**：优先使用 win-design 组件库匹配设计图功能

**流程**：
```
设计图分析
    ↓
识别UI功能模块
    ↓
查阅 win-design.md 查找匹配组件
    ↓
    ├─ 找到 → 使用 win-design 组件
    └─ 没找到 → 确认是否可组合实现
            ├─ 可组合 → 使用多个组件组合
            └─ 不可组合 → 自定义（需说明原因）
```

#### 3.5.3 常见设计元素与组件映射表

| 设计图元素 | win-design 组件 | 使用场景 |
|-----------|----------------|---------|
| 表格/数据列表 | `<w-table>` | 用户列表、订单列表 |
| 表单 | `<w-form>`, `<w-form-item>` | 登录表单、信息编辑 |
| 标签页/Tab切换 | `<w-tabs>`, `<w-tab-pane>` | 多内容区域切换 |
| 下拉选择器 | `<w-select>`, `<w-option>` | 状态筛选、类别选择 |
| 日期选择 | `<w-date-picker>` | 时间范围筛选 |
| 弹窗/对话框 | `<w-dialog>`, `<w-modal>` | 确认提示、表单编辑 |
| 分页器 | `<w-pagination>` | 列表分页 |
| 按钮 | `<w-button>` | 提交、取消、操作 |
| 输入框 | `<w-input>` | 文本输入 |
| 开关 | `<w-switch>` | 启用/禁用 |
| 树形控件 | `<w-tree>` | 组织架构、菜单 |
| 步骤条 | `<w-steps>` | 流程引导 |
| 卡片 | `<w-card>` | 信息展示 |
| 上传 | `<w-upload>` | 文件上传 |

#### 3.5.4 实战示例：用户管理页面

```vue
<template>
  <div class="user-management">
    <!-- 搜索区：w-form -->
    <w-form :model="searchForm" inline>
      <w-form-item label="关键词">
        <w-input v-model="searchForm.keyword" />
      </w-form-item>
      <w-form-item label="状态">
        <w-select v-model="searchForm.status">
          <w-option label="全部" value="" />
          <w-option label="启用" value="1" />
        </w-select>
      </w-form-item>
      <w-button type="primary" @click="search">搜索</w-button>
    </w-form>
    
    <!-- 操作区：w-button -->
    <w-button type="primary" @click="handleAdd">新增</w-button>
    
    <!-- 表格区：w-table -->
    <w-table :data="tableData" :columns="columns" />
    
    <!-- 分页区：w-pagination -->
    <w-pagination v-model:current="page" :total="total" />
    
    <!-- 弹窗：w-dialog + w-form -->
    <w-dialog v-model="visible" title="编辑用户">
      <w-form :model="formData">
        <w-form-item label="姓名">
          <w-input v-model="formData.name" />
        </w-form-item>
      </w-form>
    </w-dialog>
  </div>
</template>
```

#### 3.5.5 组件 API 使用规范

**所有 win-design 组件的 API（属性、事件、插槽）必须严格参考 `win-design.md` 文档。**

**查阅文档的优先级**：
1. 📄 优先查阅项目内的 `./cursor/win-design.md` 文档
2. 🌐 如文档不全，访问 win-design 官方文档
3. ⚠️ 不确定的 API 不要随意使用，避免运行时错误

**✅ 正确用法示例**：

```vue
<template>
  <!-- 根据 win-design.md 文档使用正确的属性 -->
  <w-button 
    type="primary" 
    size="medium"
    :loading="loading"
    :disabled="disabled"
    @click="handleSubmit"
  >
    提交
  </w-button>
  
  <w-table 
    :data="tableData"
    :columns="columns"
    :pagination="pagination"
    @selection-change="handleSelectionChange"
  />
  
  <w-form 
    ref="formRef"
    :model="formData"
    :rules="formRules"
    label-width="100px"
  >
    <w-form-item label="用户名" prop="username">
      <w-input v-model="formData.username" clearable />
    </w-form-item>
  </w-form>
</template>
```

**❌ 常见错误**：

```vue
<template>
  <!-- ❌ 错误：使用不存在的属性 -->
  <w-button color="blue">按钮</w-button>
  
  <!-- ❌ 错误：使用其他 UI 库的 API -->
  <w-table stripe border>表格</w-table>
  
  <!-- ❌ 错误：事件名称错误 -->
  <w-input @input-change="handleChange" />
</template>
```

#### 3.5.6 完整使用示例

```vue
<template>
  <div class="page-container">
    <!-- 搜索表单 -->
    <div class="search-form">
      <w-form :model="searchForm" inline>
        <w-form-item label="关键词">
          <w-input 
            v-model="searchForm.keyword" 
            placeholder="请输入关键词"
            clearable
          />
        </w-form-item>
        <w-form-item label="状态">
          <w-select v-model="searchForm.status" placeholder="请选择">
            <w-option label="全部" value="" />
            <w-option label="启用" value="1" />
            <w-option label="禁用" value="0" />
          </w-select>
        </w-form-item>
        <w-form-item>
          <w-button type="primary" @click="handleSearch">查询</w-button>
          <w-button @click="handleReset">重置</w-button>
        </w-form-item>
      </w-form>
    </div>
    
    <!-- 操作按钮 -->
    <div class="toolbar">
      <w-button type="primary" @click="handleAdd">新增</w-button>
      <w-button type="danger" :disabled="!selectedIds.length">批量删除</w-button>
    </div>
    
    <!-- 数据表格 -->
    <w-table
      :data="tableData"
      :columns="columns"
      :loading="loading"
      row-key="id"
      @selection-change="handleSelectionChange"
    />
    
    <!-- 分页 -->
    <div class="pagination">
      <w-pagination
        v-model:current="pagination.current"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        @change="handlePageChange"
      />
    </div>
    
    <!-- 编辑弹窗 -->
    <w-dialog
      v-model="dialogVisible"
      title="编辑信息"
      width="600px"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    >
      <w-form ref="formRef" :model="formData" :rules="formRules">
        <w-form-item label="名称" prop="name">
          <w-input v-model="formData.name" />
        </w-form-item>
        <w-form-item label="描述" prop="description">
          <w-input v-model="formData.description" type="textarea" />
        </w-form-item>
      </w-form>
    </w-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

// ✅ 无需导入任何 win-design 组件
const loading = ref(false);
const tableData = ref([]);
const dialogVisible = ref(false);
const selectedIds = ref<string[]>([]);

const searchForm = reactive({
  keyword: '',
  status: '',
});

const formData = reactive({
  name: '',
  description: '',
});

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
});

const handleSearch = () => {
  // 查询逻辑
};

const handleSelectionChange = (selection: any[]) => {
  selectedIds.value = selection.map(item => item.id);
};
</script>
```

**禁止的组件库列表**：

```
❌ Element Plus (el-)
❌ Ant Design Vue (a-)
❌ Vant (van-)
❌ Naive UI (n-)
❌ Arco Design (arco-)
❌ TDesign (t-)
❌ View UI Plus (i-)
❌ Quasar (q-)
❌ Vuetify (v-)
❌ PrimeVue (p-)
❌ 任何其他第三方 UI 组件库
```

**常用 win-design 组件速查**：

| 组件类型 | 标签 | 说明 |
|---------|------|------|
| 按钮 | `<w-button>` | 参考 win-design.md 中的 Button 组件 |
| 输入框 | `<w-input>` | 参考 win-design.md 中的 Input 组件 |
| 表格 | `<w-table>` | 参考 win-design.md 中的 Table 组件 |
| 表单 | `<w-form>`, `<w-form-item>` | 参考 win-design.md 中的 Form 组件 |
| 弹窗 | `<w-dialog>`, `<w-modal>` | 参考 win-design.md 中的 Dialog 组件 |
| 下拉选择 | `<w-select>`, `<w-option>` | 参考 win-design.md 中的 Select 组件 |
| 日期选择 | `<w-date-picker>` | 参考 win-design.md 中的 DatePicker 组件 |
| 分页 | `<w-pagination>` | 参考 win-design.md 中的 Pagination 组件 |
| 消息提示 | `<w-message>` | 参考 win-design.md 中的 Message 组件 |
| 布局 | `<w-row>`, `<w-col>` | 参考 win-design.md 中的 Layout 组件 |

**📖 重要提示**：使用任何 win-design 组件前，必须先查阅 `win-design.md` 文档，确认该组件支持的属性、事件和插槽。

---

## 4. 依赖管理规范

### 4.1 禁止依赖列表（强制）

**❌ 业务仓库禁止安装以下依赖**（框架已内置）：

```json
{
  "禁止依赖": [
    "vue",
    "vue-router",
    "pinia",
    "vuex",
    "qiankun",
    "win-design",
    "win-design-next",
    "element-plus",
    "element-ui",
    "ant-design-vue",
    "vant",
    "naive-ui",
    "arco-design-vue",
    "tdesign-vue-next",
    "view-ui-plus",
    "quasar",
    "vuetify",
    "primevue",
    "@winex-plugin/win-dict",
    "@winex-plugin/win-request",
    "@winex-plugin/win-ebus",
    "dayjs",
    "js-cookie",
    "js-base64",
    "@vue/use",
    "lodash-es",
    "moment"
  ]
}
```

### 4.2 工具库使用规范

| 功能 | ❌ 禁止 | ✅ 使用方式 |
|------|---------|------------|
| 对象/数组处理 | `lodash` | `import { utils } from 'spark'` |
| 时间处理 | `moment` | `utils.date.dayjs()` |
| Cookie 操作 | 直接依赖 | `utils.cookie.*` |
| Base64 编码 | 直接依赖 | `utils.base64.*` |
| 路由 | `vue-router` | Spark 框架提供 |
| 状态管理 | `pinia`/`vuex` | Spark 框架提供 |
| 微前端 | `qiankun` | `import { micro } from 'spark'` |

### 4.3 框架职责边界（强制）

**以下内容禁止出现在业务代码**：

```typescript
// ❌ 禁止：Vue 初始化
import { createApp } from 'vue';
const app = createApp(App);

// ❌ 禁止：Router 初始化
import { createRouter } from 'vue-router';
const router = createRouter({...});

// ❌ 禁止：Pinia 初始化
import { createPinia } from 'pinia';
const pinia = createPinia();

// ❌ 禁止：插件注册
app.use(somePlugin);

// ❌ 禁止：微前端注册
registerMicroApps([...]);
```

**✅ 以上全部由 Spark 框架统一处理**

---

## 5. Spark 框架 API 使用

### 5.1、接口请求规范

#### 5.1.1 Request 导入（强制）

```typescript
import { request } from 'spark';
```

❌ 禁止使用 axios 或其他 HTTP 库

#### 5.1.2 请求方法约定

**默认使用 POST，除非特殊说明**

```typescript
// ✅ 默认 POST
const result = await request('/api/user/save', {
  data: userData
});

// ✅ 特殊情况明确 GET
const users = await request('/api/users', {
  method: 'GET'
});
```

#### 5.1.3 TypeScript 类型定义

```typescript
// 响应结构
interface IRequestResponse<T = any> {
  success: boolean;
  errorDetail: any;
  data: T;
  count?: string | number;
  traceid: string;
  hostip: string;
  hostport: string;
  warnCode?: string;
  warnMsg?: string;
}

// Request 方法类型
interface IRequest {
  <T = any>(url: string, opts?: IRequestOptions): Promise<IRequestResponse<T>>;
}
```

#### 5.1.4 实战示例：用户 API 封装

```typescript
// src/pages/User/apis/user.ts
import { request, type IRequestResponse } from 'spark';

export interface UserDTO {
  id?: string;
  name: string;
  email: string;
  age: number;
}

export const userApi = {
  // 获取列表（POST）
  getUserList: async (query: any): Promise<IRequestResponse<UserDTO[]>> => {
    return request<UserDTO[]>('/api/user/list', {
      data: query
    });
  },

  // 保存用户（POST）
  saveUser: async (user: UserDTO): Promise<IRequestResponse<string>> => {
    return request<string>('/api/user/save', {
      data: user
    });
  },

  // 删除用户（POST）
  deleteUser: async (id: string): Promise<IRequestResponse<boolean>> => {
    return request<boolean>('/api/user/delete', {
      data: { id }
    });
  }
};
```

#### 5.1.5 在组件中使用

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { userApi } from './apis/user';

const tableData = ref([]);

const fetchUsers = async () => {
  const result = await userApi.getUserList({ page: 1 });
  if (result.success) {
    tableData.value = result.data;
  }
};

const handleSave = async (userData) => {
  const result = await userApi.saveUser(userData);
  if (result.success) {
    console.log('保存成功, ID:', result.data);
  }
};
</script>
```

---

### 5.2 工具集（utils）

#### 字符串处理
```typescript
import { utils } from 'spark';

utils.string.camelCase('hello_world');  // 'helloWorld'
utils.string.kebabCase('helloWorld');   // 'hello-world'
utils.string.trim('  hello  ');         // 'hello'
```

#### 对象操作
```typescript
const picked = utils.object.pick({ a: 1, b: 2, c: 3 }, ['a', 'c']);
// { a: 1, c: 3 }

const merged = utils.object.merge(obj1, obj2);
const cloned = utils.object.cloneDeep(original);
```

#### 数组操作
```typescript
const chunked = utils.array.chunk([1, 2, 3, 4, 5], 2);
// [[1, 2], [3, 4], [5]]

const sorted = utils.array.orderBy(users, ['age', 'name'], ['desc', 'asc']);
```

#### 函数工具
```typescript
const debouncedFn = utils.func.debounce(() => {
  console.log('called');
}, 300);

const throttledFn = utils.func.throttle(() => {
  console.log('called');
}, 1000);
```

#### 日期处理
```typescript
const today = utils.date.dayjs().format('YYYY-MM-DD');
const tomorrow = utils.date.dayjs().add(1, 'day');
```

#### 加密与编码
```typescript
const hash = utils.crypto.md5('password');
const encoded = utils.base64.encode('hello');
const decoded = utils.base64.decode(encoded);
```

#### Cookie 操作
```typescript
utils.cookie.set('token', 'abc123', { expires: 7 });
const token = utils.cookie.get('token');
utils.cookie.remove('token');
```

### 5.3 微前端（micro）

```typescript
import { micro } from 'spark';

// 加载微应用
const microApp = micro.loadMicroApp({
  name: 'app1',
  entry: 'https://app1.example.com',
  container: '#container',
});

// 预加载
micro.prefetchApps([
  { name: 'app2', entry: '//app2.example.com' }
]);
```

### 5.4 国际化（i18n）

```typescript
import { t } from 'spark';

// 脚本中使用
const message = t('common.save');
const greeting = t('user.welcome', { name: 'John' });
```

```vue
<template>
  <!-- 模板中使用 -->
  <div>{{ $t('common.cancel') }}</div>
  <div>{{ $t('user.welcome', { name: userName }) }}</div>
</template>
```

### 5.5 词典查询（dict）

```typescript
import { dict } from 'spark';

// 查询词典数据
const result = await dict.wdict({
  query: 'conceptDomainIds',
  keys: ['05589', '05590']
});

console.log(result['05589']);
```

### 5.6 事件总线（eventBus）

```typescript
import { useEventBus } from 'spark';

const eventBus = useEventBus();

// 监听事件
eventBus.on('app-1', 'user:login', (payload, context) => {
  console.log('收到登录事件:', payload);
});

// 触发事件
eventBus.emit('app-1', 'user:login', { userId: 123 });

// 移除监听
eventBus.off('app-1', 'user:login');
```

### 5.7 监控模块（monitor）

```typescript
import { monitor } from 'spark';

// 初始化监控
monitor.init();

// 上报埋点
monitor.report({
  event: 'page_view',
  page: '/home',
  timestamp: Date.now(),
});
```

---


### 6、Mock 数据规范

#### 6.1 Mock 文件组织（强制）

**每个 pages 模块对应一个 mock 文件：**

```
project-root/
├── mock/
│   ├── home.ts              # Home 模块
│   ├── user.ts              # User 模块  
│   ├── order.ts             # Order 模块
│   └── common.ts            # 公共数据
└── src/pages/
    ├── Home/
    ├── User/
    └── Order/
```

**命名规则**：
- 模块 `src/pages/UserManagement` → mock `user-management.ts`
- 模块 `src/pages/Home` → mock `home.ts`

#### 6.2 Mock 文件模板

```typescript
// mock/user.ts
import { type MockMethod } from 'vite-plugin-mock';

// 定义数据类型（与 apis 保持一致）
interface UserDTO {
  id: string;
  name: string;
  email: string;
  age: number;
  status: 0 | 1;
}

// Mock 数据
const mockUsers: UserDTO[] = [
  {
    id: '1',
    name: '张三',
    email: 'zhangsan@example.com',
    age: 28,
    status: 1
  },
  {
    id: '2',
    name: '李四',
    email: 'lisi@example.com',
    age: 32,
    status: 1
  }
];

export default [
  // 获取用户列表
  {
    url: '/api/user/list',
    method: 'post',
    response: ({ body }) => {
      const { keyword, page = 1, pageSize = 10 } = body;
      
      // 筛选
      let filteredUsers = mockUsers;
      if (keyword) {
        filteredUsers = mockUsers.filter(u => 
          u.name.includes(keyword) || u.email.includes(keyword)
        );
      }
      
      // 分页
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const list = filteredUsers.slice(start, end);
      
      return {
        success: true,
        data: {
          list,
          total: filteredUsers.length
        },
        traceid: 'mock-trace-001',
        hostip: '127.0.0.1',
        hostport: '3000'
      };
    }
  },
  
  // 保存用户
  {
    url: '/api/user/save',
    method: 'post',
    response: ({ body }) => {
      const user = body as UserDTO;
      
      if (user.id) {
        // 更新
        const index = mockUsers.findIndex(u => u.id === user.id);
        if (index > -1) {
          mockUsers[index] = user;
        }
      } else {
        // 新增
        user.id = String(Date.now());
        mockUsers.push(user);
      }
      
      return {
        success: true,
        data: user.id,
        traceid: 'mock-trace-002',
        hostip: '127.0.0.1',
        hostport: '3000'
      };
    }
  },
  
  // 删除用户
  {
    url: '/api/user/delete',
    method: 'post',
    response: ({ body }) => {
      const { id } = body;
      const index = mockUsers.findIndex(u => u.id === id);
      
      if (index > -1) {
        mockUsers.splice(index, 1);
        return {
          success: true,
          data: true,
          traceid: 'mock-trace-003',
          hostip: '127.0.0.1',
          hostport: '3000'
        };
      }
      
      return {
        success: false,
        errorDetail: '用户不存在',
        data: false,
        traceid: 'mock-trace-003',
        hostip: '127.0.0.1',
        hostport: '3000'
      };
    }
  }
] as MockMethod[];
```

#### 6.3 Mock 数据最佳实践

1. **类型一致**：Mock 数据类型与 APIs 定义完全一致
2. **真实模拟**：包含筛选、分页、排序等业务逻辑
3. **完整响应**：返回标准的 `IRequestResponse` 结构
4. **错误场景**：模拟成功和失败两种情况
5. **数据合理**：使用真实的中文姓名、邮箱等

---

### 7、完整开发流程示例

#### 步骤 7.1：创建 Mock 数据

```typescript
// mock/user.ts
// [参考上面的完整 mock 模板]
```

#### 步骤 7.2：定义 API 接口

```typescript
// src/pages/User/apis/user.ts
export interface UserDTO { /* ... */ }
export const userApi = { /* ... */ }
```

#### 步骤 7.3：实现页面组件

```vue
<!-- src/pages/User/index.vue -->
<template>
  <div class="user-page">
    <!-- 根据设计图选择 win-design 组件 -->
    <w-form inline>
      <w-form-item label="搜索">
        <w-input v-model="keyword" />
      </w-form-item>
      <w-button @click="fetchUsers">查询</w-button>
    </w-form>
    
    <w-table :data="users" :columns="columns" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { userApi } from './apis/user';

const users = ref([]);

const fetchUsers = async () => {
  const result = await userApi.getUserList({ page: 1 });
  if (result.success) {
    users.value = result.data.list;
  }
};

onMounted(() => fetchUsers());
</script>
```

---

## 8. 规则级别说明

### 8.1 约束级别

- **🚨 零级规则（最高优先级）**：AI 只能修改 `src/pages/` 目录，违反则立即停止
- **强制规则**：违反视为不合规代码，必须修改
- **适用范围**：人工开发、AI 辅助开发、Code Review、CI/CD

### 8.2 设计目标

- ✅ 架构统一：统一技术栈与编码风格
- ✅ 依赖可控：框架统一管理核心依赖
- ✅ 行为确定：明确职责边界，避免重复造轮
- ✅ AI 可治理：规则明确，便于 AI 工具理解执行
- ✅ 可演进性：支持项目长期维护与升级

### 8.3 常用 API 速查表

<details>
<summary>展开完整 API 列表</summary>

**utils.string**
- camelCase, kebabCase, trim, trimEnd

**utils.object**
- get, set, pick, pickBy, omit, omitBy, merge, mergeWith, cloneDeep, isEqual, keyBy, fromPairs

**utils.array**
- chunk, differenceBy, orderBy, range, uniqWith, findLastIndex

**utils.func**
- debounce, throttle, memoize

**utils.type**
- isNil, isUndefined, castArray

**utils.id**
- uniqueId

**utils.date**
- dayjs (完整 Day.js API)

**utils.crypto**
- md5

**utils.base64**
- encode, decode

**utils.cookie**
- get, set, remove

</details>

---

## 📌 快速检查清单

### AI 工具使用前（最重要）
- [ ] 确认当前要修改的文件在 `src/pages/` 目录下
- [ ] 如需修改其他文件，已停止操作并提示用户
- [ ] 使用 win-design 组件前已查阅 `design-standard.md` 文档，了解组件 API

### 代码提交前
- [ ] 使用 `.sparkrc.ts` 配置文件
- [ ] `src` 目录包含所有必备文件
- [ ] `app.ts` 只导出允许的钩子函数
- [ ] 所有组件使用 `<script setup lang="ts">`
- [ ] 没有使用禁止的依赖
- [ ] 跨模块引用通过 `asyncImport.ts`
- [ ] 多语言使用 `$t`/`t` 而非自定义实例
- [ ] `<template>` 中只出现原生标签和 `<w-` 组件
- [ ] 根据设计图优先使用 win-design 组件
- [ ] 所有 `<w-` 组件的 API 符合 `design-standard.md` 文档
- [ ] 没有手动导入/注册 UI 组件
- [ ] 接口请求使用 `request from 'spark'`
- [ ] 接口默认使用 POST 方法
- [ ] 已为模块创建对应的 mock 文件
- [ ] Mock 数据类型与 API 定义一致
- [ ] TypeScript 类型完整，无 `any`

---


**关键新增规范总结**：

1. ✨ **组件选择**：根据设计图功能，优先匹配 win-design 组件
2. ✨ **接口请求**：统一使用 `request from 'spark'`，默认 POST
3. ✨ **Mock 规范**：每个模块一个 mock 文件，类型一致，逻辑真实

---

> **维护团队**：前端架构组  
> **问题反馈**：如有疑问或改进建议，请联系架构组
