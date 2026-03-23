import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as bootstrap from "bootstrap";
import ProductList from "../components/ProductList";
import ProductDetail from "../components/ProductDetail";
import { useAuthContext } from "../context/AuthContext";
import { useProductsContext } from "../context/ProductsContext";
import { apiClient, API_ENDPOINTS } from "../config/api";

const INITIAL_TEMPLATE_DATA = {
  id: "",
  title: "",
  category: "",
  origin_price: "",
  price: "",
  unit: "",
  description: "",
  content: "",
  is_enabled: false,
  imageUrl: "",
  imagesUrl: [],
};

/**
 * 產品管理頁面
 */
const ProductsPage = () => {
  const navigate = useNavigate();
  const { checkLogin, logout } = useAuthContext();
  const { products, loading, fetchProducts } = useProductsContext();
  const [tempProduct, setTempProduct] = useState(null);
  const [modalType, setModalType] = useState(""); // "create" | "edit" | "delete"
  const [templateData, setTemplateData] = useState(INITIAL_TEMPLATE_DATA);
  const productModalRef = useRef(null);
  const deleteModalRef = useRef(null);

  /**
   * 頁面載入時取得產品列表、初始化 Modal
   */
  useEffect(() => {
    fetchProducts();

    productModalRef.current = new bootstrap.Modal("#productModal", { keyboard: false });
    document.querySelector("#productModal").addEventListener("hide.bs.modal", () => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    });

    deleteModalRef.current = new bootstrap.Modal("#deleteModal", { keyboard: false });
    document.querySelector("#deleteModal").addEventListener("hide.bs.modal", () => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openModal = (product, type) => {
    setTemplateData(type === "create" ? { ...INITIAL_TEMPLATE_DATA, imagesUrl: [""] } : { ...product, imagesUrl: product.imagesUrl ?? [] });
    setModalType(type);
    if (type === "delete") {
      deleteModalRef.current.show();
    } else {
      productModalRef.current.show();
    }
  };

  const closeModal = () => {
    productModalRef.current.hide();
  };

  const closeDeleteModal = () => {
    deleteModalRef.current.hide();
  };

  const handleModalInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTemplateData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (index, value) => {
    setTemplateData((prevData) => {
      const newImages = [...prevData.imagesUrl];
      newImages[index] = value;

      // 填寫最後一個空輸入框時，自動新增空白輸入框
      if (value !== "" && index === newImages.length - 1 && newImages.length < 5) {
        newImages.push("");
      }

      // 清空輸入框時，移除最後的空白輸入框
      if (value === "" && newImages.length > 1 && newImages[newImages.length - 1] === "") {
        newImages.pop();
      }

      return { ...prevData, imagesUrl: newImages };
    });
  };

  const handleAddImage = () => {
    setTemplateData((prevData) => ({
      ...prevData,
      imagesUrl: [...prevData.imagesUrl, ""],
    }));
  };

  const handleSubmit = async () => {
    const payload = {
      ...templateData,
      origin_price: Number(templateData.origin_price),
      price: Number(templateData.price),
      imagesUrl: templateData.imagesUrl.filter((url) => url !== ""),
    };
    try {
      if (modalType === "edit") {
        await apiClient.put(API_ENDPOINTS.PRODUCT(payload.id), { data: payload });
      } else if (modalType === "create") {
        await apiClient.post(API_ENDPOINTS.CREATE_PRODUCT, { data: payload });
      } else if (modalType === "delete") {
        await apiClient.delete(API_ENDPOINTS.PRODUCT(payload.id));
        closeDeleteModal();
        fetchProducts();
        return;
      }
      closeModal();
      fetchProducts();
    } catch (err) {
      console.error("操作失敗：", err.response?.data);
      alert("操作失敗：" + (err.response?.data?.message || err.message));
    }
  };

  const handleRemoveImage = () => {
    setTemplateData((prevData) => {
      const newImages = [...prevData.imagesUrl];
      newImages.pop();
      return { ...prevData, imagesUrl: newImages };
    });
  };

  /**
   * 處理驗證登入狀態
   */
  const handleCheckLogin = async () => {
    const isValid = await checkLogin();
    if (isValid) {
      alert("Token 驗證成功！您仍處於登入狀態");
    } else {
      alert("Token 驗證失敗，請重新登入");
    }
  };

  /**
   * 處理登出
   */
  const handleLogout = () => {
    if (window.confirm("確定要登出嗎？")) {
      logout();
      navigate("/login", { replace: true });
    }
  };

  return (
    <>
    <div className="container">
      {/* 頁面標題與操作列 */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h3 mb-0">產品管理系統</h1>
            <div className="btn-group">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={handleCheckLogin}
              >
                驗證登入狀態
              </button>
              <button
                className="btn btn-outline-danger"
                type="button"
                onClick={handleLogout}
              >
                登出
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 新增產品按鈕 */}
      <div className="text-end mt-4">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => openModal({}, "create")}
        >
          建立新的產品
        </button>
      </div>

      {/* 產品列表與細節 */}
      <div className="row">
        {/* 左側：產品列表 */}
        <div className="col-md-6">
          <ProductList
            products={products}
            loading={loading}
            onViewDetail={setTempProduct}
            openModal={openModal}
          />
        </div>

        {/* 右側：產品細節 */}
        <div className="col-md-6">
          <ProductDetail key={tempProduct?.id} product={tempProduct} />
        </div>
      </div>
    </div>

    {/* 產品 Modal */}
    <div
      id="productModal"
      className="modal fade"
      tabIndex="-1"
      aria-labelledby="productModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-xl">
        <div className="modal-content border-0">
          <div className="modal-header bg-dark text-white">
            <h5 id="productModalLabel" className="modal-title">
              <span>{modalType === "create" ? "新增產品" : "編輯產品"}</span>
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-sm-4">
                <div className="mb-2">
                  <div className="mb-3">
                    <label htmlFor="imageUrl" className="form-label">
                      輸入圖片網址
                    </label>
                    <input
                      type="text"
                      id="imageUrl"
                      name="imageUrl"
                      className="form-control"
                      placeholder="請輸入圖片連結"
                      value={templateData.imageUrl}
                      onChange={handleModalInputChange}
                    />
                  </div>
                  <img
                    className="img-fluid"
                    src={templateData.imageUrl || null}
                    alt="主圖"
                  />
                </div>
                <div>
                  {templateData.imagesUrl.map((url, index) => (
                    <div key={index}>
                      <label className="form-label">輸入圖片網址</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={`圖片網址 ${index + 1}`}
                        value={url}
                        onChange={(e) => handleImageChange(index, e.target.value)}
                      />
                      <img
                        className="img-fluid"
                        src={url || null}
                        alt={`副圖 ${index + 1}`}
                      />
                    </div>
                  ))}
                  <button
                    className="btn btn-outline-primary btn-sm d-block w-100 mt-2"
                    onClick={handleAddImage}
                  >
                    新增圖片
                  </button>
                </div>
                <div>
                  <button
                    className="btn btn-outline-danger btn-sm d-block w-100 mt-1"
                    onClick={handleRemoveImage}
                  >
                    刪除圖片
                  </button>
                </div>
              </div>
              <div className="col-sm-8">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">標題</label>
                  <input
                    name="title"
                    id="title"
                    type="text"
                    className="form-control"
                    placeholder="請輸入標題"
                    value={templateData.title}
                    onChange={handleModalInputChange}
                  />
                </div>
                <div className="row">
                  <div className="mb-3 col-md-6">
                    <label htmlFor="category" className="form-label">分類</label>
                    <input
                      name="category"
                      id="category"
                      type="text"
                      className="form-control"
                      placeholder="請輸入分類"
                      value={templateData.category}
                      onChange={handleModalInputChange}
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label htmlFor="unit" className="form-label">單位</label>
                    <input
                      name="unit"
                      id="unit"
                      type="text"
                      className="form-control"
                      placeholder="請輸入單位"
                      value={templateData.unit}
                      onChange={handleModalInputChange}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="mb-3 col-md-6">
                    <label htmlFor="origin_price" className="form-label">原價</label>
                    <input
                      name="origin_price"
                      id="origin_price"
                      type="number"
                      min="0"
                      className="form-control"
                      placeholder="請輸入原價"
                      value={templateData.origin_price}
                      onChange={handleModalInputChange}
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label htmlFor="price" className="form-label">售價</label>
                    <input
                      name="price"
                      id="price"
                      type="number"
                      min="0"
                      className="form-control"
                      placeholder="請輸入售價"
                      value={templateData.price}
                      onChange={handleModalInputChange}
                    />
                  </div>
                </div>
                <hr />
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">產品描述</label>
                  <textarea
                    name="description"
                    id="description"
                    className="form-control"
                    placeholder="請輸入產品描述"
                    value={templateData.description}
                    onChange={handleModalInputChange}
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="content" className="form-label">說明內容</label>
                  <textarea
                    name="content"
                    id="content"
                    className="form-control"
                    placeholder="請輸入說明內容"
                    value={templateData.content}
                    onChange={handleModalInputChange}
                  ></textarea>
                </div>
                <div className="mb-3">
                  <div className="form-check">
                    <input
                      name="is_enabled"
                      id="is_enabled"
                      className="form-check-input"
                      type="checkbox"
                      checked={templateData.is_enabled}
                      onChange={handleModalInputChange}
                    />
                    <label className="form-check-label" htmlFor="is_enabled">
                      是否啟用
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-secondary"
              data-bs-dismiss="modal"
              onClick={() => closeModal()}
            >
              取消
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSubmit}>確認</button>
          </div>
        </div>
      </div>
    </div>
    {/* 刪除確認 Modal */}
    <div
      id="deleteModal"
      className="modal fade"
      tabIndex="-1"
      aria-labelledby="deleteModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content border-0">
          <div className="modal-header bg-danger text-white">
            <h5 id="deleteModalLabel" className="modal-title">刪除產品</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            確定要刪除 <strong>{templateData.title}</strong> 嗎？此操作無法復原。
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={closeDeleteModal}
            >
              取消
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleSubmit}
            >
              確認刪除
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ProductsPage;
