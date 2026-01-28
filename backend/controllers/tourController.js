/**
 * Tour Controller
 * Xử lý danh sách tour, chi tiết, thêm/sửa/xóa tour (admin)
 */

const { Op } = require('sequelize');
const { Tour } = require('../models');

/**
 * GET /tours
 * Danh sách tour với filter
 * Query: name, location, minPrice, maxPrice, duration
 */
exports.getTours = async (req, res, next) => {
  try {
    const { name, location, minPrice, maxPrice, duration } = req.query;

    // Xây dựng điều kiện lọc
    const where = { trang_thai: 'active' };

    if (name) {
      where.ten_tour = { [Op.like]: `%${name}%` };
    }

    if (location) {
      where.dia_diem = { [Op.like]: `%${location}%` };
    }

    if (minPrice) {
      where.gia_tien = { [Op.gte]: parseFloat(minPrice) };
    }

    if (maxPrice) {
      if (where.gia_tien) {
        where.gia_tien[Op.lte] = parseFloat(maxPrice);
      } else {
        where.gia_tien = { [Op.lte]: parseFloat(maxPrice) };
      }
    }

    if (duration) {
      where.thoi_luong = parseInt(duration);
    }

    // Lấy danh sách
    const tours = await Tour.findAll({
      where,
      order: [['ngay_khoi_hanh', 'ASC']],
    });

    res.status(200).json({
      success: true,
      message: 'Tours retrieved successfully',
      data: tours,
      count: tours.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /tours/:id
 * Chi tiết tour
 */
exports.getTourById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const tour = await Tour.findByPk(id);

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Tour not found',
      });
    }

    res.status(200).json({
      success: true,
      data: tour,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /tours
 * Tạo tour mới (Admin only)
 */
exports.createTour = async (req, res, next) => {
  try {
    const { ten_tour, mo_ta, dia_diem, gia_tien, thoi_luong, ngay_khoi_hanh, so_cho_tong, hinh_anh } = req.body;

    // Validate
    if (!ten_tour || !dia_diem || !gia_tien || !thoi_luong || !ngay_khoi_hanh) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: ten_tour, dia_diem, gia_tien, thoi_luong, ngay_khoi_hanh',
      });
    }

    const tour = await Tour.create({
      ten_tour,
      mo_ta,
      dia_diem,
      gia_tien: parseFloat(gia_tien),
      thoi_luong: parseInt(thoi_luong),
      ngay_khoi_hanh: new Date(ngay_khoi_hanh),
      so_cho_tong: so_cho_tong ? parseInt(so_cho_tong) : 30,
      so_cho_con_lai: so_cho_tong ? parseInt(so_cho_tong) : 30,
      hinh_anh,
      trang_thai: 'active',
    });

    res.status(201).json({
      success: true,
      message: 'Tour created successfully',
      data: tour,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /tours/:id
 * Cập nhật tour (Admin only)
 */
exports.updateTour = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { ten_tour, mo_ta, dia_diem, gia_tien, thoi_luong, ngay_khoi_hanh, so_cho_tong, hinh_anh, trang_thai } = req.body;

    const tour = await Tour.findByPk(id);

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Tour not found',
      });
    }

    // Update fields
    if (ten_tour) tour.ten_tour = ten_tour;
    if (mo_ta !== undefined) tour.mo_ta = mo_ta;
    if (dia_diem) tour.dia_diem = dia_diem;
    if (gia_tien) tour.gia_tien = parseFloat(gia_tien);
    if (thoi_luong) tour.thoi_luong = parseInt(thoi_luong);
    if (ngay_khoi_hanh) tour.ngay_khoi_hanh = new Date(ngay_khoi_hanh);
    if (so_cho_tong) tour.so_cho_tong = parseInt(so_cho_tong);
    if (hinh_anh !== undefined) tour.hinh_anh = hinh_anh;
    if (trang_thai) tour.trang_thai = trang_thai;

    await tour.save();

    res.status(200).json({
      success: true,
      message: 'Tour updated successfully',
      data: tour,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /tours/:id
 * Xóa tour (Admin only) - Soft delete bằng cách set trang_thai = inactive
 */
exports.deleteTour = async (req, res, next) => {
  try {
    const { id } = req.params;

    const tour = await Tour.findByPk(id);

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Tour not found',
      });
    }

    // Soft delete: chỉ đánh dấu inactive
    tour.trang_thai = 'inactive';
    await tour.save();

    res.status(200).json({
      success: true,
      message: 'Tour deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
