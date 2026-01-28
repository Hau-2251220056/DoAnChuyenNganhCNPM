/**
 * Database Helper - Database Connection Pool
 */

const sequelize = require('../config/database');

/**
 * Khởi tạo database: tạo tables, khóa ngoại
 */
const initializeDatabase = async () => {
  try {
    // Test connection first
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    // Sync models với database
    // force: false - không drop tables hiện có
    await sequelize.sync({ force: false });
    console.log('✅ Database synchronized successfully');
  } catch (error) {
    console.error('❌ Database synchronization failed:', error.message);
    throw error;
  }
};

/**
 * Reset database (xóa toàn bộ data - dùng khi test)
 */
const resetDatabase = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('✅ Database reset successfully');
  } catch (error) {
    console.error('❌ Database reset failed:', error.message);
    throw error;
  }
};

module.exports = {
  sequelize,
  initializeDatabase,
  resetDatabase,
};
