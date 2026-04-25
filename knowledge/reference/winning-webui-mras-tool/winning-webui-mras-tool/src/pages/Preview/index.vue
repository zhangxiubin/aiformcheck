<template>
  <div class="preview-container full-width full-height" v-loading="loading">
    <div class="preview-header">
      <div class="header-left">{{ headerTitle }}</div>
      <div class="header-actions">
        <w-button size="small" @click="handleExport">导出</w-button>
        <w-button size="small" type="primary" @click="handlePrint">打印</w-button>
      </div>
    </div>

    <div class="preview-content">
      <div v-if="!templateContent" class="preview-empty">
        <p>请选择模板进行预览</p>
      </div>

      <div v-else class="preview-editor" ref="editorRef">
        <!-- 模拟报告内容展示 -->
        <div class="report-preview">
          <div class="report-header">
            <h1 class="report-title">{{ reportData.title || '报告预览' }}</h1>
            <div class="report-meta">
              <span v-if="reportData.period">周期：{{ reportData.period }}</span>
              <span v-if="reportData.date">日期：{{ reportData.date }}</span>
              <span v-if="reportData.dept">科室：{{ reportData.dept }}</span>
            </div>
          </div>

          <div class="report-sections">
            <div
              v-for="(section, index) in reportData.sections"
              :key="index"
              class="report-section"
            >
              <h2 class="section-title">{{ section.title }}</h2>
              <div class="section-content" v-html="section.content"></div>

              <!-- 图表展示区域 -->
              <div v-if="section.charts && section.charts.length > 0" class="section-charts">
                <div
                  v-for="(chart, chartIndex) in section.charts"
                  :key="chartIndex"
                  class="chart-placeholder"
                >
                  <div class="chart-type-badge">{{ chart.type }}</div>
                  <p>{{ chart.title }}</p>
                  <div class="chart-canvas">
                    <span class="chart-placeholder-text">图表区域：{{ chart.type }}</span>
                  </div>
                </div>
              </div>

              <!-- 表格展示区域 -->
              <div v-if="section.table" class="section-table">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th v-for="(col, colIndex) in section.table.columns" :key="colIndex">
                        {{ col }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, rowIndex) in section.table.data" :key="rowIndex">
                      <td v-for="(cell, cellIndex) in row" :key="cellIndex">
                        {{ cell }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Message } from 'spark';

const route = useRoute();
const loading = ref(false);
const templateContent = ref('');
const editorRef = ref<HTMLElement>();

// 报告数据
const reportData = ref({
  title: '',
  period: '',
  date: '',
  dept: '',
  sections: [] as Array<{
    title: string;
    content: string;
    charts?: Array<{ type: string; title: string }>;
    table?: {
      columns: string[];
      data: string[][];
    };
  }>,
});

// Computed
const headerTitle = computed(() => {
  const list: string[] = [];
  const { templateName, startDate, endDate } = route.query || {};

  if (templateName) {
    list.push(String(templateName));
  }
  if (startDate && endDate) {
    list.push(`${startDate} ~ ${endDate}`);
  }

  if (list.length > 0) {
    return `报告预览（${list.join('，')}）`;
  }
  return '报告预览';
});

onMounted(async () => {
  const { mrasQaTempId, templateName, startDate, endDate } = route.query || {};
  if (mrasQaTempId) {
    await loadReportData({
      mrasQaTempId: String(mrasQaTempId),
      templateName: templateName as string,
      startDate: startDate as string,
      endDate: endDate as string,
    });
  }
});

async function loadReportData(params: {
  mrasQaTempId: string;
  templateName?: string;
  startDate?: string;
  endDate?: string;
}) {
  loading.value = true;
  try {
    // 模拟 API 调用
    // const res = await aiReportApi.queryTemplate({ mrasQaTempId: params.mrasQaTempId });
    // const previewRes = await aiReportApi.previewReport({
    //   mrasQaTempId: params.mrasQaTempId,
    //   reportParams: {
    //     startDate: params.startDate,
    //     endDate: params.endDate,
    //   },
    // });

    // 模拟数据
    await new Promise(resolve => setTimeout(resolve, 500));
    templateContent.value = '<p>模拟模板内容</p>';

    // 生成更丰富的报告数据
    reportData.value = {
      title: params.templateName || '月度医疗质量控制报告',
      period: params.startDate && params.endDate ? `${params.startDate} ~ ${params.endDate}` : '2024年3月',
      date: new Date().toLocaleDateString('zh-CN'),
      dept: '质控科',
      sections: [
        {
          title: '一、工作概述',
          content: `<p>本期（2024年3月）我院医疗质量控制工作稳步推进，各项质量指标持续改善。全院共收治患者 <strong>1,234</strong> 人次，较上月增长 <strong>6.7%</strong>。医疗安全事件发生率下降 <strong>15%</strong>，患者满意度保持在 <strong>96.5%</strong> 的高位水平。</p>
            <p>本月在重点学科建设、临床路径管理、合理用药等方面均取得了显著成效。</p>`,
        },
        {
          title: '二、医疗质量指标分析',
          content: '<p>本月医疗质量核心指标监测情况如下：</p>',
          table: {
            columns: ['指标名称', '目标值', '本期值', '上月值', '环比变化', '达标情况'],
            data: [
              ['平均住院日', '≤6.5天', '5.2天', '5.5天', '-5.5%', '✓ 达标'],
              ['床位使用率', '≥85%', '92.3%', '89.7%', '+2.9%', '✓ 达标'],
              ['再入院率', '≤3%', '2.3%', '2.8%', '-17.9%', '✓ 达标'],
              ['手术切口感染率', '≤1.5%', '0.8%', '1.2%', '-33.3%', '✓ 达标'],
              ['抗菌药物使用率', '≤40%', '38.5%', '42.1%', '-8.6%', '✓ 达标'],
              ['危急值报告及时率', '≥98%', '99.2%', '98.5%', '+0.7%', '✓ 达标'],
              ['病历书写合格率', '≥95%', '97.8%', '96.2%', '+1.7%', '✓ 达标'],
              ['患者满意度', '≥90%', '96.5%', '95.2%', '+1.4%', '✓ 达标'],
            ],
          },
        },
        {
          title: '三、各科室质量指标排名',
          content: '<p>本月各临床科室医疗质量综合评分排名如下：</p>',
          charts: [
            { type: '柱状图', title: '各科室质量评分对比（满分100分）' },
            { type: '雷达图', title: '科室五维质量评估' },
          ],
        },
        {
          title: '四、患者满意度调查结果',
          content: '<p>本月共发放患者满意度调查问卷 <strong>500</strong> 份，回收有效问卷 <strong>486</strong> 份，有效回收率 <strong>97.2%</strong>。总体满意度为 <strong>96.5%</strong>，较上月提升 <strong>1.3%</strong>。</p>',
          charts: [
            { type: '折线图', title: '近6个月满意度趋势' },
            { type: '饼图', title: '满意度分布（非常满意/满意/一般/不满意）' },
          ],
          table: {
            columns: ['评价维度', '非常满意(%)', '满意(%)', '一般(%)', '不满意(%)', '综合得分'],
            data: [
              ['医疗技术水平', '68.5', '27.2', '4.0', '0.3', '95.7'],
              ['服务态度', '72.3', '24.5', '2.9', '0.3', '96.8'],
              ['就医环境', '65.8', '28.7', '5.1', '0.4', '95.1'],
              ['等候时间', '58.2', '31.5', '9.8', '0.5', '93.3'],
              ['费用透明度', '61.4', '30.2', '7.9', '0.5', '94.1'],
            ],
          },
        },
        {
          title: '五、存在问题及整改措施',
          content: `<p><strong>主要问题：</strong></p>
            <ul style="line-height: 1.8;">
              <li>部分科室病历书写及时性有待提高，尤其是病程记录的规范性需要加强</li>
              <li>个别科室抗生素预防性使用时间过长，存在过度用药现象</li>
              <li>手术室接台效率有待提升，平均接台时间超过30分钟</li>
            </ul>
            <p><strong>整改措施：</strong></p>
            <ul style="line-height: 1.8;">
              <li>加强病历书写培训，建立"病历质量周检查"制度，将病历质量纳入绩效考核</li>
              <li>开展合理用药专项整治行动，建立抗生素使用权限分级管理制度</li>
              <li>优化手术室排班流程，建立首台手术准点率考核机制</li>
            </ul>`,
        },
        {
          title: '六、下月工作计划',
          content: `<p>1. 持续推进医疗质量改进项目，重点抓好 <strong>5</strong> 个专项质量提升行动</p>
            <p>2. 加强医疗安全培训，计划开展全院性医疗安全培训 <strong>2</strong> 场</p>
            <p>3. 完善临床路径管理，新增 <strong>3</strong> 个病种的临床路径并推广实施</p>
            <p>4. 强化合理用药监管，建立处方点评长效机制</p>`,
        },
      ],
    };
  } catch (error) {
    Message.error('加载报告失败');
    console.error(error);
  } finally {
    loading.value = false;
  }
}

function handleExport() {
  Message.info('导出功能待实现');
}

function handlePrint() {
  window.print();
}
</script>

<style scoped>
.preview-container {
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.preview-header {
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background: #fff;
  border-bottom: 1px solid #e0e0e0;
}

.header-left {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.preview-content {
  flex: 1;
  overflow: auto;
  background: #fff;
  padding: 24px;
}

.preview-empty {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
}

.preview-editor {
  height: 100%;
}

.report-preview {
  max-width: 800px;
  margin: 0 auto;
  background: #fff;
}

.report-header {
  text-align: center;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e0e0e0;
}

.report-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
}

.report-meta {
  display: flex;
  justify-content: center;
  gap: 24px;
  font-size: 14px;
  color: #666;
}

.report-sections {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.report-section {
  padding: 16px 0;
}

.section-title {
  font-size: 18px;
  font-weight: 500;
  color: #333;
  margin: 0 0 12px 0;
  padding-left: 12px;
  border-left: 4px solid #2d5afa;
}

.section-content {
  font-size: 14px;
  line-height: 1.8;
  color: #666;
  margin-bottom: 16px;
}

.section-charts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  margin: 16px 0;
}

.chart-placeholder {
  border: 1px dashed #ddd;
  border-radius: 8px;
  padding: 16px;
  position: relative;
}

.chart-type-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #f0f0f0;
  color: #666;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
}

.chart-canvas {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
  border-radius: 4px;
  margin-top: 12px;
}

.chart-placeholder-text {
  color: #999;
  font-size: 14px;
}

.section-table {
  margin: 16px 0;
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.data-table th,
.data-table td {
  border: 1px solid #e0e0e0;
  padding: 10px 12px;
  text-align: left;
}

.data-table th {
  background: #f5f5f5;
  font-weight: 500;
  color: #333;
}

.data-table td {
  color: #666;
}

.data-table tbody tr:hover {
  background: #fafafa;
}

@media print {
  .preview-header {
    display: none;
  }

  .preview-content {
    padding: 0;
  }
}
</style>
