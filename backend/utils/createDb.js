/**
 * Database Auto-Create Helper
 * Tự động tạo database nếu chưa tồn tại
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

const createDatabaseIfNotExists = async () => {
  try {
    // Kết nối MySQL mà không chỉ định database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '2701',
    });

    const dbName = process.env.DB_NAME || 'tour_booking';

    // Tạo database
    await connection.execute(
      `CREATE DATABASE IF NOT EXISTS ${dbName} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );

    console.log(`✅ Database '${dbName}' created or already exists`);

    await connection.end();
    return true;
  } catch (error) {
    console.error('❌ Failed to create database:', error.message);
    return false;
  }
};

module.exports = { createDatabaseIfNotExists };
