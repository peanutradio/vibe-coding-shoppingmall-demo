import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';

const styles = `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.product-register-page {
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px;
}

.form-container {
  background: #fff;
  border-radius: 8px;
  padding: 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.form-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 30px;
  color: #000;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

@media (max-width: 1024px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}

.form-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #000;
}

.form-label.optional {
  color: #666;
}

.form-label.optional::after {
  content: ' (선택)';
  font-weight: 400;
}

.form-input {
  padding: 12px 16px;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  font-size: 14px;
  color: #000;
  background: #fff;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #000;
}

.form-input::placeholder {
  color: #999;
}

.form-select {
  padding: 12px 16px;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  font-size: 14px;
  color: #000;
  background: #fff;
  cursor: pointer;
  transition: border-color 0.2s;
}

.form-select:focus {
  outline: none;
  border-color: #000;
}

.form-textarea {
  padding: 12px 16px;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  font-size: 14px;
  color: #000;
  background: #fff;
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-textarea:focus {
  outline: none;
  border-color: #000;
}

.form-textarea::placeholder {
  color: #999;
}

.image-preview {
  margin-top: 12px;
  max-width: 300px;
  max-height: 300px;
  border-radius: 4px;
  border: 1px solid #e5e5e5;
  object-fit: contain;
}

.image-upload-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.upload-button {
  display: inline-block;
  padding: 10px 20px;
  background: #fff;
  color: #000;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: border-color 0.2s, background 0.2s;
  width: fit-content;
}

.upload-button:hover {
  border-color: #000;
  background: #fafafa;
}

.image-url-input {
  margin-top: 8px;
}

.image-url-label {
  font-size: 12px;
  color: #666;
  margin-top: 8px;
}

.submit-section {
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #e5e5e5;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.submit-button {
  padding: 12px 32px;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s;
}

.submit-button:hover {
  background: #333;
}

.submit-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.cancel-button {
  padding: 12px 32px;
  background: #fff;
  color: #000;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: border-color 0.2s, background 0.2s;
}

.cancel-button:hover {
  border-color: #000;
  background: #fafafa;
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

.success-message {
  padding: 12px;
  background: #e8f5e9;
  border: 1px solid #4caf50;
  color: #2e7d32;
  border-radius: 4px;
  font-size: 14px;
  margin-bottom: 20px;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}
`;

function ProductEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const cloudinaryRef = useRef();
  const widgetRef = useRef();
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    price: '',
    category: '',
    image: '',
    description: '',
  });

  useEffect(() => {
    checkAdminAccess();
    fetchProduct();
    
    // Cloudinary 위젯 초기화
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    
    if (cloudName && uploadPreset && window.cloudinary) {
      cloudinaryRef.current = window.cloudinary;
      widgetRef.current = cloudinaryRef.current.createUploadWidget(
        {
          cloudName: cloudName,
          uploadPreset: uploadPreset,
          sources: ['local', 'url', 'camera'],
          multiple: false,
          maxFileSize: 5000000,
          clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        },
        (error, result) => {
          if (!error && result && result.event === 'success') {
            const imageUrl = result.info.secure_url;
            setFormData((prev) => ({
              ...prev,
              image: imageUrl,
            }));
            setImagePreview(imageUrl);
            setError('');
          } else if (error) {
            setError('이미지 업로드 중 오류가 발생했습니다.');
          }
        }
      );
    }

    return () => {
      if (widgetRef.current) {
        widgetRef.current.destroy();
      }
    };
  }, [id]);

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

  const fetchProduct = async () => {
    try {
      setLoadingProduct(true);
      const response = await api.get(`/products/${id}`);
      
      if (response.data.product) {
        const product = response.data.product;
        setFormData({
          sku: product.sku || '',
          name: product.name || '',
          price: product.price || '',
          category: product.category || '',
          image: product.image || '',
          description: product.description || '',
        });
        if (product.image) {
          setImagePreview(product.image);
        }
      }
      setError('');
    } catch (err) {
      console.error('상품 조회 실패:', err);
      setError('상품 정보를 불러오는데 실패했습니다.');
      setTimeout(() => navigate('/admin/products'), 2000);
    } finally {
      setLoadingProduct(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
    setSuccess('');
  };

  const handleImageUpload = () => {
    if (widgetRef.current) {
      widgetRef.current.open();
    } else {
      setError('Cloudinary 위젯이 초기화되지 않았습니다.');
    }
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData((prev) => ({
      ...prev,
      image: url,
    }));
    
    if (url) {
      setImagePreview(url);
    } else {
      setImagePreview('');
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // 필수 필드 검증
    if (!formData.sku || !formData.name || !formData.price || !formData.category || !formData.image) {
      setError('필수 필드를 모두 입력해주세요.');
      setLoading(false);
      return;
    }

    // 가격 검증
    const price = parseFloat(formData.price);
    if (isNaN(price) || price < 0) {
      setError('가격은 0 이상의 숫자여야 합니다.');
      setLoading(false);
      return;
    }

    try {
      const productData = {
        sku: formData.sku,
        name: formData.name,
        price: price,
        category: formData.category,
        image: formData.image,
        description: formData.description || '',
      };

      const response = await api.put(`/products/${id}`, productData);
      
      if (response.data) {
        setSuccess('상품이 성공적으로 수정되었습니다.');
        setTimeout(() => {
          navigate('/admin/products');
        }, 1500);
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('상품 수정 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingProduct) {
    return (
      <>
        <style>{styles}</style>
        <div className="product-register-page">
          <div className="content-wrapper">
            <div className="loading">상품 정보를 불러오는 중...</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="product-register-page">
        {/* 헤더 */}
        <div className="page-header">
          <div className="header-left">
            <button className="back-button" onClick={() => navigate('/admin/products')}>
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
          <button className="tab" onClick={() => navigate('/admin/products')}>
            상품 목록
          </button>
          <button className="tab" onClick={() => navigate('/admin/products/register')}>
            상품 등록
          </button>
        </div>

        {/* 컨텐츠 */}
        <div className="content-wrapper">
          <div className="form-container">
            <h2 className="form-title">상품 수정</h2>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                {/* 왼쪽 컬럼 */}
                <div className="form-column">
                  <div className="form-group">
                    <label className="form-label" htmlFor="sku">
                      SKU
                    </label>
                    <input
                      type="text"
                      id="sku"
                      name="sku"
                      className="form-input"
                      placeholder="SKU를 입력하세요"
                      value={formData.sku}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="name">
                      상품명
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="form-input"
                      placeholder="상품명을 입력하세요"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="price">
                      판매가격
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      className="form-input"
                      placeholder="0"
                      value={formData.price}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="category">
                      카테고리
                    </label>
                    <select
                      id="category"
                      name="category"
                      className="form-select"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">카테고리 선택</option>
                      <option value="상의">상의</option>
                      <option value="하의">하의</option>
                      <option value="악세사리">악세사리</option>
                    </select>
                  </div>
                </div>

                {/* 오른쪽 컬럼 */}
                <div className="form-column">
                  <div className="form-group">
                    <label className="form-label optional" htmlFor="description">
                      상품 설명
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      className="form-textarea"
                      placeholder="상품에 대한 자세한 설명을 입력하세요"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="image">
                      이미지
                    </label>
                    <div className="image-upload-section">
                      <button
                        type="button"
                        className="upload-button"
                        onClick={handleImageUpload}
                      >
                        이미지 업로드
                      </button>
                      <div className="image-url-input">
                        <input
                          type="text"
                          id="image"
                          name="image"
                          className="form-input"
                          placeholder="또는 이미지 URL을 직접 입력하세요"
                          value={formData.image}
                          onChange={handleImageUrlChange}
                          required
                        />
                        <div className="image-url-label">
                          Cloudinary를 통해 업로드하거나 이미지 URL을 직접 입력할 수 있습니다.
                        </div>
                      </div>
                      {imagePreview && (
                        <div>
                          <img src={imagePreview} alt="미리보기" className="image-preview" />
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview('');
                              setFormData((prev) => ({ ...prev, image: '' }));
                            }}
                            style={{
                              marginTop: '8px',
                              padding: '6px 12px',
                              background: '#fff',
                              color: '#d32f2f',
                              border: '1px solid #d32f2f',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '12px',
                            }}
                          >
                            이미지 제거
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 제출 버튼 */}
              <div className="submit-section">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => navigate('/admin/products')}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="submit-button"
                  disabled={loading}
                >
                  {loading ? '수정 중...' : '상품 수정'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductEditPage;

