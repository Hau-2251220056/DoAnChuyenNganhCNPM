import banner from '../assets/images/banner.jpg';
import '../assets/styles/base.scss';
import '../assets/styles/Home.scss';
import TourList from '../components/TourList';

const Home = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      text: 'Trải nghiệm tuyệt vời! Du lịch Sapa với tour của công ty thật là không thể quên. Hướng dẫn viên tuyệt vời!',
      rating: 5,
      avatar: '👨‍💼',
    },
    {
      id: 2,
      name: 'Trần Thị B',
      text: 'Giá rất hợp lý, tour Hạ Long tuyệt đẹp. Tôi sẽ giới thiệu cho bạn bè!',
      rating: 5,
      avatar: '👩‍🦰',
    },
    {
      id: 3,
      name: 'Lê Văn C',
      text: 'Phục vụ chuyên nghiệp, an toàn, thoải mái. Rất hài lòng với du lịch Hội An!',
      rating: 4,
      avatar: '👨‍💻',
    },
  ];

  return (
    <>
      {/* ============ BANNER SECTION ============ */}
      <div className="home-banner-section">
        <img src={banner} alt="Banner" />
        <div className="banner-overlay">
          <h1>✈️ KHÁM PHÁ VIỆT NAM CỦA BẠN</h1>
          <p>Những chuyến du lịch tuyệt vời, những kỷ niệm không bao giờ quên</p>
          <div className="banner-buttons">
            <button>Khám Phá Tours</button>
            <button>Liên Hệ</button>
          </div>
        </div>
      </div>

      {/* ============ WHY CHOOSE SECTION ============ */}
      <div className="why-choose-section">
        <h2>🌟 Tại Sao Chọn Chúng Tôi?</h2>
        <div className="why-choose-grid">
          <div className="why-choose-card">
            <div className="icon">💰</div>
            <h3>Giá Cả Minh Bạch</h3>
            <p>Không có chi phí ẩn, tất cả giá được hiển thị rõ ràng từ đầu</p>
          </div>

          <div className="why-choose-card">
            <div className="icon">🗺️</div>
            <h3>Điểm Đến Hấp Dẫn</h3>
            <p>Những destination độc đáo, những trải nghiệm không thể quên</p>
          </div>

          <div className="why-choose-card">
            <div className="icon">🔒</div>
            <h3>Thanh Toán An Toàn</h3>
            <p>Hệ thống bảo mật cao, bảo vệ thông tin cá nhân của bạn</p>
          </div>

          <div className="why-choose-card">
            <div className="icon">🎧</div>
            <h3>Hỗ Trợ 24/7</h3>
            <p>Đội ngũ chuyên nghiệp luôn sẵn sàng hỗ trợ bạn bất kỳ lúc nào</p>
          </div>

          <div className="why-choose-card">
            <div className="icon">⭐</div>
            <h3>Đánh Giá Cao</h3>
            <p>Hàng ngàn khách hàng hài lòng và tin tưởng chúng tôi</p>
          </div>

          <div className="why-choose-card">
            <div className="icon">🚀</div>
            <h3>Trải Nghiệm Tuyệt Vời</h3>
            <p>Mỗi tour đều được thiết kế để mang lại kỷ niệm đẹp nhất</p>
          </div>
        </div>
      </div>

      {/* ============ FEATURED TOURS SECTION ============ */}
      <div className="featured-tours-section">
        <h2>🎯 Tours Nổi Bật</h2>
        <div className="featured-tours-container">
          <TourList />
        </div>
      </div>

      {/* ============ TESTIMONIALS SECTION ============ */}
      <div className="testimonials-section">
        <h2>💬 Đánh Giá Từ Khách Hàng</h2>
        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-header">
                <div className="avatar">{testimonial.avatar}</div>
                <div className="testimonial-info">
                  <h4>{testimonial.name}</h4>
                  <div className="stars">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i}>⭐</span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="testimonial-text">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </div>

      {/* ============ NEWSLETTER SECTION ============ */}
      <div className="newsletter-section">
        <div className="newsletter-container">
          <h2>📬 Nhận Thông Tin Tours Mới</h2>
          <p>Đăng ký email để nhận được các tour hot deals và ưu đãi đặc biệt</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Nhập email của bạn..." />
            <button>Đăng Ký</button>
          </div>
        </div>
      </div>

      {/* ============ CTA SECTION ============ */}
      <div className="cta-section">
        <div className="cta-container">
          <h2>🚀 Sẵn Sàng Bắt Đầu Cuộc Phiêu Lưu?</h2>
          <button>Khám Phá Tours Ngay →</button>
        </div>
      </div>
    </>
  );
};

export default Home;