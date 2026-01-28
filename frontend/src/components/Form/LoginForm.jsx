import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../assets/styles/FormAuth.scss';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!email || !password) {
        throw new Error('Vui lòng nhập email và mật khẩu');
      }

      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* LEFT SIDE - BRANDING */}
        <div className="auth-left">
          <div className="auth-brand">
            <div className="brand-icon">✈️</div>
            <h2>Du Lịch Việt</h2>
            <p>Khám phá những điều kỳ diệu của đất nước Việt Nam</p>
            <div className="brand-features">
              <div className="feature">
                <span className="feature-icon">🌟</span>
                <span>Giá tốt nhất</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🔒</span>
                <span>Thanh toán an toàn</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🎧</span>
                <span>Hỗ trợ 24/7</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - FORM */}
        <div className="auth-right">
          <form onSubmit={handleSubmit}>
            <h2 className="form-title">🔐 Đăng Nhập</h2>
            <p className="form-subtitle">Đăng nhập để bắt đầu cuộc phiêu lưu</p>

            {error && (
              <div className="alert alert-error">
                <span>❌</span>
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">
                <span className="label-icon">📧</span>
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <span className="label-icon">🔑</span>
                Mật khẩu
              </label>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <button type="submit" className="form-button" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner">⏳</span>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <span>✨</span>
                  Đăng Nhập
                </>
              )}
            </button>

            <div className="form-footer">
              <p>
                Bạn chưa có tài khoản?
                <Link to="/register"> Đăng ký ngay</Link>
              </p>
            </div>

            <div className="test-credentials">
              <div className="test-label">🧪 Tài khoản test:</div>
              <div className="test-item">
                <span className="label">Email:</span>
                <span className="value">admin@tourbooking.com</span>
              </div>
              <div className="test-item">
                <span className="label">Pass:</span>
                <span className="value">Admin@123456</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
