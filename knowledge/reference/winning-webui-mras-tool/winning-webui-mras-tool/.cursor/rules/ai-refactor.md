# AI Refactor Rules (Spark Vue Project)

> **规则性质**：AI / Cursor / Claude 自动重构专用规则  
> **适用范围**：代码生成、自动修改、重构操作  
> **优先级**：高于日常开发规范，但必须与 `project-rules.md` 协同  
> **更新日期**：2025-12-17

---

## 📋 目录

- [0. AI 重构行为总原则](#0-ai-重构行为总原则)
- [1. 框架与配置禁区](#1-框架与配置禁区)
- [2. 依赖管理约束](#2-依赖管理约束)
- [3. Vue/TypeScript 生成规则](#3-vuetypescript-生成规则)
- [4. 业务代码修改边界](#4-业务代码修改边界)
- [5. 多语言处理规则](#5-多语言处理规则)
- [6. 组件库使用约束](#6-组件库使用约束)
- [7. 模块结构保护](#7-模块结构保护)
- [8. 工具库使用规范](#8-工具库使用规范)
- [9. 重构范围控制](#9-重构范围控制)
- [10. 审计与输出要求](#10-审计与输出要求)
- [11. 强制中止条件](#11-强制中止条件)
- [12. 规则优先级说明](#12-规则优先级说明)

---

## 0. AI 重构行为总原则

### 0.1 四大核心原则（最高优先级）

#### 1️⃣ 禁止自由发挥原则

**AI 只能在明确授权范围内修改代码。**

**禁止行为**：
- ❌ "顺手"优化代码结构
- ❌ 自动调整代码格式
- ❌ 重排代码顺序
- ❌ 修改变量/函数命名
- ❌ 添加"可能有用"的功能
- ❌ 删除"看起来没用"的代码

**示例**：
```typescript
// 原代码
const data = await fetchUsers();

// ❌ 错误：重构时"顺手"优化了变量名
const userList = await fetchUsers();

// ✅ 正确：只做规则要求的修改，保持原样
const data = await fetchUsers();
```

#### 2️⃣ 行为等价原则

**重构前后代码的运行时行为必须完全一致。**

无法保证等价 → 必须停止并标记人工处理。

#### 3️⃣ 最小 Diff 原则

**只修改与重构目标直接相关的代码。**

量化标准：
- ✅ 单文件修改 < 50 行（优秀）
- ✅ 单文件修改 < 100 行（合格）
- ⚠️ 单文件修改 > 100 行（需审核）

#### 4️⃣ 可回滚原则

**所有修改必须支持 `git revert`。**

禁止跨文件、跨模块的耦合性修改。

---

## 1. 框架与配置禁区

### 1.1 绝对禁止修改的文件

```
❌ .sparkrc.ts           # Spark 框架配置
❌ src/app.ts            # 应用入口
❌ src/global.ts         # 全局配置
❌ src/global.scss       # 全局样式
❌ tsconfig.json         # TS 配置
❌ package.json          # 依赖配置
```

### 1.2 禁止绕过 Spark 能力

```typescript
// ❌ 错误：绕过 Spark 直接使用底层库
import { createRouter } from 'vue-router';

// ✅ 正确：使用 Spark 提供的能力
// Spark 已自动初始化，业务代码直接使用
```

---

## 2. 依赖管理约束

### 2.1 禁止任何依赖操作

**AI 绝对禁止**：
- ❌ 新增依赖
- ❌ 删除依赖
- ❌ 修改版本
- ❌ 引入未声明的三方库

### 2.2 强制使用 Spark 提供的能力

```typescript
// ✅ 正确：从 spark 导入
import { 
  ref, reactive, computed, watch,
  useRouter, useRoute,
  defineStore, storeToRefs,
  request, utils,
  t, useI18n,
  micro, useEventBus
} from 'spark';

// ❌ 错误：从原始库导入
import { ref } from 'vue';
import { useRouter } from 'vue-router';
```

---

## 3. Vue/TypeScript 生成规则

### 3.1 Vue 组件强制模板

```vue
<template>
  <div class="component-name">
    <!-- 组件内容 -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'spark';

interface Props {
  title: string;
  count?: number;
}

const props = withDefaults(defineProps<Props>(), {
  count: 0
});

const emits = defineEmits<{
  change: [value: number];
}>();

const data = ref<DataType>({});

onMounted(() => {
  // 初始化
});
</script>
```

**强制规则**：
- ✅ 必须使用 `<template>`
- ✅ 必须使用 `<script setup lang="ts">`
- ❌ 禁止 Options API
- ❌ 禁止混用 setup + Options API

### 3.2 Options API 转换规则

| Options API | Composition API |
|-------------|----------------|
| `data()` | `ref()` / `reactive()` |
| `computed` | `computed()` |
| `watch` | `watch()` |
| `methods` | 普通函数 |
| `mounted` | `onMounted()` |
| `props` | `defineProps<T>()` |

### 3.3 TypeScript 规则（零容忍）

```typescript
// ✅ 正确：完整类型定义
interface UserData {
  id: number;
  name: string;
}

const user = ref<UserData>({ id: 1, name: 'John' });

// ❌ 错误：使用 any
const data: any = {};

// ❌ 错误：缺少类型
const result = await fetchData();
```

---

## 4. 业务代码修改边界

### 4.1 `app.ts` 修改禁区

**AI 对 `app.ts` 的任何修改都是禁止的。**

### 4.2 禁止的初始化代码

```typescript
// ❌ 禁止：Vue 实例创建
const app = createApp(App);

// ❌ 禁止：Router 初始化
const router = createRouter({...});

// ❌ 禁止：插件注册
app.use(router);
```

以上均由 Spark 框架自动完成。

---

## 5. 多语言处理规则

### 5.1 i18n 使用规范

**模板中使用 `$t`**：
```vue
<template>
  <!-- ✅ 正确 -->
  <div>{{ $t('common.save') }}</div>
  
  <!-- ❌ 错误：硬编码 -->
  <div>保存</div>
</template>
```

**Script 中使用 `t`**：
```typescript
<script setup lang="ts">
import { t } from 'spark';

// ✅ 正确
const message = t('common.success');

// ❌ 错误：硬编码
const message = '操作成功';
</script>
```

### 5.2 禁止硬编码文案

```typescript
// ❌ 错误
const title = '用户列表';

// ✅ 正确
const title = t('user.listTitle');
```

---

## 6. 组件库使用约束

### 6.1 win-design 强制规范

```vue
<template>
  <!-- ✅ 正确 -->
  <w-button type="primary">提交</w-button>
  <w-input v-model="value" />
  
  <!-- ❌ 错误：其他 UI 库 -->
  <el-button>提交</el-button>
  <a-input v-model:value="value" />
  
  <!-- ❌ 错误：大写标签 -->
  <W-Button>提交</W-Button>
</template>

<script setup lang="ts">
// ✅ 无需导入，开箱即用

// ❌ 禁止手动导入
import { WButton } from 'win-design';
</script>
```

### 6.2 Template 标签约束

**只允许**：
1. 原生 HTML 标签：`<div>`, `<span>`, `<p>` 等
2. win-design 组件：`<w-*>` 

**禁止**：
- ❌ 其他 UI 库组件
- ❌ 未导入的自定义组件

---

## 7. 模块结构保护

### 7.1 禁止调整模块结构

**AI 不得**：
- ❌ 移动模块目录
- ❌ 重命名模块
- ❌ 调整层级
- ❌ 合并/拆分模块

### 7.2 模块内引用规则

```typescript
// ✅ 正确：相对路径
import UserCard from './components/UserCard.vue';

// ❌ 错误：绝对路径
import UserCard from '@/pages/User/components/UserCard.vue';
```

### 7.3 跨模块引用（只读）

**AI 只能使用已有的跨模块引用，不能新增。**

---

## 8. 工具库使用规范

### 8.1 对象/数组处理

```typescript
// ❌ 错误
import _ from 'lodash';

// ✅ 正确
import { utils } from 'spark';

const cloned = utils.object.cloneDeep(obj);
const picked = utils.object.pick(obj, ['name']);
const chunked = utils.array.chunk(arr, 3);
```

### 8.2 时间处理

```typescript
// ❌ 错误
import moment from 'moment';

// ✅ 正确
import { utils } from 'spark';
const date = utils.date.dayjs().format('YYYY-MM-DD');
```

### 8.3 其他工具

```typescript
import { utils } from 'spark';

// Cookie
utils.cookie.set('token', 'abc');
utils.cookie.get('token');

// Base64
utils.base64.encode('hello');

// 加密
utils.crypto.md5('password');
```

---

## 9. 重构范围控制

### 9.1 `.refactor-scope.yaml` 强制服从

```yaml
scope:
  includes:
    - src/pages/UserModule/**
  excludes:
    - "**/*.spec.ts"
  allowed_operations:
    - composition_api_migration
```

**所有重构必须完全服从此配置。**

### 9.2 范围检查流程

```
1. 读取 .refactor-scope.yaml
2. 检查文件路径是否在 includes
3. 检查是否在 excludes
4. 检查操作是否在 allowed_operations
5. 通过 → 继续 | 失败 → 停止
```

### 9.3 越权处理

```
🚨 范围越权检测

文件：src/pages/Admin/index.vue
问题：不在授权范围内

已停止操作。
```

---

## 10. 审计与输出要求

### 10.1 强制 Refactor Audit Block

**每次重构必须输出完整审计报告：**

```markdown
## 🔍 Refactor Audit Report

### 基本信息
- Scope ID: vue2-to-vue3
- 执行时间: 2025-12-17 15:30
- 操作类型: Composition API Migration

### 文件变更
| 文件 | 操作 | 行数 | 风险 |
|-----|------|------|------|
| List.vue | Options→Composition | +85,-72 | 🟡 中 |

### 行为等价性验证
- ✅ 数据响应式已验证
- ⚠️ List.vue 的 watch 需人工验证

### 规则遵守
- ✅ 范围内文件
- ✅ 使用 Spark 导入
- ✅ TypeScript 完整

### 潜在风险
- 🟡 List.vue watch 行为需测试

### 测试建议
- 单元测试 watch 逻辑
- 集成测试列表功能

### 人工审核要点
1. 验证 watch 行为
2. 测试响应式更新

### 回滚方案
```bash
git revert <commit-hash>
```
```

### 10.2 无法生成审计 = 停止操作

---

## 11. 强制中止条件

### 11.1 必须中止的场景

**检测到以下情况必须立即停止：**

1. **行为等价性无法保证**
   - 复杂响应式转换
   - 生命周期时机变化
   - 异步执行顺序变化

2. **涉及模板或样式修改**
   - 模板结构调整
   - CSS 类名修改

3. **Props / Emits 变化**
   - 类型修改
   - 事件签名变化

4. **跨模块结构变更**
   - 导入路径变化
   - 依赖关系变化

5. **超出 Refactor Scope**
   - 文件不在范围内
   - 操作不允许

### 11.2 中止提示模板

```
🛑 操作已中止

原因：[具体原因]
问题：[详细描述]
风险：行为等价性无法保证

建议：人工介入处理

已回滚更改。
```

---

## 12. 规则优先级说明

### 12.1 规则优先级

```
1. 🚨 cursor-rules.md（全局入口）
2. 🔴 ai-refactor-rules.md（本文件）
3. 🟡 project-rules.md（开发规范）
4. 🟢 win-design.md（组件文档）
```

### 12.2 规则冲突处理

**冲突时，高优先级规则覆盖低优先级规则。**

### 12.3 适用范围

```
适用于：
✅ AI 自动重构
✅ Cursor 辅助生成
✅ 批量代码转换

不适用于：
❌ 人工手动开发
❌ Code Review
```

---

## 13. 快速参考

### 13.1 核心检查清单

**重构前**：
```
□ 已加载 .refactor-scope.yaml
□ 文件在授权范围内
□ 操作类型被允许
```

**重构中**：
```
□ 只修改授权代码
□ 保持最小 Diff
□ 使用 Spark 能力
□ TypeScript 类型完整
```

**重构后**：
```
□ 输出完整审计报告
□ 行为等价性说明
□ 风险评估
```

### 13.2 禁止操作速查

| 类别 | 禁止操作 |
|------|---------|
| 文件 | 修改框架配置文件 |
| 依赖 | 新增/删除依赖 |
| 组件 | 使用非 win-design |
| 导入 | 从原始库导入 |
| 类型 | 使用 any |
| 文案 | 硬编码文本 |
| 范围 | 修改范围外文件 |

---

## 14. AI 承诺

✅ 严格遵守所有重构规则  
✅ 保证行为等价  
✅ 最小化变更  
✅ 完整审计  
✅ 及时停止  

❌ 绝不自由发挥  
❌ 绝不越权修改  
❌ 绝不隐瞒风险  

---

## 15. 总结

### 核心原则
1. 行为等价 > 一切
2. 范围控制 > 自由
3. 最小 Diff > 完美
4. 审计报告 > 速度

### 成功标准
- ✅ 行为完全等价
- ✅ Diff 最小化
- ✅ 完整审计
- ✅ 可安全回滚

---

> **维护者**：前端架构组  
> **版本**：v2.0.0  
> **更新日期**：2025-12-17

**祝重构顺利！🚀**