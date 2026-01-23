 // bỏ {}
import { Link } from 'react-router-dom';
import Banner from '../../assets/images/banner-form.jpg';
import '../../assets/styles/LoginForm.scss';



const LoginForm = () => {
    return (
        <div className="form-main mg-t-80 pd-60">
            <div className="form-content max-width">
                <img src={Banner} alt="Banner" className="form-banner" />
                <div className="form">
                    <form action="" className="form-controller">
                        <h2 className="form-title">Đăng Nhập</h2>
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input type="email" id="email" className="form-input" placeholder="Nhập email" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Mật khẩu</label>
                            <input type="password" id="password" className="form-input" placeholder="Nhập mật khẩu" />
                        </div>
                        <button type="submit" className="form-button">Đăng Nhập</button>
                        <p className="form-text">Bạn chưa có tài khoản?<span><Link to="/register"> Đăng ký</Link></span> </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;
