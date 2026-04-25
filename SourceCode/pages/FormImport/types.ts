/**
 * 表单导入模块类型定义
 */

// 表单导入数据接口
export interface FormImportData {
  formId?: string;              // 表单ID
  formName: string;             // 表单名称
  fileName: string;             // 文件名
  fileSize: number;             // 文件大小
  uploadTime: string;           // 上传时间
  status: ImportStatus;         // 导入状态
  errorMessage?: string;        // 错误信息
}

// 导入状态枚举
export enum ImportStatus {
  PENDING = 'pending',          // 待导入
  IMPORTING = 'importing',      // 导入中
  SUCCESS = 'success',          // 成功
  FAILED = 'failed',            // 失败
}

// 导入配置选项
export interface ImportConfig {
  overwriteExisting: boolean;   // 覆盖已存在的表单
  createNewVersion: boolean;    // 创建新版本
  validateData: boolean;        // 验证数据
  skipEmptyRows: boolean;       // 跳过空行
  sheetIndex?: number;          // 工作表索引
}

// 文件上传响应
export interface UploadResponse {
  success: boolean;
  message: string;
  data?: {
    fileId: string;
    fileName: string;
    fileSize: number;
    preview?: FormFieldPreview[];
  };
}

// 表单字段预览
export interface FormFieldPreview {
  fieldName: string;            // 字段名称
  fieldType: string;            // 字段类型
  defaultValue?: string;        // 默认值
  required: boolean;            // 是否必填
  options?: FieldOption[];      // 选项（用于select、radio等）
}

// 字段选项
export interface FieldOption {
  label: string;                // 选项标签
  value: string | number;       // 选项值
}

// 分页参数
export interface PaginationParams {
  pageNo: number;
  pageSize: number;
}

// 查询参数
export interface QueryParams extends PaginationParams {
  formName?: string;
  status?: ImportStatus;
}
