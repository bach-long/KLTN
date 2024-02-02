const { Storage } = require('@google-cloud/storage');
const storage = new Storage();

async function createFolder(bucketName, folderName) {
  try {
    // Kiểm tra xem thư mục đã tồn tại chưa
    const [exists] = await storage.bucket(bucketName).file(folderName).exists();

    if (!exists) {
      // Nếu thư mục chưa tồn tại, tạo mới
      await storage.bucket(bucketName).file(folderName).save('', { metadata: { contentType: 'application/x-www-form-urlencoded' } });

      console.log(`Folder ${folderName} created successfully in ${bucketName}.`);
    } else {
      console.log(`Folder ${folderName} already exists in ${bucketName}.`);
    }
  } catch (error) {
    console.error('Error creating folder:', error.message);
  }
}


module.exports = createFolder;
