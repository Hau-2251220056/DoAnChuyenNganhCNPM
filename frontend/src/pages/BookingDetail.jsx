import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingsAPI } from '../services/api';
import '../assets/styles/BookingDetail.scss';

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchBookingDetail();
  }, [isAuthenticated, id, navigate]);

  const fetchBookingDetail = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await bookingsAPI.getById(id);

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

      setBooking(bookingData);
    } catch (err) {
      console.error('Error fetching booking detail:', err);
      setError(err.message || 'Không thể tải chi tiết booking');
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

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending_payment':
      case 'pending':
        return 'badge-pending';
      case 'confirmed':
        return 'badge-confirmed';
      case 'completed':
        return 'badge-completed';
      case 'cancelled':
        return 'badge-cancelled';
      default:
        return 'badge-default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending_payment':
      case 'pending':
        return '⏳ Chờ thanh toán';
      case 'confirmed':
        return '✓ Đã xác nhận';
      case 'completed':
        return '✓ Hoàn thành';
      case 'cancelled':
        return '✕ Đã hủy';
      default:
        return status || '—';
    }
  };

  const handlePay = () => {
    navigate(`/payment/${booking?.id || id}`);
  };

  const handleCancel = async () => {
    if (!window.confirm('Bạn chắc chắn muốn hủy booking này?')) {
      return;
    }

    try {
      setCanceling(true);
      await bookingsAPI.cancel(booking?.id || id);
      navigate('/my-bookings', {
        state: { successMessage: 'Đã hủy booking thành công!' },
      });
    } catch (err) {
      console.error('Error canceling booking:', err);
      alert(`Lỗi: ${err.message || 'Không thể hủy booking'}`);
    } finally {
      setCanceling(false);
    }
  };

  if (loading) {
    return (
      <div className="booking-detail-page">
        <div className="booking-detail-container">
          <div className="booking-detail-loading">
            <div className="loading-spinner"></div>
            <p>Đang tải chi tiết booking...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="booking-detail-page">
        <div className="booking-detail-container">
          <div className="booking-detail-error-alert">
            <span>{error || 'Không tìm thấy booking'}</span>
            <button className="retry-btn" onClick={fetchBookingDetail}>Thử lại</button>
          </div>
        </div>
      </div>
    );
  }

  const tour = booking.tour || {};
  const pricePerPerson = tour.gia_tien ?? (booking.so_tien_tong && booking.so_luong_nguoi
    ? Number(booking.so_tien_tong) / Number(booking.so_luong_nguoi)
    : null);
  const isPendingPayment = booking.trang_thai === 'pending_payment' || booking.trang_thai === 'pending';

  return (
    <div className="booking-detail-page">
      <div className="booking-detail-container">
        {/* PAGE HEADER */}
        <div className="booking-detail-header">
          <h1>Chi Tiết Booking</h1>
          <p>Thông tin tour và đặt chỗ của bạn</p>
        </div>

        {/* MAIN LAYOUT - 2 COLUMNS */}
        <div className="booking-detail-layout">
          
          {/* MAIN CONTENT */}
          <div className="booking-detail-content">
            
            {/* HERO IMAGE */}
            <div className="booking-detail-hero">
              <img
                src={tour.hinh_anh || 'https://via.placeholder.com/1200x400?text=Tour+Image'}
                alt={tour.ten_tour || 'Tour'}
              />
              <div className="hero-overlay">
                <div className="hero-info">
                  <h2>{tour.ten_tour || 'Tour'}</h2>
                  <p>Chuyến hành trình của bạn sẽ bắt đầu từ đây</p>
                </div>
              </div>
              {booking.trang_thai && (
                <div className="status-overlay">
                  <span className={`status-badge ${getStatusBadgeClass(booking.trang_thai)}`}>
                    {getStatusLabel(booking.trang_thai)}
                  </span>
                </div>
              )}
            </div>

            {/* TOUR INFO SECTION */}
            <div className="booking-detail-section">
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
            <div className="booking-detail-section">
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
                  <span className="info-value price">{formatPrice(pricePerPerson)}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Ngày Đặt</span>
                  <span className="info-value">{formatDate(booking.created_at)}</span>
                </div>
              </div>
            </div>

          </div>

          {/* SIDEBAR */}
          <div className="booking-detail-sidebar">
            
            {/* AMOUNT CARD */}
            <div className="sidebar-card">
              <h4 className="card-title">Tổng Giá Trị</h4>
              <div className="amount-section">
                <div className="amount-highlight">
                  <span className="highlight-label">Tổng Cộng</span>
                  <div className="highlight-value">{formatPrice(booking.so_tien_tong)}</div>
                </div>
                <div className="amount-row">
                  <span className="label">Giá/Người</span>
                  <span className="value">{formatPrice(pricePerPerson)}</span>
                </div>
                <div className="amount-row">
                  <span className="label">Số Người</span>
                  <span className="value">{booking.so_luong_nguoi}</span>
                </div>
              </div>
            </div>

            {/* BOOKING ID CARD */}
            <div className="sidebar-card">
              <h4 className="card-title">Mã Booking</h4>
              <div className="booking-id-section">
                <div className="id-label">Booking ID</div>
                <div className="id-value">#{booking.id}</div>
              </div>
            </div>

            {/* ACTION CARD */}
            <div className="sidebar-card">
              <h4 className="card-title">Hành Động</h4>
              <div className="action-buttons">
                {isPendingPayment ? (
                  <>
                    <button className="btn-pay" onClick={handlePay}>
                      💳 Thanh Toán Ngay
                    </button>
                    <button className="btn-cancel" onClick={handleCancel} disabled={canceling}>
                      {canceling ? 'Đang hủy...' : '❌ Hủy Booking'}
                    </button>
                  </>
                ) : (
                  <div className="text-muted">Chỉ Xem Thông Tin</div>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* RESPONSIVE TABLE VIEW */}
        <div className="booking-detail-table-wrapper">
          <table className="booking-detail-table">
            <thead>
              <tr>
                <th colSpan="2">Thông tin tour</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="tour-name">Tên tour</td>
                <td>{tour.ten_tour || '—'}</td>
              </tr>
              <tr>
                <td>Ngày khởi hành</td>
                <td>{formatDate(tour.ngay_khoi_hanh)}</td>
              </tr>
              <tr>
                <td>Thời lượng</td>
                <td>{tour.thoi_luong ? `${tour.thoi_luong} ngày` : '—'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="booking-detail-table-wrapper">
          <table className="booking-detail-table">
            <thead>
              <tr>
                <th colSpan="2">Thông tin booking</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Mã booking</td>
                <td>#{booking.id}</td>
              </tr>
              <tr>
                <td>Số lượng người</td>
                <td>{booking.so_luong_nguoi}</td>
              </tr>
              <tr>
                <td>Giá mỗi người</td>
                <td className="price">{formatPrice(pricePerPerson)}</td>
              </tr>
              <tr>
                <td>Tổng tiền</td>
                <td className="price">{formatPrice(booking.so_tien_tong)}</td>
              </tr>
              <tr>
                <td>Ngày đặt</td>
                <td>{formatDate(booking.created_at)}</td>
              </tr>
              <tr>
                <td>Trạng thái</td>
                <td>
                  <span className={`status-badge ${getStatusBadgeClass(booking.trang_thai)}`}>
                    {getStatusLabel(booking.trang_thai)}
                  </span>
                </td>
              </tr>
              <tr>
                <td>Hành động</td>
                <td className="action">
                  {isPendingPayment ? (
                    <>
                      <button className="btn-pay" onClick={handlePay}>Thanh toán</button>
                      <button className="btn-cancel" onClick={handleCancel} disabled={canceling}>
                        {canceling ? 'Đang hủy...' : 'Hủy booking'}
                      </button>
                    </>
                  ) : (
                    <span className="text-muted">Chỉ xem</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* RESPONSIVE CARD VIEW */}
        <div className="booking-detail-cards">
          <div className="booking-detail-card">
            <div className="card-header">
              <h3 className="card-title">Thông tin tour</h3>
              <span className={`status-badge ${getStatusBadgeClass(booking.trang_thai)}`}>
                {getStatusLabel(booking.trang_thai)}
              </span>
            </div>
            <div className="card-body">
              <div className="info-row">
                <span className="info-label">Tên tour</span>
                <span className="info-value">{tour.ten_tour || '—'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Ngày khởi hành</span>
                <span className="info-value">{formatDate(tour.ngay_khoi_hanh)}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Thời lượng</span>
                <span className="info-value">{tour.thoi_luong ? `${tour.thoi_luong} ngày` : '—'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Hình ảnh</span>
                <span className="info-value">
                  <img
                    src={tour.hinh_anh || 'https://via.placeholder.com/260x150?text=Tour+Image'}
                    alt={tour.ten_tour || 'Tour'}
                    style={{ width: '100%', maxWidth: 260, borderRadius: 8, display: 'block' }}
                  />
                </span>
              </div>
            </div>
          </div>

          <div className="booking-detail-card">
            <div className="card-header">
              <h3 className="card-title">Thông tin booking</h3>
            </div>
            <div className="card-body">
              <div className="info-row">
                <span className="info-label">Mã booking</span>
                <span className="info-value">#{booking.id}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Số lượng người</span>
                <span className="info-value">{booking.so_luong_nguoi}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Giá mỗi người</span>
                <span className="info-value price">{formatPrice(pricePerPerson)}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Tổng tiền</span>
                <span className="info-value price">{formatPrice(booking.so_tien_tong)}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Ngày đặt</span>
                <span className="info-value">{formatDate(booking.created_at)}</span>
              </div>
            </div>
            <div className="card-footer">
              {isPendingPayment ? (
                <>
                  <button className="btn-pay" onClick={handlePay}>Thanh toán</button>
                  <button className="btn-cancel" onClick={handleCancel} disabled={canceling}>
                    {canceling ? 'Đang hủy...' : 'Hủy booking'}
                  </button>
                </>
              ) : (
                <span className="text-muted">Chỉ xem</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
