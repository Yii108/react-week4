import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import LoginForm from "../components/LoginForm";
import { useAuthContext } from "../context/AuthContext";
import { useProductsContext } from "../context/ProductsContext";

/**
 * 登入頁面
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuth, loading, error, login, clearError } = useAuthContext();
  const { fetchProducts } = useProductsContext();

  /**
   * 如果已登入，重導向到首頁
   */
  useEffect(() => {
    if (isAuth) {
      navigate("/", { replace: true });
    }
  }, [isAuth, navigate]);

  /**
   * 處理登入
   */
  const handleLogin = async (formData) => {
    const result = await login(formData);
    if (result.success) {
      // 登入成功後取得產品列表
      await fetchProducts();
      // 導向首頁
      navigate("/", { replace: true });
    }
  };

  return (
    <LoginForm
      onSubmit={handleLogin}
      loading={loading}
      error={error}
      onClearError={clearError}
    />
  );
};

export default LoginPage;
