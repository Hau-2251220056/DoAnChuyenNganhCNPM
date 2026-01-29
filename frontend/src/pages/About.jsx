import { Link } from 'react-router-dom';
import '../assets/styles/About.scss';

const About = () => {
  return (
    <>
      {/* ============ 1. HERO SECTION ============ */}
      <section className="about-hero">
        <div className="hero-content">
          <h1 className="hero-title">Du Lịch Việt</h1>
          <p className="hero-slogan">Chuyến du lịch trọn vẹn, an toàn và đáng nhớ</p>
          <div className="hero-image">
            <img 
              src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=500&fit=crop" 
              alt="Du lịch Việt Nam" 
            />
          </div>
          <p className="hero-description">
            Chúng tôi mang đến những hành trình trọn vẹn, an toàn và đáng nhớ trên khắp Việt Nam.
          </p>
        </div>
      </section>

      {/* ============ 2. WHO ARE WE SECTION ============ */}
      <section className="about-who-are-we">
        <div className="about-container">
          <div className="section-header">
            <h2>🏢 Chúng Tôi Là Ai?</h2>
            <div className="header-divider"></div>
          </div>

          <div className="who-are-we-content">
            <div className="who-are-we-text">
              <p>
                <strong>Tourly</strong> là nền tảng đặt tour du lịch trực tuyến giúp khách hàng dễ dàng lựa chọn, 
                đặt chỗ và thanh toán cho các chuyến du lịch trên khắp Việt Nam với lịch trình cố định và minh bạch.
              </p>
              <p>
                Chúng tôi chuyên cung cấp tour nội địa chất lượng cao, với mục tiêu mang lại trải nghiệm 
                du lịch tuyệt vời cho mọi khách hàng.
              </p>
              <p className="highlight">
                ✓ Đặt tour nhanh – Thanh toán an toàn – Hỗ trợ 24/7
              </p>
            </div>
            <div className="who-are-we-image">
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=400&fit=crop" 
                alt="Về chúng tôi" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============ 3. MISSION & VISION SECTION ============ */}
      <section className="about-mission-vision">
        <div className="about-container">
          <div className="section-header">
            <h2>🎯 Sứ Mệnh & Tầm Nhìn</h2>
            <div className="header-divider"></div>
          </div>

          <div className="mission-vision-grid">
            {/* MISSION */}
            <div className="mission-card">
              <div className="card-icon">🎯</div>
              <h3>Sứ Mệnh</h3>
              <div className="card-list">
                <div className="list-item">
                  <span className="bullet">✓</span>
                  <p>Mang đến trải nghiệm du lịch tiện lợi</p>
                </div>
                <div className="list-item">
                  <span className="bullet">✓</span>
                  <p>Minh bạch giá cả – lịch trình rõ ràng</p>
                </div>
                <div className="list-item">
                  <span className="bullet">✓</span>
                  <p>Đặt tour nhanh chóng, an toàn</p>
                </div>
              </div>
            </div>

            {/* VISION */}
            <div className="vision-card">
              <div className="card-icon">🌟</div>
              <h3>Tầm Nhìn</h3>
              <div className="card-list">
                <div className="list-item">
                  <span className="bullet">✓</span>
                  <p>Trở thành nền tảng đặt tour nội địa hàng đầu Việt Nam</p>
                </div>
                <div className="list-item">
                  <span className="bullet">✓</span>
                  <p>Ứng dụng công nghệ vào quản lý & thanh toán du lịch</p>
                </div>
                <div className="list-item">
                  <span className="bullet">✓</span>
                  <p>Phục vụ hàng triệu khách du lịch mỗi năm</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 4. CORE VALUES SECTION ============ */}
      <section className="about-core-values">
        <div className="about-container">
          <div className="section-header">
            <h2>⭐ Giá Trị Cốt Lõi</h2>
            <div className="header-divider"></div>
          </div>

          <div className="values-grid">
            {/* Value 1 */}
            <div className="value-card">
              <div className="value-icon">🛡</div>
              <h4>Uy Tín & An Toàn</h4>
              <p>
                Tất cả giao dịch được bảo mật, thông tin khách hàng được bảo vệ tuyệt đối. 
                Chúng tôi tuân thủ các tiêu chuẩn quốc tế về bảo mật dữ liệu.
              </p>
            </div>

            {/* Value 2 */}
            <div className="value-card">
              <div className="value-icon">💰</div>
              <h4>Giá Cả Minh Bạch</h4>
              <p>
                Không có phí ẩn, không có chi phí bất ngờ. Giá bạn thấy là giá bạn trả, 
                rõ ràng và công bằng cho mọi khách hàng.
              </p>
            </div>

            {/* Value 3 */}
            <div className="value-card">
              <div className="value-icon">🕒</div>
              <h4>Lịch Trình Cố Định</h4>
              <p>
                Mỗi tour có lịch trình chi tiết, ngày khởi hành rõ ràng, bạn có thể lên kế hoạch 
                du lịch một cách dễ dàng và chắc chắn.
              </p>
            </div>

            {/* Value 4 */}
            <div className="value-card">
              <div className="value-icon">💳</div>
              <h4>Thanh Toán Tiện Lợi</h4>
              <p>
                Hỗ trợ nhiều phương thức thanh toán an toàn bao gồm PayPal, 
                giúp bạn yên tâm khi đặt tour online.
              </p>
            </div>

            {/* Value 5 */}
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h4>Hỗ Trợ Nhanh Chóng</h4>
              <p>
                Đội ngũ hỗ trợ khách hàng 24/7, sẵn sàng giải đáp mọi thắc mắc 
                và xử lý vấn đề một cách nhanh chóng và chuyên nghiệp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 5. WHY CHOOSE US SECTION ============ */}
      <section className="about-why-choose">
        <div className="about-container">
          <div className="section-header">
            <h2>🧩 Tại Sao Chọn Chúng Tôi?</h2>
            <div className="header-divider"></div>
          </div>

          <div className="why-choose-list">
            <div className="why-choose-item">
              <div className="item-number">01</div>
              <div className="item-content">
                <h4>Đặt Tour Online Nhanh Chóng</h4>
                <p>
                  Giao diện thân thiện, dễ sử dụng. Chỉ cần vài click là bạn đã hoàn tất đặt tour, 
                  tiết kiệm thời gian so với các cách truyền thống.
                </p>
              </div>
            </div>

            <div className="why-choose-item">
              <div className="item-number">02</div>
              <div className="item-content">
                <h4>Thanh Toán PayPal An Toàn</h4>
                <p>
                  Tích hợp PayPal - phương thức thanh toán quốc tế, được tin tưởng bởi hàng 
                  triệu người dùng trên thế giới. Giao dịch được mã hóa và bảo vệ.
                </p>
              </div>
            </div>

            <div className="why-choose-item">
              <div className="item-number">03</div>
              <div className="item-content">
                <h4>Xem Lịch Sử Đặt Tour & Thanh Toán</h4>
                <p>
                  Tài khoản cá nhân lưu trữ toàn bộ lịch sử booking, thanh toán, giúp bạn 
                  quản lý các chuyến đi một cách dễ dàng.
                </p>
              </div>
            </div>

            <div className="why-choose-item">
              <div className="item-number">04</div>
              <div className="item-content">
                <h4>Tour Có Lịch Trình & Ngày Cố Định</h4>
                <p>
                  Mỗi tour được thiết kế kỹ lưỡng với lịch trình chi tiết từ A-Z, 
                  ngày khởi hành rõ ràng, không bị thay đổi bất ngờ.
                </p>
              </div>
            </div>

            <div className="why-choose-item">
              <div className="item-number">05</div>
              <div className="item-content">
                <h4>Quản Lý Booking Minh Bạch</h4>
                <p>
                  Toàn bộ quá trình từ đặt tour đến khởi hành đều được cập nhật minh bạch, 
                  bạn luôn biết rõ tình trạng booking của mình.
                </p>
              </div>
            </div>
          </div>

          <div className="about-cta">
            <Link to="/tours" className="btn-cta">
              Khám Phá Tours Ngay →
            </Link>
          </div>
        </div>
      </section>

      {/* ============ CONTACT SECTION ============ */}
      {/* <section className="about-contact">
        <div className="about-container">
          <h2>📞 Liên Hệ Với Chúng Tôi</h2>
          <div className="contact-info">
            <div className="contact-item">
              <div className="contact-icon">📧</div>
              <p>Email: <a href="mailto:info@tourly.vn">info@tourly.vn</a></p>
            </div>
            <div className="contact-item">
              <div className="contact-icon">📱</div>
              <p>Hotline: <a href="tel:+84123456789">+84 (0) 123 456 789</a></p>
            </div>
            <div className="contact-item">
              <div className="contact-icon">📍</div>
              <p>Địa chỉ: 123 Phố Cổ, Quận Hoàn Kiếm, Hà Nội, Việt Nam</p>
            </div>
          </div>
        </div>
      </section> */}
    </>
  );
};

export default About;
