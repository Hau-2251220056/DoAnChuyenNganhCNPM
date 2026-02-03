
import logo from '../assets/images/logo.png';
import { CiSearch } from "react-icons/ci";
import "../assets/styles/Header.scss";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowDropdown(false);
  };

  return (
    <>
      <div className="header">
        <div className="header-content">
          <div className="header-logo">
            <Link to="/"><img src={logo} alt="Logo" className="logo-img" /></Link>
          </div>
          <div className="header-search">
            <input type="text" className="search-input" placeholder="Tìm kiếm, điểm đến, tỉnh thành,..." />
            <button className='search-icon'><CiSearch/></button>
          </div>
          <div className="header-nav">
            <ul className="nav-list">
              <Link to="/"><li className="nav-item">Home</li></Link>
              <Link to="/tours"><li className="nav-item">Tours</li></Link>
              <Link to="/about"><li className="nav-item">About</li></Link>
              <Link to="/contact"><li className="nav-item">Contact</li></Link>
            </ul>
          </div>
          <div className="header-btn">
            {isAuthenticated && user ? (
              <div
                className="user-menu"
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
              >
                <button className="user-trigger" type="button">
                  👤 {user.ho_ten || user.email}
                  <span className="user-caret">▼</span>
                </button>

                {showDropdown && (
                  <div className="user-dropdown" role="menu">
                    <div className="user-dropdown-role">
                      Role: {user.vai_tro === 'admin' ? '👑 Admin' : '👤 Khách hàng'}
                    </div>
                    <Link
                      to="/my-bookings"
                      className="user-dropdown-item"
                      onClick={() => setShowDropdown(false)}
                    >
                      📋 Booking Của Tôi
                    </Link>
                    <button
                      type="button"
                      className="user-dropdown-item is-logout"
                      onClick={handleLogout}
                    >
                      🚪 Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-login">Đăng Nhập</Link>
                <Link to="/register" className="btn-signup">Đăng Ký</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;