import { useState } from "react";
import PropTypes from "prop-types";

/**
 * 登入表單組件
 */
const LoginForm = ({ onSubmit, loading, error, onClearError }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
    // 當用戶開始輸入時，清除錯誤訊息
    if (error && onClearError) {
      onClearError();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="container login">
      <div className="row justify-content-center">
        <h1 className="h3 mb-3 font-weight-normal">請先登入</h1>
        <div className="col-8">
          <form id="form" className="form-signin" onSubmit={handleSubmit}>
            {/* 錯誤訊息顯示 */}
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {/* Email 輸入欄位 */}
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                id="username"
                name="username"
                placeholder="name@example.com"
                value={formData.username}
                onChange={handleInputChange}
                required
                autoFocus
                disabled={loading}
              />
              <label htmlFor="username">Email address</label>
            </div>

            {/* 密碼輸入欄位 */}
            <div className="form-floating">
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
              <label htmlFor="password">Password</label>
            </div>

            {/* 登入按鈕 */}
            <button
              className="btn btn-lg btn-primary w-100 mt-3"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  登入中...
                </>
              ) : (
                "登入"
              )}
            </button>
          </form>
        </div>
      </div>
      {/* 頁尾版權資訊 */}
      <p className="mt-5 mb-3 text-muted">&copy; 2025~∞ - 六角學院</p>
    </div>
  );
};

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  onClearError: PropTypes.func,
};

export default LoginForm;
