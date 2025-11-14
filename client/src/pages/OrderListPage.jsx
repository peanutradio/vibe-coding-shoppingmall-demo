import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from './Navbar';

const styles = `
.orders-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.orders-content {
  flex: 1;
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.orders-title {
  font-size: 28px;
  font-weight: 400;
  letter-spacing: 1px;
  margin-bottom: 30px;
  color: #000;
}

.status-tabs {
  display: flex;
  gap: 0;
  border-bottom: 1px solid #e5e5e5;
  margin-bottom: 30px;
  overflow-x: auto;
}

.status-tab {
  padding: 12px 20px;
  font-size: 14px;
  color: #666;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: none;
  letter-spacing: 0;
  white-space: nowrap;
  position: relative;
}

.status-tab:hover {
  color: #000;
}

.status-tab.active {
  background: #000;
  color: #fff;
  font-weight: 500;
}

.status-tab-count {
  margin-left: 4px;
  font-weight: 500;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  padding: 24px;
  transition: box-shadow 0.2s;
}

.order-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.order-header-left {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.order-number {
  font-size: 20px;
  font-weight: 700;
  color: #000;
  margin-bottom: 4px;
}

.order-date {
  font-size: 14px;
  color: #666;
}

.order-header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.order-confirm-button {
  padding: 8px 16px;
  background: #fff3cd;
  color: #856404;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.order-confirm-button:hover {
  background: #ffe69c;
}

.order-status-badge {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-transform: none;
  letter-spacing: 0;
}

.order-status-badge.processing {
  background: #fff3cd;
  color: #856404;
}

.order-status-badge.shipping {
  background: #d1ecf1;
  color: #0c5460;
}

.order-status-badge.completed {
  background: #d4edda;
  color: #155724;
}

.order-total {
  font-size: 18px;
  font-weight: 600;
  color: #000;
}

.order-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
}

.order-item {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  padding: 12px 0;
}

.order-item-image {
  width: 80px;
  height: 80px;
  background: #f5f5f5;
  border-radius: 4px;
  object-fit: cover;
  flex-shrink: 0;
}

.order-item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.order-item-name {
  font-size: 14px;
  font-weight: 500;
  color: #000;
  margin-bottom: 2px;
}

.order-item-specs {
  font-size: 12px;
  color: #666;
  margin-bottom: 2px;
}

.order-item-quantity {
  font-size: 12px;
  color: #666;
}

.order-item-price {
  font-size: 15px;
  font-weight: 600;
  color: #000;
  margin-left: auto;
  align-self: flex-start;
  padding-top: 2px;
}

.order-status-message {
  font-size: 13px;
  color: #666;
  margin-bottom: 16px;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 4px;
}

.order-detail-button {
  display: none;
}

.empty-orders {
  text-align: center;
  padding: 60px 20px;
  color: #666;
  font-size: 14px;
}

.loading {
  text-align: center;
  padding: 60px 20px;
  color: #666;
  font-size: 14px;
}

.order-delivery-info {
  margin-top: 20px;
  padding: 20px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}

.estimated-delivery-date {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e8e8e8;
}

.estimated-delivery-date-label {
  font-size: 13px;
  color: #888;
  font-weight: 400;
  letter-spacing: -0.2px;
}

.estimated-delivery-date-value {
  font-size: 15px;
  color: #000;
  font-weight: 600;
  letter-spacing: -0.3px;
}

.tracking-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.tracking-number-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.tracking-number-label {
  font-size: 13px;
  color: #888;
  font-weight: 400;
  white-space: nowrap;
}

.tracking-number {
  font-size: 13px;
  color: #333;
  font-family: 'SF Mono', 'Monaco', 'Menlo', monospace;
  font-weight: 500;
  letter-spacing: 0.5px;
  word-break: break-all;
}

.tracking-button {
  padding: 10px 20px;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  letter-spacing: -0.2px;
  white-space: nowrap;
  flex-shrink: 0;
}

.tracking-button:hover {
  background: #333;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.tracking-button:active {
  transform: translateY(0);
}

.tracking-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.tracking-modal-content {
  background: #fff;
  border-radius: 8px;
  padding: 32px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.tracking-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.tracking-modal-title {
  font-size: 20px;
  font-weight: 600;
  color: #000;
}

.tracking-modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
}

.tracking-modal-close:hover {
  background: #f5f5f5;
  color: #000;
}

.tracking-info-item {
  margin-bottom: 16px;
}

.tracking-info-label {
  font-size: 13px;
  color: #666;
  margin-bottom: 4px;
}

.tracking-info-value {
  font-size: 15px;
  color: #000;
  font-weight: 500;
  word-break: break-all;
}

.tracking-timeline {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e5e5e5;
}

.tracking-timeline-title {
  font-size: 16px;
  font-weight: 600;
  color: #000;
  margin-bottom: 16px;
}

.tracking-timeline-item {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  position: relative;
  padding-left: 24px;
}

.tracking-timeline-item::before {
  content: '';
  position: absolute;
  left: 6px;
  top: 8px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #d1ecf1;
  border: 2px solid #0c5460;
}

.tracking-timeline-item.active::before {
  background: #0c5460;
}

.tracking-timeline-content {
  flex: 1;
}

.tracking-timeline-status {
  font-size: 14px;
  font-weight: 500;
  color: #000;
  margin-bottom: 4px;
}

.tracking-timeline-date {
  font-size: 12px;
  color: #666;
}
`;

function OrderListPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [orderCounts, setOrderCounts] = useState({
    all: 0,
    pending: 0,
    confirmed: 0,
    preparing: 0,
    shipping: 0,
    delivered: 0,
    cancelled: 0,
  });
  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState(null);

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
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const fetchOrderCounts = useCallback(async () => {
    try {
      const response = await api.get('/orders');
      const allOrders = response.data.orders || [];
      
      const counts = {
        all: allOrders.length,
        pending: allOrders.filter(o => o.orderStatus === 'pending').length,
        confirmed: allOrders.filter(o => o.orderStatus === 'confirmed').length,
        preparing: allOrders.filter(o => o.orderStatus === 'preparing').length,
        shipping: allOrders.filter(o => o.orderStatus === 'shipping').length,
        delivered: allOrders.filter(o => o.orderStatus === 'delivered').length,
        cancelled: allOrders.filter(o => o.orderStatus === 'cancelled').length,
      };
      
      setOrderCounts(counts);
    } catch (error) {
      console.error('주문 개수 조회 실패:', error);
    }
  }, []);

  const fetchOrders = useCallback(async (statusFilter) => {
    try {
      setOrdersLoading(true);
      
      let filteredOrders = [];
      
      if (statusFilter === 'all') {
        const response = await api.get('/orders');
        filteredOrders = response.data.orders || [];
      } else if (statusFilter === 'pending') {
        const response = await api.get('/orders?orderStatus=pending');
        filteredOrders = response.data.orders || [];
      } else if (statusFilter === 'confirmed') {
        const response = await api.get('/orders?orderStatus=confirmed');
        filteredOrders = response.data.orders || [];
      } else if (statusFilter === 'preparing') {
        const response = await api.get('/orders?orderStatus=preparing');
        filteredOrders = response.data.orders || [];
      } else if (statusFilter === 'shipping') {
        const response = await api.get('/orders?orderStatus=shipping');
        filteredOrders = response.data.orders || [];
      } else if (statusFilter === 'delivered') {
        const response = await api.get('/orders?orderStatus=delivered');
        filteredOrders = response.data.orders || [];
      } else if (statusFilter === 'cancelled') {
        const response = await api.get('/orders?orderStatus=cancelled');
        filteredOrders = response.data.orders || [];
      }
      
      setOrders(filteredOrders);
    } catch (error) {
      console.error('주문 목록 가져오기 실패:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        setOrders([]);
      }
    } finally {
      setOrdersLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  useEffect(() => {
    if (!loading && user) {
      fetchOrderCounts();
      fetchOrders(activeTab);
    }
  }, [loading, user, activeTab, fetchOrders, fetchOrderCounts]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  }, [navigate]);


  const formatOrderDate = (date) => {
    return new Date(date).toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getStatusDisplayText = (status) => {
    const statusMap = {
      pending: '주문확인',
      confirmed: '주문확인',
      preparing: '상품준비중',
      shipping: '배송중',
      delivered: '배송완료',
      cancelled: '주문취소',
    };
    return statusMap[status] || status;
  };

  const calculateEstimatedDeliveryDate = (order) => {
    // 서버에서 예상도착일이 있으면 사용
    if (order.estimatedDeliveryDate) {
      return new Date(order.estimatedDeliveryDate);
    }
    
    // 없으면 주문일 기준으로 계산
    const orderDate = new Date(order.createdAt);
    let deliveryDays = 5; // 기본 5일
    
    // 주문 상태에 따라 배송일수 조정
    if (order.orderStatus === 'delivered') {
      deliveryDays = 0; // 배송완료는 당일
    } else if (order.orderStatus === 'shipping') {
      deliveryDays = 2; // 배송중은 2일 후
    } else if (order.orderStatus === 'preparing') {
      deliveryDays = 4; // 상품준비중은 4일 후
    } else if (order.orderStatus === 'confirmed') {
      deliveryDays = 5; // 주문확인은 5일 후
    } else if (order.orderStatus === 'pending') {
      deliveryDays = 6; // 주문확인 대기중은 6일 후
    }
    
    const estimatedDate = new Date(orderDate);
    estimatedDate.setDate(estimatedDate.getDate() + deliveryDays);
    return estimatedDate;
  };

  const formatDeliveryDate = (date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleTrackingClick = (order) => {
    setSelectedTrackingOrder(order);
  };

  const handleCloseTrackingModal = () => {
    setSelectedTrackingOrder(null);
  };

  const getTrackingTimeline = (order) => {
    const timeline = [];
    const orderDate = new Date(order.createdAt);
    
    timeline.push({
      status: '주문 접수',
      date: orderDate,
      active: true,
    });

    if (order.orderStatus !== 'pending' && order.orderStatus !== 'cancelled') {
      const confirmedDate = new Date(orderDate);
      confirmedDate.setHours(confirmedDate.getHours() + 2);
      timeline.push({
        status: '주문 확인',
        date: confirmedDate,
        active: ['confirmed', 'preparing', 'shipping', 'delivered'].includes(order.orderStatus),
      });
    }

    if (['preparing', 'shipping', 'delivered'].includes(order.orderStatus)) {
      const preparingDate = new Date(order.createdAt);
      preparingDate.setDate(preparingDate.getDate() + 1);
      timeline.push({
        status: '상품 준비 중',
        date: preparingDate,
        active: ['preparing', 'shipping', 'delivered'].includes(order.orderStatus),
      });
    }

    if (['shipping', 'delivered'].includes(order.orderStatus)) {
      const shippingDate = order.estimatedDeliveryDate 
        ? new Date(order.estimatedDeliveryDate)
        : new Date(order.createdAt);
      shippingDate.setDate(shippingDate.getDate() - 2);
      timeline.push({
        status: '배송 중',
        date: shippingDate,
        active: ['shipping', 'delivered'].includes(order.orderStatus),
      });
    }

    if (order.orderStatus === 'delivered') {
      const deliveredDate = order.estimatedDeliveryDate 
        ? new Date(order.estimatedDeliveryDate)
        : new Date(order.createdAt);
      deliveredDate.setDate(deliveredDate.getDate() + 3);
      timeline.push({
        status: '배송 완료',
        date: deliveredDate,
        active: true,
      });
    }

    return timeline;
  };

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="orders-page">
          <Navbar user={user} loading={true} onLogout={handleLogout} />
          <div className="orders-content">
            <div className="loading">로딩 중...</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="orders-page">
        <Navbar user={user} loading={false} onLogout={handleLogout} />
        <div className="orders-content">
          <h1 className="orders-title">내 주문 목록</h1>
          
          <div className="status-tabs">
            <button
              className={`status-tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              전체 {orderCounts.all > 0 && <span className="status-tab-count">{orderCounts.all}</span>}
            </button>
            <button
              className={`status-tab ${activeTab === 'pending' ? 'active' : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              주문확인 {orderCounts.pending > 0 && <span className="status-tab-count">{orderCounts.pending}</span>}
            </button>
            <button
              className={`status-tab ${activeTab === 'preparing' ? 'active' : ''}`}
              onClick={() => setActiveTab('preparing')}
            >
              상품준비중 {orderCounts.preparing > 0 && <span className="status-tab-count">{orderCounts.preparing}</span>}
            </button>
            <button
              className={`status-tab ${activeTab === 'shipping' ? 'active' : ''}`}
              onClick={() => setActiveTab('shipping')}
            >
              배송중 {orderCounts.shipping > 0 && <span className="status-tab-count">{orderCounts.shipping}</span>}
            </button>
            <button
              className={`status-tab ${activeTab === 'delivered' ? 'active' : ''}`}
              onClick={() => setActiveTab('delivered')}
            >
              배송완료 {orderCounts.delivered > 0 && <span className="status-tab-count">{orderCounts.delivered}</span>}
            </button>
            <button
              className={`status-tab ${activeTab === 'cancelled' ? 'active' : ''}`}
              onClick={() => setActiveTab('cancelled')}
            >
              주문취소 {orderCounts.cancelled > 0 && <span className="status-tab-count">{orderCounts.cancelled}</span>}
            </button>
          </div>

          {ordersLoading ? (
            <div className="loading">주문 목록을 불러오는 중...</div>
          ) : orders.length === 0 ? (
            <div className="empty-orders">주문 내역이 없습니다.</div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <div className="order-header-left">
                      <div className="order-number">
                        주문 #{order.orderNumber}
                      </div>
                      <div className="order-date">주문일: {formatOrderDate(order.createdAt)}</div>
                    </div>
                    <div className="order-header-right">
                      <button className="order-confirm-button">
                        {getStatusDisplayText(order.orderStatus || 'pending')}
                      </button>
                    </div>
                  </div>

                  <div className="order-items">
                    {order.items?.map((item, index) => (
                      <div key={index} className="order-item">
                        <img
                          src={item.product?.image || '/placeholder.png'}
                          alt={item.product?.name || '상품'}
                          className="order-item-image"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect fill="%23f5f5f5" width="80" height="80"/%3E%3C/svg%3E';
                          }}
                        />
                        <div className="order-item-info">
                          <div className="order-item-name">{item.product?.name || '상품명 없음'}</div>
                          <div className="order-item-specs">
                            {item.size && `사이즈: ${item.size}`}
                            {item.size && item.color && ' • '}
                            {item.color && `색상: ${item.color}`}
                            {!item.size && !item.color && item.product?.category && `카테고리: ${item.product.category}`}
                          </div>
                          <div className="order-item-quantity">수량: {item.quantity}</div>
                        </div>
                        <div className="order-item-price">₩{item.price?.toLocaleString() || 0}</div>
                      </div>
                    ))}
                  </div>

                  {order.orderStatus !== 'cancelled' && (
                    <div className="order-delivery-info">
                      <div className="estimated-delivery-date">
                        <span className="estimated-delivery-date-label">예상 도착일</span>
                        <span className="estimated-delivery-date-value">
                          {formatDeliveryDate(calculateEstimatedDeliveryDate(order))}
                        </span>
                      </div>
                      <div className="tracking-section">
                        {order.trackingNumber ? (
                          <div className="tracking-number-wrapper">
                            <span className="tracking-number-label">송장번호</span>
                            <span className="tracking-number">{order.trackingNumber}</span>
                          </div>
                        ) : (
                          <div className="tracking-number-wrapper">
                            <span className="tracking-number-label" style={{ color: '#999' }}>
                              배송 추적 정보가 준비되면 표시됩니다
                            </span>
                          </div>
                        )}
                        <button 
                          className="tracking-button"
                          onClick={() => handleTrackingClick(order)}
                        >
                          배송 추적
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedTrackingOrder && (
        <div className="tracking-modal" onClick={handleCloseTrackingModal}>
          <div className="tracking-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="tracking-modal-header">
              <h2 className="tracking-modal-title">배송 추적</h2>
              <button className="tracking-modal-close" onClick={handleCloseTrackingModal}>
                ×
              </button>
            </div>
            
            <div className="tracking-info-item">
              <div className="tracking-info-label">주문번호</div>
              <div className="tracking-info-value">{selectedTrackingOrder.orderNumber}</div>
            </div>

            {selectedTrackingOrder.trackingNumber && (
              <div className="tracking-info-item">
                <div className="tracking-info-label">송장번호</div>
                <div className="tracking-info-value">{selectedTrackingOrder.trackingNumber}</div>
              </div>
            )}

            <div className="tracking-info-item">
              <div className="tracking-info-label">배송지</div>
              <div className="tracking-info-value">
                {selectedTrackingOrder.shippingAddress || selectedTrackingOrder.address}
                {selectedTrackingOrder.detailAddress && ` ${selectedTrackingOrder.detailAddress}`}
              </div>
            </div>

            <div className="tracking-timeline">
              <div className="tracking-timeline-title">배송 현황</div>
              {getTrackingTimeline(selectedTrackingOrder).map((item, index) => (
                <div 
                  key={index} 
                  className={`tracking-timeline-item ${item.active ? 'active' : ''}`}
                >
                  <div className="tracking-timeline-content">
                    <div className="tracking-timeline-status">{item.status}</div>
                    <div className="tracking-timeline-date">
                      {item.date.toLocaleString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default OrderListPage;

