import PropTypes from "prop-types";

/**
 * 產品細節組件
 */
const ProductDetail = ({ product }) => {
  if (!product) {
    return (
      <div>
        <h2>單一產品細節</h2>
        <p className="text-secondary">請選擇一個商品查看</p>
      </div>
    );
  }

  return (
    <div>
      <h2>單一產品細節</h2>
      <div className="card mb-3">
        {/* 產品主圖 */}
        <img
          key={product.imageUrl}
          src={product.imageUrl}
          className="card-img-top primary-image"
          alt={product.title}
        />
        <div className="card-body">
          {/* 產品標題與分類 */}
          <h5 className="card-title">
            {product.title}
            <span className="badge bg-primary ms-2">{product.category}</span>
          </h5>

          {/* 產品描述 */}
          <p className="card-text">
            <strong>商品描述：</strong>
            {product.description}
          </p>

          {/* 產品內容 */}
          <p className="card-text">
            <strong>商品內容：</strong>
            {product.content}
          </p>

          {/* 價格顯示 */}
          <div className="d-flex align-items-center">
            <p className="card-text text-secondary mb-0">
              <del>NT$ {product.origin_price?.toLocaleString()}</del>
            </p>
            <p className="card-text text-danger fw-bold ms-2 mb-0">
              NT$ {product.price?.toLocaleString()}
            </p>
          </div>

          {/* 更多圖片區域 */}
          {product.imagesUrl && product.imagesUrl.length > 0 && (
            <>
              <h5 className="mt-3">更多圖片：</h5>
              <div className="d-flex flex-wrap gap-2">
                {product.imagesUrl.map((url, index) => (
                  <img
                    key={url}
                    src={url}
                    className="images"
                    alt={`${product.title} - 圖片 ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

ProductDetail.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    category: PropTypes.string,
    description: PropTypes.string,
    content: PropTypes.string,
    imageUrl: PropTypes.string,
    imagesUrl: PropTypes.arrayOf(PropTypes.string),
    origin_price: PropTypes.number,
    price: PropTypes.number,
    is_enabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  }),
};

export default ProductDetail;
