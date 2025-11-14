import { useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Navbar from './Navbar';

const styles = `
.order-complete-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.order-complete-content {
  flex: 1;
  padding: 60px 40px;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  text-align: center;
}

.complete-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 30px;
  background: #4caf50;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  color: #fff;
}

.complete-title {
  font-size: 32px;
  font-weight: 400;
  letter-spacing: 2px;
  margin-bottom: 20px;
  color: #000;
}

.complete-message {
  font-size: 16px;
  color: #666;
  margin-bottom: 40px;
}

.order-info {
  background: #f5f5f5;
  padding: 30px;
  border-radius: 4px;
  margin-bottom: 40px;
  text-align: left;
}

.order-info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  font-size: 14px;
}

.order-info-label {
  color: #666;
  font-weight: 500;
}

.order-info-value {
  color: #000;
  font-weight: 500;
}

.order-info-row.total {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e5e5e5;
  font-size: 18px;
}

.order-info-row.total .order-info-value {
  color: #ff0000;
  font-weight: 600;
}

.button-group {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.primary-button {
  padding: 16px 32px;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: background 0.2s;
  font-weight: 500;
  text-decoration: none;
  display: inline-block;
}

.primary-button:hover {
  background: #333;
}

.secondary-button {
  padding: 16px 32px;
  background: #fff;
  color: #000;
  border: 1px solid #000;
  border-radius: 4px;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  text-decoration: none;
  display: inline-block;
}

.secondary-button:hover {
  background: #000;
  color: #fff;
}
`;

function OrderCompletePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order;

  useEffect(() => {
    // 주문 정보가 없거나 필수 필드가 없으면 장바구니 페이지로 리다이렉트
    if (!order || !order.orderNumber || !order.totalAmount) {
      navigate('/cart');
    }
  }, [order, navigate]);

  if (!order || !order.orderNumber || !order.totalAmount) {
    return (
      <>
        <style>{styles}</style>
        <div className="order-complete-page">
          <Navbar />
          <div className="order-complete-content">
            <div className="loading">주문 정보를 불러올 수 없습니다.</div>
          </div>
        </div>
      </>
    );
  }

  const paymentMethodNames = {
    card: '신용카드',
    bank: '무통장 입금',
    kakao: '카카오페이',
    naver: '네이버페이',
  };

  return (
    <>
      <style>{styles}</style>
      <div className="order-complete-page">
        <Navbar />
        <div className="order-complete-content">
          <div className="complete-icon">✓</div>
          <h1 className="complete-title">주문이 완료되었습니다</h1>
          <p className="complete-message">
            주문해주셔서 감사합니다. 주문 내역은 아래와 같습니다.
          </p>

          <div className="order-info">
            <div className="order-info-row">
              <span className="order-info-label">주문번호</span>
              <span className="order-info-value">{order.orderNumber}</span>
            </div>
            <div className="order-info-row">
              <span className="order-info-label">주문일시</span>
              <span className="order-info-value">
                {new Date(order.createdAt).toLocaleString('ko-KR')}
              </span>
            </div>
            {order.recipientName && (
              <div className="order-info-row">
                <span className="order-info-label">받는분</span>
                <span className="order-info-value">{order.recipientName}</span>
              </div>
            )}
            <div className="order-info-row">
              <span className="order-info-label">연락처</span>
              <span className="order-info-value">{order.phone}</span>
            </div>
            <div className="order-info-row">
              <span className="order-info-label">배송지</span>
              <span className="order-info-value">
                {order.shippingAddress} {order.address}
                {order.detailAddress && ` ${order.detailAddress}`}
              </span>
            </div>
            <div className="order-info-row">
              <span className="order-info-label">결제 방법</span>
              <span className="order-info-value">
                {paymentMethodNames[order.paymentMethod] || order.paymentMethod}
              </span>
            </div>
            <div className="order-info-row total">
              <span className="order-info-label">총 결제금액</span>
              <span className="order-info-value">
                {order.totalAmount?.toLocaleString()}원
              </span>
            </div>
          </div>

          <div className="button-group">
            <Link to="/" className="primary-button">
              쇼핑 계속하기
            </Link>
            <Link to="/orders" className="secondary-button">
              주문목록보기
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderCompletePage;

