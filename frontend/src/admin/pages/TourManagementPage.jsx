import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { toursAPI } from '../../services/api';
import './Management.scss';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

const TourManagementPage = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTour, setEditingTour] = useState(null);
  const [formData, setFormData] = useState({
    ten_tour: '',
    mo_ta: '',
    dia_diem: '',
    gia_tien: '',
    thoi_luong: '',
    ngay_khoi_hanh: '',
    so_cho_tong: 30,
    hinh_anh: '',
    trang_thai: 'active'
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [successMessage, setSuccessMessage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [useFileUpload, setUseFileUpload] = useState(false);

  useEffect(() => {
    loadTours();
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const loadTours = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await toursAPI.getAll();
      setTours(response.data || []);
    } catch (err) {
      setError('Không thể tải danh sách tour');
      console.error('Load tours error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTours = tours.filter(tour => {
    const matchesSearch = tour.ten_tour.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tour.dia_diem.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tour.trang_thai === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Tạo preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Upload file ngay lập tức
      try {
        const imageUrl = await uploadImage(file);
        setFormData(prev => ({ ...prev, hinh_anh: imageUrl }));
        setError(null);
      } catch (err) {
        setError('Upload ảnh thất bại: ' + err.message);
        console.error('Upload error:', err);
      }
    }
  };

  const toggleImageInput = () => {
    setUseFileUpload(!useFileUpload);
    if (!useFileUpload) {
      // Chuyển sang file upload, clear URL
      setFormData(prev => ({ ...prev, hinh_anh: '' }));
    } else {
      // Chuyển sang URL, clear file
      setSelectedFile(null);
      setImagePreview('');
    }
  };

  const uploadImage = async (file) => {
    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/upload/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type for FormData, let browser set it
      },
      body: formDataUpload,
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Upload failed:', response.status, errorData);
      throw new Error(`Upload ảnh thất bại: ${response.status}`);
    }

    const data = await response.json();
    return data.imageUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        gia_tien: parseFloat(formData.gia_tien),
        thoi_luong: parseInt(formData.thoi_luong),
        so_cho_tong: parseInt(formData.so_cho_tong)
      };

      if (editingTour) {
        await toursAPI.update(editingTour.id, data);
      } else {
        await toursAPI.create(data);
      }

      setShowModal(false);
      setEditingTour(null);
      resetForm();
      loadTours();
      setSuccessMessage(editingTour ? 'Cập nhật tour thành công!' : 'Thêm tour thành công!');
    } catch (err) {
      setError('Không thể lưu tour: ' + err.message);
      console.error('Save tour error:', err);
    }
  };

  const handleEdit = (tour) => {
    setEditingTour(tour);
    setFormData({
      ten_tour: tour.ten_tour,
      mo_ta: tour.mo_ta || '',
      dia_diem: tour.dia_diem,
      gia_tien: tour.gia_tien,
      thoi_luong: tour.thoi_luong,
      ngay_khoi_hanh: tour.ngay_khoi_hanh ? tour.ngay_khoi_hanh.split('T')[0] : '',
      so_cho_tong: tour.so_cho_tong,
      hinh_anh: tour.hinh_anh || '',
      trang_thai: tour.trang_thai
    });
    setSelectedFile(null);
    setImagePreview(tour.hinh_anh || '');
    setUseFileUpload(false);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tour này?')) {
      try {
        await toursAPI.delete(id);
        loadTours();
        setSuccessMessage('Xóa tour thành công!');
      } catch (err) {
        setError('Không thể xóa tour: ' + err.message);
        console.error('Delete tour error:', err);
      }
    }
  };

  const handleRefresh = () => {
    loadTours();
    setSuccessMessage('Dữ liệu đã được làm mới!');
  };

  const resetForm = () => {
    setFormData({
      ten_tour: '',
      mo_ta: '',
      dia_diem: '',
      gia_tien: '',
      thoi_luong: '',
      ngay_khoi_hanh: '',
      so_cho_tong: 30,
      hinh_anh: '',
      trang_thai: 'active'
    });
    setSelectedFile(null);
    setImagePreview('');
    setUseFileUpload(false);
  };

  const openCreateModal = () => {
    setEditingTour(null);
    resetForm();
    setShowModal(true);
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="management-page">
      <div className="page-header">
        <h1>Quản lý tour</h1>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={handleRefresh} title="Làm mới dữ liệu">
            🔄
          </button>
          <button className="btn btn-primary" onClick={openCreateModal}>
            <FaPlus /> Thêm tour mới
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {successMessage && (
        <div className="success-message">
          {successMessage}
          <button className="close-btn" onClick={() => setSuccessMessage('')}>×</button>
        </div>
      )}

      {/* Search and Filter */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên tour hoặc địa điểm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-box">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên tour</th>
              <th>Địa điểm</th>
              <th>Giá</th>
              <th>Thời lượng</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredTours.map(tour => (
              <tr key={tour.id}>
                <td>{tour.id}</td>
                <td>{tour.ten_tour}</td>
                <td>{tour.dia_diem}</td>
                <td>{formatCurrency(tour.gia_tien)}</td>
                <td>{tour.thoi_luong} ngày</td>
                <td>
                  <span className={`status ${tour.trang_thai}`}>
                    {tour.trang_thai === 'active' ? 'Hoạt động' :
                     tour.trang_thai === 'inactive' ? 'Không hoạt động' :
                     tour.trang_thai === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn btn-sm btn-info" title="Xem">
                      <FaEye />
                    </button>
                    <button className="btn btn-sm btn-warning" title="Sửa" onClick={() => handleEdit(tour)}>
                      <FaEdit />
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      title="Xóa"
                      onClick={() => handleDelete(tour.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredTours.length === 0 && (
        <div className="empty-state">
          {tours.length === 0 ? (
            <p>Chưa có tour nào. <a href="#" onClick={openCreateModal}>Thêm tour đầu tiên</a></p>
          ) : (
            <p>Không tìm thấy tour nào phù hợp với bộ lọc.</p>
          )}
        </div>
      )}

      {/* Modal for Create/Edit */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingTour ? 'Sửa tour' : 'Thêm tour mới'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Tên tour *</label>
                  <input
                    type="text"
                    name="ten_tour"
                    value={formData.ten_tour}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Mô tả</label>
                  <textarea
                    name="mo_ta"
                    value={formData.mo_ta}
                    onChange={handleInputChange}
                    rows="3"
                  />
                </div>
                <div className="form-group">
                  <label>Địa điểm *</label>
                  <input
                    type="text"
                    name="dia_diem"
                    value={formData.dia_diem}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Giá tiền *</label>
                    <input
                      type="number"
                      name="gia_tien"
                      value={formData.gia_tien}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Thời lượng (ngày) *</label>
                    <input
                      type="number"
                      name="thoi_luong"
                      value={formData.thoi_luong}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Ngày khởi hành *</label>
                    <input
                      type="date"
                      name="ngay_khoi_hanh"
                      value={formData.ngay_khoi_hanh}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Số chỗ tổng</label>
                    <input
                      type="number"
                      name="so_cho_tong"
                      value={formData.so_cho_tong}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Hình ảnh</label>
                  <div className="image-input-toggle">
                    <button
                      type="button"
                      className={`toggle-btn ${!useFileUpload ? 'active' : ''}`}
                      onClick={toggleImageInput}
                    >
                      URL
                    </button>
                    <button
                      type="button"
                      className={`toggle-btn ${useFileUpload ? 'active' : ''}`}
                      onClick={toggleImageInput}
                    >
                      Tải lên
                    </button>
                  </div>

                  {!useFileUpload ? (
                    <input
                      type="url"
                      name="hinh_anh"
                      value={formData.hinh_anh}
                      onChange={handleInputChange}
                      placeholder="Nhập URL hình ảnh"
                    />
                  ) : (
                    <div className="file-upload">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        id="image-upload"
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="image-upload" className="file-upload-btn">
                        Chọn ảnh
                      </label>
                      {selectedFile && (
                        <span className="file-name">{selectedFile.name}</span>
                      )}
                    </div>
                  )}

                  {(imagePreview || formData.hinh_anh) && (
                    <div className="image-preview">
                      <img
                        src={imagePreview || formData.hinh_anh}
                        alt="Preview"
                        style={{ maxWidth: '200px', maxHeight: '150px', marginTop: '10px' }}
                      />
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label>Trạng thái</label>
                  <select
                    name="trang_thai"
                    value={formData.trang_thai}
                    onChange={handleInputChange}
                  >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} disabled={submitting}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Đang lưu...' : (editingTour ? 'Cập nhật' : 'Thêm mới')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourManagementPage;