const axios = require('axios');

// Khởi tạo các thông tin cần thiết
const nextcloudUrl = 'https://cloud.bachnguyencoder.id.vn/';
const username = 'kltn1912';
const password = 'bach19122002';

async function createFolder(userId) {
  try {
    // Xác thực và tạo thư mục
    const response = await axios({
      method: 'MKCOL',
      url: `${nextcloudUrl}/remote.php/dav/files/${username}/Documents/${userId}`,
      auth: {
        username: username,
        password: password
      }
    });

    console.log('Thư mục đã được tạo:', response.status);
    return response.status === 201;
  } catch (error) {
    console.error('Lỗi khi tạo thư mục:', error.response.status);
    return false;
  }
}

module.exports = createFolder
