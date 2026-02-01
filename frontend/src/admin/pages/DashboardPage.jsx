import React, { useState, useEffect } from 'react';
import { FaMapMarkedAlt, FaCalendarCheck, FaDollarSign, FaUsers } from 'react-icons/fa';
import './Dashboard.scss';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalTours: 0,
    totalBookings: 0,
    totalRevenue: 0,
    totalCustomers: 0,
  });

  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    // Mock data - thay bằng API call
    setStats({
      totalTours: 25,
      totalBookings: 150,
      totalRevenue: 2500000,
      totalCustomers: 120,
    });

    setRecentBookings([
      { id: 1, customer: 'Nguyễn Văn A', tour: 'Tour Đà Nẵng', date: '2024-01-15', status: 'Đã xác nhận' },
      { id: 2, customer: 'Trần Thị B', tour: 'Tour Phú Quốc', date: '2024-01-14', status: 'Chờ thanh toán' },
      { id: 3, customer: 'Lê Văn C', tour: 'Tour Sapa', date: '2024-01-13', status: 'Đã hoàn thành' },
    ]);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FaMapMarkedAlt />
          </div>
          <div className="stat-content">
            <h3>{stats.totalTours}</h3>
            <p>Tổng số tour</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaCalendarCheck />
          </div>
          <div className="stat-content">
            <h3>{stats.totalBookings}</h3>
            <p>Tổng đơn đặt tour</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaDollarSign />
          </div>
          <div className="stat-content">
            <h3>{formatCurrency(stats.totalRevenue)}</h3>
            <p>Doanh thu</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaUsers />
          </div>
          <div className="stat-content">
            <h3>{stats.totalCustomers}</h3>
            <p>Số khách hàng</p>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="recent-bookings">
        <h2>Đơn đặt tour gần đây</h2>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Khách hàng</th>
                <th>Tour</th>
                <th>Ngày đặt</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map(booking => (
                <tr key={booking.id}>
                  <td>{booking.id}</td>
                  <td>{booking.customer}</td>
                  <td>{booking.tour}</td>
                  <td>{booking.date}</td>
                  <td>
                    <span className={`status ${booking.status.toLowerCase().replace(' ', '-')}`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Doanh thu theo thời gian</h3>
          <div className="chart-placeholder">
            <p>Biểu đồ doanh thu sẽ hiển thị ở đây</p>
          </div>
        </div>

        <div className="chart-card">
          <h3>Tour bán chạy</h3>
          <div className="chart-placeholder">
            <p>Biểu đồ tour bán chạy sẽ hiển thị ở đây</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;