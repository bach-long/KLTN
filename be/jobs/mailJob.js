const Queue = require('bull');
const transporter = require('../nodemailerConfig');

// Kết nối tới Redis
const queue = new Queue('email');

// Xử lý công việc
queue.process((job) => {
  const { to, subject, text } = job.data;

  transporter.sendMail({
    from: 'nguyenbach19122002@gmail.com', // Thay thế bằng email của bạn
    to,
    subject,
    text
  });
});

module.exports = queue
