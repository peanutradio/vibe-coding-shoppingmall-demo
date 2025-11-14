import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const styles = `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.product-manage-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.page-header {
  background-color: #fff;
  border-bottom: 1px solid #e5e5e5;
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.back-button {
  font-size: 20px;
  cursor: pointer;
  color: #000;
  background: none;
  border: none;
  padding: 0;
  transition: opacity 0.2s;
}

.back-button:hover {
  opacity: 0.7;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #000;
}

.add-product-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s;
}

.add-product-button:hover {
  background: #333;
}

.tabs {
  background-color: #fafafa;
  border-bottom: 1px solid #e5e5e5;
  padding: 0 40px;
  display: flex;
  gap: 40px;
}

.tab {
  padding: 16px 0;
  background: none;
  border: none;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: color 0.2s;
}

.tab.active {
  color: #000;
  border-bottom-color: #000;
  font-weight: 500;
}

.tab:hover {
  color: #000;
}

.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px;
}

.products-container {
  background: #fff;
  border-radius: 8px;
  padding: 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.products-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.products-title {
  font-size: 24px;
  font-weight: 600;
  color: #000;
}

.filter-section {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 24px;
}

.filter-select {
  padding: 8px 16px;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  font-size: 14px;
  color: #000;
  background: #fff;
  cursor: pointer;
}

.filter-select:focus {
  outline: none;
  border-color: #000;
}

.products-table {
  width: 100%;
  border-collapse: collapse;
}

.products-table thead {
  background-color: #fafafa;
}

.products-table th {
  padding: 16px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: #000;
  border-bottom: 2px solid #e5e5e5;
}

.products-table td {
  padding: 16px;
  font-size: 14px;
  color: #000;
  border-bottom: 1px solid #f0f0f0;
}

.products-table tbody tr:hover {
  background-color: #fafafa;
}

.product-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #e5e5e5;
}

.product-name {
  font-weight: 500;
  margin-bottom: 4px;
}

.product-sku {
  font-size: 12px;
  color: #666;
}

.category-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.category-badge.top {
  background: #e3f2fd;
  color: #1976d2;
}

.category-badge.bottom {
  background: #f3e5f5;
  color: #7b1fa2;
}

.category-badge.accessory {
  background: #fff3e0;
  color: #f57c00;
}

.price {
  font-weight: 600;
  color: #000;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px 12px;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  background: #fff;
  color: #000;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.action-btn:hover {
  border-color: #000;
  background: #fafafa;
}

.action-btn.edit {
  color: #1976d2;
  border-color: #1976d2;
}

.action-btn.edit:hover {
  background: #e3f2fd;
}

.action-btn.delete {
  color: #d32f2f;
  border-color: #d32f2f;
}

.action-btn.delete:hover {
  background: #ffebee;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}

.error-message {
  padding: 12px;
  background: #ffebee;
  border: 1px solid #d32f2f;
  color: #d32f2f;
  border-radius: 4px;
  font-size: 14px;
  margin-bottom: 20px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.empty-state-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.3;
}

.empty-state-text {
  font-size: 16px;
  margin-bottom: 24px;
}

.modal-overlay {
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

.modal-content {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  color: #000;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  color: #000;
}

.modal-body {
  margin-bottom: 20px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.modal-btn {
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.modal-btn.cancel {
  background: #fff;
  color: #000;
  border: 1px solid #e5e5e5;
}

.modal-btn.cancel:hover {
  border-color: #000;
  background: #fafafa;
}

.modal-btn.confirm {
  background: #d32f2f;
  color: #fff;
  border: none;
}

.modal-btn.confirm:hover {
  background: #b71c1c;
}

.modal-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 30px;
  padding-top: 30px;
  border-top: 1px solid #e5e5e5;
}

.pagination-button {
  padding: 8px 16px;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  background: #fff;
  color: #000;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  min-width: 40px;
}

.pagination-button:hover:not(:disabled) {
  border-color: #000;
  background: #fafafa;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-button.active {
  background: #000;
  color: #fff;
  border-color: #000;
}

.pagination-info {
  font-size: 14px;
  color: #666;
  margin: 0 16px;
}
`;

function ProductManagePage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [deleteModal, setDeleteModal] = useState({ open: false, product: null });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [categoryFilter, currentPage]);

  const checkAdminAccess = async () => {
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
      }
    } catch (error) {
      console.error('권한 확인 실패:', error);
      navigate('/login');
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (categoryFilter) {
        params.append('category', categoryFilter);
      }
      params.append('page', currentPage.toString());
      params.append('limit', '2');
      
      const response = await api.get(`/products?${params.toString()}`);
      
      if (response.data) {
        setProducts(response.data.products || []);
        setTotalPages(response.data.totalPages || 1);
        setTotalCount(response.data.totalCount || 0);
      }
      setError('');
    } catch (err) {
      console.error('상품 목록 조회 실패:', err);
      setError('상품 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.product) return;

    try {
      setDeleting(true);
      await api.delete(`/products/${deleteModal.product._id}`);
      setDeleteModal({ open: false, product: null });
      setSuccess(`${deleteModal.product.name} 상품이 삭제되었습니다.`);
      setError('');
      
      // 삭제 후 현재 페이지에 상품이 없고 첫 페이지가 아니면 이전 페이지로 이동
      if (products.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchProducts(); // 목록 새로고침
      }
      
      // 성공 메시지 3초 후 제거
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('상품 삭제 실패:', err);
      const errorMessage = err.response?.data?.message || '상품 삭제에 실패했습니다.';
      setError(errorMessage);
      setDeleteModal({ open: false, product: null });
    } finally {
      setDeleting(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCategoryChange = (category) => {
    setCategoryFilter(category);
    setCurrentPage(1); // 카테고리 변경 시 첫 페이지로 리셋
  };

  const formatPrice = (price) => {
    return `$${price.toLocaleString()}`;
  };

  const getCategoryClass = (category) => {
    const categoryMap = {
      '상의': 'top',
      '하의': 'bottom',
      '악세사리': 'accessory'
    };
    return categoryMap[category] || '';
  };

  const handleEdit = (product) => {
    // TODO: 상품 수정 페이지로 이동 (나중에 구현)
    navigate(`/admin/products/edit/${product._id}`);
  };

  if (loading && products.length === 0) {
    return (
      <>
        <style>{styles}</style>
        <div className="product-manage-page">
          <div className="content-wrapper">
            <div className="loading">로딩 중...</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="product-manage-page">
        {/* 헤더 */}
        <div className="page-header">
          <div className="header-left">
            <button className="back-button" onClick={() => navigate('/admin')}>
              ←
            </button>
            <h1 className="page-title">상품 관리</h1>
          </div>
          <button className="add-product-button" onClick={() => navigate('/admin/products/register')}>
            <span>+</span>
            <span>새 상품 등록</span>
          </button>
        </div>

        {/* 탭 */}
        <div className="tabs">
          <button className="tab active">
            상품 목록
          </button>
          <button className="tab" onClick={() => navigate('/admin/products/register')}>
            상품 등록
          </button>
        </div>

        {/* 컨텐츠 */}
        <div className="content-wrapper">
          <div className="products-container">
            <div className="products-header">
              <h2 className="products-title">상품 목록</h2>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            {/* 필터 */}
            <div className="filter-section">
              <label htmlFor="category-filter" style={{ fontSize: '14px', color: '#666' }}>
                카테고리:
              </label>
              <select
                id="category-filter"
                className="filter-select"
                value={categoryFilter}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                <option value="">전체</option>
                <option value="상의">상의</option>
                <option value="하의">하의</option>
                <option value="악세사리">악세사리</option>
              </select>
            </div>

            {/* 상품 테이블 */}
            {products.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📦</div>
                <div className="empty-state-text">등록된 상품이 없습니다.</div>
                <button
                  className="add-product-button"
                  onClick={() => navigate('/admin/products/register')}
                >
                  <span>+</span>
                  <span>새 상품 등록</span>
                </button>
              </div>
            ) : (
              <table className="products-table">
                <thead>
                  <tr>
                    <th>이미지</th>
                    <th>상품명 / SKU</th>
                    <th>카테고리</th>
                    <th>가격</th>
                    <th>등록일</th>
                    <th>작업</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td>
                        <img
                          src={product.image || '/placeholder.png'}
                          alt={product.name}
                          className="product-image"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="60" height="60"%3E%3Crect fill="%23e5e5e5" width="60" height="60"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="12"%3E이미지 없음%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      </td>
                      <td>
                        <div className="product-name">{product.name}</div>
                        <div className="product-sku">{product.sku}</div>
                      </td>
                      <td>
                        <span className={`category-badge ${getCategoryClass(product.category)}`}>
                          {product.category}
                        </span>
                      </td>
                      <td className="price">{formatPrice(product.price)}</td>
                      <td>
                        {new Date(product.createdAt).toLocaleDateString('ko-KR')}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="action-btn edit"
                            onClick={() => handleEdit(product)}
                          >
                            수정
                          </button>
                          <button
                            className="action-btn delete"
                            onClick={() => setDeleteModal({ open: true, product })}
                          >
                            삭제
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* 페이지네이션 */}
            {products.length > 0 && totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  이전
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`pagination-button ${currentPage === page ? 'active' : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  className="pagination-button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  다음
                </button>
                
                <div className="pagination-info">
                  {totalCount}개 중 {(currentPage - 1) * 2 + 1}-{Math.min(currentPage * 2, totalCount)}개 표시
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 삭제 확인 모달 */}
        {deleteModal.open && (
          <div className="modal-overlay" onClick={() => setDeleteModal({ open: false, product: null })}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">상품 삭제</h3>
                <button className="modal-close" onClick={() => setDeleteModal({ open: false, product: null })}>
                  ×
                </button>
              </div>
              <div className="modal-body">
                <p>정말로 "{deleteModal.product?.name}" 상품을 삭제하시겠습니까?</p>
                <p style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                  이 작업은 되돌릴 수 없습니다.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="modal-btn cancel"
                  onClick={() => setDeleteModal({ open: false, product: null })}
                >
                  취소
                </button>
                <button
                  className="modal-btn confirm"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? '삭제 중...' : '삭제'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ProductManagePage;

