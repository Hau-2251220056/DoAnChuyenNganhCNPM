import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingsAPI } from '../services/api';
import '../assets/styles/Payment.scss';

const Payment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('bank-transfer');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchBookingDetail();
  }, [isAuthenticated, bookingId, navigate]);

  const fetchBookingDetail = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await bookingsAPI.getById(bookingId);

      let bookingData = null;
      if (response?.data) {
        bookingData = response.data;
      } else if (response?.booking) {
        bookingData = response.booking;
      } else if (response?.id) {
        bookingData = response;
      }

      if (!bookingData) {
        throw new Error('Không tìm thấy booking');
      }

      // Check if booking status is pending or pending_payment
      const isPending = bookingData.trang_thai === 'pending' || bookingData.trang_thai === 'pending_payment';
      if (!isPending) {
        throw new Error('Booking này không cần thanh toán');
      }

      setBooking(bookingData);
    } catch (err) {
      console.error('Error fetching booking detail:', err);
      setError(err.message || 'Không thể tải thông tin thanh toán');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined) return '—';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(Number(price));
  };

  const formatDate = (date) => {
    if (!date) return 'Chưa xác định';
    return new Date(date).toLocaleDateString('vi-VN');
  };

  const handleConfirmPayment = async () => {
    if (!booking) return;

    try {
      setConfirming(true);

      // Call API to confirm payment
      await bookingsAPI.confirmPayment(booking.id);

      // Show success message
      alert('✓ Thanh toán thành công! Booking của bạn đã được xác nhận.');

      // Redirect to my-bookings
      navigate('/my-bookings', {
        state: { successMessage: 'Thanh toán thành công!' },
      });
    } catch (err) {
      console.error('Error confirming payment:', err);
      alert(`Lỗi: ${err.message || 'Không thể xác nhận thanh toán'}`);
    } finally {
      setConfirming(false);
    }
  };

  if (loading) {
    return (
      <div className="payment-page">
        <div className="payment-container">
          <div className="payment-loading">
            <div className="loading-spinner"></div>
            <p>Đang tải thông tin thanh toán...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="payment-page">
        <div className="payment-container">
          <div className="payment-error-alert">
            <span>❌ {error || 'Không tìm thấy booking'}</span>
            <button className="retry-btn" onClick={fetchBookingDetail}>Thử lại</button>
          </div>
        </div>
      </div>
    );
  }

  const tour = booking.tour || {};

  return (
    <div className="payment-page">
      <div className="payment-container">
        {/* PAGE HEADER */}
        <div className="payment-header">
          <h1>💳 Thanh Toán Booking</h1>
          <p>Hoàn tất thanh toán để xác nhận chuyến tour của bạn</p>
        </div>

        {/* MAIN LAYOUT - 2 COLUMNS */}
        <div className="payment-layout">
          
          {/* MAIN CONTENT */}
          <div className="payment-content">
            
            {/* TOUR INFO SECTION */}
            <div className="payment-section">
              <h3 className="section-title">Thông Tin Tour</h3>
              <div className="section-grid">
                <div className="info-card">
                  <span className="info-label">Tên Tour</span>
                  <div className="info-value tour-name">{tour.ten_tour || '—'}</div>
                </div>
                <div className="info-card">
                  <span className="info-label">Ngày Khởi Hành</span>
                  <div className="info-value">{formatDate(tour.ngay_khoi_hanh)}</div>
                </div>
                <div className="info-card">
                  <span className="info-label">Thời Lượng</span>
                  <div className="info-value">{tour.thoi_luong ? `${tour.thoi_luong} ngày` : '—'}</div>
                </div>
              </div>
            </div>

            {/* BOOKING INFO SECTION */}
            <div className="payment-section">
              <h3 className="section-title">Thông Tin Booking</h3>
              <div>
                <div className="info-row">
                  <span className="info-label">Mã Booking</span>
                  <span className="info-value">#{booking.id}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Số Lượng Người</span>
                  <span className="info-value">{booking.so_luong_nguoi} người</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Giá Mỗi Người</span>
                  <span className="info-value price">{formatPrice(Number(booking.so_tien_tong) / Number(booking.so_luong_nguoi))}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Ngày Đặt</span>
                  <span className="info-value">{formatDate(booking.created_at)}</span>
                </div>
              </div>
            </div>

            {/* PAYMENT METHOD SECTION */}
            <div className="payment-section">
              <h3 className="section-title">Phương Thức Thanh Toán</h3>
              <div className="payment-method-section">
                <div className="method-group">
                  
                  {/* Bank Transfer Option */}
                  <div
                    className={`method-option ${selectedMethod === 'bank-transfer' ? 'selected' : ''}`}
                    onClick={() => setSelectedMethod('bank-transfer')}
                  >
                    <input
                      type="radio"
                      name="payment-method"
                      value="bank-transfer"
                      checked={selectedMethod === 'bank-transfer'}
                      onChange={(e) => setSelectedMethod(e.target.value)}
                    />
                    <div className="method-content">
                      <div className="method-title">Chuyển Khoản Ngân Hàng</div>
                      <div className="method-desc">Chuyển tiền trực tiếp vào tài khoản công ty</div>
                    </div>
                    <div className="method-icon">💳</div>
                  </div>

                  {/* Cash on Tour Option */}
                  <div
                    className={`method-option ${selectedMethod === 'cash-on-tour' ? 'selected' : ''}`}
                    onClick={() => setSelectedMethod('cash-on-tour')}
                  >
                    <input
                      type="radio"
                      name="payment-method"
                      value="cash-on-tour"
                      checked={selectedMethod === 'cash-on-tour'}
                      onChange={(e) => setSelectedMethod(e.target.value)}
                    />
                    <div className="method-content">
                      <div className="method-title">Thanh Toán Khi Gặp HDV</div>
                      <div className="method-desc">Thanh toán trực tiếp bằng tiền mặt khi gặp hướng dẫn viên</div>
                    </div>
                    <div className="method-icon">💵</div>
                  </div>

                  {/* E-Wallet Option */}
                  <div
                    className={`method-option ${selectedMethod === 'e-wallet' ? 'selected' : ''}`}
                    onClick={() => setSelectedMethod('e-wallet')}
                  >
                    <input
                      type="radio"
                      name="payment-method"
                      value="e-wallet"
                      checked={selectedMethod === 'e-wallet'}
                      onChange={(e) => setSelectedMethod(e.target.value)}
                    />
                    <div className="method-content">
                      <div className="method-title">Ví Điện Tử (Momo, ViettelPay)</div>
                      <div className="method-desc">Thanh toán qua ứng dụng ví điện tử</div>
                    </div>
                    <div className="method-icon">📱</div>
                  </div>

                </div>
              </div>

              {/* Info Message */}
              <div className="info-message">
                📌 Vui lòng chọn phương thức thanh toán phù hợp với bạn
              </div>
            </div>

          </div>

          {/* SIDEBAR */}
          <div className="payment-sidebar">
            
            {/* AMOUNT CARD */}
            <div className="sidebar-card">
              <h4 className="card-title">Tổng Giá Trị</h4>
              <div className="amount-section">
                <div className="amount-highlight">
                  <span className="highlight-label">Tổng Cần Thanh Toán</span>
                  <div className="highlight-value">{formatPrice(booking.so_tien_tong)}</div>
                </div>
                <div className="amount-row">
                  <span className="label">Số Người</span>
                  <span className="value">{booking.so_luong_nguoi}</span>
                </div>
                <div className="amount-row">
                  <span className="label">Giá/Người</span>
                  <span className="value">{formatPrice(Number(booking.so_tien_tong) / Number(booking.so_luong_nguoi))}</span>
                </div>
              </div>
            </div>

            {/* ACTION CARD */}
            <div className="sidebar-card">
              <h4 className="card-title">Xác Nhận Thanh Toán</h4>
              <div className="action-buttons">
                <button
                  onClick={handleConfirmPayment}
                  disabled={confirming}
                  className="btn-confirm"
                >
                  {confirming ? '⏳ Đang xử lý...' : '✓ Xác Nhận'}
                </button>
                <button
                  onClick={() => navigate('/bookings/' + bookingId)}
                  className="btn-cancel"
                >
                  ← Quay Lại
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Payment;
