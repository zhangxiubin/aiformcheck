# SourceCode 文件结构

```
SourceCode/
├── .eslintrc.js                          # ESLint配置文件
├── .gitignore                            # Git忽略配置
├── .prettierrc                           # Prettier配置文件
├── package.json                          # 项目依赖配置
├── tsconfig.json                         # TypeScript配置
├── README.md                             # 项目说明文档
├── 生成说明.md                           # 代码生成说明
│
├── global/                               # 全局配置
│   └── request.ts                        # 全局请求配置
│
├── pages/                                # 页面组件
│   └── FormImport/                       # 表单导入模块
│       ├── index.vue                     # 主页面组件 (260行)
│       ├── api.ts                        # API接口定义 (110行)
│       ├── types.ts                      # TypeScript类型定义 (70行)
│       └── components/                   # 子组件
│           └── UploadExcelDialog.vue     # 上传对话框组件 (550行)
│
└── router/                               # 路由配置
    └── form-import.routes.ts             # 表单导入路由 (20行)
```

## 文件说明

### 配置文件 (7个)
- `.eslintrc.js` - ESLint代码检查规则
- `.gitignore` - Git版本控制忽略文件
- `.prettierrc` - Prettier代码格式化规则
- `package.json` - NPM包管理和依赖配置
- `tsconfig.json` - TypeScript编译配置
- `README.md` - 项目使用文档
- `生成说明.md` - 代码生成详细说明

### 核心代码 (4个)
- `global/request.ts` - Axios请求实例配置
- `pages/FormImport/index.vue` - 表单导入主页面
- `pages/FormImport/api.ts` - 6个API接口定义
- `pages/FormImport/types.ts` - 8个TypeScript类型定义

### 组件 (1个)
- `pages/FormImport/components/UploadExcelDialog.vue` - 三步导入对话框

### 路由 (1个)
- `router/form-import.routes.ts` - 表单导入路由配置

## 总计
- **文件总数**: 13个
- **代码行数**: 约1500+行
- **组件数**: 2个
- **API接口**: 6个
- **类型定义**: 8个

## 使用指南

详见 [README.md](./README.md)
