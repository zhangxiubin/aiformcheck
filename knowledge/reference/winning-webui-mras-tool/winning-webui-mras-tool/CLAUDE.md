# AI 报告系统 - Claude AI 指导文档

## 项目概述

这是一个基于 Spark 框架的 AI 报告管理系统，用于医疗质量控制、报告模板管理和变量管理。

**技术栈**:
- 前端框架: Vue 3 + TypeScript
- UI 组件: Win Design (Spark)
- 状态管理: Pinia
- 路由: Vue Router
- 构建: Spark CLI
- 开发服务器: http://localhost:8001

## 核心开发原则

### 1. 自主决策流程

遇到需要决策的情况时，采用以下流程：

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. 分析问题 → 识别关键约束和目标                                 │
│ 2. 生成方案 → 至少2-3个可行方案                                  │
│ 3. 评估方案 → 从可行性、复杂度、维护性、性能等维度评估            │
│ 4. 选择执行 → 选择最优方案立即执行                               │
│ 5. 验证结果 → 测试确保方案有效                                   │
└─────────────────────────────────────────────────────────────────┘
```

**仅在以下情况中断任务并请求用户输入：**
- 需求存在关键歧义，无法合理推断
- 多个方案各有重大取舍，需用户做出业务决策
- 涉及敏感操作（如删除数据、重大架构变更）

### 2. 编码规范

```typescript
// 使用简体中文注释，技术术语保持英文
interface ReportData {
  reportId: string;    // 报告ID
  title: string;       // 报告标题
  status: ReportStatus; // 报告状态
}

// 组件命名：PascalCase
export default defineComponent({
  name: 'ReportList'
});

// 函数命名：camelCase
function fetchReportList() {}

// 常量命名：UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;

// API 函数命名：动词 + 名词
async function queryTemplateList() {}
async function deleteTemplate() {}
async function updateReport() {}
```

### 3. 项目结构

```
src/
├── pages/              # 页面组件
│   ├── Template/      # 模板管理
│   │   ├── api.ts     # API 定义
│   │   ├── components/# 子组件
│   │   ├── stores/    # Pinia Store
│   │   └── index.vue  # 页面入口
│   ├── Variable/      # 变量管理
│   └── Preview/       # 报告预览
├── assets/            # 静态资源
└── App.vue           # 根组件
```

**组件组织原则**:
- 组件放在各自使用的页面下的 `components/` 目录
- 不使用公共的 `src/components/` 目录
- 相关的 API 和 Store 与页面放在一起

### 4. API 请求规范

使用原生 fetch API，避免依赖框架特定的 request 模块：

```typescript
async function request<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data || {}),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}
```

### 5. 组件开发规范

**Props 定义**:
```typescript
interface Props {
  modelValue: boolean;
  templateData?: Template | null;
}

const props = defineProps<Props>();
```

**Emits 定义**:
```typescript
interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'success'): void;
}

const emit = defineEmits<Emits>();
```

**响应式数据**:
```typescript
// ref 用于基本类型
const loading = ref(false);

// computed 用于计算属性
const isVisible = computed(() => props.modelValue);
```

**对话框组件**:
```typescript
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});
```

### 6. Store (Pinia) 规范

```typescript
export const useTemplateStore = defineStore('template', () => {
  // State
  const templates = ref<Template[]>([]);
  const loading = ref(false);

  // Actions
  async function fetchTemplates(params?: any) {
    loading.value = true;
    try {
      const res = await templateApi.queryTemplateList(params);
      if (res.success) {
        templates.value = res.data || [];
      }
      return res;
    } finally {
      loading.value = false;
    }
  }

  return {
    templates,
    loading,
    fetchTemplates,
  };
});
```

### 7. 错误处理

```typescript
async function handleDelete(id: string) {
  try {
    await WMessageBox.confirm('确定删除?', '提示', {
      type: 'warning',
    });
    const res = await api.deleteItem({ id });
    if (res.success) {
      Message.success('删除成功');
      refresh();
    }
  } catch {
    // 用户取消或错误
  }
}
```

### 8. 开发工作流

1. **理解需求** → 彻底理解需求再动手
2. **创建组件** → 组件放在对应页面的 `components/` 目录
3. **定义接口** → API 定义在页面的 `api.ts` 文件
4. **状态管理** → Store 定义在页面的 `stores/` 目录
5. **测试验证** → 每完成一个功能立即测试
6. **代码提交** → 确保编译通过后再提交

### 9. 质量检查清单

**代码质量**:
- [ ] 代码符合 TypeScript 类型规范
- [ ] 组件命名符合规范
- [ ] API 请求有错误处理
- [ ] 用户操作有确认提示

**功能验证**:
- [ ] 页面布局响应式适配
- [ ] 表单验证规则完整
- [ ] 数据加载状态正确
- [ ] 错误提示信息清晰

**测试检查**:
- [ ] 无控制台错误或警告
- [ ] 代码已格式化
- [ ] 编译通过无错误
- [ ] 功能运行正常

### 10. 常见问题处理

**API 请求失败**:
- 检查 mock 数据是否在 `mock/aiReportAPI.ts` 中定义
- 确认请求 URL 与 mock 配置匹配
- 查看浏览器控制台的网络请求

**路由页面无法访问**:
- 检查 `.sparkrc.ts` 中路由配置
- 确认页面组件路径正确
- 查看编译错误信息

**组件导入错误**:
- 确认组件路径使用相对路径 `./components/`
- 检查组件文件是否存在
- 验证组件导出方式正确

**Spark request 模块错误**:
- 使用原生 fetch API 替代 `request.post()`
- 在 `api.ts` 中定义通用 request 函数
- 避免直接导入 spark 的 request 模块

### 11. 性能优化

- 使用 `computed` 缓存计算结果
- 大列表使用虚拟滚动
- 避免不必要的响应式数据
- 组件懒加载路由页面
- 图片资源懒加载

### 12. 安全注意事项

- 用户输入必须验证和清理
- 防止 XSS 攻击
- API 请求使用 HTTPS
- 敏感数据不存储在前端
- 遵循最小权限原则

## Mock 数据规范

Mock 数据定义在 `mock/aiReportAPI.ts`，包含：

### 数据类型

1. **模板数据** (18条)：各类医疗质量报告模板
   - 月度/季度/年度报告
   - 质控/总结/分析/巡检报告

2. **变量目录** (8个)：系统基础、患者信息、诊疗相关等
   - 系统基础变量
   - 患者基本信息
   - 诊疗相关变量
   - 医嘱执行变量
   - 检验检查变量
   - 护理质量变量
   - 药品管理变量
   - 费用统计变量

3. **变量数据** (35+条)：各类医疗指标变量
   - 患者总数、平均年龄、性别分布
   - 住院天数、手术例数、死亡率
   - 医嘱执行率、检查完成率
   - 满意度评分等

4. **报告分类** (9类)：质控、总结、分析等报告类型

### API 响应格式

```typescript
{
  success: boolean;
  errorDetail: string | null;
  data: T;
  count?: number | string;
}
```

## 开发命令

```bash
# 启动开发服务器
yarn dev

# 类型检查
yarn tsc --noEmit

# 构建
yarn build
```

## 当前页面路由

- 首页: http://localhost:8001
- 模板管理: http://localhost:8001/template
- 变量管理: http://localhost:8001/variable
- 报告预览: http://localhost:8001/preview

## 详细设计文档模板

当需要开发新功能时，使用以下模板创建详细设计文档：

```markdown
# [功能名称] 详细设计文档

## 1. 需求分析

### 1.1 功能需求
- 描述功能的具体需求
- 列出用户使用场景
- 定义功能边界

### 1.2 非功能需求
- 性能要求
- 安全要求
- 可维护性要求

### 1.3 数据需求
- 输入数据
- 输出数据
- 数据流转

## 2. 技术方案

### 2.1 技术栈选择
- 前端技术
- 后端技术（如有）
- 第三方库

### 2.2 架构设计
- 整体架构图
- 模块划分
- 接口定义

### 2.3 模块划分
- 组件结构
- 数据流
- 状态管理

## 3. 接口设计

### 3.1 前端组件接口
- Props
- Emits
- Slots

### 3.2 后端API接口（如有）
- 请求格式
- 响应格式
- 错误处理

## 4. 数据设计

### 4.1 数据模型
- TypeScript 接口定义
- 数据结构说明

### 4.2 状态管理
- Store 结构
- Actions 定义

## 5. 实现计划

### 5.1 开发任务分解
- 任务列表
- 优先级排序
- 依赖关系

### 5.2 测试计划
- 单元测试
- 集成测试
- 用户验收测试

## 6. 风险评估

### 6.1 技术风险
- 潜在技术难点
- 解决方案

### 6.2 项目风险
- 时间风险
- 资源风险
```
