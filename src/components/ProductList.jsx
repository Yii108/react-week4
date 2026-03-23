import PropTypes from "prop-types";

/**
 * 產品列表組件
 */
const ProductList = ({ products, onViewDetail, loading, openModal }) => {
  return (
    <div>
      <h2>產品列表</h2>

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">載入中...</span>
          </div>
          <p className="mt-2">載入產品中...</p>
        </div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>產品名稱</th>
              <th>原價</th>
              <th>售價</th>
              <th>是否啟用</th>
              <th>查看細節</th>
              <th>編輯/刪除</th>
            </tr>
          </thead>
          <tbody>
            {products && products.length > 0 ? (
              products.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.origin_price}</td>
                  <td>{item.price}</td>
                  <td>
                    <span className={`${item.is_enabled ? "text-success" : ""}`}>
                      {item.is_enabled ? "啟用" : "未啟用"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => onViewDetail(item)}
                    >
                      查看細節
                    </button>
                  </td>
                  <td>
                    <div className="btn-group">
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => openModal(item, "edit")}
                      >
                        編輯
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => openModal(item, "delete")}
                      >
                        刪除
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  尚無產品資料
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

ProductList.propTypes = {
  products: PropTypes.array,
  onViewDetail: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  openModal: PropTypes.func.isRequired,
};

export default ProductList;
