<template>
  <Layout />
</template>

<script setup lang="ts">
import Layout from './components/Layout.vue';
</script>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  width: 100%;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  width: 100%;
  min-height: 100vh;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 全局链接样式 */
a {
  color: #667eea;
  text-decoration: none;
  transition: color 0.3s ease;
}

a:hover {
  color: #764ba2;
}

/* 全局按钮样式 */
button {
  cursor: pointer;
  font-family: inherit;
}

/* 全局输入框样式 */
input,
textarea,
select {
  font-family: inherit;
}

/* 全局表格样式 */
table {
  border-collapse: collapse;
  width: 100%;
}

/* 全局图片样式 */
img {
  max-width: 100%;
  height: auto;
  display: block;
}

/* 全局过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 工具类 */
.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.text-muted {
  color: #909399;
}

.text-primary {
  color: #667eea;
}

.text-success {
  color: #43e97b;
}

.text-warning {
  color: #f5576c;
}

.text-danger {
  color: #ff6b6b;
}

/* 间距工具类 */
.mt-1 { margin-top: 8px; }
.mt-2 { margin-top: 16px; }
.mt-3 { margin-top: 24px; }
.mb-1 { margin-bottom: 8px; }
.mb-2 { margin-bottom: 16px; }
.mb-3 { margin-bottom: 24px; }
.ml-1 { margin-left: 8px; }
.ml-2 { margin-left: 16px; }
.mr-1 { margin-right: 8px; }
.mr-2 { margin-right: 16px; }

.p-1 { padding: 8px; }
.p-2 { padding: 16px; }
.p-3 { padding: 24px; }

/* 显示工具类 */
.d-none { display: none; }
.d-block { display: block; }
.d-flex { display: flex; }
.d-inline-block { display: inline-block; }

/* 对齐工具类 */
.align-center { align-items: center; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }

/* 宽度工具类 */
.w-100 { width: 100%; }
.h-100 { height: 100%; }
</style>
