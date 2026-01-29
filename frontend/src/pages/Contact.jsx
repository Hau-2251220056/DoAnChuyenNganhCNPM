import { useState } from 'react';
import '../assets/styles/Contact.scss';

const Contact = () => {
  const [formData, setFormData] = useState({
    ho_ten: '',
    email: '',
    so_dien_thoai: '',
    tieu_de: '',
    noi_dung: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Họ tên
    if (!formData.ho_ten.trim()) {
      newErrors.ho_ten = 'Vui lòng nhập họ và tên';
    } else if (formData.ho_ten.trim().length < 3) {
      newErrors.ho_ten = 'Họ tên phải có ít nhất 3 ký tự';
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    // Số điện thoại (optional but validate if provided)
    if (formData.so_dien_thoai && !/^[0-9]{10,11}$/.test(formData.so_dien_thoai)) {
      newErrors.so_dien_thoai = 'Số điện thoại phải có 10-11 chữ số';
    }

    // Tiêu đề
    if (!formData.tieu_de.trim()) {
      newErrors.tieu_de = 'Vui lòng nhập tiêu đề';
    }

    // Nội dung
    if (!formData.noi_dung.trim()) {
      newErrors.noi_dung = 'Vui lòng nhập nội dung liên hệ';
    } else if (formData.noi_dung.trim().length < 10) {
      newErrors.noi_dung = 'Nội dung phải có ít nhất 10 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call (replace with actual API later)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Contact Form Data:', formData);
      
      // Show success message
      setSubmitSuccess(true);
      
      // Reset form
      setFormData({
        ho_ten: '',
        email: '',
        so_dien_thoai: '',
        tieu_de: '',
        noi_dung: '',
      });

      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);

    } catch (error) {
      console.error('Error submitting contact form:', error);
      setErrors({ submit: 'Có lỗi xảy ra, vui lòng thử lại sau' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      {/* ============ HERO SECTION ============ */}
      <section className="contact-hero">
        <div className="hero-content">
          <h1>📞 Liên Hệ Với Chúng Tôi</h1>
          <p>Chúng tôi luôn sẵn sàng hỗ trợ và giải đáp mọi thắc mắc của bạn</p>
        </div>
      </section>

      {/* ============ QUICK SUPPORT CARDS ============ */}
      <section className="support-cards-section">
        <div className="container">
          <div className="support-cards-grid">
            <div className="support-card">
              <div className="card-icon">🎫</div>
              <h3>Hỗ Trợ Đặt Tour</h3>
              <p>Tư vấn và hỗ trợ chọn tour phù hợp với nhu cầu của bạn</p>
            </div>

            <div className="support-card">
              <div className="card-icon">💳</div>
              <h3>Hỗ Trợ Thanh Toán</h3>
              <p>Giải đáp thắc mắc về thanh toán, hoàn tiền và bảo mật</p>
            </div>

            <div className="support-card">
              <div className="card-icon">🔄</div>
              <h3>Hoàn/Hủy Tour</h3>
              <p>Hỗ trợ chính sách hoàn hủy và thủ tục hoàn tiền</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ MAIN CONTACT SECTION ============ */}
      <section className="main-contact-section">
        <div className="container">
          <div className="contact-grid">
            {/* LEFT - CONTACT FORM */}
            <div className="contact-form-wrapper">
              <h2>Gửi Liên Hệ Cho Chúng Tôi</h2>
              <p className="form-description">
                Điền thông tin vào form bên dưới, chúng tôi sẽ phản hồi trong vòng 24 giờ
              </p>

              {/* Success Message */}
              {submitSuccess && (
                <div className="alert alert-success">
                  ✓ Gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm nhất.
                </div>
              )}

              {/* Error Message */}
              {errors.submit && (
                <div className="alert alert-error">
                  ✕ {errors.submit}
                </div>
              )}

              <form onSubmit={handleSubmit} className="contact-form">
                {/* Họ và tên */}
                <div className="form-group">
                  <label htmlFor="ho_ten">
                    Họ và tên <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="ho_ten"
                    name="ho_ten"
                    value={formData.ho_ten}
                    onChange={handleChange}
                    className={errors.ho_ten ? 'error' : ''}
                    placeholder="Nguyễn Văn A"
                  />
                  {errors.ho_ten && <span className="error-message">{errors.ho_ten}</span>}
                </div>

                {/* Email */}
                <div className="form-group">
                  <label htmlFor="email">
                    Email <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'error' : ''}
                    placeholder="example@gmail.com"
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                {/* Số điện thoại */}
                <div className="form-group">
                  <label htmlFor="so_dien_thoai">Số điện thoại</label>
                  <input
                    type="tel"
                    id="so_dien_thoai"
                    name="so_dien_thoai"
                    value={formData.so_dien_thoai}
                    onChange={handleChange}
                    className={errors.so_dien_thoai ? 'error' : ''}
                    placeholder="0912345678"
                  />
                  {errors.so_dien_thoai && <span className="error-message">{errors.so_dien_thoai}</span>}
                </div>

                {/* Tiêu đề */}
                <div className="form-group">
                  <label htmlFor="tieu_de">
                    Tiêu đề <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="tieu_de"
                    name="tieu_de"
                    value={formData.tieu_de}
                    onChange={handleChange}
                    className={errors.tieu_de ? 'error' : ''}
                    placeholder="VD: Hỏi về tour Sapa 3 ngày 2 đêm"
                  />
                  {errors.tieu_de && <span className="error-message">{errors.tieu_de}</span>}
                </div>

                {/* Nội dung */}
                <div className="form-group">
                  <label htmlFor="noi_dung">
                    Nội dung <span className="required">*</span>
                  </label>
                  <textarea
                    id="noi_dung"
                    name="noi_dung"
                    value={formData.noi_dung}
                    onChange={handleChange}
                    className={errors.noi_dung ? 'error' : ''}
                    placeholder="Nhập nội dung liên hệ của bạn..."
                    rows="6"
                  ></textarea>
                  {errors.noi_dung && <span className="error-message">{errors.noi_dung}</span>}
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  className="btn-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      📤 Gửi Liên Hệ
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* RIGHT - CONTACT INFO */}
            <div className="contact-info-wrapper">
              <h2>Thông Tin Liên Hệ</h2>
              
              <div className="info-cards">
                {/* Address */}
                <div className="info-card">
                  <div className="info-icon">📍</div>
                  <div className="info-content">
                    <h4>Địa Chỉ</h4>
                    <p>123 Phố Cổ, Quận Hoàn Kiếm,<br />Hà Nội, Việt Nam</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="info-card">
                  <div className="info-icon">📞</div>
                  <div className="info-content">
                    <h4>Hotline</h4>
                    <p>
                      <a href="tel:1900xxxx">1900 xxxx</a><br />
                      <a href="tel:+84123456789">+84 123 456 789</a>
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="info-card">
                  <div className="info-icon">✉️</div>
                  <div className="info-content">
                    <h4>Email</h4>
                    <p>
                      <a href="mailto:support@tourly.com">support@tourly.com</a><br />
                      <a href="mailto:info@tourly.vn">info@tourly.vn</a>
                    </p>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="info-card">
                  <div className="info-icon">🕒</div>
                  <div className="info-content">
                    <h4>Giờ Làm Việc</h4>
                    <p>
                      Thứ 2 - Chủ Nhật<br />
                      8:00 - 18:00
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="social-section">
                <h4>Kết Nối Với Chúng Tôi</h4>
                <div className="social-links">
                  <a href="#" className="social-btn facebook">
                    <span>f</span> Facebook
                  </a>
                  <a href="#" className="social-btn instagram">
                    <span>📷</span> Instagram
                  </a>
                  <a href="#" className="social-btn youtube">
                    <span>▶</span> YouTube
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ MAP SECTION ============ */}
      <section className="map-section">
        <div className="container">
          <h2>Vị Trí Của Chúng Tôi</h2>
          <div className="map-wrapper">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.096867396037!2d105.8529148!3d21.0285403!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab9bd9861ca1%3A0xe7887f7b72ca17a9!2zSMOgIE7hu5lpLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1234567890123!5m2!1svi!2s"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Tourly Location"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
