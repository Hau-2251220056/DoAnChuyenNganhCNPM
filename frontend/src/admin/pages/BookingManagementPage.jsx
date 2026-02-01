import React, { useState, useEffect } from 'react';
import { FaEye, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import './Management.scss';

const BookingManagementPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data
    setTimeout(() => {
      setBookings([
        { id: 1, customer: 'Nguyễn Văn A', tour: 'Tour Đà Nẵng', date: '2024-01-15', status: 'pending', total: 5000000 },
        { id: 2, customer: 'Trần Thị B', tour: 'Tour Phú Quốc', date: '2024-01-14', status: 'confirmed', total: 7000000 },
        { id: 3, customer: 'Lê Văn C', tour: 'Tour Sapa', date: '2024-01-13', status: 'cancelled', total: 4000000 },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      pending: 'Chờ xác nhận',
      confirmed: 'Đã xác nhận',
      cancelled: 'Đã hủy',
      completed: 'Hoàn thành'
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status) => {
    const classMap = {
      pending: 'warning',
      confirmed: 'success',
      cancelled: 'danger',
      completed: 'info'
    };
    return classMap[status] || '';
  };

  const handleStatusChange = (id, newStatus) => {
    setBookings(bookings.map(booking =>
      booking.id === id ? { ...booking, status: newStatus } : booking
    ));
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="management-page">
      <div className="page-header">
        <h1>Đơn đặt tour</h1>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Khách hàng</th>
              <th>Tour</th>
              <th>Ngày đặt</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.customer}</td>
                <td>{booking.tour}</td>
                <td>{booking.date}</td>
                <td>{formatCurrency(booking.total)}</td>
                <td>
                  <span className={`status ${getStatusClass(booking.status)}`}>
                    {getStatusLabel(booking.status)}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn btn-sm btn-info" title="Xem chi tiết">
                      <FaEye />
                    </button>
                    <button className="btn btn-sm btn-warning" title="Chỉnh sửa">
                      <FaEdit />
                    </button>
                    {booking.status === 'pending' && (
                      <>
                        <button
                          className="btn btn-sm btn-success"
                          title="Xác nhận"
                          onClick={() => handleStatusChange(booking.id, 'confirmed')}
                        >
                          <FaCheck />
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          title="Hủy"
                          onClick={() => handleStatusChange(booking.id, 'cancelled')}
                        >
                          <FaTimes />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {bookings.length === 0 && (
        <div className="empty-state">
          <p>Chưa có đơn đặt tour nào.</p>
        </div>
      )}
    </div>
  );
};

export default BookingManagementPage;