 // bỏ {}
import { Link } from 'react-router-dom';
import Banner from '../../assets/images/banner-form.jpg';
import '../../assets/styles/RegisterForm.scss';



const RegisterForm = () => {
    return (
        <div className="form-main mg-t-80 pd-60">
            <div className="form-content max-width">
                <img src={Banner} alt="Banner" className="form-banner" />
                <div className="form">
                    <form action="" className="form-controller">
                        <h2 className="form-title">Đăng Ký</h2>
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input type="email" id="email" className="form-input" placeholder="Nhập email" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Mật khẩu</label>
                            <input type="password" id="password" className="form-input" placeholder="Nhập mật khẩu" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Nhập lại mật khẩu</label>
                            <input type="password" id="password" className="form-input" placeholder="Nhập lại mật khẩu" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="text" className="form-label">Số điện thoại</label>
                            <input type="text" id="text" className="form-input" placeholder="Nhập số điện thoại" />
                        </div>
                        <button type="submit" className="form-button">Đăng Ký</button>
                        <p className="form-text">Bạn đã có tài khoản<span><Link to="/login"> Đăng nhập</Link></span> </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default RegisterForm;
