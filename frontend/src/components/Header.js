git
import logo from '../assets/images/logo.png';
import { CiSearch } from "react-icons/ci";

const Header = () => {
  return (
    <>
      <div className="header">
        <div className="header-content">
          <div className="header-logo">
            <img className="logo-img" src={logo} alt="Logo" />
          </div>
          <div className="header-search">
            <input type="text" className="search-input" placeholder="Tìm kiếm..." />
            <button className='search-icon'><CiSearch/></button>
          </div>
          <div className="header-nav">
            <ul className="nav-list">
              <li className="nav-item">Trang Chủ</li>
              <li className="nav-item">Tour</li>
            </ul>
          </div>
          <div className="header-btn">
            <button className="btn-login">Đăng Nhập</button>
            <button className="btn-signup">Đăng Ký</button>
          </div>
        </div>
      </div>
      
    </>
  );
};

export default Header;