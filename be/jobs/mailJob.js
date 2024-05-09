const Queue = require('bull');
const transporter = require('../nodemailerConfig');

// Kết nối tới Redis
const queue = new Queue('email', {
  redis: {
    host: "redis",
    port: "6379",
  }
});

// Xử lý công việc
queue.process((job) => {
  const { to, subject, text } = job.data;

  transporter.sendMail({
    from: 'nguyenbach19122002@gmail.com',
    to,
    subject,
    text
  });
});

module.exports = queue
