import axios from "axios";

// API 設定
export const API_BASE = import.meta.env.VITE_API_BASE;
export const API_PATH = import.meta.env.VITE_API_PATH;

/**
 * 建立 axios 實例
 * 預設配置 baseURL 和其他設定
 */
export const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * 請求攔截器
 * 自動在請求中加入 Authorization token
 */
apiClient.interceptors.request.use(
  (config) => {
    // 從 cookie 中取得 token
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("hexToken="))
      ?.split("=")[1];

    if (token) {
      config.headers.Authorization = token;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 回應攔截器
 * 統一處理錯誤
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 統一錯誤處理
    if (error.response) {
      // 伺服器回應錯誤
      console.error("API Error:", error.response.data);

      // 401 未授權
      if (error.response.status === 401) {
        // 清除 token
        document.cookie = "hexToken=;expires=Thu, 01 Jan 1970 00:00:00 GMT;";
        // 可以選擇重導向到登入頁面
        // window.location.href = '/login';
      }
    } else if (error.request) {
      // 請求已發送但沒有收到回應
      console.error("Network Error:", error.request);
    } else {
      // 其他錯誤
      console.error("Error:", error.message);
    }

    return Promise.reject(error);
  }
);

/**
 * API 端點
 */
export const API_ENDPOINTS = {
  // 認證相關
  LOGIN: "/admin/signin",
  LOGOUT: "/admin/signout",
  CHECK_AUTH: "/api/user/check",

  // 產品相關
  PRODUCTS: `/api/${API_PATH}/admin/products`,
  PRODUCT: (id) => `/api/${API_PATH}/admin/product/${id}`,
  CREATE_PRODUCT: `/api/${API_PATH}/admin/product`,
};

export default apiClient;
