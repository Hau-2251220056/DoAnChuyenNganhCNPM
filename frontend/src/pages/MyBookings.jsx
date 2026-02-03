import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingsAPI } from '../services/api';
import '../assets/styles/MyBookings.scss';

const MyBookings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelingId, setCancelingId] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, completed, cancelled

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchBookings();
  }, [isAuthenticated, navigate]);

  // Refresh bookings when returning from payment or payment page changes
  useEffect(() => {
    const handleFocus = () => {
      fetchBookings();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Refresh when coming back from payment
  useEffect(() => {
    if (location.state?.successMessage) {
      fetchBookings();
      // Clear state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const fetchBookings = async () => {
    try {
      setError('');
      const response = await bookingsAPI.getAll();
      
      console.log('Bookings Response:', response);

      // Handle different response formats
      let bookingsData = [];
      if (Array.isArray(response)) {
        bookingsData = response;
      } else if (response && response.data && Array.isArray(response.data)) {
        bookingsData = response.data;
      } else if (response && response.bookings && Array.isArray(response.bookings)) {
        bookingsData = response.bookings;
      }

      // Merge new data with existing data (nhẹ nhàng update)
      setBookings(prevBookings => {
        // Create a map of new bookings by id for quick lookup
        const newBookingsMap = new Map(bookingsData.map(b => [b.id, b]));
        
        // Update existing bookings or add new ones
        const merged = prevBookings
          .map(oldBooking => newBookingsMap.has(oldBooking.id) 
            ? { ...oldBooking, ...newBookingsMap.get(oldBooking.id) }
            : oldBooking
          )
          .concat(
            bookingsData.filter(b => !prevBookings.find(pb => pb.id === b.id))
          );
        
        return merged;
      });

      // Only set loading to false on initial load
      setLoading(false);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err.message || 'Không thể tải danh sách booking');
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Bạn chắc chắn muốn hủy booking này?')) {
      return;
    }

    try {
      setCancelingId(bookingId);
      await bookingsAPI.cancel(bookingId);
      
      // Update UI
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, trang_thai: 'cancelled' }
            : booking
        )
      );
      
      alert('Hủy booking thành công!');
    } catch (err) {
      console.error('Error canceling booking:', err);
      alert(`Lỗi: ${err.message}`);
    } finally {
      setCancelingId(null);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN');
  };

  const handleViewDetail = (bookingId) => {
    navigate(`/bookings/${bookingId}`);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'badge-pending';
      case 'pending_payment':
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
      case 'pending':
        return '⏳ Chờ thanh toán';
      case 'pending_payment':
        return '⏳ Chờ thanh toán';
      case 'confirmed':
        return '✓ Đã xác nhận';
      case 'completed':
        return '✓ Đã hoàn thành';
      case 'cancelled':
        return '✕ Đã hủy';
      default:
        return status;
    }
  };

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.trang_thai === filter);

  // Loading state
  if (loading) {
    return (
      <div className="my-bookings-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải danh sách booking...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-bookings-page">
      <div className="my-bookings-container">
        {/* Header */}
        <div className="bookings-header">
          <h1>📋 Các Chuyến Tour Đã Đặt</h1>
          <p>Quản lý và theo dõi các booking của bạn</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-alert">
            <span>❌ {error}</span>
            <button onClick={fetchBookings} className="retry-btn">
              Thử lại
            </button>
          </div>
        )}

        {/* Filter Buttons */}
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Tất Cả ({bookings.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Chờ Thanh Toán ({bookings.filter(b => b.trang_thai === 'pending').length})
          </button>
          <button 
            className={`filter-btn ${filter === 'confirmed' ? 'active' : ''}`}
            onClick={() => setFilter('confirmed')}
          >
            Đã Xác Nhận ({bookings.filter(b => b.trang_thai === 'confirmed').length})
          </button>
          <button 
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Hoàn Thành ({bookings.filter(b => b.trang_thai === 'completed').length})
          </button>
          <button 
            className={`filter-btn ${filter === 'cancelled' ? 'active' : ''}`}
            onClick={() => setFilter('cancelled')}
          >
            Đã Hủy ({bookings.filter(b => b.trang_thai === 'cancelled').length})
          </button>
        </div>

        {/* Empty State */}
        {filteredBookings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h2>Chưa có booking</h2>
            <p>
              {filter === 'all' 
                ? 'Bạn chưa đặt tour nào. Hãy khám phá những tour tuyệt vời!'
                : `Không có booking nào ở trạng thái này.`}
            </p>
            <button className="btn-explore" onClick={() => navigate('/tours')}>
              🔍 Khám Phá Tours
            </button>
          </div>
        ) : (
          <>
            {/* Desktop View - Table */}
            <div className="bookings-table-wrapper">
              <table className="bookings-table">
                <thead>
                  <tr>
                    <th>Tên Tour</th>
                    <th>Ngày Khởi Hành</th>
                    <th>Số Lượng</th>
                    <th>Tổng Tiền</th>
                    <th>Ngày Đặt</th>
                    <th>Trạng Thái</th>
                    <th>Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map(booking => (
                    <tr
                      key={booking.id}
                      className="booking-row"
                      onClick={() => handleViewDetail(booking.id)}
                    >
                      <td className="tour-name">
                        <span className="tour-title">{booking.tour_ten_tour || booking.tour?.ten_tour || 'N/A'}</span>
                      </td>
                      <td>
                        {formatDate(booking.tour_ngay_khoi_hanh || booking.tour?.ngay_khoi_hanh)}
                      </td>
                      <td className="quantity">
                        {booking.so_luong_nguoi}
                      </td>
                      <td className="price">
                        {formatPrice(booking.so_tien_tong)}
                      </td>
                      <td>
                        {formatDate(booking.created_at)}
                      </td>
                      <td className="status">
                        <span className={`status-badge ${getStatusBadgeClass(booking.trang_thai)}`}>
                          {getStatusLabel(booking.trang_thai)}
                        </span>
                      </td>
                      <td className="action">
                        {booking.trang_thai === 'pending' && (
                          <button
                            className="btn-cancel"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelBooking(booking.id);
                            }}
                            disabled={cancelingId === booking.id}
                          >
                            {cancelingId === booking.id ? 'Đang hủy...' : 'Hủy'}
                          </button>
                        )}
                        {booking.trang_thai === 'pending_payment' && (
                          <button
                            className="btn-pay"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/payment/${booking.id}`);
                            }}
                          >
                            Thanh Toán
                          </button>
                        )}
                        {booking.trang_thai === 'cancelled' ? (
                          <span className="text-muted">Đã hủy</span>
                        ) : (
                          <button
                            className="btn-detail"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetail(booking.id);
                            }}
                          >
                            Xem chi tiết
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View - Cards */}
            <div className="bookings-cards">
              {filteredBookings.map(booking => (
                <div
                  key={booking.id}
                  className="booking-card"
                  onClick={() => handleViewDetail(booking.id)}
                >
                  <div className="card-header">
                    <div className="header-left">
                      <span className="tour-name">{booking.tour_ten_tour || booking.tour?.ten_tour || 'N/A'}</span>
                      <span className="tour-date">
                        📅 {formatDate(booking.tour_ngay_khoi_hanh || booking.tour?.ngay_khoi_hanh)}
                      </span>
                    </div>
                    <span className={`status-badge ${getStatusBadgeClass(booking.trang_thai)}`}>
                      {getStatusLabel(booking.trang_thai)}
                    </span>
                  </div>

                  <div className="card-body">
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="label">Người</span>
                        <span className="value">{booking.so_luong_nguoi} người</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Tổng tiền</span>
                        <span className="value price">{formatPrice(booking.so_tien_tong)}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Ngày đặt</span>
                        <span className="value">{formatDate(booking.created_at)}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Trạng thái</span>
                        <span className={`value status-text ${booking.trang_thai}`}>
                          {getStatusLabel(booking.trang_thai)}
                        </span>
                      </div>
                    </div>

                    {booking.ghi_chu && (
                      <div className="info-row">
                        <span className="label">📝 Ghi chú:</span>
                        <span className="value">{booking.ghi_chu}</span>
                      </div>
                    )}
                  </div>

                  <div className="card-footer">
                    {booking.trang_thai === 'pending' && (
                      <button
                        className="btn-cancel"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancelBooking(booking.id);
                        }}
                        disabled={cancelingId === booking.id}
                      >
                        {cancelingId === booking.id ? 'Đang hủy...' : 'Hủy'}
                      </button>
                    )}
                    {booking.trang_thai === 'pending_payment' && (
                      <button
                        className="btn-pay"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/payment/${booking.id}`);
                        }}
                      >
                        Thanh Toán
                      </button>
                    )}
                    {booking.trang_thai === 'cancelled' ? (
                      <button
                        className="text-muted"
                        disabled
                      >
                        Đã hủy
                      </button>
                    ) : (
                      <button
                        className="btn-detail"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetail(booking.id);
                        }}
                      >
                        Xem chi tiết
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
