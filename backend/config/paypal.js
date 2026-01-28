/**
 * PayPal Configuration Template
 * Hãy điền đầy đủ thông tin từ PayPal Developer Dashboard
 */

module.exports = {
  // Sandbox Mode (Testing)
  sandbox: {
    clientId: process.env.PAYPAL_SANDBOX_CLIENT_ID || 'YOUR_SANDBOX_CLIENT_ID',
    clientSecret: process.env.PAYPAL_SANDBOX_CLIENT_SECRET || 'YOUR_SANDBOX_CLIENT_SECRET',
    baseUrl: 'https://api-m.sandbox.paypal.com',
  },

  // Production Mode
  production: {
    clientId: process.env.PAYPAL_PRODUCTION_CLIENT_ID || 'YOUR_PRODUCTION_CLIENT_ID',
    clientSecret: process.env.PAYPAL_PRODUCTION_CLIENT_SECRET || 'YOUR_PRODUCTION_CLIENT_SECRET',
    baseUrl: 'https://api-m.paypal.com',
  },

  // Chọn mode: 'sandbox' hoặc 'production'
  mode: process.env.PAYPAL_MODE || 'sandbox',

  // Return URLs
  returnUrl: process.env.PAYPAL_RETURN_URL || 'http://localhost:3000/payment/success',
  cancelUrl: process.env.PAYPAL_CANCEL_URL || 'http://localhost:3000/payment/cancel',
};
