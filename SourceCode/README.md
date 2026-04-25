# 表单导入模块 - 前端代码

## 📋 项目概述

这是基于 Win Design (Spark) 框架开发的表单导入模块，支持从 Excel 文件导入自定义表单配置。

## 🛠 技术栈

- **前端框架**: Vue 3 + TypeScript
- **UI 组件**: Win Design (Spark)
- **构建工具**: Spark CLI
- **状态管理**: Pinia (可选)
- **路由**: Vue Router 4

## 📁 文件结构

```
SourceCode/
├── pages/
│   └── FormImport/           # 表单导入模块
│       ├── index.vue          # 主页面
│       ├── api.ts             # API接口
│       ├── types.ts           # TypeScript类型定义
│       └── components/        # 组件
│           └── UploadExcelDialog.vue  # 上传对话框
├── global/
│   └── request.ts            # 全局请求配置
└── router/
    └── form-import.routes.ts # 路由配置
```

## 🚀 功能特性

### 1. 文件上传
- ✅ 支持 .xls、.xlsx 格式Excel文件
- ✅ 拖拽上传和点击上传
- ✅ 文件格式和大小验证（最大10MB）
- ✅ 上传进度显示

### 2. 导入配置
- ✅ 覆盖已存在的表单
- ✅ 创建新版本
- ✅ 数据验证
- ✅ 跳过空行
- ✅ 工作表索引选择

### 3. 数据预览
- ✅ 上传前验证文件格式
- ✅ 配置确认界面
- ✅ 数据预览（前10条）
- ✅ 导入状态跟踪

### 4. 列表管理
- ✅ 表单列表展示
- ✅ 状态标签显示
- ✅ 搜索和过滤
- ✅ 分页功能
- ✅ 重新导入
- ✅ 删除功能

## 📦 安装使用

### 1. 复制文件到项目

将以下文件复制到您的 Spark 项目中：

```bash
# 复制页面文件
cp -r SourceCode/pages/FormImport /path/to/your-project/src/pages/

# 复制全局配置
cp SourceCode/global/request.ts /path/to/your-project/src/global/

# 复制路由配置
cp SourceCode/router/form-import.routes.ts /path/to/your-project/src/router/
```

### 2. 配置路由

在您的主路由文件中导入并使用：

```typescript
// src/router/index.ts
import formImportRoutes from './form-import.routes';

const routes = [
  // ... 其他路由
  ...formImportRoutes,
];

export default routes;
```

### 3. 配置API代理

在开发环境中配置API代理：

```javascript
// spark.config.js
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://your-backend-server',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
};
```

### 4. 添加菜单配置

在您的菜单配置中添加：

```typescript
{
  path: '/form-import',
  name: 'FormImport',
  title: '表单导入',
  icon: 'upload',
}
```

## 🔌 API 接口说明

### 1. 上传表单文件

```typescript
POST /api/form-import/upload
Content-Type: multipart/form-data

参数:
- file: File (Excel文件)
- config: ImportConfig (JSON字符串)

响应:
{
  success: boolean;
  message: string;
  data?: {
    fileId: string;
    fileName: string;
    fileSize: number;
    preview?: FormFieldPreview[];
  };
}
```

### 2. 查询表单列表

```typescript
GET /api/form-import/list

参数:
- pageNo: number
- pageSize: number
- formName?: string
- status?: ImportStatus

响应:
{
  success: boolean;
  data: FormImportData[];
  count: number;
}
```

### 3. 删除表单

```typescript
DELETE /api/form-import/:formId

响应:
{
  success: boolean;
  message: string;
}
```

### 4. 重新导入

```typescript
POST /api/form-import/reimport/:formId

请求体:
{
  overwriteExisting: boolean;
  createNewVersion: boolean;
  validateData: boolean;
  skipEmptyRows: boolean;
  sheetIndex?: number;
}

响应:
{
  success: boolean;
  message: string;
}
```

### 5. 下载模板

```typescript
GET /api/form-import/template

响应: Blob (Excel文件)
```

### 6. 验证文件

```typescript
POST /api/form-import/validate
Content-Type: multipart/form-data

参数:
- file: File (Excel文件)

响应:
{
  success: boolean;
  valid: boolean;
  message?: string;
}
```

## 🎨 组件使用示例

### 基础使用

```vue
<template>
  <FormImport />
</template>

<script setup lang="ts">
import FormImport from '@/pages/FormImport/index.vue';
</script>
```

### 单独使用上传对话框

```vue
<template>
  <UploadExcelDialog
    v-model="uploadVisible"
    @success="handleSuccess"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import UploadExcelDialog from '@/pages/FormImport/components/UploadExcelDialog.vue';

const uploadVisible = ref(false);

function handleSuccess() {
  console.log('上传成功');
}
</script>
```

## 🎯 类型定义

### FormImportData

```typescript
interface FormImportData {
  formId?: string;              // 表单ID
  formName: string;             // 表单名称
  fileName: string;             // 文件名
  fileSize: number;             // 文件大小
  uploadTime: string;           // 上传时间
  status: ImportStatus;         // 导入状态
  errorMessage?: string;        // 错误信息
}
```

### ImportConfig

```typescript
interface ImportConfig {
  overwriteExisting: boolean;   // 覆盖已存在的表单
  createNewVersion: boolean;    // 创建新版本
  validateData: boolean;        // 验证数据
  skipEmptyRows: boolean;       // 跳过空行
  sheetIndex?: number;          // 工作表索引
}
```

### ImportStatus

```typescript
enum ImportStatus {
  PENDING = 'pending',          // 待导入
  IMPORTING = 'importing',      // 导入中
  SUCCESS = 'success',          // 成功
  FAILED = 'failed',            // 失败
}
```

## 🐛 常见问题

### 1. 上传文件失败

**问题**: 点击上传后没有反应或报错

**解决方案**:
- 检查文件格式是否为 .xls 或 .xlsx
- 检查文件大小是否超过 10MB
- 检查网络连接和API配置

### 2. 导入失败

**问题**: 导入过程显示失败

**解决方案**:
- 检查Excel文件格式是否符合要求
- 查看错误信息获取具体失败原因
- 尝试关闭数据验证选项重新导入

### 3. 路由404

**问题**: 访问页面显示404

**解决方案**:
- 确认路由配置已正确导入
- 检查路由路径是否与菜单配置一致
- 确认父路由配置是否正确

## 📝 开发建议

### 1. 环境配置

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### 2. 代码规范

- 使用 TypeScript 进行类型检查
- 遵循 ESLint 规则
- 组件命名使用 PascalCase
- 文件命名使用 kebab-case

### 3. 样式规范

- 使用 Spark 组件库样式
- 避免内联样式
- 使用 scoped 样式避免污染

## 🔗 相关资源

- [Win Design 文档](http://wued.winning-health.com.cn:8088/win-design-next/zh-CN/)
- [Spark CLI 文档](https://spark.winning.com.cn/)
- [Vue 3 文档](https://cn.vuejs.org/)
- [TypeScript 文档](https://www.typescriptlang.org/)

## 📄 许可证

MIT License

---

**生成时间**: 2026-04-23
**版本**: 1.0.0
**基于原型**: Model/表单导入页.png, Model/表单导入EXCEL.png
