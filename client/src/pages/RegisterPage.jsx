import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const styles = `
.register-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background-color: #fff;
}

.register-container {
  width: 100%;
  max-width: 500px;
}

.register-title {
  font-size: 1.5rem;
  font-weight: 400;
  text-align: center;
  margin-bottom: 2rem;
  letter-spacing: 1px;
}

.register-subtitle {
  font-size: 0.9rem;
  color: #999;
  text-align: center;
  margin-top: -1.5rem;
  margin-bottom: 2rem;
  font-weight: 300;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 400;
  color: #000;
}

.form-group input,
.form-group select {
  padding: 12px;
  border: 1px solid #000;
  font-size: 1rem;
  background: #fff;
  font-family: inherit;
}

.form-group input::placeholder {
  color: #999;
  font-size: 0.9rem;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #333;
}

.user-type-select {
  cursor: pointer;
}

.agreements {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.agreement-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
  font-size: 0.9rem;
}

.agreement-item.required span {
  font-weight: 500;
}

.agreement-item input[type='checkbox'] {
  margin-top: 2px;
  cursor: pointer;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.agreement-item span {
  flex: 1;
  line-height: 1.5;
}

.error-message {
  color: #d32f2f;
  font-size: 0.9rem;
  padding: 0.75rem;
  background-color: #ffebee;
  border: 1px solid #d32f2f;
}

.success-message {
  color: #2e7d32;
  font-size: 0.9rem;
  padding: 0.75rem;
  background-color: #e8f5e9;
  border: 1px solid #2e7d32;
}

.create-account-button {
  margin-top: 1rem;
  padding: 14px;
  font-size: 1rem;
  border: 1px solid #ccc;
  background: #f5f5f5;
  color: #000;
  cursor: pointer;
  transition: background 0.3s, border-color 0.3s;
  font-weight: 400;
}

.create-account-button:hover:not(:disabled) {
  background: #e8e8e8;
  border-color: #999;
}

.create-account-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.back-button {
  margin-top: 1.5rem;
  padding: 10px 20px;
  font-size: 0.9rem;
  border: 1px solid #ccc;
  background: transparent;
  cursor: pointer;
  transition: border-color 0.3s;
  width: 100%;
}

.back-button:hover {
  border-color: #000;
}
`;

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    passwordConfirm: '',
    userType: 'customer',
    address: '',
  });

  const [agreements, setAgreements] = useState({
    all: false,
    age14: false,
    required: false,
    optional: false,
    marketing: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAgreementChange = (name) => {
    if (name === 'all') {
      const newValue = !agreements.all;
      setAgreements({
        all: newValue,
        age14: newValue,
        required: newValue,
        optional: newValue,
        marketing: newValue,
      });
    } else {
      setAgreements((prev) => {
        const updated = {
          ...prev,
          [name]: !prev[name],
        };
        // 모든 체크박스가 선택되면 "모든 항목에 동의"도 자동 체크
        updated.all =
          updated.age14 &&
          updated.required &&
          updated.optional &&
          updated.marketing;
        return updated;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // 필수 약관 동의 체크
    if (!agreements.age14 || !agreements.required) {
      setError('필수 약관에 동의해주세요.');
      return;
    }

    // 필수 필드 검증
    if (!formData.email || !formData.name || !formData.password || !formData.passwordConfirm) {
      setError('필수 필드를 모두 입력해주세요.');
      return;
    }

    // 비밀번호 확인 검증
    if (formData.password !== formData.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        email: formData.email,
        name: formData.name,
        password: formData.password,
        userType: formData.userType,
        ...(formData.address && { address: formData.address }),
      };

      const response = await api.post('/users', payload);
      setSuccess(response.data.message || '회원가입이 완료되었습니다.');
      
      // 2초 후 홈으로 이동
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          '회원가입에 실패했습니다. 다시 시도해주세요.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="register-page">
      <div className="register-container">
        <h1 className="register-title">회원가입</h1>
        <p className="register-subtitle">새로운 쇼핑의 세계로의 시작</p>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="name">이름</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="실명을 입력해주세요"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="예: example@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="8자 이상의 영문, 숫자, 특수문자 조합"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="passwordConfirm">비밀번호 확인</label>
            <input
              type="password"
              id="passwordConfirm"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              placeholder="비밀번호를 다시 입력해주세요"
              required
            />
          </div>

          <div className="agreements">
            <label className="agreement-item">
              <input
                type="checkbox"
                checked={agreements.all}
                onChange={() => handleAgreementChange('all')}
              />
              <span>모든 항목에 동의</span>
            </label>

            <label className="agreement-item required">
              <input
                type="checkbox"
                checked={agreements.age14}
                onChange={() => handleAgreementChange('age14')}
              />
              <span>*만 14세 이상입니다</span>
            </label>

            <label className="agreement-item required">
              <input
                type="checkbox"
                checked={agreements.required}
                onChange={() => handleAgreementChange('required')}
              />
              <span>
                *필수적 개인정보의 수집 및 이용에 대한 동의
              </span>
            </label>

            <label className="agreement-item">
              <input
                type="checkbox"
                checked={agreements.optional}
                onChange={() => handleAgreementChange('optional')}
              />
              <span>선택적 개인정보의 수집 및 이용에 대한 동의</span>
            </label>

            <label className="agreement-item">
              <input
                type="checkbox"
                checked={agreements.marketing}
                onChange={() => handleAgreementChange('marketing')}
              />
              <span>광고성 정보 수신에 대한 동의</span>
            </label>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button
            type="submit"
            className="create-account-button"
            disabled={loading}
          >
            {loading ? '처리 중...' : '회원가입'}
          </button>
        </form>

        <button
          className="back-button"
          onClick={() => navigate('/')}
        >
          돌아가기
        </button>
      </div>
    </div>
    </>
  );
}

export default RegisterPage;

