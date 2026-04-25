/**
 * 表单导入 API 接口（演示版 - 使用模拟数据）
 */
import type {
  FormImportData,
  ImportConfig,
  UploadResponse,
  QueryParams,
} from './types';

// 模拟数据存储
let mockFormImportList: FormImportData[] = [
  {
    formId: '1',
    formName: '临床科室医疗质量考核评分标准',
    fileName: '临床科室医疗质量考核评分标准.xls',
    fileSize: 204800,
    uploadTime: '2026-04-23 10:30:00',
    status: 'success' as any,
    errorMessage: ''
  },
  {
    formId: '2',
    formName: '护理质量评分表',
    fileName: '护理质量评分表.xlsx',
    fileSize: 153600,
    uploadTime: '2026-04-23 11:15:00',
    status: 'failed' as any,
    errorMessage: '文件格式不正确，缺少必填列'
  }
];

/**
 * 上传表单文件（模拟）
 */
export function uploadFormFile(
  file: File,
  config: ImportConfig
): Promise<UploadResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newForm: FormImportData = {
        formId: Date.now().toString(),
        formName: file.name.replace(/\.(xls|xlsx)$/, ''),
        fileName: file.name,
        fileSize: file.size,
        uploadTime: new Date().toLocaleString(),
        status: 'success' as any,
        errorMessage: ''
      };

      mockFormImportList.unshift(newForm);

      resolve({
        success: true,
        message: '上传成功',
        data: {
          fileId: newForm.formId,
          fileName: newForm.fileName,
          fileSize: newForm.fileSize
        }
      });
    }, 1000);
  });
}

/**
 * 查询表单导入列表（模拟）
 */
export function queryFormImportList(
  params: QueryParams
): Promise<{ success: boolean; data: FormImportData[]; count: number }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredList = [...mockFormImportList];

      // 按名称过滤
      if (params.formName) {
        filteredList = filteredList.filter(item =>
          item.formName.includes(params.formName!)
        );
      }

      // 按状态过滤
      if (params.status) {
        filteredList = filteredList.filter(item => item.status === params.status);
      }

      const start = params.pageNo * params.pageSize;
      const end = start + params.pageSize;
      const paginatedList = filteredList.slice(start, end);

      resolve({
        success: true,
        data: paginatedList,
        count: filteredList.length
      });
    }, 300);
  });
}

/**
 * 删除导入的表单（模拟）
 */
export function deleteFormImport(
  formId: string
): Promise<{ success: boolean; message: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockFormImportList.findIndex(item => item.formId === formId);
      if (index > -1) {
        mockFormImportList.splice(index, 1);
        resolve({ success: true, message: '删除成功' });
      } else {
        resolve({ success: false, message: '表单不存在' });
      }
    }, 300);
  });
}

/**
 * 重新导入表单（模拟）
 */
export function reImportForm(
  formId: string,
  config: ImportConfig
): Promise<{ success: boolean; message: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const form = mockFormImportList.find(item => item.formId === formId);
      if (form) {
        form.status = 'success' as any;
        form.errorMessage = '';
        resolve({ success: true, message: '重新导入成功' });
      } else {
        resolve({ success: false, message: '表单不存在' });
      }
    }, 800);
  });
}

/**
 * 下载表单模板（模拟）
 */
export function downloadTemplate(): Promise<Blob> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockContent = '模拟的Excel模板文件内容';
      const blob = new Blob([mockContent], { type: 'application/vnd.ms-excel' });
      resolve(blob);
    }, 500);
  });
}

/**
 * 验证Excel文件格式（模拟）
 */
export function validateExcelFile(file: File): Promise<{
  success: boolean;
  valid: boolean;
  message?: string;
}> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const isValidExt = /\.(xls|xlsx)$/.test(file.name);
      resolve({
        success: true,
        valid: isValidExt,
        message: isValidExt ? '文件格式验证通过' : '只支持 .xls 或 .xlsx 格式的文件'
      });
    }, 300);
  });
}
