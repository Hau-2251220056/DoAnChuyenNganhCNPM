import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaBars, FaBell, FaUser, FaSignOutAlt } from 'react-icons/fa';
import './Header.scss';

const Header = ({ onToggleSidebar }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const getBreadcrumb = () => {
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);

    if (segments[0] === 'admin') {
      const adminPath = segments[1] || 'dashboard';
      const breadcrumbMap = {
        dashboard: 'Dashboard',
        tours: 'Quản lý tour',
        'tour-types': 'Quản lý loại tour',
        bookings: 'Đơn đặt tour',
        customers: 'Khách hàng',
        payments: 'Thanh toán',
        promotions: 'Khuyến mãi',
        reviews: 'Đánh giá',
        reports: 'Báo cáo – Thống kê',
        settings: 'Cài đặt',
      };

      return ['Admin', breadcrumbMap[adminPath] || adminPath];
    }

    return ['Home'];
  };

  const breadcrumb = getBreadcrumb();

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      logout();
    }
  };

  return (
    <header className="admin-header">
      <div className="header-left">
        <button className="sidebar-toggle" onClick={onToggleSidebar}>
          <FaBars />
        </button>
        <div className="breadcrumb">
          {breadcrumb.map((item, index) => (
            <span key={index}>
              {item}
              {index < breadcrumb.length - 1 && ' / '}
            </span>
          ))}
        </div>
      </div>
      <div className="header-right">
        <button className="notification-btn">
          <FaBell />
          <span className="notification-badge">3</span>
        </button>
        <div className="user-menu">
          <div className="user-info">
            <img src="/default-avatar.png" alt="Avatar" className="user-avatar" />
            <span className="user-name">{user?.ho_ten || 'Admin'}</span>
          </div>
          <div className="user-dropdown">
            <button className="dropdown-item">
              <FaUser /> Thông tin cá nhân
            </button>
            <button className="dropdown-item" onClick={handleLogout}>
              <FaSignOutAlt /> Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;