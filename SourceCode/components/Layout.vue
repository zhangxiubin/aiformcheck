<template>
  <div class="app-layout">
    <!-- 顶部导航栏 -->
    <div class="app-header">
      <div class="header-content">
        <div class="logo-section">
          <el-icon :size="24">
            <Document />
          </el-icon>
          <span class="app-title">AI-Form工具</span>
        </div>

        <nav class="nav-menu">
          <router-link
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            class="nav-item"
            active-class="active"
          >
            <el-icon :size="18">
              <component :is="item.icon" />
            </el-icon>
            <span>{{ item.title }}</span>
          </router-link>
        </nav>

        <div class="header-actions">
          <el-button text>
            <el-icon :size="18">
              <User />
            </el-icon>
            <span>管理员</span>
          </el-button>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="app-main">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>

    <!-- 页脚 -->
    <div class="app-footer">
      <div class="footer-content">
        <span>© 2026 AI-Form工具 | 版本 1.1.0</span>
        <span class="footer-links">
          <a href="#">使用条款</a>
          <span class="divider">|</span>
          <a href="#">隐私政策</a>
          <span class="divider">|</span>
          <a href="#">联系我们</a>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  Document,
  User,
  House,
  Files,
  QuestionFilled,
} from '@element-plus/icons-vue';

interface MenuItem {
  path: string;
  title: string;
  icon: any;
}

const menuItems = ref<MenuItem[]>([
  {
    path: '/home',
    title: '首页',
    icon: House,
  },
  {
    path: '/form-import',
    title: '表单生成',
    icon: Files,
  },
  {
    path: '/help',
    title: '帮助',
    icon: QuestionFilled,
  },
]);
</script>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f5f5f5;
}

/* 顶部导航栏 */
.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 60px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
}

.logo-section .el-icon {
  color: white;
}

.app-title {
  font-size: 18px;
  font-weight: 600;
  color: white;
  letter-spacing: 0.5px;
}

/* 导航菜单 */
.nav-menu {
  display: flex;
  gap: 8px;
  flex: 1;
  justify-content: center;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-size: 14px;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-weight: 500;
}

.nav-item .el-icon {
  color: inherit;
}

/* 头部操作区 */
.header-actions {
  display: flex;
  gap: 12px;
}

.header-actions .el-button {
  color: white !important;
}

.header-actions .el-button:hover {
  background: rgba(255, 255, 255, 0.1) !important;
}

/* 主内容区 */
.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 24px;
}

/* 页脚 */
.app-footer {
  background: white;
  border-top: 1px solid #e8e8e8;
  padding: 16px 24px;
  margin-top: auto;
}

.footer-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1400px;
  margin: 0 auto;
  font-size: 13px;
  color: #666;
}

.footer-links {
  display: flex;
  gap: 12px;
  align-items: center;
}

.footer-links a {
  color: #666;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: #667eea;
}

.divider {
  color: #d9d9d9;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-menu {
    gap: 4px;
  }

  .nav-item {
    padding: 6px 12px;
    font-size: 13px;
  }

  .nav-item span {
    display: none;
  }

  .footer-content {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
}
</style>
