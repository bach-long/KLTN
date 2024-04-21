const nodemailer = require('nodemailer');

// Cấu hình transporter (trình gửi)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nguyenbach19122002@gmail.com', // Thay thế bằng email của bạn
    pass: 'pkkxnqfqilfuvads' // Thay thế bằng mật khẩu của bạn
  }
});

module.exports = transporter;
