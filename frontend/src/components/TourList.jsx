/**
 * TourList Component - Hiển thị danh sách tours
 */

import { useState, useEffect } from 'react';
import { toursAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const TourList = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const response = await toursAPI.getAll();
      console.log('📋 Tours fetched:', response);
      
      setTours(response.data || []);
      setError(null);
    } catch (err) {
      console.error('❌ Error fetching tours:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', fontSize: '18px' }}>
        ⏳ Đang tải danh sách tour...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px',
        color: '#d32f2f',
        backgroundColor: '#ffebee',
        borderRadius: '4px',
        margin: '20px',
      }}>
        ❌ Lỗi: {error}
      </div>
    );
  }

  if (tours.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', fontSize: '18px' }}>
        🚫 Chưa có tour nào
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
      {tours.map((tour) => (
        <div
          key={tour.id}
          style={{
            border: 'none',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
            backgroundColor: 'white',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.1)';
          }}
        >
          {/* Tour Image */}
          <div style={{ position: 'relative', height: '220px', overflow: 'hidden', backgroundColor: '#f0f0f0' }}>
            <img
              src={tour.hinh_anh || 'https://via.placeholder.com/400x220?text=Tour+Image'}
              alt={tour.ten_tour}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.4s ease-out',
              }}
              onMouseEnter={(e) => (e.target.style.transform = 'scale(1.08)')}
              onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
            />
            {/* Badge */}
            <div style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              backgroundColor: 'rgba(255, 107, 107, 0.95)',
              color: 'white',
              padding: '8px 14px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 'bold',
              backdropFilter: 'blur(10px)',
            }}>
              ⏱️ {tour.thoi_luong} ngày
            </div>
            {/* Featured Badge */}
            {tour.id <= 2 && (
              <div style={{
                position: 'absolute',
                top: '15px',
                left: '15px',
                backgroundColor: 'rgba(255, 193, 7, 0.95)',
                color: '#333',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: 'bold',
                backdropFilter: 'blur(10px)',
              }}>
                ⭐ HOT DEAL
              </div>
            )}
          </div>

          {/* Tour Info */}
          <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Location */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              marginBottom: '10px',
              color: '#ff6b6b',
              fontSize: '13px',
              fontWeight: '600',
            }}>
              📍 {tour.dia_diem}
            </div>

            {/* Title */}
            <h3 style={{
              margin: '0 0 12px 0',
              fontSize: '17px',
              color: '#222',
              fontWeight: '600',
              lineHeight: '1.4',
              minHeight: '50px',
            }}>
              {tour.ten_tour}
            </h3>

            {/* Description */}
            <p style={{
              margin: '0 0 12px 0',
              fontSize: '13px',
              color: '#666',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: '1.5',
              flex: 1,
            }}>
              {tour.mo_ta}
            </p>

            {/* Date */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              marginBottom: '12px',
              fontSize: '12px',
              color: '#999',
            }}>
              📅 Khởi hành: {formatDate(tour.ngay_khoi_hanh)}
            </div>

            {/* Price & Seats */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '12px',
              borderTop: '1px solid #f0f0f0',
              marginBottom: '12px',
            }}>
              <div style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#ff6b6b',
                display: 'flex',
                flexDirection: 'column',
              }}>
                <div>{formatPrice(tour.gia_tien)}</div>
                <div style={{ fontSize: '11px', color: '#999', marginTop: '3px' }}>Giá / người</div>
              </div>
              <div style={{
                fontSize: '12px',
                color: '#666',
                backgroundColor: '#f5f5f5',
                padding: '6px 10px',
                borderRadius: '6px',
                textAlign: 'center',
              }}>
                <div style={{ fontWeight: 'bold', color: '#ff6b6b' }}>{tour.so_cho_con_lai}</div>
                <div>chỗ còn lại</div>
              </div>
            </div>

            {/* Button */}
            <button
              onClick={() => navigate(`/tour/${tour.id}`)}
              style={{
                width: '100%',
                padding: '12px',
                marginTop: 'auto',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 14px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              Xem Chi Tiết →
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TourList;