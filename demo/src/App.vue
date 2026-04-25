<template>
  <div id="app">
    <el-container style="height: 100vh">
      <el-header style="background-color: #409EFF; color: white; display: flex; align-items: center;">
        <h2 style="margin: 0;">表单导入系统 - 演示版</h2>
      </el-header>
      <el-main style="padding: 20px; background-color: #f5f5f5;">
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  document.title = '表单导入系统 - 演示版'
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

#app {
  width: 100%;
  height: 100vh;
}
</style>
