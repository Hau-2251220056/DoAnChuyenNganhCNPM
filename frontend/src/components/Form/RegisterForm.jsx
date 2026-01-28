import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../assets/styles/FormAuth.scss';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    hoTen: '',
    email: '',
    soDienThoai: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const { register } = useAuth();
  const navigate = useNavigate();

  // Check password strength
  const checkPasswordStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^a-zA-Z0-9]/.test(pass)) strength++;
    setPasswordStrength(strength);
    return strength;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const getPasswordStrengthLabel = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return 'Yếu';
      case 2:
        return 'Trung bình';
      case 3:
      case 4:
        return 'Mạnh';
      default:
        return '';
    }
  };

  const getPasswordStrengthClass = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return 'weak';
      case 2:
        return 'medium';
      case 3:
      case 4:
        return 'strong';
      default:
        return '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      // Validation
      if (!formData.hoTen.trim()) {
        throw new Error('Vui lòng nhập họ và tên');
      }

      if (!formData.email) {
        throw new Error('Vui lòng nhập email');
      }

      if (!formData.soDienThoai) {
        throw new Error('Vui lòng nhập số điện thoại');
      }

      if (!/^[0-9]{10}$/.test(formData.soDienThoai)) {
        throw new Error('Số điện thoại phải có 10 chữ số');
      }

      if (!formData.password) {
        throw new Error('Vui lòng nhập mật khẩu');
      }

      if (formData.password.length < 8) {
        throw new Error('Mật khẩu phải có ít nhất 8 ký tự');
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error('Mật khẩu không khớp');
      }

      // Call register API
      await register(formData.hoTen, formData.email, formData.soDienThoai, formData.password);
      
      setSuccess('✅ Đăng ký thành công! Đang chuyển hướng...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Đăng ký thất bại');
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
            <div className="brand-icon">🌍</div>
            <h2>Du Lịch Việt</h2>
            <p>Gia nhập cộng đồng hàng ngàn du khách yêu thích du lịch</p>
            <div className="brand-features">
              <div className="feature">
                <span className="feature-icon">💳</span>
                <span>Thanh toán linh hoạt</span>
              </div>
              <div className="feature">
                <span className="feature-icon">⭐</span>
                <span>Ưu đãi độc quyền</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🎁</span>
                <span>Điểm thưởng tích lũy</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - FORM */}
        <div className="auth-right">
          <form onSubmit={handleSubmit}>
            <h2 className="form-title">🚀 Đăng Ký</h2>
            <p className="form-subtitle">Tạo tài khoản để bắt đầu</p>

            {error && (
              <div className="alert alert-error">
                <span>❌</span>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="alert alert-success">
                <span>✅</span>
                <span>{success}</span>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="hoTen">
                <span className="label-icon">👤</span>
                Họ và Tên
              </label>
              <input
                type="text"
                id="hoTen"
                name="hoTen"
                placeholder="Nhập họ và tên"
                value={formData.hoTen}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                <span className="label-icon">📧</span>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="soDienThoai">
                <span className="label-icon">📱</span>
                Số Điện Thoại
              </label>
              <input
                type="tel"
                id="soDienThoai"
                name="soDienThoai"
                placeholder="0123456789"
                value={formData.soDienThoai}
                onChange={handleChange}
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
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
              {formData.password && (
                <>
                  <div className="password-strength">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`strength-bar ${i < passwordStrength ? getPasswordStrengthClass() : ''}`}
                      />
                    ))}
                  </div>
                  <div className={`password-strength-text ${getPasswordStrengthClass()}`}>
                    Độ mạnh: {getPasswordStrengthLabel()}
                  </div>
                </>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                <span className="label-icon">✓</span>
                Xác Nhận Mật Khẩu
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
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
                  Đăng Ký
                </>
              )}
            </button>

            <div className="form-footer">
              <p>
                Bạn đã có tài khoản?
                <Link to="/login"> Đăng nhập ngay</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
