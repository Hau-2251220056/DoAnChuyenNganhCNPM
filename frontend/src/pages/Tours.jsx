import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toursAPI } from '../services/api';
import '../assets/styles/Tours.scss';
import '../assets/styles/TourFilter.scss';

const Tours = () => {
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter states
  const [filters, setFilters] = useState({
    location: [],
    duration: [],
    priceRange: [0, 100000000],
  });

  // Sort state
  const [sortBy, setSortBy] = useState('newest');

  const [currentPage, setCurrentPage] = useState(1);
  const toursPerPage = 9;

  // Fetch tours
  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const response = await toursAPI.getAll();
      console.log('Tours API Response:', response);
      
      // Handle different response formats
      let toursData = [];
      if (Array.isArray(response)) {
        toursData = response;
      } else if (response && response.data && Array.isArray(response.data)) {
        toursData = response.data;
      } else if (response && typeof response === 'object') {
        // If it's an object, try to find the array property
        const possibleArrays = Object.values(response).filter(val => Array.isArray(val));
        toursData = possibleArrays.length > 0 ? possibleArrays[0] : [];
      }
      
      setTours(toursData);
      setFilteredTours(toursData);
    } catch (err) {
      setError('Lỗi khi tải danh sách tour');
      console.error(err);
      setTours([]);
      setFilteredTours([]);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters and sorting
  useEffect(() => {
    console.log('🔍 Applying filters:', filters);
    console.log('📋 All tours:', tours);
    
    let result = [...tours];

    // Location filter - theo field dia_diem trong DB
    if (filters.location.length > 0) {
      result = result.filter(tour => {
        const destination = (tour.dia_diem || '').toLowerCase();
        const matches = filters.location.some(loc => destination.includes(loc.toLowerCase()));
        console.log(`Tour "${tour.ten_tour}" destination: "${destination}", matches:`, matches);
        return matches;
      });
      console.log('After location filter:', result.length);
    }

    // Duration filter - theo field thoi_luong trong DB
    if (filters.duration.length > 0) {
      result = result.filter(tour => {
        const days = parseInt(tour.thoi_luong || 0);
        const matches = filters.duration.some(dur => {
          if (dur === '3days') return days === 3;
          if (dur === '4days') return days === 4;
          if (dur === '5plus') return days >= 5;
          return false;
        });
        console.log(`Tour "${tour.ten_tour}" duration: ${days} days, matches:`, matches);
        return matches;
      });
      console.log('After duration filter:', result.length);
    }

    // Price filter - theo field gia_tien trong DB
    result = result.filter(tour => {
      const price = parseFloat(tour.gia_tien || 0);
      const matches = price >= filters.priceRange[0] && price <= filters.priceRange[1];
      return matches;
    });
    console.log('After price filter:', result.length);

    // Apply sorting
    result = applySorting(result, sortBy);

    console.log('✅ Final filtered tours:', result.length, result);
    setFilteredTours(result);
    setCurrentPage(1);
  }, [filters, tours, sortBy]);

  // Sorting function
  const applySorting = (toursArray, sortOption) => {
    if (!Array.isArray(toursArray) || toursArray.length === 0) return toursArray;

    const sortedArray = [...toursArray];

    switch (sortOption) {
      case 'price-asc':
        // Giá thấp đến cao
        return sortedArray.sort((a, b) => {
          const priceA = parseFloat(a.gia_tien || 0);
          const priceB = parseFloat(b.gia_tien || 0);
          return priceA - priceB;
        });

      case 'price-desc':
        // Giá cao đến thấp
        return sortedArray.sort((a, b) => {
          const priceA = parseFloat(a.gia_tien || 0);
          const priceB = parseFloat(b.gia_tien || 0);
          return priceB - priceA;
        });

      case 'duration-asc':
        // Thời gian ngắn đến dài
        return sortedArray.sort((a, b) => {
          const durationA = parseInt(a.thoi_luong || 0);
          const durationB = parseInt(b.thoi_luong || 0);
          return durationA - durationB;
        });

      case 'duration-desc':
        // Thời gian dài đến ngắn
        return sortedArray.sort((a, b) => {
          const durationA = parseInt(a.thoi_luong || 0);
          const durationB = parseInt(b.thoi_luong || 0);
          return durationB - durationA;
        });

      case 'name-asc':
        // Tên A-Z
        return sortedArray.sort((a, b) => {
          const nameA = (a.ten_tour || '').toLowerCase();
          const nameB = (b.ten_tour || '').toLowerCase();
          return nameA.localeCompare(nameB, 'vi');
        });

      case 'name-desc':
        // Tên Z-A
        return sortedArray.sort((a, b) => {
          const nameA = (a.ten_tour || '').toLowerCase();
          const nameB = (b.ten_tour || '').toLowerCase();
          return nameB.localeCompare(nameA, 'vi');
        });

      case 'newest':
      default:
        // Mới nhất (theo ID hoặc ngày tạo)
        return sortedArray.sort((a, b) => b.id - a.id);
    }
  };

  // Handle sort change
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  // Pagination - ensure filteredTours is always an array
  const indexOfLastTour = currentPage * toursPerPage;
  const indexOfFirstTour = indexOfLastTour - toursPerPage;
  const currentTours = Array.isArray(filteredTours) ? filteredTours.slice(indexOfFirstTour, indexOfLastTour) : [];
  const totalPages = Array.isArray(filteredTours) ? Math.ceil(filteredTours.length / toursPerPage) : 0;

  // Handle filter change
  const handleFilterChange = (filterName, value) => {
    if (filterName === 'location' || filterName === 'duration') {
      setFilters(prev => ({
        ...prev,
        [filterName]: prev[filterName].includes(value)
          ? prev[filterName].filter(item => item !== value)
          : [...prev[filterName], value]
      }));
    } else if (filterName === 'priceRange') {
      setFilters(prev => ({
        ...prev,
        priceRange: value
      }));
    }
  };

  const clearFilters = () => {
    setFilters({
      location: [],
      duration: [],
      priceRange: [0, 100000000],
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (date) => {
    if (!date) return 'Chưa xác định';
    return new Date(date).toLocaleDateString('vi-VN');
  };

  return (
    <div className="tours-container">
      <div className="tours-header">
        <h1>✈️ Danh Sách Tours</h1>
        <p>Khám phá những chuyến du lịch tuyệt vời</p>
      </div>

      <div className="tours-wrapper max-width">
        {/* SIDEBAR FILTER */}
        <aside className="tours-sidebar">
          <div className="filter-section">
            <div className="filter-header">
              <h3>🔍 Bộ Lọc</h3>
              <button className="clear-filters-btn" onClick={clearFilters}>
                🔄 Xóa
              </button>
            </div>

            {/* Location Filter */}
            <div className="filter-group">
              <h4 className="filter-title">📍 Địa Điểm</h4>
              <div className="filter-options">
                {['Sapa', 'Quảng Ninh', 'Đà Nẵng', 'Hội An', 'Hồ Chí Minh', 'Cần Thơ', 'Huế', 'Quảng Bình', 'Nha Trang'].map(location => (
                  <label key={location} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.location.includes(location)}
                      onChange={() => handleFilterChange('location', location)}
                    />
                    <span>{location}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Duration Filter */}
            <div className="filter-group">
              <h4 className="filter-title">⏱️ Thời Lượng</h4>
              <div className="filter-options">
                {[
                  { id: '3days', label: '3 ngày' },
                  { id: '4days', label: '4 ngày' },
                  { id: '5plus', label: '5+ ngày' }
                ].map(duration => (
                  <label key={duration.id} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.duration.includes(duration.id)}
                      onChange={() => handleFilterChange('duration', duration.id)}
                    />
                    <span>{duration.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="filter-group">
              <h4 className="filter-title">💰 Mức Giá</h4>
              <div className="filter-options">
                {[
                  { label: 'Dưới 2 triệu', min: 0, max: 2000000 },
                  { label: '2 - 5 triệu', min: 2000000, max: 5000000 },
                  { label: '5 - 10 triệu', min: 5000000, max: 10000000 },
                  { label: 'Trên 10 triệu', min: 10000000, max: 100000000 }
                ].map((price, idx) => (
                  <label key={idx} className="filter-radio">
                    <input
                      type="radio"
                      name="price"
                      checked={filters.priceRange[0] === price.min && filters.priceRange[1] === price.max}
                      onChange={() => handleFilterChange('priceRange', [price.min, price.max])}
                    />
                    <span>{price.label}</span>
                  </label>
                ))}
                <label className="filter-radio">
                  <input
                    type="radio"
                    name="price"
                    checked={filters.priceRange[0] === 0 && filters.priceRange[1] === 100000000}
                    onChange={() => handleFilterChange('priceRange', [0, 100000000])}
                  />
                  <span>Tất cả mức giá</span>
                </label>
              </div>
            </div>


          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="tours-main">
          {/* Results Info */}
          <div className="results-info">
            <p>
              Tìm thấy <strong>{Array.isArray(filteredTours) ? filteredTours.length : 0}</strong> tour
              {Array.isArray(filteredTours) && Array.isArray(tours) && filteredTours.length !== tours.length && ` (lọc từ ${tours.length})`}
            </p>
            <select className="sort-select" value={sortBy} onChange={handleSortChange}>
              <option value="newest">Sắp xếp: Mới nhất</option>
              <option value="price-asc">Sắp xếp: Giá thấp → cao</option>
              <option value="price-desc">Sắp xếp: Giá cao → thấp</option>
              <option value="duration-asc">Sắp xếp: Thời gian ngắn → dài</option>
              <option value="duration-desc">Sắp xếp: Thời gian dài → ngắn</option>
              <option value="name-asc">Sắp xếp: Tên A → Z</option>
              <option value="name-desc">Sắp xếp: Tên Z → A</option>
            </select>
          </div>

          {/* Loading State */}
          {loading && <div className="loading">⏳ Đang tải tours...</div>}

          {/* Error State */}
          {error && <div className="error-message">❌ {error}</div>}

          {/* Tour Cards Grid */}
          {!loading && filteredTours.length > 0 ? (
            <>
              <div className="tours-grid">
                {currentTours.map(tour => (
                  <div key={tour.id} className="tour-card">
                    <div className="tour-image-wrapper">
                      <img 
                        src={tour.hinh_anh || 'https://via.placeholder.com/400x220?text=Tour+Image'} 
                        alt={tour.ten_tour} 
                      />
                      
                      {/* Duration Badge */}
                      <div className="duration-badge">
                        ⏱️ {tour.thoi_luong} ngày
                      </div>
                      
                      {/* Hot Deal Badge */}
                      {(tour.hot_deal || tour.id <= 2) && (
                        <div className="hot-deal-badge">⭐ HOT DEAL</div>
                      )}
                    </div>

                    <div className="tour-content">
                      {/* Location */}
                      <div className="tour-location">
                        📍 {tour.dia_diem}
                      </div>

                      {/* Title */}
                      <h3 className="tour-title">{tour.ten_tour}</h3>

                      {/* Description */}
                      <p className="tour-description">{tour.mo_ta}</p>

                      {/* Departure Date */}
                      <div className="tour-date">
                        📅 Khởi hành: {formatDate(tour.ngay_khoi_hanh)}
                      </div>

                      {/* Price & Seats */}
                      <div className="tour-footer">
                        <div className="tour-price-section">
                          <div className="tour-price">
                            {formatPrice(tour.gia_tien)}
                          </div>
                          <div className="price-label">Giá / người</div>
                        </div>
                        <div className="tour-seats">
                          <div className="seats-number">{tour.so_cho_con_lai}</div>
                          <div className="seats-label">chỗ còn lại</div>
                        </div>
                      </div>

                      {/* View Details Button */}
                      <Link to={`/tours/${tour.id}`} className="btn-detail">
                        Xem Chi Tiết →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    ← Trước
                  </button>

                  <div className="pagination-pages">
                    {[...Array(totalPages)].map((_, idx) => (
                      <button
                        key={idx + 1}
                        className={`pagination-page ${currentPage === idx + 1 ? 'active' : ''}`}
                        onClick={() => setCurrentPage(idx + 1)}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Tiếp →
                  </button>
                </div>
              )}
            </>
          ) : (
            !loading && (
              <div className="no-results">
                <p>😔 Không tìm thấy tour phù hợp với bộ lọc của bạn</p>
                <button className="btn-clear" onClick={clearFilters}>Xóa bộ lọc</button>
              </div>
            )
          )}
        </main>
      </div>
    </div>
  );
};

export default Tours;
