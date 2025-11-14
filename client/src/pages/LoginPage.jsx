import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const styles = `
.login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background-color: #fff;
}

.login-container {
  width: 100%;
  max-width: 500px;
}

.brand-logo {
  font-size: 1.5rem;
  font-weight: 400;
  letter-spacing: 3px;
  margin-bottom: 2rem;
  text-align: left;
  font-family: serif;
}

.login-title {
  font-size: 1.5rem;
  font-weight: 400;
  text-align: left;
  margin-bottom: 2rem;
  letter-spacing: 1px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 400;
  color: #000;
  text-align: left;
}

.input-line {
  height: 1px;
  background-color: #000;
  width: 100%;
  margin-bottom: 0.5rem;
}

.form-group input {
  border: none;
  border-bottom: 1px solid #000;
  padding: 8px 0;
  font-size: 1rem;
  background: transparent;
  font-family: inherit;
  outline: none;
}

.form-group input::placeholder {
  color: #999;
  font-size: 0.9rem;
}

.form-group input:focus {
  border-bottom-color: #333;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
}

.remember-me input[type='checkbox'] {
  cursor: pointer;
  width: 18px;
  height: 18px;
}

.forgot-password {
  font-size: 0.9rem;
  color: #000;
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
}

.error-message {
  color: #d32f2f;
  font-size: 0.9rem;
  padding: 0.75rem;
  background-color: #ffebee;
  border: 1px solid #d32f2f;
  text-align: left;
}

.login-button {
  margin-top: 1rem;
  padding: 14px;
  font-size: 1rem;
  border: none;
  background: #000;
  color: #fff;
  cursor: pointer;
  transition: background 0.3s;
  font-weight: 400;
  width: 100%;
}

.login-button:hover:not(:disabled) {
  background: #333;
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.register-button {
  margin-top: 0.5rem;
  padding: 14px;
  font-size: 1rem;
  border: 1px solid #000;
  background: transparent;
  color: #000;
  cursor: pointer;
  transition: background 0.3s, color 0.3s;
  font-weight: 400;
  width: 100%;
}

.register-button:hover {
  background: #000;
  color: #fff;
}

.social-login-section {
  margin-top: 2rem;
  text-align: left;
}

.social-title {
  font-size: 0.9rem;
  color: #000;
  margin-bottom: 0.5rem;
}

.social-consent {
  font-size: 0.85rem;
  color: #000;
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.privacy-link {
  color: #000;
  text-decoration: underline;
}

.social-divider {
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  text-align: center;
}

.social-divider::before,
.social-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #ccc;
}

.social-divider span {
  padding: 0 1rem;
  font-size: 0.9rem;
  color: #999;
}

.social-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.social-button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 12px;
  font-size: 0.9rem;
  border: 1px solid #000;
  background: transparent;
  color: #000;
  cursor: pointer;
  transition: background 0.3s, color 0.3s;
  font-weight: 400;
  width: 100%;
  text-align: left;
}

.social-button:hover {
  background: #f5f5f5;
}

.social-icon {
  font-size: 1.2rem;
  font-weight: bold;
  min-width: 24px;
  text-align: center;
}

.signup-link {
  margin-top: 2rem;
  text-align: left;
  font-size: 0.9rem;
  color: #000;
}

.signup-link a {
  color: #000;
  text-decoration: underline;
  font-weight: 500;
}

.help-link {
  display: block;
  margin-top: 2rem;
  text-align: left;
  font-size: 0.9rem;
  color: #000;
  text-decoration: none;
}

.help-link:hover {
  text-decoration: underline;
}
`;

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 토큰이 있으면 메인 페이지로 리다이렉트
  useEffect(() => {
    const checkTokenAndRedirect = async () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (token) {
        try {
          // 토큰이 유효한지 확인
          const response = await api.get('/users/me');
          if (response.data.user) {
            // 유효한 토큰이면 메인 페이지로 리다이렉트
            navigate('/');
          }
        } catch (error) {
          // 토큰이 유효하지 않으면 제거하고 로그인 페이지에 머물기
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');
        }
      }
    };

    checkTokenAndRedirect();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/users/login', {
        email: formData.email.trim(),
        password: formData.password,
      });
      
      // 응답 데이터 확인
      if (response.data.token && response.data.user) {
        // 토큰 저장
        if (rememberMe) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        } else {
          sessionStorage.setItem('token', response.data.token);
          sessionStorage.setItem('user', JSON.stringify(response.data.user));
        }

        // 홈으로 이동
        navigate('/');
      } else {
        setError('로그인 응답 형식이 올바르지 않습니다.');
      }
    } catch (err) {
      // 에러 처리 개선
      if (err.response) {
        // 서버에서 응답이 온 경우
        setError(
          err.response.data?.message ||
            '로그인에 실패했습니다. 다시 시도해주세요.'
        );
      } else if (err.request) {
        // 요청은 보냈지만 응답을 받지 못한 경우
        setError('서버에 연결할 수 없습니다. 네트워크를 확인해주세요.');
      } else {
        // 요청 설정 중 오류가 발생한 경우
        setError('로그인 요청 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="login-page">
      <div className="login-container">
        <h1 className="brand-logo">SHOPPING MALL</h1>
        
        <h2 className="login-title">로그인</h2>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <div className="input-line"></div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <div className="input-line"></div>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>로그인 상태 유지</span>
            </label>
            <Link to="/forgot-password" className="forgot-password">
              비밀번호를 잊으셨나요?
            </Link>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </button>

          <button
            type="button"
            className="register-button"
            onClick={() => navigate('/register')}
          >
            등록
          </button>
        </form>

        <div className="social-login-section">
          <p className="social-title">다음을 통해 액세스:</p>
          <p className="social-consent">
            소셜 계정을 통해 로그인함으로써 다음과 같이 내 계정을 연결하는 데 동의합니다.{' '}
            <Link to="/privacy" className="privacy-link">
              개인정보 보호 정책
            </Link>
          </p>

          <div className="social-divider">
            <span>또는</span>
          </div>

          <div className="social-buttons">
            <button type="button" className="social-button google">
              <span className="social-icon">G</span>
              <span>Google로 로그인</span>
            </button>
            <button type="button" className="social-button kakao">
              <span className="social-icon">K</span>
              <span>Kakao로 로그인</span>
            </button>
          </div>
        </div>

        <div className="signup-link">
          <span>아직 계정이 없으신가요? </span>
          <Link to="/register">회원가입</Link>
        </div>

        <Link to="/help" className="help-link">
          도움말
        </Link>
      </div>
    </div>
    </>
  );
}

export default LoginPage;

