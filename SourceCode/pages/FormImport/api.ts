/**
 * 表单导入 API 接口
 */
import request from '@/global/request';
import type {
  FormImportData,
  ImportConfig,
  UploadResponse,
  QueryParams,
} from './types';

const BASE_URL = '/api/form-import';

/**
 * 上传表单文件
 * @param file 文件对象
 * @param config 导入配置
 */
export function uploadFormFile(
  file: File,
  config: ImportConfig
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('config', JSON.stringify(config));

  return request.post(`${BASE_URL}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

/**
 * 查询表单导入列表
 * @param params 查询参数
 */
export function queryFormImportList(
  params: QueryParams
): Promise<{ success: boolean; data: FormImportData[]; count: number }> {
  return request.get(`${BASE_URL}/list`, { params });
}

/**
 * 删除导入的表单
 * @param formId 表单ID
 */
export function deleteFormImport(
  formId: string
): Promise<{ success: boolean; message: string }> {
  return request.delete(`${BASE_URL}/${formId}`);
}

/**
 * 重新导入表单
 * @param formId 表单ID
 * @param config 导入配置
 */
export function reImportForm(
  formId: string,
  config: ImportConfig
): Promise<{ success: boolean; message: string }> {
  return request.post(`${BASE_URL}/reimport/${formId}`, config);
}

/**
 * 下载表单模板
 */
export function downloadTemplate(): Promise<Blob> {
  return request.get(`${BASE_URL}/template`, {
    responseType: 'blob',
  });
}

/**
 * 验证Excel文件格式
 * @param file 文件对象
 */
export function validateExcelFile(file: File): Promise<{
  success: boolean;
  valid: boolean;
  message?: string;
}> {
  const formData = new FormData();
  formData.append('file', file);

  return request.post(`${BASE_URL}/validate`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
