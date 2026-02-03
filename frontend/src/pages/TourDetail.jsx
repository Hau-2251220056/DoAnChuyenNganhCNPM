import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toursAPI, bookingsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../assets/styles/TourDetail.scss';

const TourDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [soNguoi, setSoNguoi] = useState(1);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    fetchTourDetail();
  }, [id]);

  const fetchTourDetail = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await toursAPI.getById(id);
      
      console.log('Tour Detail Response:', response);

      // Handle different response formats
      let tourData = null;
      if (response && response.data) {
        tourData = response.data;
      } else if (response && response.id) {
        tourData = response;
      }

      if (!tourData) {
        throw new Error('Không tìm thấy thông tin tour');
      }

      setTour(tourData);
    } catch (err) {
      console.error('Error fetching tour detail:', err);
      setError(err.message || 'Không thể tải thông tin tour');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (date) => {
    if (!date) return 'Chưa xác định';
    return new Date(date).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleBookTour = async () => {
    if (!isAuthenticated) {
      // Redirect to login with return URL
      navigate('/login', { state: { from: `/tours/${id}` } });
      return;
    }

    try {
      setIsBooking(true);
      
      // Create booking
      const bookingData = {
        tour_id: parseInt(id),
        so_luong_nguoi: soNguoi,
        ghi_chu: '',
      };

      console.log('Creating booking:', bookingData);
      const response = await bookingsAPI.create(bookingData);
      
      console.log('Booking created successfully:', response);

      // Navigate to my-bookings
      navigate('/my-bookings', { 
        state: { successMessage: `Đã đặt tour cho ${soNguoi} người thành công!` } 
      });

    } catch (err) {
      console.error('Error creating booking:', err);
      alert(`Lỗi: ${err.message || 'Không thể tạo booking'}`);
    } finally {
      setIsBooking(false);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= (tour?.so_cho_con_lai || 1)) {
      setSoNguoi(value);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="tour-detail-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải thông tin tour...</p>
      </div>
    );
  }

  // Error state
  if (error || !tour) {
    return (
      <div className="tour-detail-error">
        <div className="error-icon">😔</div>
        <h2>Không tìm thấy tour</h2>
        <p>{error || 'Tour này không tồn tại hoặc đã bị xóa'}</p>
        <button className="btn-back" onClick={() => navigate('/tours')}>
          ← Quay lại danh sách tours
        </button>
      </div>
    );
  }

  const isAvailable = tour.so_cho_con_lai > 0 && tour.trang_thai === 'active';
  const tongTien = tour.gia_tien * soNguoi;

  return (
    <div className="tour-detail-page">
      <div className="tour-detail-container max-width">
        {/* MAIN CONTENT - LEFT COLUMN */}
        <div className="tour-detail-main">
          {/* Breadcrumb */}
          <div className="breadcrumb">
            <span onClick={() => navigate('/')} className="breadcrumb-link">Trang chủ</span>
            <span className="separator">›</span>
            <span onClick={() => navigate('/tours')} className="breadcrumb-link">Tours</span>
            <span className="separator">›</span>
            <span className="breadcrumb-current">{tour.ten_tour}</span>
          </div>

          {/* Tour Title */}
          <h1 className="tour-title">{tour.ten_tour}</h1>

          {/* Tour Meta Info */}
          <div className="tour-meta">
            <div className="meta-item">
              <span className="meta-icon">📍</span>
              <span className="meta-text">{tour.dia_diem}</span>
            </div>
            <div className="meta-item">
              <span className="meta-icon">⏱️</span>
              <span className="meta-text">{tour.thoi_luong} ngày</span>
            </div>
            <div className="meta-item">
              <span className="meta-icon">📅</span>
              <span className="meta-text">{formatDate(tour.ngay_khoi_hanh)}</span>
            </div>
            <div className="meta-item">
              <span className="meta-icon">👥</span>
              <span className="meta-text">{tour.so_cho_con_lai} chỗ còn lại</span>
            </div>
          </div>

          {/* Tour Image */}
          <div className="tour-image-section">
            <img 
              src={tour.hinh_anh || 'https://via.placeholder.com/800x450?text=Tour+Image'} 
              alt={tour.ten_tour}
              className="tour-main-image"
            />
            {!isAvailable && (
              <div className="sold-out-badge">HẾT CHỖ</div>
            )}
          </div>

          {/* Tour Price Highlight */}
          <div className="tour-price-highlight">
            <div className="price-label">Giá Tour</div>
            <div className="price-value">{formatPrice(tour.gia_tien)}</div>
            <div className="price-note">/ người</div>
          </div>

          {/* Tour Description */}
          <div className="tour-section">
            <h2 className="section-title">📝 Mô Tả Tour</h2>
            <div className="section-content">
              <p>{tour.mo_ta || 'Chưa có mô tả chi tiết'}</p>
            </div>
          </div>

          {/* Tour Itinerary */}
          <div className="tour-section">
            <h2 className="section-title">🗓️ Lịch Trình Chi Tiết</h2>
            <div className="section-content">
              <div className="itinerary-list">
                {[...Array(tour.thoi_luong)].map((_, index) => (
                  <div key={index} className="itinerary-item">
                    <div className="itinerary-day">
                      <span className="day-number">Ngày {index + 1}</span>
                    </div>
                    <div className="itinerary-content">
                      <h4>Khám phá {tour.dia_diem}</h4>
                      <p>
                        {index === 0 && 'Đón khách tại điểm hẹn, khởi hành đi tour. Tham quan các địa điểm nổi tiếng, check-in khách sạn.'}
                        {index > 0 && index < tour.thoi_luong - 1 && 'Tiếp tục hành trình khám phá các điểm đến hấp dẫn, trải nghiệm văn hóa địa phương.'}
                        {index === tour.thoi_luong - 1 && 'Tham quan các điểm còn lại, mua sắm lưu niệm. Trả khách về điểm đón ban đầu, kết thúc tour.'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tour Highlights */}
          <div className="tour-section">
            <h2 className="section-title">⭐ Điểm Nổi Bật</h2>
            <div className="section-content">
              <ul className="highlights-list">
                <li>✓ Khởi hành đúng lịch trình đã công bố</li>
                <li>✓ Hướng dẫn viên chuyên nghiệp, nhiệt tình</li>
                <li>✓ Phương tiện di chuyển hiện đại, thoải mái</li>
                <li>✓ Bảo hiểm du lịch cho toàn bộ hành trình</li>
                <li>✓ Hỗ trợ khách hàng 24/7 trong suốt chuyến đi</li>
              </ul>
            </div>
          </div>

          {/* Tour Includes */}
          <div className="tour-section">
            <h2 className="section-title">✅ Giá Tour Bao Gồm</h2>
            <div className="section-content">
              <ul className="includes-list">
                <li>✓ Vé tham quan các điểm theo chương trình</li>
                <li>✓ Khách sạn {tour.thoi_luong - 1} đêm (phòng 2-3 người/phòng)</li>
                <li>✓ Ăn uống theo chương trình ({tour.thoi_luong * 3} bữa)</li>
                <li>✓ Xe du lịch đời mới, máy lạnh</li>
                <li>✓ Hướng dẫn viên suốt tuyến</li>
                <li>✓ Bảo hiểm du lịch mức cao nhất</li>
              </ul>
            </div>
          </div>

          {/* Tour Status Info */}
          <div className="tour-section">
            <h2 className="section-title">📊 Trạng Thái Tour</h2>
            <div className="section-content">
              <div className="status-grid">
                <div className="status-item">
                  <span className="status-label">Tổng số chỗ:</span>
                  <span className="status-value">{tour.so_cho_tong} người</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Số chỗ còn lại:</span>
                  <span className="status-value highlight">{tour.so_cho_con_lai} người</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Trạng thái:</span>
                  <span className={`status-badge ${isAvailable ? 'active' : 'inactive'}`}>
                    {isAvailable ? '✓ Còn chỗ' : '✕ Hết chỗ'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR - RIGHT COLUMN */}
        <div className="tour-detail-sidebar">
          <div className="booking-card">
            <div className="booking-header">
              <h3>Thông Tin Đặt Tour</h3>
            </div>

            <div className="booking-price">
              <div className="price-per-person">
                <span className="label">Giá / người:</span>
                <span className="value">{formatPrice(tour.gia_tien)}</span>
              </div>
            </div>

            <div className="booking-info">
              <div className="info-row">
                <span className="info-icon">📅</span>
                <div className="info-content">
                  <div className="info-label">Ngày khởi hành</div>
                  <div className="info-value">{formatDate(tour.ngay_khoi_hanh)}</div>
                </div>
              </div>

              <div className="info-row">
                <span className="info-icon">⏱️</span>
                <div className="info-content">
                  <div className="info-label">Thời lượng</div>
                  <div className="info-value">{tour.thoi_luong} ngày</div>
                </div>
              </div>

              <div className="info-row">
                <span className="info-icon">👥</span>
                <div className="info-content">
                  <div className="info-label">Số chỗ còn lại</div>
                  <div className="info-value">{tour.so_cho_con_lai} người</div>
                </div>
              </div>
            </div>

            <div className="booking-quantity">
              <label htmlFor="soNguoi">Số lượng người</label>
              <div className="quantity-control">
                <button 
                  className="btn-decrease"
                  onClick={() => setSoNguoi(prev => Math.max(1, prev - 1))}
                  disabled={soNguoi <= 1}
                >
                  −
                </button>
                <input
                  type="number"
                  id="soNguoi"
                  value={soNguoi}
                  onChange={handleQuantityChange}
                  min="1"
                  max={tour.so_cho_con_lai}
                  disabled={!isAvailable}
                />
                <button 
                  className="btn-increase"
                  onClick={() => setSoNguoi(prev => Math.min(tour.so_cho_con_lai, prev + 1))}
                  disabled={soNguoi >= tour.so_cho_con_lai}
                >
                  +
                </button>
              </div>
            </div>

            <div className="booking-total">
              <div className="total-label">Tổng tiền:</div>
              <div className="total-value">{formatPrice(tongTien)}</div>
            </div>

            <button 
              className={`btn-book ${!isAvailable ? 'disabled' : ''}`}
              onClick={handleBookTour}
              disabled={!isAvailable || isBooking}
            >
              {isBooking ? (
                <>
                  <span className="spinner"></span>
                  Đang xử lý...
                </>
              ) : (
                isAvailable ? '🎫 Đặt Tour Ngay' : '❌ Hết Chỗ'
              )}
            </button>

            {!isAuthenticated && isAvailable && (
              <div className="login-notice">
                <small>* Bạn cần đăng nhập để đặt tour</small>
              </div>
            )}

            <div className="booking-support">
              <div className="support-title">Cần hỗ trợ?</div>
              <div className="support-contact">
                <div className="contact-item">
                  📞 <a href="tel:1900xxxx">1900 xxxx</a>
                </div>
                <div className="contact-item">
                  ✉️ <a href="mailto:support@tourly.com">support@tourly.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetail;
