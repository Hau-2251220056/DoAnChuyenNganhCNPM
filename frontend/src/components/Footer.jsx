import { Link } from 'react-router-dom';
import '../assets/styles/Footer.scss';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      {/* ============ MAIN FOOTER CONTENT ============ */}
      <div className="footer-content">
        <div className="footer-container">
          {/* COLUMN 1 - COMPANY INFO */}
          <div className="footer-column">
            <div className="footer-brand">
              <div className="brand-icon">✈️</div>
              <h3>Du Lịch Việt</h3>
            </div>
            <p className="brand-description">
              Khám phá những điều kỳ diệu của đất nước Việt Nam với những chuyến du lịch tuyệt vời và những kỷ niệm không bao giờ quên.
            </p>
            <div className="social-links">
              <a href="#" className="social-icon" title="Facebook">f</a>
              <a href="#" className="social-icon" title="Instagram">📷</a>
              <a href="#" className="social-icon" title="Twitter">𝕏</a>
              <a href="#" className="social-icon" title="YouTube">▶</a>
            </div>
          </div>

          {/* COLUMN 2 - QUICK LINKS */}
          <div className="footer-column">
            <h4 className="footer-title">🔗 Liên Kết Nhanh</h4>
            <ul className="footer-links">
              <li><Link to="/">Trang Chủ</Link></li>
              <li><a href="#tours">Tours</a></li>
              <li><a href="#about">Về Chúng Tôi</a></li>
              <li><a href="#blog">Blog</a></li>
              <li><a href="#contact">Liên Hệ</a></li>
            </ul>
          </div>

          {/* COLUMN 3 - POPULAR TOURS */}
          <div className="footer-column">
            <h4 className="footer-title">🎯 Tours Phổ Biến</h4>
            <ul className="footer-links">
              <li><a href="#ha-long">Tour Hạ Long</a></li>
              <li><a href="#sapa">Tour Sa Pa</a></li>
              <li><a href="#hoi-an">Tour Hội An</a></li>
              <li><a href="#da-lat">Tour Đà Lạt</a></li>
              <li><a href="#ha-noi">Tour Hà Nội</a></li>
            </ul>
          </div>

          {/* COLUMN 4 - CONTACT INFO */}
          <div className="footer-column">
            <h4 className="footer-title">📞 Liên Hệ</h4>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <span>123 Đường Nguyễn Huệ, Quận 1, TP.HCM</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <a href="mailto:info@dulichviet.com">info@dulichviet.com</a>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📱</span>
                <a href="tel:0123456789">+84 123 456 789</a>
              </div>
              <div className="contact-item">
                <span className="contact-icon">⏰</span>
                <span>7 ngày/tuần, 8h00 - 22h00</span>
              </div>
            </div>
          </div>

          {/* COLUMN 5 - NEWSLETTER */}
          <div className="footer-column">
            <h4 className="footer-title">💌 Bản Tin</h4>
            <p className="newsletter-desc">Nhận các ưu đãi mới nhất</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email của bạn"
                className="newsletter-input"
              />
              <button type="submit" className="newsletter-btn">Đăng Ký</button>
            </form>
            <div className="payment-methods">
              <span className="payment-title">💳 Phương Thức Thanh Toán:</span>
              <div className="payment-icons">
                <span title="Visa">💳</span>
                <span title="Mastercard">💳</span>
                <span title="PayPal">🅿</span>
                <span title="Bank Transfer">🏦</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============ FOOTER DIVIDER ============ */}
      <div className="footer-divider"></div>

      {/* ============ BOTTOM FOOTER ============ */}
      <div className="footer-bottom">
        <div className="footer-container">
          <div className="footer-bottom-left">
            <p>&copy; {currentYear} <strong>Du Lịch Việt</strong>. Tất cả quyền được bảo lưu.</p>
          </div>
          <div className="footer-bottom-links">
            <a href="#privacy">Chính Sách Riêng Tư</a>
            <span className="divider">|</span>
            <a href="#terms">Điều Khoản Dịch Vụ</a>
            <span className="divider">|</span>
            <a href="#sitemap">Sơ Đồ Trang Web</a>
          </div>
          <div className="footer-bottom-right">
            <p>Thiết kế với ❤️ bởi <strong>Dev Team</strong></p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
