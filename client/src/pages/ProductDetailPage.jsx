import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import Navbar from './Navbar';

const styles = `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.product-detail-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.page-content {
  flex: 1;
  padding: 60px 40px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 30px;
  color: #000;
  text-decoration: none;
  font-size: 14px;
  transition: opacity 0.2s;
}

.back-link:hover {
  opacity: 0.7;
}

.product-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  margin-bottom: 80px;
}

@media (max-width: 1024px) {
  .product-container {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}

.product-image-section {
  position: sticky;
  top: 100px;
  height: fit-content;
}

.product-main-image {
  width: 100%;
  aspect-ratio: 3/4;
  object-fit: cover;
  background: #f5f5f5;
  margin-bottom: 20px;
  border-radius: 4px;
}

.product-info-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.product-title {
  font-size: 32px;
  font-weight: 400;
  color: #000;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.product-sku {
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 20px;
}

.product-price {
  font-size: 28px;
  font-weight: 500;
  color: #000;
  margin-bottom: 30px;
}

.product-description {
  font-size: 14px;
  color: #666;
  line-height: 1.8;
  margin-bottom: 30px;
  padding-bottom: 30px;
  border-bottom: 1px solid #e5e5e5;
}

.option-group {
  margin-bottom: 24px;
}

.option-label {
  font-size: 13px;
  font-weight: 500;
  color: #000;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 12px;
  display: block;
}

.option-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.option-button {
  padding: 10px 20px;
  border: 1px solid #e5e5e5;
  background: #fff;
  color: #000;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.option-button:hover {
  border-color: #000;
  background: #fafafa;
}

.option-button.selected {
  background: #000;
  color: #fff;
  border-color: #000;
}

.quantity-group {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 30px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
}

.quantity-button {
  width: 40px;
  height: 40px;
  border: none;
  background: #fff;
  color: #000;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.quantity-button:hover {
  background: #f5f5f5;
}

.quantity-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-input {
  width: 60px;
  height: 40px;
  border: none;
  border-left: 1px solid #e5e5e5;
  border-right: 1px solid #e5e5e5;
  text-align: center;
  font-size: 14px;
  color: #000;
}

.quantity-input:focus {
  outline: none;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-button {
  padding: 16px 32px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.action-button.primary {
  background: #000;
  color: #fff;
}

.action-button.primary:hover {
  background: #333;
}

.action-button.secondary {
  background: #fff;
  color: #000;
  border: 1px solid #000;
}

.action-button.secondary:hover {
  background: #000;
  color: #fff;
}

.action-button.outline {
  background: transparent;
  color: #000;
  border: 1px solid #e5e5e5;
}

.action-button.outline:hover {
  border-color: #000;
  background: #fafafa;
}

.loading {
  text-align: center;
  padding: 60px 20px;
  color: #666;
  font-size: 14px;
}

.error-message {
  text-align: center;
  padding: 60px 20px;
  color: #d32f2f;
  font-size: 14px;
}

.product-category {
  display: inline-block;
  padding: 4px 12px;
  background: #f5f5f5;
  color: #666;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.success-message {
  padding: 12px 16px;
  background: #e8f5e9;
  border: 1px solid #4caf50;
  color: #2e7d32;
  border-radius: 4px;
  font-size: 14px;
  margin-bottom: 20px;
}
`;

function ProductDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // 상품 옵션 상태
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  
  // 기본 사이즈와 색상 옵션 (실제로는 상품 데이터에서 가져올 수 있음)
  const sizes = ['XS', 'S', 'M', 'L', 'XL'];
  const colors = ['Black', 'White', 'Gray', 'Navy', 'Beige'];

  useEffect(() => {
    fetchUserInfo();
    fetchProduct();
  }, [id]);

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (token) {
        const response = await api.get('/users/me');
        if (response.data.user) {
          setUser(response.data.user);
        }
      }
    } catch (error) {
      console.error('유저 정보 가져오기 실패:', error);
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get(`/products/${id}`);
      
      if (response.data.product) {
        setProduct(response.data.product);
      }
    } catch (err) {
      console.error('상품 조회 실패:', err);
      setError('상품을 찾을 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  };

  const handleQuantityInput = (e) => {
    const value = parseInt(e.target.value) || 1;
    if (value >= 1 && value <= 99) {
      setQuantity(value);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      setError('사이즈와 색상을 선택해주세요.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    // 로그인 확인
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      setError('장바구니에 추가하려면 로그인이 필요합니다.');
      setTimeout(() => {
        setError('');
        navigate('/login');
      }, 2000);
      return;
    }

    try {
      await api.post('/carts/items', {
        productId: product._id,
        quantity: quantity,
      });

      setSuccess('장바구니에 상품이 추가되었습니다.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('장바구니 추가 실패:', error);
      if (error.response?.status === 401) {
        setError('로그인이 필요합니다.');
        setTimeout(() => {
          setError('');
          navigate('/login');
        }, 2000);
      } else {
        setError(error.response?.data?.message || '장바구니에 상품을 추가하는데 실패했습니다.');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const handleOrder = () => {
    if (!selectedSize || !selectedColor) {
      setError('Please select size and color');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    // TODO: 주문 페이지로 이동 또는 주문 API 호출
    console.log('Order:', {
      productId: product._id,
      size: selectedSize,
      color: selectedColor,
      quantity
    });
    // navigate('/checkout', { state: { product, size: selectedSize, color: selectedColor, quantity } });
    setSuccess('Order functionality will be implemented soon');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleAddToWishlist = () => {
    // TODO: 위시리스트 추가 API 호출
    setSuccess('Product added to wishlist');
    setTimeout(() => setSuccess(''), 3000);
    console.log('Add to wishlist:', product._id);
  };

  const formatPrice = (price) => {
    return `$${price.toLocaleString()}`;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setUser(null);
    window.location.reload();
  };

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="product-detail-page">
          <Navbar user={user} loading={false} onLogout={handleLogout} />
          <div className="page-content">
            <div className="loading">Loading product...</div>
          </div>
        </div>
      </>
    );
  }

  if (error && !product) {
    return (
      <>
        <style>{styles}</style>
        <div className="product-detail-page">
          <Navbar user={user} loading={false} onLogout={handleLogout} />
          <div className="page-content">
            <div className="error-message">{error}</div>
            <button
              onClick={() => navigate('/')}
              style={{
                marginTop: '20px',
                padding: '12px 24px',
                background: '#000',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Back to Home
            </button>
          </div>
        </div>
      </>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <>
      <style>{styles}</style>
      <div className="product-detail-page">
        <Navbar user={user} loading={false} onLogout={handleLogout} />
        
        <div className="page-content">
          <a href="#" onClick={(e) => { e.preventDefault(); navigate(-1); }} className="back-link">
            ← Back
          </a>

          <div className="product-container">
            {/* 상품 이미지 섹션 */}
            <div className="product-image-section">
              <img
                src={product.image || '/placeholder.png'}
                alt={product.name}
                className="product-main-image"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="800"%3E%3Crect fill="%23f5f5f5" width="600" height="800"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="16"%3ENo Image%3C/text%3E%3C/svg%3E';
                }}
              />
            </div>

            {/* 상품 정보 섹션 */}
            <div className="product-info-section">
              <span className="product-category">{product.category}</span>
              <h1 className="product-title">{product.name}</h1>
              <div className="product-sku">SKU: {product.sku}</div>
              <div className="product-price">{formatPrice(product.price)}</div>
              
              {product.description && (
                <div className="product-description">
                  {product.description}
                </div>
              )}

              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}

              {/* 사이즈 선택 */}
              <div className="option-group">
                <label className="option-label">Size</label>
                <div className="option-buttons">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      className={`option-button ${selectedSize === size ? 'selected' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* 색상 선택 */}
              <div className="option-group">
                <label className="option-label">Color</label>
                <div className="option-buttons">
                  {colors.map((color) => (
                    <button
                      key={color}
                      className={`option-button ${selectedColor === color ? 'selected' : ''}`}
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* 수량 선택 */}
              <div className="option-group">
                <label className="option-label">Quantity</label>
                <div className="quantity-group">
                  <div className="quantity-controls">
                    <button
                      className="quantity-button"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      className="quantity-input"
                      value={quantity}
                      onChange={handleQuantityInput}
                      min="1"
                      max="99"
                    />
                    <button
                      className="quantity-button"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= 99}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* 액션 버튼 */}
              <div className="action-buttons">
                <button
                  className="action-button primary"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
                <button
                  className="action-button secondary"
                  onClick={handleOrder}
                >
                  Order Now
                </button>
                <button
                  className="action-button outline"
                  onClick={handleAddToWishlist}
                >
                  ♡ Add to Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetailPage;

