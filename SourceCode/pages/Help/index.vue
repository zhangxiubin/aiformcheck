<template>
  <div class="help-container">
    <!-- 帮助标题 -->
    <div class="help-header">
      <h1>
        <w-icon name="question-circle" :size="28" />
        帮助中心
      </h1>
      <p>查找常见问题解答和使用指南</p>
    </div>

    <!-- 搜索框 -->
    <div class="search-section">
      <w-input-search
        v-model="searchQuery"
        placeholder="搜索帮助内容..."
        size="large"
        style="max-width: 600px; width: 100%;"
        @search="handleSearch"
      />
    </div>

    <!-- 快速链接 -->
    <div class="quick-links">
      <div
        v-for="link in quickLinks"
        :key="link.title"
        class="quick-link-item"
        @click="scrollToSection(link.id)"
      >
        <w-icon :name="link.icon" :size="24" />
        <span>{{ link.title }}</span>
      </div>
    </div>

    <!-- 常见问题 -->
    <div id="faq" class="help-section">
      <div class="section-title">
        <h2>
          <w-icon name="question" :size="20" />
          常见问题
        </h2>
      </div>

      <w-collapse v-model="activeCollapse">
        <w-collapse-item
          v-for="faq in filteredFaqs"
          :key="faq.question"
          :title="faq.question"
          :name="faq.question"
        >
          <div class="faq-content">{{ faq.answer }}</div>
        </w-collapse-item>
      </w-collapse>
    </div>

    <!-- 使用指南 -->
    <div id="guide" class="help-section">
      <div class="section-title">
        <h2>
          <w-icon name="document" :size="20" />
          使用指南
        </h2>
      </div>

      <div class="guide-steps">
        <div
          v-for="(step, index) in guideSteps"
          :key="step.title"
          class="guide-step"
        >
          <div class="step-number">{{ index + 1 }}</div>
          <div class="step-content">
            <h3 class="step-title">{{ step.title }}</h3>
            <p class="step-description">{{ step.description }}</p>
            <div v-if="step.tips" class="step-tips">
              <strong>提示：</strong>
              <ul>
                <li v-for="tip in step.tips" :key="tip">{{ tip }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 文件格式说明 -->
    <div id="format" class="help-section">
      <div class="section-title">
        <h2>
          <w-icon name="file-excel" :size="20" />
          文件格式说明
        </h2>
      </div>

      <div class="format-info">
        <div class="format-requirements">
          <h3>文件要求</h3>
          <ul>
            <li>支持格式：.xls、.xlsx</li>
            <li>文件大小：不超过 10MB</li>
            <li>工作表数量：建议单个工作表</li>
            <li>数据行数：建议不超过 1000 行</li>
          </ul>
        </div>

        <div class="format-structure">
          <h3>推荐结构</h3>
          <div class="table-preview">
            <table>
              <thead>
                <tr>
                  <th>字段名称</th>
                  <th>检查要求</th>
                  <th>评分标准</th>
                  <th>标分</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>项目名称</td>
                  <td>具体要求内容</td>
                  <td>评分细则</td>
                  <td>10</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- 联系支持 -->
    <div id="support" class="help-section">
      <div class="section-title">
        <h2>
          <w-icon name="service" :size="20" />
          联系支持
        </h2>
      </div>

      <div class="support-cards">
        <div class="support-card">
          <div class="card-icon">
            <w-icon name="phone" :size="32" />
          </div>
          <h3>电话支持</h3>
          <p class="support-value">400-888-8888</p>
          <p class="support-time">工作日 9:00-18:00</p>
        </div>

        <div class="support-card">
          <div class="card-icon">
            <w-icon name="message" :size="32" />
          </div>
          <h3>在线客服</h3>
          <p class="support-value">7x24小时服务</p>
          <w-button type="primary" size="small">开始聊天</w-button>
        </div>

        <div class="support-card">
          <div class="card-icon">
            <w-icon name="email" :size="32" />
          </div>
          <h3>邮件支持</h3>
          <p class="support-value">support@example.com</p>
          <p class="support-time">24小时内回复</p>
        </div>
      </div>
    </div>

    <!-- 视频教程 -->
    <div id="video" class="help-section">
      <div class="section-title">
        <h2>
          <w-icon name="video" :size="20" />
          视频教程
        </h2>
      </div>

      <div class="video-grid">
        <div
          v-for="video in videoTutorials"
          :key="video.title"
          class="video-card"
        >
          <div class="video-thumbnail">
            <w-icon name="play-circle" :size="48" />
            <span class="video-duration">{{ video.duration }}</span>
          </div>
          <div class="video-info">
            <h3 class="video-title">{{ video.title }}</h3>
            <p class="video-description">{{ video.description }}</p>
            <div class="video-meta">
              <span>{{ video.views }} 次观看</span>
              <span>{{ video.date }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface QuickLink {
  id: string;
  title: string;
  icon: string;
}

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

interface GuideStep {
  title: string;
  description: string;
  tips?: string[];
}

interface Video {
  title: string;
  description: string;
  duration: string;
  views: string;
  date: string;
}

const searchQuery = ref('');
const activeCollapse = ref<string[]>([]);

const quickLinks = ref<QuickLink[]>([
  { id: 'faq', title: '常见问题', icon: 'question' },
  { id: 'guide', title: '使用指南', icon: 'document' },
  { id: 'format', title: '文件格式', icon: 'file-excel' },
  { id: 'support', title: '联系支持', icon: 'service' },
  { id: 'video', title: '视频教程', icon: 'video' },
]);

const faqs = ref<FAQ[]>([
  {
    question: '如何上传Excel文件？',
    answer: '您可以点击"导入表单"按钮，然后拖拽文件到上传区域，或点击选择文件。支持 .xls 和 .xlsx 格式的文件，文件大小不超过 10MB。',
    category: '上传',
  },
  {
    question: '导入失败怎么办？',
    answer: '如果导入失败，请检查：1) 文件格式是否正确；2) 文件是否损坏；3) 数据是否符合要求。您也可以点击"重新导入"按钮再次尝试。',
    category: '导入',
  },
  {
    question: '是否支持批量导入？',
    answer: '当前版本支持单个文件导入。批量导入功能正在开发中，敬请期待。',
    category: '功能',
  },
  {
    question: '如何下载导入模板？',
    answer: '点击页面顶部的"下载模板"按钮即可获取标准的Excel模板文件。',
    category: '模板',
  },
  {
    question: '导入的数据会保存在哪里？',
    answer: '导入的数据会保存在系统的数据库中，您可以在表单列表中查看和管理所有已导入的表单。',
    category: '数据',
  },
  {
    question: '如何修改已导入的表单？',
    answer: '当前版本不支持直接修改已导入的表单。您可以删除后重新导入，或联系管理员进行处理。',
    category: '编辑',
  },
]);

const guideSteps = ref<GuideStep[]>([
  {
    title: '准备Excel文件',
    description: '确保您的Excel文件符合系统要求的格式，包含必要的字段和数据。',
    tips: [
      '使用系统提供的标准模板',
      '检查数据完整性',
      '删除不必要的空行和空列',
    ],
  },
  {
    title: '上传文件',
    description: '点击"导入表单"按钮，选择或拖拽您的Excel文件到上传区域。',
    tips: [
      '文件大小不超过10MB',
      '支持的格式：.xls、.xlsx',
      '上传前建议先备份数据',
    ],
  },
  {
    title: '配置导入选项',
    description: '根据需要配置导入参数，如是否覆盖已存在的表单、是否验证数据等。',
    tips: [
      '首次导入建议开启数据验证',
      '如需更新现有表单，选择"覆盖已存在的表单"',
      '选择"跳过空行"可以避免导入空数据',
    ],
  },
  {
    title: '确认并导入',
    description: '预览导入信息，确认无误后点击"开始导入"按钮。',
    tips: [
      '仔细检查预览数据',
      '确认文件信息和配置选项',
      '导入过程请勿关闭页面',
    ],
  },
  {
    title: '查看导入结果',
    description: '导入完成后，在表单列表中查看导入状态和结果。',
    tips: [
      '成功：表单已添加到列表',
      '失败：查看错误信息并重新导入',
      '可以搜索和筛选已导入的表单',
    ],
  },
]);

const videoTutorials = ref<Video[]>([
  {
    title: '快速入门：如何导入第一个表单',
    description: '了解完整的表单导入流程，从文件准备到成功导入。',
    duration: '3:24',
    views: '1.2K',
    date: '2026-04-20',
  },
  {
    title: 'Excel文件格式详解',
    description: '详细了解系统支持的Excel文件格式和字段要求。',
    duration: '5:18',
    views: '856',
    date: '2026-04-18',
  },
  {
    title: '常见导入问题及解决方案',
    description: '学习如何处理导入过程中遇到的常见问题。',
    duration: '4:45',
    views: '1.5K',
    date: '2026-04-15',
  },
]);

const filteredFaqs = computed(() => {
  if (!searchQuery.value) return faqs.value;
  const query = searchQuery.value.toLowerCase();
  return faqs.value.filter(
    (faq) =>
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query)
  );
});

function handleSearch() {
  // 搜索功能已通过 computed 实现
  console.log('搜索:', searchQuery.value);
}

function scrollToSection(id: string) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
</script>

<style scoped>
.help-container {
  display: flex;
  flex-direction: column;
  gap: 32px;
  max-width: 900px;
  margin: 0 auto;
}

/* 帮助标题 */
.help-header {
  text-align: center;
  padding: 40px 20px;
}

.help-header h1 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 32px;
  color: #303133;
  margin: 0 0 12px 0;
}

.help-header p {
  font-size: 16px;
  color: #909399;
  margin: 0;
}

/* 搜索区域 */
.search-section {
  display: flex;
  justify-content: center;
  padding: 20px;
}

/* 快速链接 */
.quick-links {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.quick-link-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #f5f7ff;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #667eea;
  font-weight: 500;
}

.quick-link-item:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

/* 帮助区块 */
.help-section {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-title {
  margin-bottom: 24px;
}

.section-title h2 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 22px;
  color: #303133;
  margin: 0;
}

/* FAQ样式 */
.faq-content {
  line-height: 1.8;
  color: #606266;
  padding: 12px 0;
}

/* 使用指南 */
.guide-steps {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.guide-step {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: #fafafa;
  border-radius: 12px;
  border-left: 4px solid #667eea;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 18px;
  color: #303133;
  margin: 0 0 8px 0;
}

.step-description {
  color: #606266;
  margin: 0 0 12px 0;
  line-height: 1.6;
}

.step-tips {
  padding: 12px;
  background: white;
  border-radius: 8px;
  font-size: 14px;
}

.step-tips strong {
  color: #667eea;
  display: block;
  margin-bottom: 8px;
}

.step-tips ul {
  margin: 0;
  padding-left: 20px;
}

.step-tips li {
  color: #606266;
  margin-bottom: 4px;
}

/* 文件格式说明 */
.format-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.format-requirements,
.format-structure {
  padding: 20px;
  background: #fafafa;
  border-radius: 12px;
}

.format-requirements h3,
.format-structure h3 {
  font-size: 16px;
  color: #303133;
  margin: 0 0 16px 0;
}

.format-requirements ul {
  margin: 0;
  padding-left: 20px;
}

.format-requirements li {
  color: #606266;
  margin-bottom: 8px;
}

.table-preview {
  overflow-x: auto;
}

.table-preview table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.table-preview th,
.table-preview td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e8e8e8;
}

.table-preview th {
  background: #667eea;
  color: white;
  font-weight: 600;
}

.table-preview td {
  color: #606266;
}

/* 联系支持 */
.support-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.support-card {
  padding: 24px;
  text-align: center;
  background: #fafafa;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.support-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.support-card h3 {
  font-size: 16px;
  color: #303133;
  margin: 0 0 8px 0;
}

.support-value {
  font-size: 18px;
  font-weight: 600;
  color: #667eea;
  margin: 0 0 4px 0;
}

.support-time {
  font-size: 13px;
  color: #909399;
  margin: 0 0 16px 0;
}

/* 视频教程 */
.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.video-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.video-card:hover {
  transform: translateY(-4px);
}

.video-thumbnail {
  position: relative;
  width: 100%;
  height: 160px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 12px;
}

.video-duration {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.7);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: white;
}

.video-title {
  font-size: 15px;
  color: #303133;
  margin: 0 0 8px 0;
}

.video-description {
  font-size: 13px;
  color: #909399;
  margin: 0 0 8px 0;
  line-height: 1.5;
}

.video-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #c0c4cc;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .format-info {
    grid-template-columns: 1fr;
  }

  .help-section {
    padding: 20px;
  }

  .guide-step {
    flex-direction: column;
  }
}
</style>
