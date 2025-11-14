import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import Navbar from './Navbar';

const styles = `
.cart-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.cart-content {
  flex: 1;
  padding: 60px 40px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.cart-title {
  font-size: 32px;
  font-weight: 400;
  letter-spacing: 2px;
  margin-bottom: 40px;
  color: #000;
}

.cart-layout {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 40px;
  align-items: start;
}

@media (max-width: 1024px) {
  .cart-layout {
    grid-template-columns: 1fr;
  }
}

.cart-empty {
  text-align: center;
  padding: 80px 20px;
}

.cart-empty-text {
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cart-item {
  display: flex;
  gap: 20px;
  padding: 20px;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
}

.cart-item-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 4px;
}

.cart-item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.cart-item-name {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #000;
}

.cart-item-sku {
  font-size: 12px;
  color: #666;
  margin-bottom: 10px;
  text-transform: uppercase;
}

.cart-item-price {
  font-size: 16px;
  color: #666;
  margin-bottom: 10px;
}

.cart-item-quantity {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity-button {
  width: 30px;
  height: 30px;
  border: 1px solid #e5e5e5;
  background: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: background 0.2s;
}

.quantity-button:hover {
  background: #f5f5f5;
}

.quantity-input {
  width: 50px;
  text-align: center;
  border: 1px solid #e5e5e5;
  padding: 5px;
  font-size: 14px;
}

.cart-item-actions {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
}

.remove-button {
  background: transparent;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 14px;
  text-decoration: underline;
  transition: color 0.2s;
}

.remove-button:hover {
  color: #000;
}

.cart-item-total {
  font-size: 18px;
  font-weight: 500;
  color: #000;
}

.order-summary {
  position: sticky;
  top: 100px;
  padding: 30px;
  border-radius: 4px;
  background: #fff;
}

.order-summary-title {
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 24px;
  color: #000;
  text-align: center;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 14px;
  color: #000;
}

.summary-label {
  color: #666;
}

.summary-value {
  font-weight: 500;
}

.summary-row.total {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e5e5e5;
  font-size: 18px;
}

.summary-row.total .summary-value {
  color: #ff0000;
  font-weight: 600;
  font-size: 20px;
}

.shipping-free {
  color: #666;
  font-size: 14px;
}

.checkout-button {
  width: 100%;
  padding: 16px;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 20px;
  font-weight: 500;
}

.checkout-button:hover {
  background: #333;
}

.continue-shopping {
  display: block;
  text-align: center;
  margin-top: 16px;
  color: #666;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}

.continue-shopping:hover {
  color: #000;
  text-decoration: underline;
}
`;

function CartPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState(null);
  const [cartLoading, setCartLoading] = useState(true);

  const fetchUserInfo = useCallback(async () => {
    try {
      const response = await api.get('/users/me');
      if (response.data.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('유저 정보 가져오기 실패:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setUser(null);
    navigate('/');
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (token) {
      fetchUserInfo();
    } else {
      setLoading(false);
      navigate('/login');
    }
  }, [fetchUserInfo, navigate]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await api.get('/carts');
        setCart(response.data.cart);
      } catch (error) {
        console.error('장바구니 조회 실패:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setCartLoading(false);
      }
    };

    if (user) {
      fetchCart();
    }
  }, [user, navigate]);

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await api.put(`/carts/items/${productId}`, { quantity: newQuantity });
      const response = await api.get('/carts');
      setCart(response.data.cart);
    } catch (error) {
      console.error('수량 업데이트 실패:', error);
    }
  };

  const removeItem = async (productId) => {
    try {
      await api.delete(`/carts/items/${productId}`);
      const response = await api.get('/carts');
      setCart(response.data.cart);
    } catch (error) {
      console.error('아이템 제거 실패:', error);
    }
  };

  if (cartLoading || loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="cart-page">
          <Navbar user={user} loading={loading} onLogout={handleLogout} />
          <div className="cart-content">
            <div className="cart-empty">
              <div className="cart-empty-text">로딩 중...</div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <>
        <style>{styles}</style>
        <div className="cart-page">
          <Navbar user={user} loading={loading} onLogout={handleLogout} />
          <div className="cart-content">
            <h1 className="cart-title">장바구니</h1>
            <div className="cart-empty">
              <div className="cart-empty-text">장바구니가 비어있습니다.</div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="cart-page">
        <Navbar user={user} loading={loading} onLogout={handleLogout} />
        <div className="cart-content">
          <h1 className="cart-title">장바구니</h1>
          <div className="cart-layout">
            <div className="cart-items">
              {cart.items.map((item) => (
                <div key={item._id} className="cart-item">
                  <img
                    src={item.product?.image || '/placeholder.png'}
                    alt={item.product?.name}
                    className="cart-item-image"
                  />
                  <div className="cart-item-details">
                    <div>
                      <div className="cart-item-name">{item.product?.name}</div>
                      {item.product?.sku && (
                        <div className="cart-item-sku">SKU: {item.product.sku}</div>
                      )}
                      <div className="cart-item-price">
                        {item.product?.price?.toLocaleString()}원
                      </div>
                      <div className="cart-item-quantity">
                        <button
                          className="quantity-button"
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          className="quantity-input"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.product._id, parseInt(e.target.value) || 1)
                          }
                          min="1"
                        />
                        <button
                          className="quantity-button"
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="cart-item-actions">
                    <button
                      className="remove-button"
                      onClick={() => removeItem(item.product._id)}
                    >
                      삭제
                    </button>
                    <div className="cart-item-total">
                      {(item.product?.price * item.quantity)?.toLocaleString()}원
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="order-summary">
              <h2 className="order-summary-title">주문 요약</h2>
              <div className="summary-row">
                <span className="summary-label">상품 수량 ({cart.totalItems}개)</span>
                <span className="summary-value">{cart.totalAmount?.toLocaleString()}원</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">배송비</span>
                <span className="summary-value shipping-free">무료</span>
              </div>
              <div className="summary-row total">
                <span className="summary-label">총 결제금액</span>
                <span className="summary-value">{cart.totalAmount?.toLocaleString()}원</span>
              </div>
              <button 
                className="checkout-button"
                onClick={() => navigate('/order')}
              >
                결제하기
              </button>
              <Link to="/" className="continue-shopping">쇼핑 계속하기</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CartPage;

