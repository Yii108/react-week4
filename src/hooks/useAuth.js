import { useState } from "react";
import { API_ENDPOINTS, apiClient } from "../config/api";

/**
 * 自定義認證 Hook
 * 處理使用者登入、登出及認證狀態管理
 */
export const useAuth = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * 登入函式
   */
  const login = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post(API_ENDPOINTS.LOGIN, formData);
      const { token, expired } = response.data;

      // 儲存 token 到 cookie
      document.cookie = `hexToken=${token};expires=${new Date(expired)};`;

      setIsAuth(true);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "登入失敗，請稍後再試";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * 檢查登入狀態
   */
  const checkLogin = async () => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("hexToken="))
        ?.split("=")[1];

      if (!token) {
        console.log("未找到 token");
        return false;
      }

      const res = await apiClient.post(API_ENDPOINTS.CHECK_AUTH);
      console.log("登入驗證成功:", res.data);
      return true;
    } catch (err) {
      console.error("登入驗證失敗:", err.response?.data?.message);
      return false;
    }
  };

  /**
   * 登出函式
   */
  const logout = () => {
    document.cookie = "hexToken=;expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    setIsAuth(false);
  };

  /**
   * 清除錯誤訊息
   */
  const clearError = () => {
    setError(null);
  };

  return {
    isAuth,
    loading,
    error,
    login,
    checkLogin,
    logout,
    clearError,
  };
};
