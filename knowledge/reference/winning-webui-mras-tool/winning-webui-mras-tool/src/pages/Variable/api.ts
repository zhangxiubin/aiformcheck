/**
 * Variable Page API
 * 变量管理相关 API
 */

export interface VariableDir {
  mrasQaValclassId: string;
  vaclassName: string;
  mrasDataSourceConfigId?: string;
}

export interface Variable {
  mrasQaUservarId: string;
  mrasQaUservarName: string;
  mrasQaUservarNo: string;
  mrasQaUservarDesc: string;
  mrasQaUservarType: string;
  mrasQaUservarTypeDesc?: string;
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

// 查询变量列表
export async function queryVariable(params?: {
  pageNo?: number;
  pageSize?: number;
  mrasQaUservarName?: string;
  mrasQaValclassId?: string;
  pageType?: string;
}): Promise<ApiResponse<Variable[]>> {
  return request('/casebus/mras_qa_uservar/bus/query/by_example', {
    ...params,
  });
}

// 删除变量
export async function deleteVariable(params: {
  mrasQaUservarId: string;
}): Promise<ApiResponse<null>> {
  return request('/casebus/mras_qa_uservar/bus/delete', {
    ...params,
  });
}

// 更新/保存变量
export async function updateVariable(params: Record<string, unknown>): Promise<ApiResponse> {
  return request('/casebus/mras_qa_uservar/bus/update', {
    ...params,
  });
}

// 查询变量目录
export async function queryVariableDir(params?: Record<string, unknown>): Promise<ApiResponse<VariableDir[]>> {
  return request('/casebus/mras_qa_valclass/bus/query/by_example', {
    ...params,
  });
}

// 删除变量目录
export async function deleteVariableDir(params: {
  mrasQaValclassId: string;
}): Promise<ApiResponse<null>> {
  return request('/casebus/mras_qa_valclass/bus/delete', {
    ...params,
  });
}

// 更新/保存变量目录
export async function updateVariableDir(params: Record<string, unknown>): Promise<ApiResponse> {
  return request('/casebus/mras_qa_valclass/bus/update', {
    ...params,
  });
}
