# 🎫 Backend API - Tour Booking System

Backend hoàn chỉnh cho hệ thống đặt tour du lịch trực tuyến, được viết theo chuẩn production.

## 📋 Công nghệ sử dụng

- **Node.js + Express.js** - Web framework
- **MySQL + Sequelize** - Database ORM
- **JWT + bcryptjs** - Authentication & Bảo mật
- **PayPal REST API** - Xử lý thanh toán
- **dotenv** - Quản lý biến môi trường

## 📁 Cấu trúc thư mục

```
backend/
├── config/
│   ├── database.js          # Cấu hình MySQL + Sequelize
│   └── paypal.js            # Cấu hình PayPal (template)
├── controllers/
│   ├── authController.js    # Xử lý đăng ký, đăng nhập
│   ├── tourController.js    # Xử lý tour (CRUD)
│   ├── bookingController.js # Xử lý booking
│   └── paymentController.js # Xử lý thanh toán PayPal
├── models/
│   ├── User.js              # Model người dùng
│   ├── Tour.js              # Model tour
│   ├── Booking.js           # Model đặt tour
│   ├── Payment.js           # Model thanh toán
│   └── index.js             # Thiết lập quan hệ
├── middleware/
│   ├── authMiddleware.js    # Xác thực JWT
│   ├── roleMiddleware.js    # Phân quyền (admin/customer)
│   └── errorHandler.js      # Xử lý lỗi tập trung
├── routes/
│   ├── auth.js              # Routes đăng ký/đăng nhập
│   ├── tours.js             # Routes tour
│   ├── bookings.js          # Routes booking
│   └── payments.js          # Routes thanh toán
├── utils/
│   ├── db.js                # Database helper
│   └── seed.js              # Tạo dữ liệu mẫu
├── server.js                # Main entry point
├── package.json             # Dependencies
├── .env.example             # Template biến môi trường
└── README.md                # Tài liệu này
```

## ⚙️ Cài đặt & Chạy

### 1. Cài đặt dependencies

```bash
cd backend
npm install
```

### 2. Cấu hình biến môi trường

Tạo file `.env` bằng cách copy `.env.example`:

```bash
cp .env.example .env
```

Điền thông tin vào `.env`:

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=2701
DB_NAME=tour_booking

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRATION=7d

# PayPal (Lấy từ PayPal Developer Dashboard)
PAYPAL_MODE=sandbox
PAYPAL_SANDBOX_CLIENT_ID=YOUR_CLIENT_ID
PAYPAL_SANDBOX_CLIENT_SECRET=YOUR_CLIENT_SECRET

# CORS
CORS_ORIGIN=http://localhost:3000
```

### 3. Tạo database

**MySQL phải đang chạy!**

```bash
mysql -u root -p
```

```sql
CREATE DATABASE IF NOT EXISTS tour_booking CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Seed dữ liệu mẫu

```bash
npm run seed
```

Điều này sẽ:

- ✅ Tạo bảng: `nguoi_dung`, `tour`, `dat_tour`, `thanh_toan`
- ✅ Tạo 1 admin account: `admin@tourbooking.com` / `Admin@123456`
- ✅ Tạo 6 tour mẫu (Việt Nam)

### 5. Chạy server

**Mode production:**

```bash
npm start
```

**Mode development (với auto-reload):**

```bash
npm run dev
```

Server sẽ chạy trên: `http://localhost:5000`

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api/v1
```

### 🔐 Authentication

#### POST `/auth/register`

Đăng ký tài khoản mới

**Request:**

```json
{
  "email": "user@example.com",
  "password": "Password123",
  "ho_ten": "Nguyễn Văn A",
  "so_dien_thoai": "0123456789"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "ho_ten": "Nguyễn Văn A",
    "vai_tro": "khach_hang"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### POST `/auth/login`

Đăng nhập

**Request:**

```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "ho_ten": "Nguyễn Văn A",
    "vai_tro": "khach_hang"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### GET `/auth/profile`

Lấy thông tin profile (yêu cầu JWT token)

**Headers:**

```
Authorization: Bearer <token>
```

### 🗽 Tours

#### GET `/tours`

Danh sách tour (có filter)

**Query params:**

- `name` - Tìm theo tên tour
- `location` - Tìm theo địa điểm
- `minPrice` - Giá tối thiểu
- `maxPrice` - Giá tối đa
- `duration` - Thời lượng (ngày)

**Example:**

```
GET /api/v1/tours?location=Hà Nội&minPrice=3000000&maxPrice=5000000
```

#### GET `/tours/:id`

Chi tiết tour

#### POST `/tours` (Admin only)

Tạo tour mới

**Headers:**

```
Authorization: Bearer <admin_token>
```

**Request:**

```json
{
  "ten_tour": "Tour mới",
  "mo_ta": "Mô tả chi tiết",
  "dia_diem": "Hà Nội",
  "gia_tien": 3500000,
  "thoi_luong": 3,
  "ngay_khoi_hanh": "2026-02-15",
  "so_cho_tong": 30,
  "hinh_anh": "url_image"
}
```

#### PUT `/tours/:id` (Admin only)

Cập nhật tour

#### DELETE `/tours/:id` (Admin only)

Xóa tour (soft delete - chỉ set trang_thai = inactive)

### 📅 Bookings

#### POST `/bookings`

Tạo booking mới (yêu cầu đăng nhập)

**Headers:**

```
Authorization: Bearer <token>
```

**Request:**

```json
{
  "tour_id": 1,
  "so_luong_nguoi": 2,
  "ghi_chu": "Ghi chú thêm"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "id": 1,
    "tour_id": 1,
    "so_luong_nguoi": 2,
    "so_tien_tong": 7000000,
    "trang_thai": "pending"
  }
}
```

#### GET `/bookings`

Danh sách booking của người dùng hiện tại

**Headers:**

```
Authorization: Bearer <token>
```

#### GET `/bookings/:id`

Chi tiết booking

#### PUT `/bookings/:id`

Hủy booking

#### GET `/bookings/admin/all` (Admin only)

Danh sách tất cả booking

**Query params:**

- `status` - Lọc theo trạng thái (pending, confirmed, completed, cancelled)
- `tour_id` - Lọc theo tour

#### PUT `/bookings/admin/:id` (Admin only)

Xác nhận hoặc từ chối booking

**Request:**

```json
{
  "action": "confirm" // hoặc "reject"
}
```

### 💳 Payments

#### POST `/payments`

Tạo order PayPal

**Headers:**

```
Authorization: Bearer <token>
```

**Request:**

```json
{
  "booking_id": 1
}
```

**Response:**

```json
{
  "success": true,
  "message": "Payment order created successfully",
  "data": {
    "payment_id": 1,
    "paypal_order_id": "...",
    "approval_url": "https://www.paypal.com/checkoutnow?token=..."
  }
}
```

#### GET `/payments/success?token=<PAYPAL_ORDER_ID>`

Callback thanh toán thành công (gọi từ PayPal)

#### GET `/payments/cancel?token=<PAYPAL_ORDER_ID>`

Callback hủy thanh toán (gọi từ PayPal)

#### GET `/payments/history`

Lịch sử thanh toán của người dùng

**Headers:**

```
Authorization: Bearer <token>
```

## 🔐 Bảo mật

- ✅ **Password Hashing**: bcryptjs (10 rounds)
- ✅ **JWT Authentication**: Token expires in 7 days
- ✅ **Role-based Authorization**: Admin & Customer roles
- ✅ **CORS**: Configured for frontend
- ✅ **Transaction**: Atomic operations cho booking + payment
- ✅ **Input Validation**: Request validation
- ✅ **Error Handling**: Centralized error handling
- ✅ **SQL Injection Prevention**: Sequelize parameterized queries

## 📊 Database Schema

### Bảng `nguoi_dung`

```sql
id (INT, PK, AI)
ho_ten (VARCHAR)
email (VARCHAR, UNIQUE)
mat_khau (VARCHAR - bcrypt hash)
so_dien_thoai (VARCHAR)
dia_chi (TEXT)
vai_tro (ENUM: khach_hang, admin)
trang_thai (ENUM: active, inactive, blocked)
created_at, updated_at
```

### Bảng `tour`

```sql
id (INT, PK, AI)
ten_tour (VARCHAR)
mo_ta (TEXT)
dia_diem (VARCHAR)
gia_tien (DECIMAL)
thoi_luong (INT)
ngay_khoi_hanh (DATE)
so_cho_tong (INT)
so_cho_con_lai (INT)
hinh_anh (VARCHAR)
trang_thai (ENUM: active, inactive, completed, cancelled)
created_at, updated_at
```

### Bảng `dat_tour`

```sql
id (INT, PK, AI)
nguoi_dung_id (INT, FK → nguoi_dung.id)
tour_id (INT, FK → tour.id)
so_luong_nguoi (INT)
so_tien_tong (DECIMAL)
trang_thai (ENUM: pending, confirmed, completed, cancelled)
ghi_chu (TEXT)
created_at, updated_at
```

### Bảng `thanh_toan`

```sql
id (INT, PK, AI)
nguoi_dung_id (INT, FK → nguoi_dung.id)
dat_tour_id (INT, FK → dat_tour.id)
paypal_order_id (VARCHAR, UNIQUE)
so_tien (DECIMAL)
trang_thai (ENUM: pending, completed, failed, cancelled)
thoi_gian_thanh_toan (DATETIME)
created_at, updated_at
```

## 🔧 Admin Credentials

Sau khi seed data:

```
Email: admin@tourbooking.com
Password: Admin@123456
```

## 📝 Troubleshooting

### Lỗi: Database connection failed

- Kiểm tra MySQL đang chạy
- Kiểm tra credentials trong `.env`
- Kiểm tra database tồn tại

### Lỗi: Token expired

- Cấp token mới bằng cách login lại
- Hoặc tăng `JWT_EXPIRATION` trong `.env`

### Lỗi: PayPal payment failed

- Kiểm tra PayPal credentials
- Chạy ở Sandbox mode trước
- Kiểm tra return URLs đúng

### Lỗi: CORS blocked

- Kiểm tra `CORS_ORIGIN` đúng với frontend URL
- Mặc định: `http://localhost:3000`

## 📞 Support

Frontend sẽ gọi các API này để:

- ✅ Đăng ký / Đăng nhập
- ✅ Xem danh sách tour
- ✅ Tạo booking
- ✅ Thanh toán qua PayPal
- ✅ Xem lịch sử booking

**Tất cả đã sẵn sàng để kết nối!**

---

**Created**: 28-01-2026  
**Version**: 1.0.0  
**Status**: Production Ready ✅
