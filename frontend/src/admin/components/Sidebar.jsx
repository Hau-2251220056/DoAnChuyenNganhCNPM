import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaMapMarkedAlt, FaTags, FaCalendarCheck, FaUsers, FaCreditCard, FaGift, FaStar, FaChartBar, FaCog, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import './Sidebar.scss';

const Sidebar = ({ collapsed }) => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({});

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: FaTachometerAlt },
    { path: '/admin/tours', label: 'Quản lý tour', icon: FaMapMarkedAlt },
    { path: '/admin/tour-types', label: 'Quản lý loại tour', icon: FaTags },
    { path: '/admin/bookings', label: 'Đơn đặt tour', icon: FaCalendarCheck },
    { path: '/admin/customers', label: 'Khách hàng', icon: FaUsers },
    { path: '/admin/payments', label: 'Thanh toán', icon: FaCreditCard },
    { path: '/admin/promotions', label: 'Khuyến mãi', icon: FaGift },
    { path: '/admin/reviews', label: 'Đánh giá', icon: FaStar },
    { path: '/admin/reports', label: 'Báo cáo – Thống kê', icon: FaChartBar },
    { path: '/admin/settings', label: 'Cài đặt', icon: FaCog },
  ];

  const toggleSubmenu = (index) => {
    setExpandedMenus(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          {!collapsed && <span>Admin Panel</span>}
        </div>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          const hasSubmenu = item.submenu && item.submenu.length > 0;
          const isExpanded = expandedMenus[index];

          return (
            <div key={index} className="menu-item-container">
              <Link
                to={item.path}
                className={`menu-item ${isActive ? 'active' : ''}`}
                onClick={hasSubmenu ? (e) => { e.preventDefault(); toggleSubmenu(index); } : undefined}
              >
                <item.icon className="menu-icon" />
                {!collapsed && (
                  <>
                    <span className="menu-label">{item.label}</span>
                    {hasSubmenu && (
                      <span className="submenu-toggle">
                        {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
                      </span>
                    )}
                  </>
                )}
              </Link>
              {hasSubmenu && isExpanded && !collapsed && (
                <div className="submenu">
                  {item.submenu.map((subItem, subIndex) => (
                    <Link
                      key={subIndex}
                      to={subItem.path}
                      className={`submenu-item ${location.pathname === subItem.path ? 'active' : ''}`}
                    >
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;