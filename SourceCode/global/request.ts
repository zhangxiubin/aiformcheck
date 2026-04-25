/**
 * 全局请求配置
 */
import axios from 'axios';

// 创建请求实例
const request = axios.create({
  baseURL: '/api',
  timeout: 30000,
  withCredentials: true,
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 添加认证token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const { data } = response;

    // 处理业务错误
    if (data.success === false) {
      return Promise.reject(new Error(data.message || '请求失败'));
    }

    return data;
  },
  (error) => {
    // 处理HTTP错误
    if (error.response) {
      const { status } = error.response;

      switch (status) {
        case 401:
          // 未授权，跳转登录
          window.location.href = '/login';
          break;
        case 403:
          console.error('无权限访问');
          break;
        case 404:
          console.error('请求的资源不存在');
          break;
        case 500:
          console.error('服务器错误');
          break;
        default:
          console.error('请求失败');
      }
    }

    return Promise.reject(error);
  }
);

export default request;
