/**
 * AI-Form工具路由配置
 */
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../pages/Home/index.vue'),
    meta: {
      title: '首页',
      icon: 'home',
      requiresAuth: false,
    },
  },
  {
    path: '/form-import',
    name: 'FormImport',
    component: () => import('../pages/FormImport/index.vue'),
    meta: {
      title: '表单生成',
      icon: 'code',
      requiresAuth: false,
    },
  },
  {
    path: '/help',
    name: 'Help',
    component: () => import('../pages/Help/index.vue'),
    meta: {
      title: '帮助',
      icon: 'question-circle',
      requiresAuth: false,
    },
  },
];

export default routes;
