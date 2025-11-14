import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from './Navbar';

const styles = `
.order-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.order-content {
  flex: 1;
  padding: 60px 40px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.order-title {
  font-size: 32px;
  font-weight: 400;
  letter-spacing: 2px;
  margin-bottom: 40px;
  color: #000;
}

.order-layout {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 40px;
  align-items: start;
}

@media (max-width: 1024px) {
  .order-layout {
    grid-template-columns: 1fr;
  }
}

.order-section {
  background: #fff;
  padding: 30px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.section-title {
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 24px;
  color: #000;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e5e5;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #000;
}

.form-label.required::after {
  content: ' *';
  color: #ff0000;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #000;
}

.form-input.error {
  border-color: #ff0000;
}

.form-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  font-size: 14px;
  min-height: 100px;
  resize: vertical;
  transition: border-color 0.2s;
  box-sizing: border-box;
  font-family: inherit;
}

.form-textarea:focus {
  outline: none;
  border-color: #000;
}

.address-row {
  display: grid;
  grid-template-columns: 1fr 120px;
  gap: 10px;
  margin-bottom: 10px;
}

.address-search-button {
  padding: 12px;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
}

.address-search-button:hover {
  background: #333;
}

.payment-methods {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.payment-method {
  padding: 16px;
  border: 2px solid #e5e5e5;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  background: #fff;
}

.payment-method:hover {
  border-color: #000;
}

.payment-method.selected {
  border-color: #000;
  background: #f5f5f5;
}

.payment-method-name {
  font-size: 14px;
  font-weight: 500;
  color: #000;
}

.order-summary {
  position: sticky;
  top: 100px;
  background: #fff;
  padding: 30px;
  border-radius: 4px;
}

.order-summary-title {
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 24px;
  color: #000;
  text-align: center;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e5e5;
}

.order-items {
  margin-bottom: 24px;
}

.order-item {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.order-item:last-child {
  border-bottom: none;
}

.order-item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

.order-item-info {
  flex: 1;
}

.order-item-name {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
  color: #000;
}

.order-item-details {
  font-size: 12px;
  color: #666;
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

.submit-button {
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

.submit-button:hover:not(:disabled) {
  background: #333;
}

.submit-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.error-message {
  color: #ff0000;
  font-size: 12px;
  margin-top: 4px;
}

.help-text {
  color: #666;
  font-size: 12px;
  margin-top: 4px;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}
`;

function OrderPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState(null);
  const [cartLoading, setCartLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    recipientName: '',
    phone: '',
    address: '',
    detailAddress: '',
    zipCode: '',
    deliveryRequest: '',
    paymentMethod: '',
  });

  const [formErrors, setFormErrors] = useState({});

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

  // 포트원 결제 모듈 초기화
  useEffect(() => {
    if (window.IMP) {
      window.IMP.init('imp84574064'); // 고객사 식별코드
    } else {
      console.error('포트원 스크립트가 로드되지 않았습니다.');
    }
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await api.get('/carts');
        setCart(response.data.cart);
        
        // 장바구니가 비어있으면 장바구니 페이지로 리다이렉트
        if (!response.data.cart || !response.data.cart.items || response.data.cart.items.length === 0) {
          navigate('/cart');
        }
      } catch (error) {
        console.error('장바구니 조회 실패:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        } else {
          navigate('/cart');
        }
      } finally {
        setCartLoading(false);
      }
    };

    if (user) {
      fetchCart();
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // 에러 초기화
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.recipientName.trim()) {
      errors.recipientName = '받는분 이름을 입력해주세요.';
    }
    if (!formData.phone.trim()) {
      errors.phone = '전화번호를 입력해주세요.';
    }
    if (!formData.address.trim()) {
      errors.address = '주소를 입력해주세요.';
    }
    if (!formData.zipCode.trim()) {
      errors.zipCode = '우편번호를 입력해주세요.';
    }
    if (!formData.paymentMethod) {
      errors.paymentMethod = '결제 방법을 선택해주세요.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    if (!cart || !cart.items || cart.items.length === 0) {
      setError('주문할 상품이 없습니다.');
      return;
    }

    // 장바구니 총 금액 검증
    if (!cart.totalAmount || cart.totalAmount <= 0) {
      setError('주문 금액이 올바르지 않습니다. 장바구니를 확인해주세요.');
      return;
    }

    if (!window.IMP) {
      setError('결제 모듈을 불러올 수 없습니다. 페이지를 새로고침해주세요.');
      return;
    }

    setSubmitting(true);

    try {
      // 주문 데이터 준비
      const orderData = {
        ...formData,
        shippingAddress: formData.address, // address를 shippingAddress로도 전달
        useCart: true, // 장바구니에서 주문 생성
      };

      // 포트원 결제 요청
      const paymentMethodMap = {
        card: 'card',
        bank: 'trans',
        kakao: 'kakaopay',
        naver: 'naverpay',
      };

      const paymentMethodCode = paymentMethodMap[formData.paymentMethod] || 'card';

      window.IMP.request_pay(
        {
          pg : 'html5_inicis',
          pay_method: paymentMethodCode === 'card' ? 'card' : paymentMethodCode,
          merchant_uid: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // 주문 고유번호
          name: cart.items.length === 1 
            ? cart.items[0].product?.name 
            : `${cart.items[0].product?.name} 외 ${cart.items.length - 1}개`,
          amount: cart.totalAmount,
          buyer_name: formData.recipientName,
          buyer_tel: formData.phone,
          buyer_email: user?.email || '',
          buyer_addr: `${formData.address} ${formData.detailAddress || ''}`.trim(),
          buyer_postcode: formData.zipCode,
        },
        async (rsp) => {
          // 결제 성공 시
          if (rsp.success) {
            try {
              // 서버에 주문 생성
              const response = await api.post('/orders', {
                ...orderData,
                imp_uid: rsp.imp_uid, // 포트원 결제 고유번호
                merchant_uid: rsp.merchant_uid, // 주문 고유번호
              });

              if (response.data.order) {
                // 주문 성공 시 주문 완료 페이지로 이동
                navigate('/order/complete', {
                  state: { order: response.data.order },
                });
              }
            } catch (error) {
              console.error('주문 생성 실패:', error);
              
              // 상세한 에러 메시지 처리
              let errorMessage = '주문 생성에 실패했습니다.';
              
              if (error.response?.data) {
                if (error.response.data.message) {
                  errorMessage = error.response.data.message;
                }
                if (error.response.data.error) {
                  errorMessage += `\n${error.response.data.error}`;
                }
                if (error.response.data.details) {
                  errorMessage += `\n상세: ${JSON.stringify(error.response.data.details)}`;
                }
              } else if (error.message) {
                errorMessage = error.message;
              }
              
              setError(errorMessage);
              setSubmitting(false);
            }
          } else {
            // 결제 실패 시
            setError(rsp.error_msg || '결제에 실패했습니다.');
            setSubmitting(false);
          }
        }
      );
    } catch (error) {
      console.error('결제 요청 실패:', error);
      setError('결제 요청에 실패했습니다.');
      setSubmitting(false);
    }
  };

  if (cartLoading || loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="order-page">
          <Navbar user={user} loading={loading} onLogout={handleLogout} />
          <div className="order-content">
            <div className="loading">로딩 중...</div>
          </div>
        </div>
      </>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return null; // useEffect에서 리다이렉트 처리됨
  }

  return (
    <>
      <style>{styles}</style>
      <div className="order-page">
        <Navbar user={user} loading={loading} onLogout={handleLogout} />
        <div className="order-content">
          <h1 className="order-title">주문하기</h1>
          
          {error && (
            <div className="order-section" style={{ background: '#fff3cd', border: '1px solid #ffc107', padding: '16px', marginBottom: '20px', borderRadius: '4px' }}>
              <div style={{ color: '#856404' }}>{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="order-layout">
              <div>
                {/* 배송 정보 섹션 */}
                <div className="order-section">
                  <h2 className="section-title">배송 정보</h2>
                  
                  <div className="form-group">
                    <label className="form-label required">받는분</label>
                    <input
                      type="text"
                      name="recipientName"
                      value={formData.recipientName}
                      onChange={handleChange}
                      className={`form-input ${formErrors.recipientName ? 'error' : ''}`}
                      placeholder="받는분 이름을 입력해주세요"
                    />
                    {formErrors.recipientName && (
                      <div className="error-message">{formErrors.recipientName}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label required">전화번호</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`form-input ${formErrors.phone ? 'error' : ''}`}
                      placeholder="010-1234-5678"
                    />
                    {formErrors.phone && (
                      <div className="error-message">{formErrors.phone}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label required">주소</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={`form-input ${formErrors.address ? 'error' : ''}`}
                      placeholder="기본 주소"
                      style={{ marginBottom: '10px' }}
                    />
                    <input
                      type="text"
                      name="detailAddress"
                      value={formData.detailAddress}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="상세 주소"
                    />
                    {formErrors.address && (
                      <div className="error-message">{formErrors.address}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label required">우편번호</label>
                    <div className="address-row">
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        className={`form-input ${formErrors.zipCode ? 'error' : ''}`}
                        placeholder="우편번호"
                      />
                      <button
                        type="button"
                        className="address-search-button"
                        onClick={() => {
                          // 우편번호 검색 API 연동 (실제 구현 시 다음 우편번호 API 등 사용)
                          alert('우편번호 검색 기능은 우편번호 API 연동이 필요합니다.');
                        }}
                      >
                        검색
                      </button>
                    </div>
                    {formErrors.zipCode && (
                      <div className="error-message">{formErrors.zipCode}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">배송 요청사항 (선택)</label>
                    <textarea
                      name="deliveryRequest"
                      value={formData.deliveryRequest}
                      onChange={handleChange}
                      className="form-textarea"
                      placeholder="배송 시 요청사항을 입력해주세요"
                    />
                  </div>
                </div>

                {/* 결제 방법 섹션 */}
                <div className="order-section">
                  <h2 className="section-title">결제 방법</h2>
                  
                  <div className="payment-methods">
                    <div
                      className={`payment-method ${formData.paymentMethod === 'card' ? 'selected' : ''}`}
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, paymentMethod: 'card' }));
                        if (formErrors.paymentMethod) {
                          setFormErrors((prev) => ({ ...prev, paymentMethod: '' }));
                        }
                      }}
                    >
                      <div className="payment-method-name">신용카드</div>
                    </div>
                    <div
                      className={`payment-method ${formData.paymentMethod === 'bank' ? 'selected' : ''}`}
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, paymentMethod: 'bank' }));
                        if (formErrors.paymentMethod) {
                          setFormErrors((prev) => ({ ...prev, paymentMethod: '' }));
                        }
                      }}
                    >
                      <div className="payment-method-name">무통장 입금</div>
                    </div>
                    <div
                      className={`payment-method ${formData.paymentMethod === 'kakao' ? 'selected' : ''}`}
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, paymentMethod: 'kakao' }));
                        if (formErrors.paymentMethod) {
                          setFormErrors((prev) => ({ ...prev, paymentMethod: '' }));
                        }
                      }}
                    >
                      <div className="payment-method-name">카카오페이</div>
                    </div>
                    <div
                      className={`payment-method ${formData.paymentMethod === 'naver' ? 'selected' : ''}`}
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, paymentMethod: 'naver' }));
                        if (formErrors.paymentMethod) {
                          setFormErrors((prev) => ({ ...prev, paymentMethod: '' }));
                        }
                      }}
                    >
                      <div className="payment-method-name">네이버페이</div>
                    </div>
                  </div>
                  {formErrors.paymentMethod && (
                    <div className="error-message" style={{ marginTop: '12px' }}>{formErrors.paymentMethod}</div>
                  )}
                </div>
              </div>

              {/* 주문 요약 섹션 */}
              <div className="order-summary">
                <h2 className="order-summary-title">주문 요약</h2>
                
                <div className="order-items">
                  {cart.items.map((item) => (
                    <div key={item._id} className="order-item">
                      <img
                        src={item.product?.image || '/placeholder.png'}
                        alt={item.product?.name}
                        className="order-item-image"
                      />
                      <div className="order-item-info">
                        <div className="order-item-name">{item.product?.name}</div>
                        <div className="order-item-details">
                          {item.quantity}개 × {item.product?.price?.toLocaleString()}원
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="summary-row">
                  <span className="summary-label">상품 수량 ({cart.totalItems}개)</span>
                  <span className="summary-value">{cart.totalAmount?.toLocaleString()}원</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">배송비</span>
                  <span className="summary-value" style={{ color: '#666' }}>무료</span>
                </div>
                <div className="summary-row total">
                  <span className="summary-label">총 결제금액</span>
                  <span className="summary-value">{cart.totalAmount?.toLocaleString()}원</span>
                </div>

                <button
                  type="submit"
                  className="submit-button"
                  disabled={submitting}
                >
                  {submitting ? '주문 처리 중...' : '주문하기'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default OrderPage;

