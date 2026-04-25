# Vue2 到 Vue3 组件整体迁移规则（完整 Composition API）

> 版本：1.0  
> 目的：规范 AI/Cursor 在 Vue2 组件整体迁移到 Vue3 `<script setup lang="ts">` 写法中的行为，确保行为等价、代码规范、可审计。  

---

## 一、核心原则

- **行为等价**  
  任何重构都必须保证组件逻辑与行为与原实现保持完全等价（不允许功能改变）。若无法确保，必须中止并标注风险。

- **最小改动原则**  
  除非明确授权，禁止修改组件模板、样式、公共接口（props、emits）、文件结构和导入声明。

- **全量迁移**  
  允许修改组件内所有部分（data、props、methods、computed、watch、生命周期、模板等），以达到纯 Vue3 Composition API 写法。  

- **不能有任何的lint错误**  
  转换成 Vue3 Composition API 后，必须确保行为等价，且不能有 lint 错误。

- **禁止引入非官方依赖**  
  仅允许使用 Vue3 官方 Composition API 和 TypeScript，禁止引入第三方运行时依赖。

- **显式副作用管理**  
  所有副作用必须显式声明并写入 Side Effect Ledger，且在迁移时必须同时迁移对应的清理逻辑。

- **完整类型声明**  
  必须使用 TypeScript，禁止使用 any，确保类型安全。 

---

## 二、允许的迁移行为
- 允许修改模板语法以适应 Vue3 特性，例如事件绑定方式、`v-model` 改变、插槽语法等。
- **只能使用自研组件库：`win-design-next`**，组件的标签必须为小写：`w-`。
- 如果发现使用了非`win-design-next`的标签，需要重构为`win-design-next`组件库的标签`w-`。
- 将 `data` 迁移为 `ref` 或 `reactive` 响应式变量。  
- 将 `props` 迁移为 `defineProps` + TypeScript 接口。  
- 将 `methods` 迁移为普通顶层函数。  
- 将 `computed` 迁移为 `computed()`。  
- 将 `watch` 迁移为 Vue3 的 `watch` 或 `watchEffect`。  
- 将生命周期钩子迁移为 `onMounted`、`onBeforeUnmount` 等 Composition API 钩子。
- 迁移模板中所有响应式访问，替换 `this.xxx` 为直接变量访问或 `.value`。
- 组件整体采用 `<script setup lang="ts">` 语法糖结构。
- 保持组件名称、事件接口（emits）、文件路径不变。
- 如果样式中存在Vue2语法特有的内容（如深度选择器 `/deep/` 等），请帮忙转换为 Vue3 支持的等效写法（如 `::v-deep`）。
- 保持页面渲染和交互行为完全等价
- **命名冲突避免**：当解构赋值的变量名与已存在的响应式变量同名时，必须对解构出的变量重命名，添加合适的前缀或后缀（如 `Raw`、`Data` 等）以避免命名冲突
---

## 三、禁止的行为（除非有特别授权）

- 不要添加新的样式代码或删除已有样式。
- 不要添加新的 DOM 结构或删除现有节点
- 其他CSS 代码请保持原样
- 变更组件的 `props` 或 `emits` 定义（包括名称、类型、默认值）。  
- 删除、重命名或移动组件文件。  
- 引入新的第三方运行时依赖或工具库。  
- 自动提取或合并公共逻辑。  
- 引入不确定副作用或隐式行为改变。  
- 不经授权修改公共接口（事件、暴露方法）。 
- 转换完成后，不能不校验各种lint的错误，如果有lint错误，请帮忙修复 

---

## 四、副作用管理

- **所有副作用都必须登记**，包括但不限于：  
  - DOM 事件监听（`window.addEventListener` 等）  
  - 定时器（`setTimeout`、`setInterval`）  
  - 外部订阅（EventBus、全局状态监听）  
  - 异步资源加载（Ajax、WebSocket）  
- 每个副作用都必须同时迁移对应的**清理函数**（`onUnmounted` 或等价）确保无内存泄漏。  
- 副作用的新增必须详细记录在 Side Effect Ledger。  

---

## 五、输出格式要求

- 迁移后代码必须采用 `<script setup lang="ts">` 格式，且确保 TypeScript 类型安全。
- Props用 TypeScript 接口声明，使用 `defineProps<Props>()`。
- 状态使用 `ref` 或 `reactive` 管理。  
- 方法和计算属性用顶层函数和 `computed()` 实现。
- 生命周期钩子用 Composition API 生命周期函数。 
- 模板语法对应 Vue3 响应式访问。 
- 必须在代码或 PR 描述中附带**Refactor Audit Block**，包含以下内容：  
  - 迁移文件路径  
  - 迁移阶段（phase）  
  - 行为是否等价（Yes/No + 说明）  
  - 副作用变更说明（无/新增/移除 + 详细列表）  
  - 是否可回滚（Yes/No）  
- 禁止提交未附带 Audit Block 的代码。  

---

## 六、示例输出结构

```vue
<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onUnmounted, defineProps } from 'vue'

// Props 定义
interface Props {
  title: string
  count?: number
}
const props = defineProps<Props>()

// 响应式状态
const state = reactive({
  message: 'hello',
  count: 0
})

// 计算属性
const doubleCount = computed(() => state.count * 2)

// 方法
function increment() {
  state.count++
}

// 生命周期
onMounted(() => {
  console.log('组件挂载')
})
onUnmounted(() => {
  // 清理副作用
})

// 监听器
watch(() => state.count, (newVal) => {
  console.log('count 变了', newVal)
})
</script>

<template>
  <div>
    <h1>{{ props.title }}</h1>
    <p>{{ state.message }}</p>
    <p>{{ doubleCount }}</p>
    <button @click="increment">+1</button>
  </div>
</template>
```

## 七、审计与回滚要求

- 所有迁移必须有 Reviewer 审核确认，重点关注行为等价与副作用。  
- 迁移代码必须确保能够通过所有单元测试与集成测试。  
- 回滚路径必须清晰，任何迁移都应能通过 `git revert` 完整回退。  
- 严重风险迁移需人工执行，AI 自动迁移需有限范围且持续人工监控。

---

## 八、异常处理
- 遇到复杂业务逻辑或副作用时，禁止自动迁移。
- 所有异常和风险点必须记录，并汇报给 Reviewer。


## 九、命名冲突避免规范

### 9.1 变量命名冲突处理

当遇到解构赋值变量与响应式变量同名时，**必须**对解构变量重命名：

**错误示例：**
```javascript
// 响应式变量
const hintStatus = ref('')

// 解构赋值时产生冲突
const { hintStatus, portalSchemeCode } = res.data || {}
hintStatus.value = hintStatus  // ❌ 冲突！hintStatus指向解构的值
```

**正确示例：**
```javascript
// 响应式变量
const hintStatus = ref('')
const portalSchemeCode = ref('')

// 解构赋值时重命名避免冲突
const {
  hintStatus: hintStatusData,
  portalSchemeCode: portalSchemeCodeData
} = res.data || {}

// 正确赋值
hintStatus.value = hintStatusData
portalSchemeCode.value = portalSchemeCodeData
```

### 9.2 推荐的重命名后缀

- `Data` - 来自API响应的数据（推荐）
- `Raw` - 原始数据
- `Value` - 值数据
- `Info` - 信息数据

### 9.3 强制性要求

- **所有AI转换必须检查命名冲突**
- **发现冲突时必须自动重命名解构变量**
- **重命名必须保持语义清晰**
- **不允许任何同名变量冲突的代码通过审核**

## 十、示例 Refactor Audit Block

Refactor Audit:
- 文件路径：src/components/Example.vue
- 阶段：整体 Composition API 迁移
- 行为等价：是
- 副作用变更：无新增，清理函数迁移完备
- 命名冲突处理：已检查并修复所有变量命名冲突
- 是否可回滚：是