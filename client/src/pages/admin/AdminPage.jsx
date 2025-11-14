import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const styles = `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.admin-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 40px;
}

.admin-content {
  max-width: 1400px;
  margin: 0 auto;
}

.admin-header {
  margin-bottom: 40px;
}

.admin-title {
  font-size: 36px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #000;
}

.admin-welcome {
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.stat-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 32px;
  font-weight: 600;
  color: #000;
  margin-bottom: 8px;
}

.stat-change {
  font-size: 13px;
  color: #4caf50;
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-change.negative {
  color: #f44336;
}

.stat-icon {
  font-size: 48px;
  opacity: 0.1;
  color: #000;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 24px;
  margin-bottom: 40px;
}

@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

.dashboard-section {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #000;
}

.view-all-link {
  font-size: 14px;
  color: #666;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s;
}

.view-all-link:hover {
  color: #000;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s, transform 0.2s;
  text-align: left;
}

.action-button.secondary {
  background: #fff;
  color: #000;
  border: 1px solid #e5e5e5;
}

.action-button:hover {
  background: #333;
  transform: translateX(4px);
}

.action-button.secondary:hover {
  background: #f5f5f5;
  border-color: #000;
}

.action-icon {
  font-size: 20px;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.order-item {
  padding: 16px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}

.order-item:hover {
  border-color: #000;
  background: #fafafa;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.order-id {
  font-size: 14px;
  font-weight: 600;
  color: #000;
}

.order-date {
  font-size: 12px;
  color: #666;
}

.order-customer {
  font-size: 14px;
  color: #000;
  margin-bottom: 8px;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.order-status.processing {
  background: #fff3e0;
  color: #f57c00;
}

.order-status.shipping {
  background: #e3f2fd;
  color: #1976d2;
}

.order-status.completed {
  background: #e8f5e9;
  color: #388e3c;
}

.order-price {
  font-size: 16px;
  font-weight: 600;
  color: #000;
}

.back-button {
  display: inline-block;
  padding: 12px 24px;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #000;
  background: transparent;
  border: 1px solid #000;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.3s, color 0.3s;
  margin-bottom: 30px;
  border-radius: 4px;
}

.back-button:hover {
  background: #000;
  color: #fff;
}

.error-message {
  padding: 20px;
  background: #ffebee;
  border: 1px solid #d32f2f;
  color: #d32f2f;
  text-align: center;
  margin: 40px;
  border-radius: 4px;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}
`;

function AdminPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // 대시보드 통계 데이터 (나중에 API로 교체 가능)
  const [stats, setStats] = useState({
    totalOrders: 1234,
    totalProducts: 156,
    totalCustomers: 2345,
    totalSales: 45678,
    ordersChange: 12,
    productsChange: 3,
    customersChange: 8,
    salesChange: 15
  });

  // 최근 주문 데이터 (나중에 API로 교체 가능)
  const [recentOrders] = useState([
    {
      id: 'ORD-001234',
      customer: '김민수',
      date: '2024-12-30',
      status: 'processing',
      price: 219
    },
    {
      id: 'ORD-001233',
      customer: '이영희',
      date: '2024-12-29',
      status: 'shipping',
      price: 156
    },
    {
      id: 'ORD-001232',
      customer: '박철수',
      date: '2024-12-29',
      status: 'completed',
      price: 342
    },
    {
      id: 'ORD-001231',
      customer: '최지영',
      date: '2024-12-28',
      status: 'processing',
      price: 89
    }
  ]);

  useEffect(() => {
    checkAdminAccess();
    // TODO: 실제 API 호출로 대시보드 데이터 가져오기
    // loadDashboardData();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        setError('로그인이 필요합니다.');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      const response = await api.get('/users/me');
      
      if (response.data.user) {
        const userType = response.data.user.userType?.toLowerCase();
        if (userType !== 'admin' && userType !== 'admiin') {
          setError('관리자 권한이 필요합니다.');
          setTimeout(() => navigate('/'), 2000);
          return;
        }
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('권한 확인 실패:', error);
      setError('권한을 확인할 수 없습니다.');
      setTimeout(() => navigate('/login'), 2000);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return `$${price.toLocaleString()}`;
  };

  const getStatusText = (status) => {
    const statusMap = {
      processing: '처리중',
      shipping: '배송중',
      completed: '완료'
    };
    return statusMap[status] || status;
  };

  const handleQuickAction = (action) => {
    if (action === 'add-product') {
      navigate('/admin/products/register');
    } else if (action === 'products') {
      navigate('/admin/products');
    } else {
      // TODO: 다른 액션들에 대한 페이지로 이동하거나 모달 열기
      console.log('Quick action:', action);
    }
  };

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="admin-page">
          <div className="admin-content">
            <div className="loading">로딩 중...</div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <style>{styles}</style>
        <div className="admin-page">
          <div className="error-message">{error}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="admin-page">
        <div className="admin-content">
          <button className="back-button" onClick={() => navigate('/')}>
            ← 메인으로
          </button>
          
          <div className="admin-header">
            <h1 className="admin-title">관리자 대시보드</h1>
            <p className="admin-welcome">
              CIDER 쇼핑몰 관리 시스템에 오신 것을 환영합니다.
            </p>
          </div>

          {/* 통계 카드 */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-info">
                <div className="stat-label">총 주문</div>
                <div className="stat-value">{stats.totalOrders.toLocaleString()}</div>
                <div className="stat-change">
                  <span>↑</span>
                  <span>+{stats.ordersChange}% from last month</span>
                </div>
              </div>
              <div className="stat-icon">🛒</div>
            </div>

            <div className="stat-card">
              <div className="stat-info">
                <div className="stat-label">총 상품</div>
                <div className="stat-value">{stats.totalProducts.toLocaleString()}</div>
                <div className="stat-change">
                  <span>↑</span>
                  <span>+{stats.productsChange}% from last month</span>
                </div>
              </div>
              <div className="stat-icon">📦</div>
            </div>

            <div className="stat-card">
              <div className="stat-info">
                <div className="stat-label">총 고객</div>
                <div className="stat-value">{stats.totalCustomers.toLocaleString()}</div>
                <div className="stat-change">
                  <span>↑</span>
                  <span>+{stats.customersChange}% from last month</span>
                </div>
              </div>
              <div className="stat-icon">👥</div>
            </div>

            <div className="stat-card">
              <div className="stat-info">
                <div className="stat-label">총 매출</div>
                <div className="stat-value">{formatPrice(stats.totalSales)}</div>
                <div className="stat-change">
                  <span>↑</span>
                  <span>+{stats.salesChange}% from last month</span>
                </div>
              </div>
              <div className="stat-icon">📈</div>
            </div>
          </div>

          {/* 빠른 작업 & 최근 주문 */}
          <div className="dashboard-grid">
            {/* 빠른 작업 */}
            <div className="dashboard-section">
              <div className="section-header">
                <h2 className="section-title">빠른 작업</h2>
              </div>
              <div className="quick-actions">
                <button 
                  className="action-button"
                  onClick={() => handleQuickAction('add-product')}
                >
                  <span className="action-icon">+</span>
                  <span>새 상품 등록</span>
                </button>
                <button 
                  className="action-button secondary"
                  onClick={() => handleQuickAction('products')}
                >
                  <span className="action-icon">📦</span>
                  <span>상품 관리</span>
                </button>
                <button 
                  className="action-button secondary"
                  onClick={() => navigate('/admin/orders')}
                >
                  <span className="action-icon">👁</span>
                  <span>주문 관리</span>
                </button>
                <button 
                  className="action-button secondary"
                  onClick={() => handleQuickAction('sales')}
                >
                  <span className="action-icon">📊</span>
                  <span>매출 분석</span>
                </button>
                <button 
                  className="action-button secondary"
                  onClick={() => handleQuickAction('customers')}
                >
                  <span className="action-icon">👥</span>
                  <span>고객 관리</span>
                </button>
              </div>
            </div>

            {/* 최근 주문 */}
            <div className="dashboard-section">
              <div className="section-header">
                <h2 className="section-title">최근 주문</h2>
                <a className="view-all-link" onClick={() => handleQuickAction('all-orders')}>
                  전체보기
                </a>
              </div>
              <div className="orders-list">
                {recentOrders.map((order) => (
                  <div key={order.id} className="order-item">
                    <div className="order-header">
                      <span className="order-id">{order.id}</span>
                      <span className="order-date">{order.date}</span>
                    </div>
                    <div className="order-customer">고객: {order.customer}</div>
                    <div className="order-footer">
                      <span className={`order-status ${order.status}`}>
                        {getStatusText(order.status)}
                      </span>
                      <span className="order-price">{formatPrice(order.price)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminPage;

