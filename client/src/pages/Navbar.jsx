import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const styles = `
.navbar {
  width: 100%;
  padding: 20px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e5e5e5;
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 100;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.menu-icon {
  font-size: 20px;
  cursor: pointer;
  font-weight: 300;
  color: #000;
}

.menu-icon:hover {
  opacity: 0.7;
}

.logo {
  font-size: 24px;
  font-weight: 400;
  letter-spacing: 2px;
  color: #000;
  text-decoration: none;
  font-family: serif;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 30px;
}

.nav-link {
  font-size: 13px;
  color: #000;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.nav-link:hover {
  opacity: 0.7;
}

.admin-link {
  font-weight: 500;
  color: #fff;
  background-color: #424242;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.admin-link:hover {
  background-color: #616161;
  opacity: 1;
}

.search-icon {
  font-size: 18px;
  cursor: pointer;
  color: #000;
}

.search-icon:hover {
  opacity: 0.7;
}

.cart-icon {
  font-size: 20px;
  cursor: pointer;
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
  text-decoration: none;
  position: relative;
}

.cart-icon:hover {
  opacity: 0.7;
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #2196F3;
  color: #fff;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  min-width: 20px;
}

.user-menu-container {
  position: relative;
}

.welcome-text {
  font-size: 13px;
  color: #000;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.welcome-text:hover {
  opacity: 0.7;
}

.welcome-text::after {
  content: '▼';
  font-size: 10px;
  color: #666;
  transition: transform 0.2s ease;
  display: inline-block;
}

.welcome-text:hover::after {
  color: #000;
}

.user-menu-container[data-open="true"] .welcome-text::after {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 10px;
  background: #fff;
  border: 1px solid #e5e5e5;
  min-width: 180px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 12px 20px;
  text-align: left;
  font-size: 13px;
  color: #000;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dropdown-item:hover {
  background: #f5f5f5;
}

.dropdown-item:not(:last-child) {
  border-bottom: 1px solid #f0f0f0;
}
`;

function Navbar({ user, loading, onLogout }) {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(0);
  const dropdownRef = useRef(null);

  // 어드민 권한 확인 함수
  const isAdmin = useCallback(() => {
    if (!user) return false;
    const userType = user.userType?.toLowerCase();
    return userType === 'admin' || userType === 'admiin';
  }, [user]);

  // 장바구니 수량 가져오기
  const fetchCartQuantity = useCallback(async () => {
    if (!user) {
      setCartQuantity(0);
      return;
    }

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        setCartQuantity(0);
        return;
      }

      const response = await api.get('/carts');
      if (response.data.cart) {
        setCartQuantity(response.data.cart.totalItems || 0);
      }
    } catch (error) {
      // 에러가 발생해도 수량을 0으로 설정하지 않고 그대로 유지
      // 401 에러는 로그인이 필요한 경우이므로 0으로 설정
      if (error.response?.status === 401) {
        setCartQuantity(0);
      }
    }
  }, [user]);

  // 사용자가 로그인되어 있을 때 장바구니 수량 가져오기
  useEffect(() => {
    if (user && !loading) {
      fetchCartQuantity();
    } else {
      setCartQuantity(0);
    }
  }, [user, loading, fetchCartQuantity]);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isDropdownOpen]);

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen((prev) => !prev);
  }, []);

  const handleAdminClick = useCallback(() => {
    setIsDropdownOpen(false);
    navigate('/admin');
  }, [navigate]);

  const handleOrdersClick = useCallback(() => {
    setIsDropdownOpen(false);
    navigate('/orders');
  }, [navigate]);

  const handleLogoutClick = useCallback(() => {
    setIsDropdownOpen(false);
    onLogout();
  }, [onLogout]);

  return (
    <>
      <style>{styles}</style>
      <nav className="navbar">
        <div className="navbar-left">
          <div className="menu-icon">☰</div>
          <Link to="/" className="logo">
            SHOPPING MALL
          </Link>
        </div>
        <div className="navbar-right">
          <div className="search-icon">🔍</div>
          {!loading && user && isAdmin() && (
            <Link to="/admin" className="nav-link admin-link">
              ADMIN
            </Link>
          )}
          {!loading && (
            <>
              {user ? (
                <div className="user-menu-container" ref={dropdownRef} data-open={isDropdownOpen}>
                  <div className="welcome-text" onClick={toggleDropdown}>
                    {user.name}님 환영합니다
                  </div>
                  {isDropdownOpen && (
                    <div className="dropdown-menu">
                      {isAdmin() && (
                        <button className="dropdown-item" onClick={handleAdminClick}>
                          어드민
                        </button>
                      )}
                      <button className="dropdown-item" onClick={handleOrdersClick}>
                        내 주문목록
                      </button>
                      <button className="dropdown-item" onClick={handleLogoutClick}>
                        로그아웃
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="nav-link">
                  LOGIN
                </Link>
              )}
            </>
          )}
          <Link to="/help" className="nav-link">
            HELP
          </Link>
          <Link to="/cart" className="cart-icon">
            🛒
            {cartQuantity > 0 && (
              <span className="cart-badge">{cartQuantity}</span>
            )}
          </Link>
        </div>
      </nav>
    </>
  );
}

export default Navbar;

