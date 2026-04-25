/**
 * AI Report Module Mock API
 * 模拟数据用于前端开发和测试
 */

// 辅助函数：生成日期
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 辅助函数：生成随机ID
function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ==================== 模拟模板数据 ====================
const mockTemplates = [
  {
    mrasQaTempId: 'temp-001',
    templateName: '月度医疗质量控制报告',
    busClassName: '质控报告',
    tempTypeDesc: '月度',
    templateTypeName: '富文本',
    tempGenerateModeDesc: '自动',
    modifierName: '张主任',
    modifiedAt: formatDate(new Date(Date.now() - 86400000)),
  },
  {
    mrasQaTempId: 'temp-002',
    templateName: '季度医疗工作总结报告',
    busClassName: '总结报告',
    tempTypeDesc: '季度',
    templateTypeName: '富文本',
    tempGenerateModeDesc: '自动',
    modifierName: '李医生',
    modifiedAt: formatDate(new Date(Date.now() - 172800000)),
  },
  {
    mrasQaTempId: 'temp-003',
    templateName: '年度医疗质量分析报告',
    busClassName: '分析报告',
    tempTypeDesc: '年度',
    templateTypeName: '图表',
    tempGenerateModeDesc: '自动',
    modifierName: '王院长',
    modifiedAt: formatDate(new Date(Date.now() - 259200000)),
  },
  {
    mrasQaTempId: 'temp-004',
    templateName: '日常护理质量巡检报告',
    busClassName: '巡检报告',
    tempTypeDesc: '日度',
    templateTypeName: '富文本',
    tempGenerateModeDesc: '自动',
    modifierName: '赵护士长',
    modifiedAt: formatDate(new Date(Date.now() - 43200000)),
  },
  {
    mrasQaTempId: 'temp-005',
    templateName: '医疗不良事件分析报告',
    busClassName: '事件报告',
    tempTypeDesc: '实时',
    templateTypeName: '富文本',
    tempGenerateModeDesc: '手动',
    modifierName: '钱主任',
    modifiedAt: formatDate(new Date(Date.now() - 129600000)),
  },
  {
    mrasQaTempId: 'temp-006',
    templateName: '医院感染监测报告',
    busClassName: '质控报告',
    tempTypeDesc: '周度',
    templateTypeName: '图表',
    tempGenerateModeDesc: '自动',
    modifierName: '孙医师',
    modifiedAt: formatDate(new Date(Date.now() - 604800000)),
  },
  {
    mrasQaTempId: 'temp-007',
    templateName: '抗生素使用情况分析',
    busClassName: '分析报告',
    tempTypeDesc: '月度',
    templateTypeName: '混合',
    tempGenerateModeDesc: '自动',
    modifierName: '周药师',
    modifiedAt: formatDate(new Date(Date.now() - 43200000)),
  },
  {
    mrasQaTempId: 'temp-008',
    templateName: '手术安全核查报告',
    busClassName: '质控报告',
    tempTypeDesc: '周度',
    templateTypeName: '富文本',
    tempGenerateModeDesc: '自动',
    modifierName: '吴主任',
    modifiedAt: formatDate(new Date(Date.now() - 86400000)),
  },
  {
    mrasQaTempId: 'temp-009',
    templateName: '临床路径执行情况统计',
    busClassName: '统计报告',
    tempTypeDesc: '月度',
    templateTypeName: '图表',
    tempGenerateModeDesc: '自动',
    modifierName: '郑医师',
    modifiedAt: formatDate(new Date(Date.now() - 216000000)),
  },
  {
    mrasQaTempId: 'temp-010',
    templateName: '患者满意度调查报告',
    busClassName: '满意度报告',
    tempTypeDesc: '季度',
    templateTypeName: '图表',
    tempGenerateModeDesc: '自动',
    modifierName: '冯科长',
    modifiedAt: formatDate(new Date(Date.now() - 86400000)),
  },
  {
    mrasQaTempId: 'temp-011',
    templateName: '医疗设备运行状态报告',
    busClassName: '巡检报告',
    tempTypeDesc: '日度',
    templateTypeName: '富文本',
    tempGenerateModeDesc: '自动',
    modifierName: '陈工程师',
    modifiedAt: formatDate(new Date(Date.now() - 43200000)),
  },
  {
    mrasQaTempId: 'temp-012',
    templateName: '病案质量检查报告',
    busClassName: '质控报告',
    tempTypeDesc: '月度',
    templateTypeName: '富文本',
    tempGenerateModeDesc: '手动',
    modifierName: '楚医师',
    modifiedAt: formatDate(new Date(Date.now() - 172800000)),
  },
  {
    mrasQaTempId: 'temp-013',
    templateName: '急诊科月度工作总结',
    busClassName: '总结报告',
    tempTypeDesc: '月度',
    templateTypeName: '富文本',
    tempGenerateModeDesc: '自动',
    modifierName: '卫主任',
    modifiedAt: formatDate(new Date(Date.now() - 86400000)),
  },
  {
    mrasQaTempId: 'temp-014',
    templateName: 'ICU质量监测报告',
    busClassName: '质控报告',
    tempTypeDesc: '周度',
    templateTypeName: '图表',
    tempGenerateModeDesc: '自动',
    modifierName: '蒋医师',
    modifiedAt: formatDate(new Date(Date.now() - 259200000)),
  },
  {
    mrasQaTempId: 'temp-015',
    templateName: '门诊处方点评报告',
    busClassName: '分析报告',
    tempTypeDesc: '周度',
    templateTypeName: '富文本',
    tempGenerateModeDesc: '自动',
    modifierName: '沈药师',
    modifiedAt: formatDate(new Date(Date.now() - 43200000)),
  },
  {
    mrasQaTempId: 'temp-016',
    templateName: '医疗废弃物处理报告',
    busClassName: '环境报告',
    tempTypeDesc: '月度',
    templateTypeName: '富文本',
    tempGenerateModeDesc: '自动',
    modifierName: '韩主管',
    modifiedAt: formatDate(new Date(Date.now() - 302400000)),
  },
  {
    mrasQaTempId: 'temp-017',
    templateName: '医护人员培训记录报告',
    busClassName: '培训报告',
    tempTypeDesc: '季度',
    templateTypeName: '富文本',
    tempGenerateModeDesc: '手动',
    modifierName: '杨教员',
    modifiedAt: formatDate(new Date(Date.now() - 86400000)),
  },
  {
    mrasQaTempId: 'temp-018',
    templateName: '医保费用分析报告',
    busClassName: '分析报告',
    tempTypeDesc: '月度',
    templateTypeName: '图表',
    tempGenerateModeDesc: '自动',
    modifierName: '朱会计',
    modifiedAt: formatDate(new Date(Date.now() - 216000000)),
  },
];

// ==================== 模拟报告分类数据 ====================
const mockReportClasses = [
  { mrasQaClassId: 'class-001', className: '质控报告' },
  { mrasQaClassId: 'class-002', className: '总结报告' },
  { mrasQaClassId: 'class-003', className: '分析报告' },
  { mrasQaClassId: 'class-004', className: '巡检报告' },
  { mrasQaClassId: 'class-005', className: '事件报告' },
  { mrasQaClassId: 'class-006', className: '统计报告' },
  { mrasQaClassId: 'class-007', className: '满意度报告' },
  { mrasQaClassId: 'class-008', className: '环境报告' },
  { mrasQaClassId: 'class-009', className: '培训报告' },
];

// ==================== 模拟变量目录数据 ====================
const mockVariableDirs = [
  {
    mrasQaValclassId: 'dir-001',
    vaclassName: '系统基础变量',
    mrasDataSourceConfigId: 'ds-001',
  },
  {
    mrasQaValclassId: 'dir-002',
    vaclassName: '患者基本信息',
    mrasDataSourceConfigId: 'ds-002',
  },
  {
    mrasQaValclassId: 'dir-003',
    vaclassName: '诊疗相关变量',
    mrasDataSourceConfigId: 'ds-003',
  },
  {
    mrasQaValclassId: 'dir-004',
    vaclassName: '医嘱执行变量',
    mrasDataSourceConfigId: 'ds-004',
  },
  {
    mrasQaValclassId: 'dir-005',
    vaclassName: '检验检查变量',
    mrasDataSourceConfigId: 'ds-005',
  },
  {
    mrasQaValclassId: 'dir-006',
    vaclassName: '护理质量变量',
    mrasDataSourceConfigId: 'ds-006',
  },
  {
    mrasQaValclassId: 'dir-007',
    vaclassName: '药品管理变量',
    mrasDataSourceConfigId: 'ds-007',
  },
  {
    mrasQaValclassId: 'dir-008',
    vaclassName: '费用统计变量',
    mrasDataSourceConfigId: 'ds-008',
  },
];

// ==================== 模拟变量数据 ====================
const mockVariables = [
  // 系统基础变量
  {
    mrasQaUservarId: 'var-001',
    mrasQaUservarName: '当前日期',
    mrasQaUservarNo: 'current_date',
    mrasQaUservarDesc: '报告生成的当前日期',
    mrasQaUservarType: 'SYSTEM',
    mrasQaUservarTypeDesc: '系统变量',
  },
  {
    mrasQaUservarId: 'var-002',
    mrasQaUservarName: '报告周期',
    mrasQaUservarNo: 'report_period',
    mrasQaUservarDesc: '报告统计周期',
    mrasQaUservarType: 'SYSTEM',
    mrasQaUservarTypeDesc: '系统变量',
  },
  {
    mrasQaUservarId: 'var-003',
    mrasQaUservarName: '科室名称',
    mrasQaUservarNo: 'dept_name',
    mrasQaUservarDesc: '当前科室名称',
    mrasQaUservarType: 'SYSTEM',
    mrasQaUservarTypeDesc: '系统变量',
  },

  // 患者基本信息
  {
    mrasQaUservarId: 'var-101',
    mrasQaUservarName: '患者总数',
    mrasQaUservarNo: 'patient_total',
    mrasQaUservarDesc: '统计期内患者总人数',
    mrasQaUservarType: 'NORMAL',
    mrasQaUservarTypeDesc: '普通变量',
  },
  {
    mrasQaUservarId: 'var-102',
    mrasQaUservarName: '平均年龄',
    mrasQaUservarNo: 'avg_age',
    mrasQaUservarDesc: '患者平均年龄',
    mrasQaUservarType: 'NORMAL',
    mrasQaUservarTypeDesc: '普通变量',
  },
  {
    mrasQaUservarId: 'var-103',
    mrasQaUservarName: '性别分布',
    mrasQaUservarNo: 'gender_distribution',
    mrasQaUservarDesc: '患者性别比例分布',
    mrasQaUservarType: 'NORMAL',
    mrasQaUservarTypeDesc: '普通变量',
  },
  {
    mrasQaUservarId: 'var-104',
    mrasQaUservarName: '医保类型',
    mrasQaUservarNo: 'insurance_type',
    mrasQaUservarDesc: '患者医保类型分布',
    mrasQaUservarType: 'NORMAL',
    mrasQaUservarTypeDesc: '普通变量',
  },
  {
    mrasQaUservarId: 'var-105',
    mrasQaUservarName: '入院来源',
    mrasQaUservarNo: 'admission_source',
    mrasQaUservarDesc: '患者入院来源统计',
    mrasQaUservarType: 'NORMAL',
    mrasQaUservarTypeDesc: '普通变量',
  },

  // 诊疗相关变量
  {
    mrasQaUservarId: 'var-201',
    mrasQaUservarName: '住院总天数',
    mrasQaUservarNo: 'total_inpatient_days',
    mrasQaUservarDesc: '统计期内住院总天数',
    mrasQaUservarType: 'NORMAL',
    mrasQaUservarTypeDesc: '普通变量',
  },
  {
    mrasQaUservarId: 'var-202',
    mrasQaUservarName: '平均住院日',
    mrasQaUservarNo: 'avg_length_of_stay',
    mrasQaUservarDesc: '患者平均住院天数',
    mrasQaUservarType: 'NORMAL',
    mrasQaUservarTypeDesc: '普通变量',
  },
  {
    mrasQaUservarId: 'var-203',
    mrasQaUservarName: '手术例数',
    mrasQaUservarNo: 'surgery_count',
    mrasQaUservarDesc: '统计期内手术总例数',
    mrasQaUservarType: 'NORMAL',
    mrasQaUservarTypeDesc: '普通变量',
  },
  {
    mrasQaUservarId: 'var-204',
    mrasQaUservarName: '死亡人数',
    mrasQaUservarNo: 'death_count',
    mrasQaUservarDesc: '统计期内死亡人数',
    mrasQaUservarType: 'NORMAL',
    mrasQaUservarTypeDesc: '普通变量',
  },
  {
    mrasQaUservarId: 'var-205',
    mrasQaUservarName: '死亡率',
    mrasQaUservarNo: 'death_rate',
    mrasQaUservarDesc: '患者死亡率百分比',
    mrasQaUservarType: 'NORMAL',
    mrasQaUservarTypeDesc: '普通变量',
  },
  {
    mrasQaUservarId: 'var-206',
    mrasQaUservarName: '再入院率',
    mrasQaUservarNo: 'readmission_rate',
    mrasQaUservarDesc: '患者31天内再入院率',
    mrasQaUservarType: 'NORMAL',
    mrasQaUservarTypeDesc: '普通变量',
  },
  {
    mrasQaUservarId: 'var-207',
    mrasQaUservarName: '床位使用率',
    mrasQaUservarNo: 'bed_utilization_rate',
    mrasQaUservarDesc: '病床使用率百分比',
    mrasQaUservarType: 'NORMAL',
    mrasQaUservarTypeDesc: '普通变量',
  },
  {
    mrasQaUservarId: 'var-208',
    mrasQaUservarName: '病床周转次数',
    mrasQaUservarNo: 'bed_turnover',
    mrasQaUservarDesc: '病床周转次数统计',
    mrasQaUservarType: 'NORMAL',
    mrasQaUservarTypeDesc: '普通变量',
  },

  // 医嘱执行变量
  {
    mrasQaUservarId: 'var-301',
    mrasQaUservarName: '医嘱总数',
    mrasQaUservarNo: 'order_total',
    mrasQaUservarDesc: '统计期内医嘱总数',
    mrasQaUservarType: 'NORMAL',
    mrasQaUservarTypeDesc: '普通变量',
  },
  {
    mrasQaUservarId: 'var-302',
    mrasQaUservarName: '长期医嘱数',
    mrasQaUservarNo: 'long_term_orders',
    mrasQaUservarDesc: '长期医嘱数量',
    mrasQaUservarType: 'NORMAL',
    mrasQaUservarTypeDesc: '普通变量',
  },
  {
    mrasQaUservarId: 'var-303',
    mrasQaUservarName: '临时医嘱数',
    mrasQaUservarNo: 'temporary_orders',
    mrasQaUservarDesc: '临时医嘱数量',
    mrasQaUservarType: 'NORMAL',
    mrasQaUservarTypeDesc: '普通变量',
  },
  {
    mrasQaUservarId: 'var-304',
    mrasQaUservarName: '医嘱执行率',
    mrasQaUservarNo: 'order_execution_rate',
    mrasQaUservarDesc: '医嘱按时执行率',
    mrasQaUservarType: 'NORMAL',
    mrasQaUservarTypeDesc: '普通变量',
  },

  // 检验检查变量
  {
    mrasQaUservarId: 'var-401',
    mrasQaUservarName: '检验项目数',
    mrasQaUservarNo: 'lab_test_count',
    mrasQaUservarDesc: '检验项目总数',
    mrasQaUservarType: 'NORMAL',
    mrasQaUservarTypeDesc: '普通变量',
  },
  {
    mrasQaUservarId: 'var-402',
    mrasQaUservarName: '危急值报告数',
    mrasQaUservarNo: 'critical_value_count',
    mrasQaUservarDesc: '危急值报告总数',
    mrasQaUservarType: 'NORMAL',
    mrasQaUservarTypeDesc: '普通变量',
  },
  {
    mrasQaUservarId: 'var-403',
    mrasQaUservarName: '检查完成率',
    mrasQaUservarNo: 'exam_completion_rate',
    mrasQaUservarDesc: '检查项目按时完成率',
    mrasQaUservarType: 'NORMAL',
    mrasQaUservarTypeDesc: '普通变量',
  },
  {
    mrasQaUservarId: 'var-404',
    mrasQaUservarName: '影像检查数',
    mrasQaUservarNo: 'radiology_exam_count',
    mrasQaUservarDesc: '影像学检查数量',
    mrasQaUservarType: 'NORMAL',
    mrasQaUservarTypeDesc: '普通变量',
  },

  // 护理质量变量
  {
    mrasQaUservarId: 'var-501',
    mrasQaUservarName: '压疮发生率',
    mrasQaUservarNo: 'pressure_ulcer_rate',
    mrasQaUservarDesc: '院内压疮发生率',
    mrasQaUservarType: 'NORMAL',
    mrasQaUservarTypeDesc: '普通变量',
  },
  {
    mrasQaUservarId: 'var-502',
    mrasQaUservarName: '跌倒坠床率',
    mrasQaUservarNo: 'fall_rate',
    mrasQaUservarDesc: '患者跌倒坠床发生率',
    mrasQaUservarType: 'NORMAL',
    mrasQaUservarTypeDesc: '普通变量',
  },
  {
    mrasQaUservarId: 'var-503',
    mrasQaUservarName: '护理合格率',
    mrasQaUservarNo: 'nursing_quality_rate',
    mrasQaUservarDesc: '护理质量合格率',
    mrasQaUservarType: 'NORMAL',
    mrasQaUservarTypeDesc: '普通变量',
  },
  {
    mrasQaUservarId: 'var-504',
    mrasQaUservarName: '健康教育覆盖率',
    mrasQaUservarNo: 'health_education_coverage',
    mrasQaUservarDesc: '患者健康教育覆盖率',
    mrasQaUservarType: 'NORMAL',
    mrasQaUservarTypeDesc: '普通变量',
  },

  // 药品管理变量
  {
    mrasQaUservarId: 'var-601',
    mrasQaUservarName: '抗生素使用率',
    mrasQaUservarNo: 'antibiotic_usage_rate',
    mrasQaUservarDesc: '抗生素药物使用率',
    mrasQaUservarType: 'NORMAL',
    mrasQaUservarTypeDesc: '普通变量',
  },
  {
    mrasQaUservarId: 'var-602',
    mrasQaUservarName: '特殊药品使用数',
    mrasQaUservarNo: 'special_drug_count',
    mrasQaUservarDesc: '特殊管制药品使用数量',
    mrasQaUservarType: 'NORMAL',
    mrasQaUservarTypeDesc: '普通变量',
  },
  {
    mrasQaUservarId: 'var-603',
    mrasQaUservarName: '处方合格率',
    mrasQaUservarNo: 'prescription_pass_rate',
    mrasQaUservarDesc: '处方审核合格率',
    mrasQaUservarType: 'NORMAL',
    mrasQaUservarTypeDesc: '普通变量',
  },
  {
    mrasQaUservarId: 'var-604',
    mrasQaUservarName: '药品配送及时率',
    mrasQaUservarNo: 'drug_delivery_rate',
    mrasQaUservarDesc: '药品配送及时率',
    mrasQaUservarType: 'NORMAL',
    mrasQaUservarTypeDesc: '普通变量',
  },

  // 费用统计变量
  {
    mrasQaUservarId: 'var-701',
    mrasQaUservarName: '总费用',
    mrasQaUservarNo: 'total_cost',
    mrasQaUservarDesc: '统计期内总费用',
    mrasQaUservarType: 'NORMAL',
    mrasQaUservarTypeDesc: '普通变量',
  },
  {
    mrasQaUservarId: 'var-702',
    mrasQaUservarName: '人均费用',
    mrasQaUservarNo: 'avg_cost_per_patient',
    mrasQaUservarDesc: '人均住院费用',
    mrasQaUservarType: 'NORMAL',
    mrasQaUservarTypeDesc: '普通变量',
  },
  {
    mrasQaUservarId: 'var-703',
    mrasQaUservarName: '药占比',
    mrasQaUservarNo: 'drug_cost_ratio',
    mrasQaUservarDesc: '药品费用占总费用比例',
    mrasQaUservarType: 'NORMAL',
    mrasQaUservarTypeDesc: '普通变量',
  },
  {
    mrasQaUservarId: 'var-704',
    mrasQaUservarName: '医保报销金额',
    mrasQaUservarNo: 'insurance_reimbursement',
    mrasQaUservarDesc: '医保报销总金额',
    mrasQaUservarType: 'NORMAL',
    mrasQaUservarTypeDesc: '普通变量',
  },
  {
    mrasQaUservarId: 'var-705',
    mrasQaUservarName: '自费金额',
    mrasQaUservarNo: 'self_pay_amount',
    mrasQaUservarDesc: '患者自费金额',
    mrasQaUservarType: 'NORMAL',
    mrasQaUservarTypeDesc: '普通变量',
  },
];

// Mock API 配置
export default {
  // ==================== 模板管理 API ====================

  // 查询模板列表
  'POST /casebus/mras_qa_temp/bus/query/by_example': (req: any, res: any) => {
    const { pageNo = 0, pageSize = 20, templateName } = req.body;

    let data = [...mockTemplates];

    // 根据模板名称过滤
    if (templateName) {
      data = data.filter(item =>
        item.templateName.toLowerCase().includes(templateName.toLowerCase())
      );
    }

    // 分页
    const start = pageNo * pageSize;
    const end = start + pageSize;
    const paginatedData = data.slice(start, end);

    res.json({
      success: true,
      errorDetail: null,
      data: paginatedData,
      count: data.length,
    });
  },

  // 查询模板内容
  'POST /casebus/mras_qa_tempcontent/bus/query/by_example': (req: any, res: any) => {
    const { mrasQaTempId } = req.body;

    res.json({
      success: true,
      errorDetail: null,
      data: [{
        mrasQaTempId,
        tempContentData: `
          <div style="padding: 20px;">
            <h1 style="text-align: center; color: #2d5afa;">医疗质量分析报告</h1>
            <p style="margin-top: 20px; line-height: 1.8;">本报告对医疗质量进行了全面分析，涵盖了患者满意度、医疗安全指标、临床路径执行情况等多个维度。</p>
            <h2 style="margin-top: 30px; color: #333;">一、患者概况</h2>
            <p style="line-height: 1.8;">本期共接诊患者 <strong>1,234</strong> 人次，较上期增长 <strong>6.7%</strong>。</p>
            <h2 style="margin-top: 30px; color: #333;">二、质量指标</h2>
            <p style="line-height: 1.8;">医疗质量各项指标均达到预期目标，患者满意度保持在较高水平。</p>
          </div>
        `,
      }],
    });
  },

  // 更新/保存模板
  'POST /casebus/mras_qa_temp/bus/update': (req: any, res: any) => {
    res.json({
      success: true,
      errorDetail: null,
      data: {
        mrasQaTempId: generateId('temp'),
        ...req.body,
        modifiedAt: formatDate(new Date()),
      },
    });
  },

  // 删除模板
  'POST /casebus/mras_qa_temp/bus/delete': (req: any, res: any) => {
    res.json({
      success: true,
      errorDetail: null,
      data: null,
    });
  },

  // ==================== 报告分类 API ====================

  // 查询报告分类
  'POST /casebus/mras_qa_class/bus/query/by_example': (req: any, res: any) => {
    res.json({
      success: true,
      errorDetail: null,
      data: mockReportClasses,
      count: mockReportClasses.length,
    });
  },

  // 更新/保存报告分类
  'POST /casebus/mras_qa_class/bus/update': (req: any, res: any) => {
    res.json({
      success: true,
      errorDetail: null,
      data: {
        mrasQaClassId: generateId('class'),
        ...req.body,
      },
    });
  },

  // 删除报告分类
  'POST /casebus/mras_qa_class/bus/delete': (req: any, res: any) => {
    res.json({
      success: true,
      errorDetail: null,
      data: null,
    });
  },

  // ==================== 变量目录管理 API ====================

  // 查询变量目录
  'POST /casebus/mras_qa_valclass/bus/query/by_example': (req: any, res: any) => {
    res.json({
      success: true,
      errorDetail: null,
      data: mockVariableDirs,
      count: mockVariableDirs.length,
    });
  },

  // 更新/保存变量目录
  'POST /casebus/mras_qa_valclass/bus/update': (req: any, res: any) => {
    res.json({
      success: true,
      errorDetail: null,
      data: {
        mrasQaValclassId: generateId('dir'),
        ...req.body,
      },
    });
  },

  // 删除变量目录
  'POST /casebus/mras_qa_valclass/bus/delete': (req: any, res: any) => {
    res.json({
      success: true,
      errorDetail: null,
      data: null,
    });
  },

  // ==================== 变量管理 API ====================

  // 查询变量列表
  'POST /casebus/mras_qa_uservar/bus/query/by_example': (req: any, res: any) => {
    const { pageNo = 0, pageSize = 20, mrasQaUservarName } = req.body;

    let data = [...mockVariables];

    // 根据变量名称过滤
    if (mrasQaUservarName) {
      data = data.filter(item =>
        item.mrasQaUservarName.toLowerCase().includes(mrasQaUservarName.toLowerCase()) ||
        item.mrasQaUservarNo.toLowerCase().includes(mrasQaUservarName.toLowerCase())
      );
    }

    // 分页
    const start = pageNo * pageSize;
    const end = start + pageSize;
    const paginatedData = data.slice(start, end);

    res.json({
      success: true,
      errorDetail: null,
      data: paginatedData,
      count: data.length,
    });
  },

  // 更新/保存变量
  'POST /casebus/mras_qa_uservar/bus/update': (req: any, res: any) => {
    res.json({
      success: true,
      errorDetail: null,
      data: {
        mrasQaUservarId: generateId('var'),
        ...req.body,
      },
    });
  },

  // 删除变量
  'POST /casebus/mras_qa_uservar/bus/delete': (req: any, res: any) => {
    res.json({
      success: true,
      errorDetail: null,
      data: null,
    });
  },
};
