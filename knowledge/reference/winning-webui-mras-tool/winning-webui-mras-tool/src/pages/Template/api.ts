/**
 * Template Page API
 * 模板管理相关 API
 */

export interface Template {
  mrasQaTempId: string;
  templateName: string;
  busClassName: string;
  tempTypeDesc: string;
  templateTypeName: string;
  tempGenerateModeDesc: string;
  modifierName: string;
  modifiedAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  errorDetail: string | null;
  data: T;
  count?: number | string;
}

// 通用请求函数
async function request<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
  try {
    // 使用原生 fetch 发起请求
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data || {}),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}

// 查询模板列表
export async function queryTemplateList(params?: {
  pageNo?: number;
  pageSize?: number;
  templateName?: string;
  hiddenFlag?: number;
  pageType?: string;
}): Promise<ApiResponse<Template[]>> {
  return request('/casebus/mras_qa_temp/bus/query/by_example', {
    ...params,
  });
}

// 删除模板
export async function deleteTemplate(params: {
  mrasQaTempId: string;
}): Promise<ApiResponse<null>> {
  return request('/casebus/mras_qa_temp/bus/delete', {
    ...params,
  });
}

// 查询模板内容
export async function queryTemplate(params: {
  mrasQaTempId: string;
}): Promise<ApiResponse<{ tempContentData: string }[]>> {
  return request('/casebus/mras_qa_tempcontent/bus/query/by_example', {
    ...params,
  });
}

// 更新/保存模板
export async function updateTemplate(params: Record<string, unknown>): Promise<ApiResponse> {
  return request('/casebus/mras_qa_temp/bus/update', {
    ...params,
  });
}
