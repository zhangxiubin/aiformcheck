import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'

const routes = [
  {
    path: '/',
    redirect: '/form-import'
  },
  {
    path: '/form-import',
    name: 'FormImport',
    component: () => import('./pages/FormImport/index.vue'),
    meta: {
      title: '表单导入'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)

// 注册所有 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus)
app.use(router)
app.mount('#app')
