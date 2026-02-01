
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
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div 
                  style={{
                    cursor: 'pointer',
                    padding: '8px 12px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                  onMouseEnter={() => setShowDropdown(true)}
                  onMouseLeave={() => setShowDropdown(false)}
                >
                  👤 {user.ho_ten || user.email}
                  <span style={{ fontSize: '12px' }}>▼</span>
                </div>
                
                {showDropdown && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      backgroundColor: 'white',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      minWidth: '150px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      zIndex: 1000,
                      marginTop: '5px',
                    }}
                    onMouseEnter={() => setShowDropdown(true)}
                    onMouseLeave={() => setShowDropdown(false)}
                  >
                    <div style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                      <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                        Role: {user.vai_tro === 'admin' ? '👑 Admin' : '👤 Khách hàng'}
                      </p>
                    </div>
                    {user.vai_tro === 'admin' && (
                      <Link
                        to="/admin"
                        style={{
                          display: 'block',
                          padding: '10px',
                          borderBottom: '1px solid #eee',
                          textDecoration: 'none',
                          color: '#007bff',
                          fontSize: '14px',
                        }}
                        onClick={() => setShowDropdown(false)}
                      >
                        🏢 Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        color: '#d32f2f',
                        textAlign: 'left',
                        fontSize: '14px',
                      }}
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