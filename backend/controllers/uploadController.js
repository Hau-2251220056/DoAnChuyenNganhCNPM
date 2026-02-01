/**
 * Upload Controller
 * Xử lý upload file
 */

const path = require('path');
const fs = require('fs');

/**
 * POST /upload/image
 * Upload hình ảnh
 */
exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Không có file được upload'
      });
    }

    // Tạo URL cho file
    const imageUrl = `/uploads/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: 'Upload ảnh thành công',
      imageUrl: imageUrl
    });
  } catch (error) {
    console.error('Upload error:', error);
    next(error);
  }
};