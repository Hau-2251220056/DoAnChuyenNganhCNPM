
import logo from '../assets/images/logo.png';
import { CiSearch } from "react-icons/ci";
import "../assets/styles/Header.scss";
import { Link } from 'react-router-dom';
const Header = () => {


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
              <li className="nav-item">Điểm đến</li>
              <li className="nav-item">Tour</li>
              <li className="nav-item">Liên hệ</li>
              <li className="nav-item">Giới thiệu</li>
            </ul>
          </div>
          <div className="header-btn">
            <Link to="/login" className="btn-login">Đăng Nhập</Link>
            <Link to="/register" className="btn-signup">Đăng Ký</Link>
          </div>
        </div>
      </div>
      
    </>
  );
};

export default Header;