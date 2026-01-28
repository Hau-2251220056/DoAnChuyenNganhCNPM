/**
 * Database Seeding - Tạo dữ liệu mẫu
 * Chạy: npm run seed
 */

const { User, Tour } = require('../models');
const { initializeDatabase } = require('./db');
const { createDatabaseIfNotExists } = require('./createDb');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Tạo database nếu chưa tồn tại
    await createDatabaseIfNotExists();

    // Khởi tạo database
    await initializeDatabase();

    // ============== TẠO ADMIN ==============
    const adminExists = await User.findOne({
      where: { email: 'admin@tourbooking.com' },
    });

    if (!adminExists) {
      await User.create({
        email: 'admin@tourbooking.com',
        mat_khau: 'Admin@123456', // Mật khẩu sẽ được hash tự động
        ho_ten: 'Admin Tour System',
        so_dien_thoai: '0123456789',
        dia_chi: 'Hà Nội, Việt Nam',
        vai_tro: 'admin',
        trang_thai: 'active',
      });
      console.log('✅ Admin account created: admin@tourbooking.com / Admin@123456');
    }

    // ============== TẠODATA TOUR VIETNAM ==============
    const tourData = [
      {
        ten_tour: 'Hà Nội - Sapa - Hà Nội',
        mo_ta: 'Khám phá Sapa với những cánh đồng lúa bậc thang tuyệt đẹp, tới thăm các dân tộc thiểu số, trải nghiệm phong cảnh núi rừng tuyệt vời.',
        dia_diem: 'Sapa, Lào Cai',
        gia_tien: 3500000,
        thoi_luong: 3,
        ngay_khoi_hanh: new Date('2026-02-15'),
        so_cho_tong: 30,
        hinh_anh: 'https://via.placeholder.com/300x200?text=Sapa',
      },
      {
        ten_tour: 'Hà Nội - Hạ Long - Hà Nội',
        mo_ta: 'Du ngoạn Vịnh Hạ Long - Di sản thế giới, khám phá hang động Sương Sơn Hạ, tham gia hoạt động trên biển, tận hưởng ẩm thực địa phương.',
        dia_diem: 'Quảng Ninh',
        gia_tien: 5000000,
        thoi_luong: 3,
        ngay_khoi_hanh: new Date('2026-02-20'),
        so_cho_tong: 40,
        hinh_anh: 'https://via.placeholder.com/300x200?text=Ha+Long',
      },
      {
        ten_tour: 'Đà Nẵng - Hội An - Đà Nẵng',
        mo_ta: 'Tham quan phố cổ Hội An với kiến trúc độc đáo, thưởng ngoạn cảnh đẹp tại Mỹ Khe, tham gia hoạt động ngoài trời đa dạng.',
        dia_diem: 'Đà Nẵng - Hội An',
        gia_tien: 4500000,
        thoi_luong: 4,
        ngay_khoi_hanh: new Date('2026-03-01'),
        so_cho_tong: 35,
        hinh_anh: 'https://via.placeholder.com/300x200?text=Da+Nang',
      },
      {
        ten_tour: 'Tp. Hồ Chí Minh - Mekong Delta',
        mo_ta: 'Khám phá vẻ đẹp sông nước Miền Tây, thăm các khu trồng trái cây, tham gia hoạt động trên sông, tìm hiểu văn hóa địa phương.',
        dia_diem: 'TP. Hồ Chí Minh - Cần Thơ',
        gia_tien: 3800000,
        thoi_luong: 3,
        ngay_khoi_hanh: new Date('2026-02-25'),
        so_cho_tong: 30,
        hinh_anh: 'https://via.placeholder.com/300x200?text=Mekong',
      },
      {
        ten_tour: 'Huế - Phong Nha - Quảng Bình',
        mo_ta: 'Khám phá di tích Cố đô Huế, hang động Phong Nha kỳ vĩ, chiêm ngưỡng vẻ đẹp tự nhiên hoang sơ, tìm hiểu lịch sử Việt Nam.',
        dia_diem: 'Huế - Quảng Bình',
        gia_tien: 4200000,
        thoi_luong: 4,
        ngay_khoi_hanh: new Date('2026-03-10'),
        so_cho_tong: 32,
        hinh_anh: 'https://via.placeholder.com/300x200?text=Hue',
      },
      {
        ten_tour: 'Nha Trang - Khánh Hòa',
        mo_ta: 'Du lịch biển Nha Trang xinh đẹp, tham gia lặn biển, khám phá quần đảo Hòn Mun, tận hưởng ẩm thực hải sản tươi ngon.',
        dia_diem: 'Nha Trang, Khánh Hòa',
        gia_tien: 4000000,
        thoi_luong: 3,
        ngay_khoi_hanh: new Date('2026-03-05'),
        so_cho_tong: 40,
        hinh_anh: 'https://via.placeholder.com/300x200?text=Nha+Trang',
      },
    ];

    // Kiểm tra tour tồn tại trước khi tạo
    for (const tour of tourData) {
      const tourExists = await Tour.findOne({
        where: { ten_tour: tour.ten_tour },
      });

      if (!tourExists) {
        await Tour.create({
          ...tour,
          so_cho_con_lai: tour.so_cho_tong,
          trang_thai: 'active',
        });
        console.log(`✅ Tour created: ${tour.ten_tour}`);
      }
    }

    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

// Chạy seed nếu file này được gọi trực tiếp
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
