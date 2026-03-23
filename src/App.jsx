import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProductsProvider } from "./context/ProductsContext";
import { useAuthContext } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import ProductsPage from "./pages/ProductsPage";
import "./assets/style.css";

/**
 * App 路由配置組件
 */
const AppRoutes = () => {
  const { isAuth } = useAuthContext();

  return (
    <Routes>
      {/* 登入頁面 */}
      <Route path="/login" element={<LoginPage />} />

      {/* 首頁（受保護） */}
      <Route
        path="/"
        element={
          <ProtectedRoute isAuth={isAuth}>
            <ProductsPage />
          </ProtectedRoute>
        }
      />

      {/* 404 重導向 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

/**
 * App 主組件
 * 提供路由、認證和產品狀態管理
 */
function App() {
  return (
    <BrowserRouter basename="/react-week3">
      <AuthProvider>
        <ProductsProvider>
          <AppRoutes />
        </ProductsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
