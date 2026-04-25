/**
 * AI-Form工具应用入口
 */
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import App from './App.vue';
import routes from './router/form-import.routes';

// 创建路由实例
const router = createRouter({
  history: createWebHistory('/aiformcheck/'),
  routes,
});

// 路由守卫
router.beforeEach((to, _from, next) => {
  // 设置页面标题
  if (to.meta?.title) {
    document.title = `${to.meta.title} - AI-FORM`;
  }
  next();
});

// 创建应用实例
const app = createApp(App);

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

// 使用插件
app.use(router);
app.use(ElementPlus);

// 挂载应用
app.mount('#app');
