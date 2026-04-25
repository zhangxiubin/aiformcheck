<template>
  <w-title>基础用法</w-title>
  <div class="flex flex-wrap gap-4 items-center">
    <w-select v-model="value" size="large" style="width: 240px">
      <w-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </w-select>
    <w-select v-model="value" placeholder="请选择" style="width: 240px">
      <w-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </w-select>
    <w-select
      v-model="value"
      placeholder="请选择"
      size="small"
      :suffix-icon="CaretBottom"
      style="width: 240px"
    >
      <w-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </w-select>
    <w-select
      v-model="value"
      placeholder="请选择"
      size="mini"
      :suffix-icon="Search"
      :suffix-icon-rotate="false"
      style="width: 240px"
    >
      <w-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </w-select>
  </div>
  <w-divider />
  <w-title
    >禁用状态：为 `w-select` 设置 `disabled`属性，则整个选择器不可用</w-title
  >
  <w-select v-model="value" disabled placeholder="请选择" style="width: 240px">
    <w-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </w-select>
  <w-select
    v-model="value4"
    disabled
    placeholder="请选择"
    style="width: 240px"
    class="ml-4"
  >
    <w-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </w-select>
  <w-divider />
  <w-title
    >禁用选项：在 w-option 中，设定 disabled 值为 true，即可禁用该选项</w-title
  >
  <w-select v-model="value1" placeholder="请选择" style="width: 240px">
    <w-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
      :disabled="item.disabled"
    />
  </w-select>
  <w-divider />
  <w-title>可清空：为 w-select 设置 clearable 属性，则可将选择器清空 </w-title>
  <w-select
    v-model="value2"
    clearable
    placeholder="请选择"
    style="width: 240px"
  >
    <w-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </w-select>
  <w-divider />
  <w-title>🎉 轻量化：为 w-select 设置 plain 属性 </w-title>
  <w-select
    v-model="value2"
    clearable
    plain
    placeholder="请选择"
    style="width: 240px"
  >
    <w-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </w-select>
  <w-select
    v-model="value2"
    class="ml-8"
    clearable
    plain
    disabled
    placeholder="请选择"
    style="width: 240px"
  >
    <w-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </w-select>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { CaretBottom, Search } from '@win-design-next/icons-vue'

const value = ref('')
const value1 = ref('')
const value2 = ref('')
const value4 = ref('option1')

const options = [
  {
    value: 'option1',
    label: '选项1',
  },
  {
    value: 'option2',
    label: '选项2',
  },
  {
    value: 'option3',
    label: '选项3',
  },
  {
    value: 'option4',
    label: '选项4',
  },
  {
    value: 'option5',
    label: '选项5',
    disabled: true,
  },
]
</script>