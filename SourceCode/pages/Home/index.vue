<template>
  <div class="home-container">
    <!-- 欢迎横幅 -->
    <div class="welcome-banner">
      <div class="banner-content">
        <h1 class="banner-title">
          欢迎使用AI-Form工具
        </h1>
        <p class="banner-subtitle">
          高效、便捷的 Excel 表单导入解决方案
        </p>
      </div>
    </div>

    <!-- 快速操作 -->
    <div class="quick-actions">
      <div class="section-title">
        <h2>快速操作</h2>
        <p>常用功能快捷入口</p>
      </div>

      <div class="action-cards">
        <div
          v-for="action in quickActions"
          :key="action.title"
          class="action-card"
          @click="handleActionClick(action.path)"
        >
          <div class="card-icon" :style="{ background: action.color }">
            <el-icon :size="32" color="white">
              <component :is="action.icon" />
            </el-icon>
          </div>
          <h3 class="card-title">{{ action.title }}</h3>
          <p class="card-description">{{ action.description }}</p>
        </div>
      </div>
    </div>

    <!-- 系统统计 -->
    <div class="system-stats">
      <div class="section-title">
        <h2>系统统计</h2>
        <p>实时数据概览</p>
      </div>

      <div class="stats-grid">
        <div
          v-for="stat in systemStats"
          :key="stat.title"
          class="stat-card"
        >
          <div class="stat-header">
            <el-icon :size="24" :color="stat.color">
              <component :is="stat.icon" />
            </el-icon>
            <span class="stat-title">{{ stat.title }}</span>
          </div>
          <div class="stat-value" :style="{ color: stat.color }">
            {{ stat.value }}
          </div>
          <div class="stat-change" :class="stat.trend">
            <el-icon :size="12">
              <component :is="stat.trend === 'up' ? ArrowUp : ArrowDown" />
            </el-icon>
            <span>{{ stat.change }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 最近活动 -->
    <div class="recent-activity">
      <div class="section-title">
        <h2>最近活动</h2>
        <p>最新的操作记录</p>
      </div>

      <div class="activity-list">
        <div
          v-for="activity in recentActivities"
          :key="activity.id"
          class="activity-item"
        >
          <div class="activity-icon" :class="activity.type">
            <el-icon :size="16" color="white">
              <component :is="activity.icon" />
            </el-icon>
          </div>
          <div class="activity-content">
            <div class="activity-title">{{ activity.title }}</div>
            <div class="activity-time">{{ activity.time }}</div>
          </div>
          <div class="activity-status" :class="activity.status">
            {{ activity.statusText }}
          </div>
        </div>
      </div>
    </div>

    <!-- 系统特性 -->
    <div class="features-section">
      <div class="section-title">
        <h2>系统特性</h2>
        <p>强大的功能支持</p>
      </div>

      <div class="features-grid">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="feature-item"
        >
          <div class="feature-icon">
            <el-icon :size="28" color="#667eea">
              <component :is="feature.icon" />
            </el-icon>
          </div>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-description">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  Document,
  Upload,
  Download,
  Setting,
  Files,
  CircleCheck,
  CircleClose,
  Clock,
  ArrowUp,
  ArrowDown,
  Lightning,
  Lock,
  Grid,
  View,
  Coin,
  CopyDocument,
} from '@element-plus/icons-vue';

const router = useRouter();

interface QuickAction {
  title: string;
  description: string;
  icon: any;
  color: string;
  path: string;
}

interface SystemStat {
  title: string;
  value: string;
  change: string;
  icon: any;
  color: string;
  trend: 'up' | 'down';
}

interface Activity {
  id: number;
  title: string;
  time: string;
  icon: any;
  type: string;
  status: string;
  statusText: string;
}

interface Feature {
  icon: any;
  title: string;
  description: string;
}

const quickActions = ref<QuickAction[]>([
  {
    title: '导入表单',
    description: '从Excel文件导入表单配置',
    icon: Upload,
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    path: '/form-import',
  },
  {
    title: '下载模板',
    description: '获取标准Excel模板文件',
    icon: Download,
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    path: '/form-import',
  },
  {
    title: '查看文档',
    description: '阅读详细的帮助文档',
    icon: Document,
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    path: '/help',
  },
  {
    title: '系统设置',
    description: '配置系统参数和选项',
    icon: Setting,
    color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    path: '/settings',
  },
]);

const systemStats = ref<SystemStat[]>([
  {
    title: '总表单数',
    value: '1,234',
    change: '+12%',
    icon: Files,
    color: '#667eea',
    trend: 'up',
  },
  {
    title: '今日导入',
    value: '89',
    change: '+8%',
    icon: Upload,
    color: '#f5576c',
    trend: 'up',
  },
  {
    title: '成功导入',
    value: '98.5%',
    change: '+2%',
    icon: CircleCheck,
    color: '#43e97b',
    trend: 'up',
  },
  {
    title: '失败导入',
    value: '1.5%',
    change: '-0.5%',
    icon: CircleClose,
    color: '#ff6b6b',
    trend: 'down',
  },
]);

const recentActivities = ref<Activity[]>([
  {
    id: 1,
    title: '临床科室医疗质量考核评分标准 导入成功',
    time: '2分钟前',
    icon: CircleCheck,
    type: 'success',
    status: 'success',
    statusText: '成功',
  },
  {
    id: 2,
    title: '护理质量评分表 导入失败',
    time: '15分钟前',
    icon: CircleClose,
    type: 'error',
    status: 'error',
    statusText: '失败',
  },
  {
    id: 3,
    title: '用户 下载了表单模板',
    time: '1小时前',
    icon: Download,
    type: 'info',
    status: 'info',
    statusText: '完成',
  },
  {
    id: 4,
    title: '系统定时任务执行完成',
    time: '2小时前',
    icon: Clock,
    type: 'info',
    status: 'info',
    statusText: '完成',
  },
]);

const features = ref<Feature[]>([
  {
    icon: Lightning,
    title: '快速导入',
    description: '支持拖拽上传，秒级处理Excel文件',
  },
  {
    icon: Lock,
    title: '数据验证',
    description: '智能数据验证，确保导入质量',
  },
  {
    icon: Grid,
    title: '批量处理',
    description: '支持批量导入多个表单文件',
  },
  {
    icon: View,
    title: '实时预览',
    description: '导入前预览数据，避免错误',
  },
  {
    icon: Coin,
    title: '数据管理',
    description: '完善的表单管理和维护功能',
  },
  {
    icon: CopyDocument,
    title: 'API接口',
    description: '提供RESTful API，便于集成',
  },
]);

function handleActionClick(path: string) {
  router.push(path);
}
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 欢迎横幅 */
.welcome-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 40px;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.banner-content {
  max-width: 800px;
}

.banner-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 12px 0;
}

.banner-subtitle {
  font-size: 16px;
  opacity: 0.9;
  margin: 0;
}

/* 通用区块样式 */
.section-title {
  margin-bottom: 20px;
}

.section-title h2 {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 4px 0;
}

.section-title p {
  font-size: 14px;
  color: #909399;
  margin: 0;
}

/* 快速操作 */
.quick-actions {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.action-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.action-card {
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #e8e8e8;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.action-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
  transform: translateY(-2px);
}

.card-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px 0;
}

.card-description {
  font-size: 13px;
  color: #909399;
  margin: 0;
}

/* 系统统计 */
.system-stats {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  padding: 20px;
  border-radius: 12px;
  background: #fafafa;
  border: 1px solid #e8e8e8;
}

.stat-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.stat-title {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
}

.stat-change {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
}

.stat-change.up {
  color: #43e97b;
}

.stat-change.down {
  color: #ff6b6b;
}

/* 最近活动 */
.recent-activity {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  background: #fafafa;
  transition: background 0.2s;
}

.activity-item:hover {
  background: #f0f0f0;
}

.activity-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-icon.success {
  background: #43e97b;
}

.activity-icon.error {
  background: #ff6b6b;
}

.activity-icon.info {
  background: #667eea;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-size: 14px;
  color: #303133;
  margin-bottom: 4px;
}

.activity-time {
  font-size: 12px;
  color: #909399;
}

.activity-status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.activity-status.success {
  background: #e8f8f0;
  color: #43e97b;
}

.activity-status.error {
  background: #ffe8e8;
  color: #ff6b6b;
}

.activity-status.info {
  background: #e8ecff;
  color: #667eea;
}

/* 系统特性 */
.features-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.feature-item {
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e8e8e8;
  transition: all 0.3s ease;
}

.feature-item:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.feature-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: #f5f7ff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.feature-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px 0;
}

.feature-description {
  font-size: 13px;
  color: #909399;
  margin: 0;
  line-height: 1.6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .banner-title {
    font-size: 24px;
  }

  .action-cards,
  .stats-grid,
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
