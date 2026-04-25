# mras-scroll-to-bottom

滚动到底部，拓展 `element-ui` 和 `win-design` 中的 `infinite-scroll`，
理论上支持任意滚动元素、组件，如 `<el-select>`, `<el-table>`, `<w-select>`, `<w-table>` 等。

`win-design` 为 `<w-table>` 的滚动加载专门提供了支持（[点击查看](http://wued.winning-health.com.cn:8088/win-design/views/table.html)）

```html
<ul v-mras-scroll-to-bottom="onScrollToBottom"
  :mras-scroll-to-bottom-disabled="disabled"
  style="max-height: 200px;overflow: auto;">
  <li v-for="item in options"
    :key="item.value"
    style="height: 20px;background: #ddd;margin: 4px 0 8px;">
    {{ item.label }}
  </li>
  <li v-if="disabled">正在加载...</li>
</ul>
```

## Attributes

|                参数                |                                                                        说明                                                                       |   类型  |   可选值   | 默认值 |
|------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|---------|------------|--------|
| mras-scroll-to-bottom-disabled     | 是否禁用，为 true 时不会调用指令绑定的函数                                                                                                        | boolean | true/false | false  |
| mras-scroll-to-bottom-delay        | 节流延时，单位为 ms                                                                                                                               | number  | -          | 200    |
| mras-scroll-to-bottom-distance     | 触发加载的距离阈值，单位为px                                                                                                                      | number  | -          | 0      |
| mras-scroll-to-bottom-immediate    | 是否立即执行加载方法，以防初始状态下内容无法撑满容器。                                                                                            | boolean | true/false | true   |
| **mras-scroll-to-bottom-selector** | 滚动容器的 css 选择器。默认情况下无需指定，会将指令绑定的容器视为滚动容器，但是在配合一些组件库使用时需要指定，比如 `<el-select>` 和 `<w-select>` | string  | -          | -      |


## 代码示例

```html
<template>
  <div>
    <ul v-mras-scroll-to-bottom="onScrollToBottom"
      mras-scroll-to-bottom-disrance="30"
      :mras-scroll-to-bottom-disabled="disabled"
      style="max-height: 200px;overflow: auto;">
      <li v-for="item in options"
        :key="item.value"
        style="height: 20px;background: #ddd;margin: 4px 0 8px;">
        {{ item.label }}
      </li>
      <li v-if="disabled">正在加载...</li>
    </ul>

    <!-- 在 el-select 上使用时, 需要指定滚动容器 .el-select-dropdown__wrap -->
    <el-select v-model="value" placeholder="请选择"
      v-mras-scroll-to-bottom="onScrollToBottom"
      mras-scroll-to-bottom-selector=".el-select-dropdown__wrap"
      mras-scroll-to-bottom-distance="30"
      :mras-scroll-to-bottom-disabled="disabled">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
      <li v-if="disabled">正在加载...</li>
    </el-select>

    <!-- 在 w-select 上使用时, 需要指定滚动容器 .w-select-dropdown__wrap -->
    <w-select v-model="value" placeholder="请选择"
      v-mras-scroll-to-bottom="onScrollToBottom"
      mras-scroll-to-bottom-selector=".w-select-dropdown__wrap"
      mras-scroll-to-bottom-distance="30"
      :mras-scroll-to-bottom-disabled="disabled">
      <w-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </w-option>
      <li v-if="disabled">正在加载...</li>
    </w-select>

    <!--
      在 w-table 上使用时, 需要指定滚动容器 .w-table__body-wrapper
      需要注意的是, 要开启表格的滚动, 需要设置一个固定的 height
    -->
    <w-table
      v-win-loading="disabled"
      loading-background="rgba(0, 0, 0, 0.5)"
      v-mras-scroll-to-bottom="onScrollToBottom"
      mras-scroll-to-bottom-selector=".w-table__body-wrapper"
      mras-scroll-to-bottom-disrance="30"
      :mras-scroll-to-bottom-disabled="disabled"
      :data="options" border stripe height="400">
      <w-table-column label="序号" type="index" align="center" width="70" />
      <w-table-column label="值" prop="label" align="center" />
    </w-table>
  </div>
</template>

<script>
const genOptions = (index = 0, cnt = 20) => {
  const options = []
  for (let i = index; i < index + cnt; i++) {
    options.push({
      label: `item-${i}`,
      value: i
    })
  }
  return options
}

export default {
  data () {
    return {
      options: genOptions(),
      value: '',
      disabled: false
    }
  },

  methods: {
    onScrollToBottom () {
      this.disabled = true

      setTimeout(() => {
        const index = this.options[this.options.length - 1].value + 1
        const options = genOptions(index)
        this.options = this.options.concat(options)

        this.disabled = false
      }, 2 * 1000)
    }
  }
}
</script>
```
