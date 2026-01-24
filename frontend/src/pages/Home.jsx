import banner from '../assets/images/banner.jpg';
import { IoReceipt, IoShieldCheckmark } from "react-icons/io5";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaHeadset } from "react-icons/fa6";
import '../assets/styles/base.scss';
import '../assets/styles/Home.scss';

// import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
  return (
    <>
        <div className="home-main pd-60 center">
           <div className='max-width'>
             <div className="home-banner">
                <img className="banner-img" src={banner} alt="Banner" />
                <div className='banner-content'>
                    <h1 className='banner-title'>KHÁM PHÁ DU LỊCH VIỆT NAM</h1>
                    <h3 className='sub-title'>Khám phá vẻ đẹp thiên nhiên và văn hóa phong phú của đất nước</h3>
                </div>
            </div>
           </div>
        </div>
        <div className="home-content pd-60 center">
          <div className="max-width">
            <div className="row">
              <div className="col col-md-4">
                <div className="title-box">
                  <h4 className="box-title">Why Choose Tour ?</h4>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col col-md-3">
                <div className="content-box">
                  <i className="content-icon"><IoReceipt /></i>
                  <p className="box-text">Giá cả minh bạch</p>
                  <p className="decs">Tất cả giá tour được hiển thị rõ ràng, chi tiết ngay từ đầu, không phát sinh chi phí ẩn, giúp khách hàng yên tâm lựa chọn và đặt tour.</p>
                </div>
              </div>
              <div className="col col-md-3">
                <div className="content-box">
                  <i className="content-icon"><FaMapMarkerAlt /></i>
                  <p className="box-text">Điểm đến hấp dẫn</p>
                  <p className="decs">Chúng tôi cung cấp các điểm đến tuyệt vời và độc đáo, mang đến cho bạn những trải nghiệm đáng nhớ và khám phá những điều mới mẻ.</p>
                </div>
              </div>
              <div className="col col-md-3">
                <div className="content-box">
                  <i className="content-icon"><IoShieldCheckmark /></i>
                  <p className="box-text">Thanh toán an toàn</p>
                  <p className="decs">Hệ thống hỗ trợ các phương thức thanh toán bảo mật, đảm bảo an toàn thông tin cá nhân và giao dịch của khách hàng trong suốt quá trình thanh toán.</p>
                </div>
              </div>
              <div className="col col-md-3">
                <div className="content-box">
                  <i className="content-icon"><FaHeadset /></i>
                  <p className="box-text">Hỗ trợ khách hàng</p>
                  <p className="decs">Đội ngũ hỗ trợ khách hàng chuyên nghiệp, luôn sẵn sàng giải đáp mọi thắc mắc và hỗ trợ bạn trong suốt hành trình du lịch của mình.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
    </>
  );
};

export default Home;