import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const styles = `
.order-manage-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
}

.order-manage-content {
  max-width: 1200px;
  margin: 0 auto;
}

.order-manage-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.back-button {
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #000;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-button:hover {
  opacity: 0.7;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #000;
}

.search-filter-section {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  align-items: center;
}

.search-input-wrapper {
  flex: 1;
  position: relative;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 40px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  font-size: 14px;
  background: #fff;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  font-size: 18px;
}

.filter-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 16px;
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  color: #000;
}

.filter-button:hover {
  border-color: #000;
}

.status-tabs {
  display: flex;
  gap: 0;
  background: #fff;
  border-radius: 8px;
  padding: 4px;
  margin-bottom: 20px;
  overflow-x: auto;
}

.status-tab {
  flex: 1;
  padding: 10px 16px;
  font-size: 14px;
  color: #666;
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.status-tab:hover {
  background: #f5f5f5;
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
  gap: 16px;
}

.order-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.order-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.order-header-left {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.order-id-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.order-id {
  font-size: 16px;
  font-weight: 600;
  color: #000;
}

.order-customer-date {
  font-size: 14px;
  color: #666;
}

.order-header-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.order-status-dropdown-wrapper {
  position: relative;
}

.order-status-dropdown {
  padding: 8px 32px 8px 12px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  background: #fff;
  color: #000;
  cursor: pointer;
  min-width: 120px;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  transition: all 0.2s;
}

.order-status-dropdown:hover {
  border-color: #000;
}

.order-status-dropdown:focus {
  outline: none;
  border-color: #000;
}

.order-status-dropdown.processing {
  background-color: #fff3cd;
  color: #856404;
  border-color: #fff3cd;
}

.order-status-dropdown.shipping {
  background-color: #d1ecf1;
  color: #0c5460;
  border-color: #d1ecf1;
}

.order-status-dropdown.completed {
  background-color: #d4edda;
  color: #155724;
  border-color: #d4edda;
}

.order-status-dropdown.cancelled {
  background-color: #f8d7da;
  color: #721c24;
  border-color: #f8d7da;
}

.order-total {
  font-size: 18px;
  font-weight: 600;
  color: #000;
}

.order-detail-link {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #666;
  text-decoration: none;
  margin-top: 4px;
}

.order-detail-link:hover {
  color: #000;
}

.order-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.detail-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  font-size: 12px;
  color: #999;
  margin-bottom: 2px;
}

.detail-value {
  font-size: 14px;
  color: #000;
}

.detail-value.email {
  color: #666;
}

.tracking-number {
  color: #1976d2;
  font-weight: 500;
}


.empty-orders {
  text-align: center;
  padding: 60px 20px;
  color: #666;
  font-size: 14px;
  background: #fff;
  border-radius: 12px;
}

.loading {
  text-align: center;
  padding: 60px 20px;
  color: #666;
  font-size: 14px;
  background: #fff;
  border-radius: 12px;
}
`;

function OrderManagePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [orderCounts, setOrderCounts] = useState({
    all: 0,
    pending: 0,
    confirmed: 0,
    preparing: 0,
    shipping: 0,
    delivered: 0,
    cancelled: 0,
  });

  const checkAdminAccess = useCallback(async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await api.get('/users/me');
      
      if (response.data.user) {
        const userType = response.data.user.userType?.toLowerCase();
        if (userType !== 'admin' && userType !== 'admiin') {
          navigate('/admin');
          return;
        }
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('권한 확인 실패:', error);
      navigate('/admin');
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

  const fetchOrders = useCallback(async (statusFilter, search = '') => {
    try {
      setOrdersLoading(true);
      
      // 전체 주문 가져오기
      const response = await api.get('/orders');
      let filteredOrders = response.data.orders || [];
      
      // 상태 필터링
      if (statusFilter !== 'all') {
        filteredOrders = filteredOrders.filter(order => {
          const status = order.orderStatus || 'pending';
          return status === statusFilter;
        });
      }
      // 'all'인 경우 필터링하지 않음
      
      // 검색 필터링
      if (search.trim()) {
        const searchLower = search.toLowerCase();
        filteredOrders = filteredOrders.filter(order => {
          const orderNumber = order.orderNumber?.toLowerCase() || '';
          const customerName = order.user?.name?.toLowerCase() || '';
          const customerEmail = order.user?.email?.toLowerCase() || '';
          
          return orderNumber.includes(searchLower) || 
                 customerName.includes(searchLower) || 
                 customerEmail.includes(searchLower);
        });
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
    checkAdminAccess();
  }, [checkAdminAccess]);

  useEffect(() => {
    if (!loading && user) {
      fetchOrderCounts();
      fetchOrders(activeTab, searchQuery);
    }
  }, [loading, user, activeTab, searchQuery, fetchOrders, fetchOrderCounts]);

  const handleStatusChange = async (orderId, newStatus) => {
    // 취소 상태로 변경할 때는 확인 메시지 표시
    if (newStatus === 'cancelled') {
      if (!window.confirm('정말 주문을 취소하시겠습니까?')) {
        return;
      }
    }
    
    try {
      await api.put(`/orders/${orderId}`, { orderStatus: newStatus });
      // 주문 목록 및 개수 새로고침
      await fetchOrderCounts();
      fetchOrders(activeTab, searchQuery);
    } catch (error) {
      console.error('주문 상태 변경 실패:', error);
      alert('주문 상태 변경에 실패했습니다.');
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      pending: 'processing',
      confirmed: 'processing',
      preparing: 'processing',
      shipping: 'shipping',
      delivered: 'completed',
      cancelled: 'cancelled',
    };
    return statusMap[status] || 'processing';
  };

  const getStatusText = (status) => {
    const statusMap = {
      pending: '주문확인',
      confirmed: '주문확인완료',
      preparing: '상품준비중',
      shipping: '배송중',
      delivered: '배송완료',
      cancelled: '주문취소',
    };
    return statusMap[status] || status;
  };

  const getStatusDisplayOptions = (currentStatus) => {
    // 현재 상태에 따라 선택 가능한 옵션 반환
    const allOptions = [
      { value: 'pending', label: '주문확인' },
      { value: 'confirmed', label: '주문확인완료' },
      { value: 'preparing', label: '상품준비중' },
      { value: 'shipping', label: '배송중' },
      { value: 'delivered', label: '배송완료' },
      { value: 'cancelled', label: '주문취소' },
    ];
    
    // 취소된 주문이나 배송완료된 주문은 상태 변경 불가
    if (currentStatus === 'cancelled' || currentStatus === 'delivered') {
      return allOptions.filter(opt => opt.value === currentStatus);
    }
    
    return allOptions;
  };

  const formatPrice = (price) => {
    return `$${price?.toLocaleString() || 0}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="order-manage-page">
          <div className="order-manage-content">
            <div className="loading">로딩 중...</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="order-manage-page">
        <div className="order-manage-content">
          <div className="order-manage-header">
            <button className="back-button" onClick={() => navigate('/admin')}>
              ←
            </button>
            <h1 className="page-title">주문 관리</h1>
          </div>

          <div className="search-filter-section">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="주문번호 또는 고객명으로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="filter-button">
              <span>🔽</span>
              <span>필터</span>
            </button>
          </div>

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
              className={`status-tab ${activeTab === 'confirmed' ? 'active' : ''}`}
              onClick={() => setActiveTab('confirmed')}
            >
              주문확인완료 {orderCounts.confirmed > 0 && <span className="status-tab-count">{orderCounts.confirmed}</span>}
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
                  <div className="order-card-header">
                    <div className="order-header-left">
                      <div className="order-id-row">
                        <span>🕐</span>
                        <span className="order-id">{order.orderNumber}</span>
                      </div>
                      <div className="order-customer-date">
                        {order.user?.name || '고객명 없음'} • {formatDate(order.createdAt)}
                      </div>
                    </div>
                    <div className="order-header-right">
                      <div className="order-status-dropdown-wrapper">
                        <select
                          className={`order-status-dropdown ${getStatusBadgeClass(order.orderStatus || 'pending')}`}
                          value={order.orderStatus || 'pending'}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        >
                          {getStatusDisplayOptions(order.orderStatus || 'pending').map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="order-total">{formatPrice(order.totalAmount)}</div>
                      <a href="#" className="order-detail-link" onClick={(e) => {
                        e.preventDefault();
                        // 주문 상세 페이지로 이동 (나중에 구현)
                        console.log('주문 상세보기:', order.orderNumber);
                      }}>
                        <span>👁</span>
                        <span>상세보기</span>
                      </a>
                    </div>
                  </div>

                  <div className="order-details">
                    <div className="detail-row">
                      <div className="detail-label">고객 정보</div>
                      <div className="detail-value email">{order.user?.email || '-'}</div>
                      <div className="detail-value">{order.phone || '-'}</div>
                    </div>
                    <div className="detail-row">
                      <div className="detail-label">주문 상품</div>
                      <div className="detail-value">{order.items?.length || 0}개 상품</div>
                    </div>
                    <div className="detail-row">
                      <div className="detail-label">배송 주소</div>
                      <div className="detail-value">
                        {order.shippingAddress} {order.address}
                        {order.detailAddress && ` ${order.detailAddress}`}
                      </div>
                    </div>
                    {order.orderStatus === 'shipping' && order.trackingNumber && (
                      <div className="detail-row">
                        <div className="detail-label">추적번호</div>
                        <div className="detail-value tracking-number">{order.trackingNumber}</div>
                      </div>
                    )}
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default OrderManagePage;

