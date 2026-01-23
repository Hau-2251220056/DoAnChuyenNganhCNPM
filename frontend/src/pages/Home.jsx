import banner from '../assets/images/banner.jpg';
import '../assets/styles/Home.scss';
const Home = () => {
  return (
    <>
        <div className="home-main pd-60">
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
    </>
  );
};

export default Home;