import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Navbar from './Navbar';

const styles = `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.main-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

/* Sub Navigation */
.sub-nav {
  width: 100%;
  padding: 15px 40px;
  display: flex;
  align-items: center;
  gap: 30px;
  border-bottom: 1px solid #e5e5e5;
  background: #fff;
}

.sub-nav-link {
  font-size: 12px;
  color: #000;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.sub-nav-link:hover {
  opacity: 0.7;
}

/* Main Content */
.main-content {
  flex: 1;
  padding: 60px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.content-title {
  font-size: 48px;
  font-weight: 300;
  letter-spacing: 3px;
  margin-bottom: 40px;
  text-align: center;
  color: #000;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 40px;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.product-placeholder {
  width: 100%;
  aspect-ratio: 3/4;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.product-card {
  width: 100%;
  cursor: pointer;
  transition: transform 0.2s;
  text-decoration: none;
  color: inherit;
}

.product-card:hover {
  transform: translateY(-4px);
}

.product-image-container {
  width: 100%;
  aspect-ratio: 3/4;
  background: #f5f5f5;
  overflow: hidden;
  margin-bottom: 12px;
  position: relative;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.product-name {
  font-size: 14px;
  color: #000;
  font-weight: 400;
  letter-spacing: 0.5px;
}

.product-price {
  font-size: 14px;
  color: #000;
  font-weight: 500;
}

.product-category {
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.loading-products {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 14px;
}

.error-products {
  text-align: center;
  padding: 40px;
  color: #d32f2f;
  font-size: 14px;
}

/* Footer */
.footer {
  width: 100%;
  padding: 60px 40px 30px;
  background: #fff;
  border-top: 1px solid #e5e5e5;
}

.social-links {
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.social-link {
  font-size: 11px;
  color: #000;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: opacity 0.2s;
}

.social-link:hover {
  opacity: 0.7;
}

.footer-columns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  margin-bottom: 40px;
}

.footer-column h4 {
  font-size: 12px;
  font-weight: 400;
  margin-bottom: 15px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #000;
}

.footer-column a {
  display: block;
  font-size: 11px;
  color: #666;
  text-decoration: none;
  margin-bottom: 10px;
  transition: color 0.2s;
}

.footer-column a:hover {
  color: #000;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 30px;
  border-top: 1px solid #e5e5e5;
  font-size: 11px;
  color: #999;
}

.language-selector {
  display: flex;
  gap: 15px;
}

.language-link {
  color: #000;
  text-decoration: none;
  text-transform: uppercase;
  transition: opacity 0.2s;
}

.language-link:hover {
  opacity: 0.7;
}
`;

function MainPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState('');

  const fetchUserInfo = useCallback(async () => {
    try {
      const response = await api.get('/users/me');
      if (response.data.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('유저 정보 가져오기 실패:', error);
      // 토큰 제거
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogout = useCallback(() => {
    // 토큰 및 유저 정보 제거
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    
    // 유저 상태 초기화
    setUser(null);
    
    // 메인 페이지 새로고침
    window.location.reload();
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setProductsLoading(true);
      setProductsError('');
      const response = await api.get('/products');
      
      if (response.data.products) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error('상품 목록 가져오기 실패:', error);
      setProductsError('상품을 불러오는데 실패했습니다.');
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    // 토큰 확인
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (token) {
      fetchUserInfo();
    } else {
      setLoading(false);
    }
    
    // 상품 데이터 가져오기
    fetchProducts();
  }, [fetchUserInfo, fetchProducts]);

  const formatPrice = (price) => {
    return `$${price.toLocaleString()}`;
  };

  return (
    <>
      <style>{styles}</style>
      <div className="main-page">
        <Navbar user={user} loading={loading} onLogout={handleLogout} />

        {/* Sub Navigation */}
        <div className="sub-nav">
          <Link to="/collection" className="sub-nav-link">
            COLLECTION
          </Link>
          <Link to="/men" className="sub-nav-link">
            MEN
          </Link>
          <Link to="/women" className="sub-nav-link">
            WOMEN
          </Link>
          <Link to="/kids" className="sub-nav-link">
            KIDS
          </Link>
        </div>

        {/* Main Content */}
        <main className="main-content">
          <h1 className="content-title">SHOPPING MALL</h1>
          <div className="product-grid">
            {productsLoading ? (
              <div className="loading-products">상품을 불러오는 중...</div>
            ) : productsError ? (
              <div className="error-products">{productsError}</div>
            ) : products.length === 0 ? (
              <div className="loading-products">등록된 상품이 없습니다.</div>
            ) : (
              products.map((product) => (
                <Link
                  key={product._id}
                  to={`/product/${product._id}`}
                  className="product-card"
                >
                  <div className="product-image-container">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="product-image"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="400"%3E%3Crect fill="%23f5f5f5" width="300" height="400"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="14"%3E이미지 없음%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    ) : (
                      <div className="product-placeholder">이미지 없음</div>
                    )}
                  </div>
                  <div className="product-info">
                    <div className="product-name">{product.name}</div>
                    <div className="product-price">{formatPrice(product.price)}</div>
                    <div className="product-category">{product.category}</div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="footer">
          <div className="social-links">
            <a href="#" className="social-link">TIKTOK</a>
            <a href="#" className="social-link">INSTAGRAM</a>
            <a href="#" className="social-link">FACEBOOK</a>
            <a href="#" className="social-link">X</a>
            <a href="#" className="social-link">PINTEREST</a>
            <a href="#" className="social-link">KAKAO</a>
            <a href="#" className="social-link">YOUTUBE</a>
            <a href="#" className="social-link">SPOTIFY</a>
          </div>
          <div className="footer-columns">
            <div className="footer-column">
              <h4>고객 서비스</h4>
              <a href="#">문의하기</a>
              <a href="#">배송 정보</a>
              <a href="#">반품 및 교환</a>
              <a href="#">주문 조회</a>
            </div>
            <div className="footer-column">
              <h4>회사 정보</h4>
              <a href="#">회사 소개</a>
              <a href="#">채용</a>
              <a href="#">매장 찾기</a>
              <a href="#">투자자 관계</a>
            </div>
            <div className="footer-column">
              <h4>정책</h4>
              <a href="#">개인정보 보호</a>
              <a href="#">이용 약관</a>
              <a href="#">쿠키 정책</a>
              <a href="#">환경 정책</a>
            </div>
          </div>
          <div className="footer-bottom">
            <div>© 2024 SHOPPING MALL. ALL RIGHTS RESERVED.</div>
            <div className="language-selector">
              <a href="#" className="language-link">ENGLISH</a>
              <a href="#" className="language-link">KOREA</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default MainPage;

